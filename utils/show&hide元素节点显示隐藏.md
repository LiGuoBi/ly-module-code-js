# show&hide元素节点显示隐藏

```js
/**
 * 元素节点显示隐藏
 * @param {Object} el 需要显示/隐藏的节点 
 * @param {Number} type 显示/隐藏方式 1 = translateY，2 = opacity
 * @return null
 */
function show(el, type) {
  el.style.display = 'block';
  if (type == 1) { // transform
    el.style.transform = 'translateY(100%)';
    setTimeout(function() {
      el.style.transform = 'translateY(0%)';
    }, 100);
  } else if (type == 2) { //  opacity
    el.style.opacity = 0;
    setTimeout(function() {
      el.style.opacity = 1;
    }, 100);
  }
}
function hide(el, type) {
  if (type == 1) { // transform
    el.style.transform = 'translateY(100%)';
  } else if (type == 2) { //  opacity
    el.style.opacity = 0;
  }
  setTimeout(function() {
    el.style.display = 'none';
  }, 600);
}
```
