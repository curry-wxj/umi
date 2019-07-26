
function getXmlHttp() {
  let xmlhttp = false;
  try {
    // 尝试创建 XMLHttpRequest 对象，除 IE 外的浏览器都支持这个方法。
    xmlhttp = new window.XMLHttpRequest();
  } catch (e) {
    try {
      // 使用较新版本的 IE 创建 IE 兼容的对象（Msxml2.XMLHTTP）。
      xmlhttp = window.ActiveXobject('Msxml12.XMLHTTP');
    } catch (e2) {
      try {
        // 使用较老版本的 IE 创建 IE 兼容的对象（Microsoft.XMLHTTP）。
        xmlhttp = window.ActiveXobject('Microsoft.XMLHTTP');
      } catch (e3) {
        // 如果失败了还保持false
        xmlhttp = false;
      }
    }
  }
  return xmlhttp;
}
function get(url) {
  const xmlhttp = getXmlHttp();
  if (xmlhttp === false) {
    throw new Error('XMLHttpRequest 对象创建失败');
  }
  xmlhttp.open('GET', url, false);
  xmlhttp.send();
  if (xmlhttp.status === 200 || xmlhttp.status === 304) {
    return xmlhttp.responseText;
  }
  return null;
}
export default function request(url) {
  // 获取文件名
  const fileName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
  // 获取.js
  const suffix = url.substring(url.lastIndexOf('.') + 1);
  try {
    let responseText = get(url);
    let tmpObj = null;
    if (suffix === 'js') {
      const randomFileName = `random${new Date().getMilliseconds()}`;
      const index = responseText.indexOf('=');
      if (index > -1) {
        // 获取=号 后面的字符串
        const body = responseText.substring(index + 1);
        responseText = `var ${randomFileName} = ${body}`;
      }
      window.eval(responseText); // 执行 responseText代码， 定义变量
      // tmpObj = JSON.parse(JSON.stringify(window[randomFileName]));
      tmpObj = window[randomFileName]
      delete window[randomFileName];
    } else if (suffix === 'json') {
      tmpObj = JSON.parse(responseText);
    } else {
      throw new Error('配置信息仅支持 js, json 格式');
    }
    return tmpObj;
  } catch (e) {
    throw new Error(`读取${fileName}.${suffix}文件失败 ${e.message}`);
  }
}