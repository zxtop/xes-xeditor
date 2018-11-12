<template>
  <div class="titleImgs">
    <div>
      <!--图文混合中的图片显示-->
      <img class="imgTit" :src="getStyleValue(this.objs,'imageUrl')" alt="">
      <button class="btnCImg">更改图片</button>
      <input name="dataInput" type="file" class="btnCImg inpimg" @click="replaceInput($event)" @change="ChangeRes($event, objs, 'img')">
    </div>
  </div>
</template>
<script>
import proCon from "./proCommon.vue";
export default {
  extends: proCon,
  props: ["imgTW"],
  data() {
    return {
      objs: this.imgTW,
      imgUs: ""
    };
  }
};
</script>
<style scoped>
.titleImgs {
  width: 2.8rem;
  height: 1.2rem;
  position: relative;
}
.imgTit {
  width: 1.02rem;
  height: 1rem;
  margin-left: 0.2rem;
  margin-top: 0.2rem;
}
.btnCImg {
  width: 0.89rem;
  height: 0.3rem;
  border: none;
  outline: none;
  background: #666;
  border-radius: 0.05rem;
  position: absolute;
  bottom: 0rem;
  right: 0.4rem;
  color: #fff;
}
.title_pro {
  width: 100%;
  height: 0.51rem;
  font-size: 0.22rem;
  color: #eee;
  line-height: 0.55rem;
  font-weight: bold;
  background: #555;
  margin-top: 0.1rem;
  text-indent: 0.15rem;
}
.inpimg {
  opacity: 0;
}
</style>
