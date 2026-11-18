/*!
 * 不蒜子本地兼容脚本
 * 数据源使用可用的第三方镜像 API，输出兼容 Hexo Fluid 主题的官方 id：
 *   busuanzi_value_site_pv / busuanzi_container_site_pv
 *   busuanzi_value_site_uv / busuanzi_container_site_uv
 *   busuanzi_value_page_pv / busuanzi_container_page_pv
 */
(function () {
  'use strict';

  var API = 'https://busuanzi.aspark.cc/api';

  function send() {
    try {
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      xhr.open('POST', API, true);
      xhr.setRequestHeader('x-bsz-referer', window.location.href);
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4 || xhr.status !== 200) return;
        try {
          var res = JSON.parse(xhr.responseText);
          if (!res || res.success !== true || !res.data) return;
          fill('site_pv', res.data.site_pv);
          fill('site_uv', res.data.site_uv);
          fill('page_pv', res.data.page_pv);
          fill('page_uv', res.data.page_uv);
        } catch (e) { /* 数据解析失败则保持隐藏 */ }
      };
      xhr.send();
    } catch (e) { /* 网络异常则保持隐藏 */ }
  }

  function fill(key, value) {
    if (value === undefined || value === null) return;
    var v = document.getElementById('busuanzi_value_' + key);
    if (v) v.innerHTML = String(value);
    var c = document.getElementById('busuanzi_container_' + key);
    if (c) c.style.display = 'inline';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', send);
  } else {
    send();
  }

  // 兼容 PJAX / 单页切换
  if (window.history && window.history.pushState) {
    var orig = window.history.pushState;
    window.history.pushState = function () {
      var r = orig.apply(this, arguments);
      send();
      return r;
    };
    window.addEventListener('popstate', send);
  }
})();
