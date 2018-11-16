import Env from './env';
import Emitter from './emitter';

// 连接方法
function connect(callback) {
  if (!Env.is('app')) {
    return false;
  }
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }

  // Android 初始化
  if (Env.is('android')) {
    document.addEventListener(
      'WebViewJavascriptBridgeReady',
      function() {
        callback(window.WebViewJavascriptBridge);
      },
      false
    );
  }
  // IOS 初始化
  else if (Env.is('ios')) {
    if (window.WVJBCallbacks) {
      window.WVJBCallbacks.push(callback);
    } else {
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'https://__bridge_loaded__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function() {
        document.documentElement.removeChild(WVJBIframe);
      }, 0);
    }
  }
}

// 初始化桥
connect(function(bridge) {
  // 不能省略
  if (Env.is('android')) {
    bridge.init(function(message, callback) {
      // eslint-disable-next-line
      console.log(message, callback);
    });
  }

  // APP调用JS
  bridge.registerHandler('appCallJs', function(data) {
    const { action, params } = typeof data === 'string' ? JSON.parse(data) : data;
    JSBridge.emit(action, params);
  });
});

// 对外接口
const JSBridge = {
  // 核心
  invoke(action, params = {}, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }
    if (callback) {
      JSBridge.off(action).on(action, callback);
    }
    connect(function(bridge) {
      if (Env.is('ios')) {
        bridge.callHandler('jsCallApp', { action, params });
      } else {
        bridge.callHandler(action, { action, params });
      }
    });
  },

  // 登录
  login() {
    this.invoke('login', function(success) {
      // 登录成功 简单刷新
      if (success) {
        location.reload();
      } else {
        JSBridge.back();
      }
    });
  },

  // 授权
  oauth(callback) {
    this.invoke('oauth', function({ token }) {
      callback(token);
    });
  },

  // 菜单
  menubar(menus) {
    this.invoke('menubar', menus, function({ name }) {
      const index = menus.findIndex(item => item.name === name);
      if (index !== -1) {
        menus[index].onClick();
      }
    });
  },

  // 上传
  upload(callback) {
    this.invoke('upload', function(url) {
      callback(url);
    });
  },

  // 下单验证码
  verifyCode(params) {
    this.invoke('verifyCode', params);
  },

  // 贝宝支付
  paypal(subId, amount, currency = 'USD') {
    this.invoke('paypal', { subId, amount, currency });
  },

  // 关闭
  close() {
    this.invoke('closeWeb');
  },

  // 后退
  back: function() {
    history.go(-1);
    if (Env.is('app')) {
      if (history.length === 1) {
        JSBridge.close();
      }
    }
  },

  // 打开原生页面 pcode 代表是否需要登录
  // 4001/订单列表 1001/商品详情
  skip(params, pcode = 0) {
    params = typeof params === 'object' ? params : { skno: params };
    this.invoke('skip', { pcode, ...params });
  },

  // 复制
  copy(text) {
    if (Env.is('ios')) {
      this.invoke('copy', { text });
    }
  },
};

// 注入事件功能
Emitter(JSBridge);

export default JSBridge;
