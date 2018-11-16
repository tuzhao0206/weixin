export function setCookie(name, value, hours = 1) {
  const exp = new Date();
  exp.setTime(exp.getTime() + hours * 60 * 60 * 1000);

  // 设置到根域以便共享
  const domain = document.domain.replace(/(.*?)\.(bitmain\.com)/, '$2');
  document.cookie = name + '=' + escape(value) + ';path=/;expires=' + exp.toGMTString() + ';domain=' + domain;
}

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export function delCookie(name) {
  setCookie(name, '', 0);
}
