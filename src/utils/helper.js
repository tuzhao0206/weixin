// 解析查询参数
export function parseQuery(str = location.search) {
  let query = {};
  if (str) {
    let pairs = (str[0] === '?' ? str.substr(1) : str).split('&');
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
  }
  return query;
}

// 删除URL中指定参数
export function removeQuery(name, url) {
  let base = '';
  let query = '';
  if (!url) {
    base = location.protocol + '//' + location.host + location.pathname;
    query = location.search.substr(1);
  } else {
    const index = url.indexOf('?');
    if (index === -1) {
      base = url;
    } else {
      base = url.substring(0, index);
      query = url.substring(index + 1);
    }
  }

  // 没有找到
  if (query.indexOf(name) === -1) {
    return base;
  }
  let obj = {};
  let arr = query.split('&');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].split('=');
    obj[arr[i][0]] = arr[i][1];
  }
  delete obj[name];
  if (JSON.stringify(obj) !== '{}') {
    base = base + '?';
  }

  return (
    base +
    JSON.stringify(obj)
      .replace(/[\"\{\}]/g, '')
      .replace(/\:/g, '=')
      .replace(/\,/g, '&')
  );
}

// 获取元素的位置
export function getOffset(child, parent) {
  parent = parent || document.body;

  let [left, top] = [0, 0];

  while (child && child !== parent) {
    left += child.offsetLeft;
    top += child.offsetTop;
    child = child.offsetParent;
  }

  return { left, top };
}
