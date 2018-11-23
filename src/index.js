// import es6 polyfill
import 'core-js/es6/array';
import 'core-js/es6/string';
import 'core-js/es6/promise';

// import es7 polyfill
import 'core-js/es7/array';
import 'core-js/es7/string';
import 'core-js/es7/promise';

// import business
import './less/index.less';
import './utils/axios';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import store from './ducks';
import { routes } from './schema';
import * as components from './components';
import axios from 'axios';
import HOSTS from './env.config';
import Env from './utils/env';
import JSBridge from './utils/bridge';
import Filters from './utils/filters';
import { removeQuery, parseQuery } from './utils/helper';
import { setCookie, getCookie, delCookie } from './utils/cookie';
import { lang, site, prelang } from './utils/site';

Vue.use(VueI18n);
Vue.use(VueRouter);

// 工具方法
// AbCdEf => ab-cd-ef
const kebabCase = str => str.replace(/([A-Z])/g, s => '-' + s.toLowerCase()).replace(/^-/, '');

// 自动注册
Object.keys(components).forEach(name => {
  Vue.component(`ex-${kebabCase(name)}`, components[name]);
});

// 国际化
const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: 'en',
});

// 组装路由
const router = new VueRouter({
  mode: 'history',
  fallback: true,
  routes: [
    {
      path: `/(${site})?`,
      component: components.Nested,
      children: routes,
    },
    // ...routes,
    { path: '*', component: components.NoMatch },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

// 等待加载
router.beforeEach((to, from, next) => {
  // 延迟Router组件实例化 以便确保user已经加载完毕(无论登录与否)
  // 根据ready来识别
  if (store.state.ready) {
    next();
  } else {
    store.subscribe(mutation => {
      if (mutation.type === 'fetchUser') {
        next();
      }
    });
  }
});

// 登录拦截
router.beforeEach((to, from, next) => {
  if (to.matched.some(item => item.meta.loginRequired)) {
    console.log('需要登录！');
    if (!store.state.user) {
      // APP登录
      if (Env.is('app')) {
        JSBridge.login();
      }
      // 网页登录
      else {
        const locale = i18n.locale;
        const next = encodeURIComponent(removeQuery('ticket', location.protocol + '//' + location.host + to.fullPath));
        location.href = `${HOSTS.LOGIN}/login?locale=${locale}&service=${next}`;
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

// 特殊场景
router.beforeEach((to, from, next) => {
  if (Env.is('app')) {
    JSBridge.menubar([]);
  }

  next();
});

// 过滤器: 金额格式化
// 因为需要使用i18n，所以写在这里
{
  // 前缀
  const prefix = type => {
    if (type === 'USD' || type === 'PAYPAL') {
      return '$';
    } else if (type === 'CNY' || type === '元' || type === '人民币转账') {
      return '¥';
    }
    return '';
  };

  // 后缀
  const suffix = type => {
    if (type == 'CNY' || type == 'USD' || type == 'PAYPAL' || type === '元' || type === '人民币转账') {
      return '';
    }
    return type;
  };

  // 金额格式化
  // unit 小数
  // type 币种
  Vue.filter('currency', function(num, unit, type) {
    num = Number(num);
    if (isNaN(num)) {
      return 'NaN';
    }
    if (unit !== undefined && typeof unit !== 'number') {
      type = unit;
      unit = undefined;
    }
    // 支付币种
    type = type || (i18n.locale === 'zh' ? 'CNY' : 'USD');

    // 保留小数
    if (type == 'CNY' || type == 'USD' || type == 'PAYPAL' || type === '元' || type === '人民币转账') {
      num = num.toFixed(typeof unit === 'number' ? unit : 2);
    } else {
      num = num.toFixed(typeof unit === 'number' ? unit : 8);
    }
    // 后缀加间隔
    let text = prefix(type) + num;
    if (suffix(type)) {
      text += ' ' + suffix(type);
    }
    return text;
  });
}

// 过滤器: 其他通用过滤器
Object.keys(Filters).forEach(name => {
  Vue.filter(name, Filters[name]);
});

// 弹窗简化调用控件
Vue.prototype.$message = function(message) {
  let options = message;
  if (typeof options === 'string') {
    options = { message: options };
  }
  this.$store.dispatch({
    type: 'tipsToast',
    toast: options,
  });
};

// 弹窗简化调用控件
Vue.prototype.$alert = function(options, callback) {
  if (typeof options === 'string') {
    options = { message: options };
  }
  if (typeof callback === 'function') {
    options.callback = callback;
  }
  this.$store.dispatch({
    type: 'showModal',
    modal: {
      message: options.message,
      buttons: [
        {
          text: options.confirm || (this.$i18n.locale === 'zh' ? '确定' : 'Confirm'),
          class: 'text-primary',
          onClick: () => {
            this.$store.dispatch('hideModal');
            callback && callback();
          },
        },
      ],
    },
  });
};

// 弹窗简化调用控件
Vue.prototype.$confirm = function(options, callback) {
  if (typeof options === 'string') {
    options = { message: options };
  }
  if (typeof callback === 'function') {
    options.callback = callback;
  }
  this.$store.dispatch({
    type: 'showModal',
    modal: {
      message: options.message,
      buttons: [
        {
          text: options.cancel || this.$i18n.locale === 'zh' ? '取消' : 'Cancel',
          class: 'text-darkgray',
          onClick: () => {
            this.$store.dispatch('hideModal');
          },
        },
        {
          text: options.confirm || this.$i18n.locale === 'zh' ? '确定' : 'Confirm',
          class: 'text-primary',
          onClick: () => {
            this.$store.dispatch('hideModal');
            callback && callback();
          },
        },
      ],
    },
  });
};

// 语言前缀
Vue.prototype.$site = site;
Vue.prototype.$lang = lang;
Vue.prototype.$prelang = prelang;

// 调试工具
if (process.env.NODE_ENV === 'development' && Env.is('app')) {
  const VConsole = require('vconsole');
  const vConsole = new VConsole();
}

/*!
 * 加载用户逻辑
 **/
{
  // 网页用户
  function getWebUser(ticket) {
    const url = `${HOSTS.BASE}/api/casLogin`;
    const params = ticket ? { ticket } : null;
    // 当获取用户异常时，是否需要重定向到登录页面
    // 我们默认当URL中存在ticket参数时必须强制登录
    // 此时当登录失败时 axios拦截器会自动重定向到登录页
    const force = ticket ? true : false;
    return axios.get(url, { params, force, global: false }).then(
      ({ isError, data }) => {
        if (!isError && data && data[0]) {
          return data[0];
        }
        return null;
      },
      () => {
        // 如果存在ticket却无法获取用户 表明ticket已失效
        // 此时为了避免刷新后依然调用登录 - 移除ticket
        delCookie('ticket');
        return null;
      }
    );
  }

  // APP用户
  function getAppUser() {
    const url = `${HOSTS.UCENTER}/api/user/getLoginUserInfo`;
    // 当获取用户异常时，是否需要重定向到登录页面
    // 我们默认当APP中存在token时必须强制登录
    // 此时当登录失败时 axios拦截器会自动重定向到登录页
    const force = store.state.token ? true : false;
    return axios.get(url, { force, global: false }).then(
      ({ code, data }) => {
        if (Number(code) === 0) {
          return data;
        }
        return null;
      },
      () => null
    );
  }

  // APP授权
  if (Env.is('app')) {
    JSBridge.oauth(token => {
      store.dispatch('fetchToken', { token });
      if (!token) {
        store.dispatch('fetchUser', { user: null });
      } else {
        getAppUser().then(user => {
          store.dispatch('fetchUser', { user });
        });
      }
    });
  } else {
    // 网页授权
    const { ticket } = parseQuery(location.search);
    // 登录回调: TICKET
    if (ticket) {
      setCookie('ticket', ticket);
    }

    /*!
      获取用户节流:
      后台不允许频繁调用casLogin，所以此处根据cookie中的ticket来判别
      PS: 尽管不赞同前端操作cookie
    */
    if (getCookie('ticket')) {
      getWebUser(ticket).then(user => {
        store.dispatch('fetchUser', { user });
      });
    } else {
      store.dispatch('fetchUser', { user: null });
    }
  }
}

// OK LET'S GO
new Vue({ store, router, i18n, render: c => c(components.App) }).$mount('#bootstrap');
