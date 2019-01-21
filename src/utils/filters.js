export default {
  // 移除脚本
  rmxss: function(content = '') {
    const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    return content.replace(regex, '');
  },

  // 移除样式
  rmstyle: function(content = '') {
    const regex = /\bstyle=("|')(.*?)\1/g;
    return content.replace(regex, '');
  },

  // 添加默认值
  defaults: function(x, y) {
    return x || y;
  },

  // 截取字符串
  truncate: function(input, size) {
    input = String(input || '');
    if (input.length <= size) {
      return input;
    }
    return input.substring(0, size) + '...';
  },

  // 压缩图片
  thumbnail: function(uri, width, height) {
    if (!uri) {
      return require('../assets/images/image-13.png');
    }
    // if (uri.indexOf('?') === -1) {
    //   if (width && height) {
    //     uri += '?imageView2/2/w/' + width + '/h/' + height;
    //   } else {
    //     uri += '?imageslim';
    //   }
    // }
    // 修复图片和页面不同协议下在安卓端不显示的问题
    return uri.replace(/^https?:/, '');
  },

  // 长度截取
  toFixed: function(val, unit = 2) {
    const number = Number(val);
    if (isNaN(number)) {
      return val;
    }
    return number.toFixed(unit);
  },

  // 日期格式化
  date: function(date, fmt) {
    if (!date || (typeof date === 'string' && Number(date) === 0)) {
      return date;
    }
    date = date.constructor === Date ? date : new Date(Number(date));
    var o = {
      'y+': date.getFullYear(),
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      'S+': date.getMilliseconds(), //毫秒
    };
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        if (k == 'y+') {
          fmt = fmt.replace(RegExp.$1, ('' + o[k]).substr(4 - RegExp.$1.length));
        } else if (k == 'S+') {
          var lens = RegExp.$1.length;
          lens = lens == 1 ? 3 : lens;
          fmt = fmt.replace(RegExp.$1, ('00' + o[k]).substr(('""' + o[k]).length - 1, lens));
        } else {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }
    }
    return fmt;
  },
};
