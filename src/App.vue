<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import home from "./components/Home";
  import index from "./components/Index";
export default {
  name: 'App',
  mounted(){
         let vueTarget = this;
        (function (doc, win) {
          var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
              window.clientWidth = docEl.clientWidth;
              window.clientHeight = docEl.clientHeight;
              if (!window.clientWidth) return;
              var aspectRatio = window.clientWidth / window.clientHeight;
              if (aspectRatio > 1440 / 900) {
                docEl.style.fontSize = 100 * (window.clientHeight / 900) + 'px';
                window.base = 100 * (window.clientHeight / 900);
              } else {
                docEl.style.fontSize = 100 * (window.clientWidth / 1440) + 'px';
                window.base = 100 * (window.clientWidth / 1440);
                // 判断是否为移动设备，提示旋转屏幕
              }
              let parentDom = vueTarget.$store.state.stageParentDom;
              vueTarget.$store.commit("STAGE_PARENT_SIZE",{width:parentDom.width*window.base/100,height:parentDom.height*window.base/100});
              // alert(navigator.userAgent)
              var isMobile = {
                Android: function () {
                  return navigator.userAgent.match(/Android/i) ? true : false;
                },
                BlackBerry: function () {
                  return navigator.userAgent.match(/BlackBerry/i) ? true : false;
                },
                iOS: function () {
                  return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
                },
                Windows: function () {
                  return navigator.userAgent.match(/IEMobile/i) ? true : false;
                },
                any: function () {
                  return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
                }
              };
            };
          try {
            recalc();
          } catch (e) {
          }
          if (!doc.addEventListener) return;
          win.addEventListener(resizeEvt, recalc, false);
          doc.addEventListener('DOMContentLoaded', recalc, false);

          document.onreadystatechange = function() { //文档加载完毕
          }
        })(document, window);
        }
}
</script>


<style>
  * {
    margin: 0;
    padding: 0;
  }
  html{
    height:100%;
  }
  body {
    background: #ffffff;
    font-family: "Avenir Next", "PingFang SC", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", "Microsoft Yahei", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height:100%;
    position: relative;

  }
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }
  #app{
    width:100%;
    height:100%;
  }

</style>
