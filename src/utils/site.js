import { SITE_LANG } from './dict';
import { setCookie } from './cookie';
import store from '../ducks';
import Env from './env';

// 计算站点类型
function calculate() {
  const list = Object.keys(SITE_LANG);
  const site = location.pathname.split('/')[1];

  if (!list.includes(site)) {
    return location.hostname.includes('.cn') ? 'cn' : 'en';
  }
  return site;
}

// 根据主体推导语言
function deduction() {
  return SITE_LANG[site].lang;
}

// 初始化
const site = calculate();
const lang = deduction();

// 追加主体
const prelang = function(path) {
  // 替换可能手误多传的斜线
  path = `/${site}/${path}`.replace(/\/+/g, '/');

  // cn站点不必添加 /cn 前缀
  if (/cn$/.test(location.hostname)) {
    return path.replace(/^\/cn/, '');
  }
  // com攒点不必添加/en 前缀
  return path.replace(/^\/en/, '');
};

const isEllipsis =
  (/com$/.test(location.hostname) && site === 'en') || (/cn$/.test(location.hostname) && site === 'cn');

// 写入语言和后台依赖的COOKIE
// APP内根据约定使用request header传递语言 仅网页开发需要写入cookie
// 详细diamante参见utils/axios.js
if (!Env.is('app')) {
  setCookie('country', site);
  setCookie('language', lang);

  // www工程依赖这个做国际化 目前www只有中英文两个版本
  setCookie('locale', lang === 'zh' ? 'zh-CN' : 'en');
}
// 同步写入Vuex
store.dispatch('setSite', { lang, site });

export { site, lang, prelang, isEllipsis };
