<template>
  <div class="proImgBox">
    <div class="imgWant">
      <img class="imgsC" :src="getStyleValue(this.objs,'imageUrl')"  alt="">
      <button class="btnChangeImg" @click="ChangePic()">更改图片</button>
      <input type="file" class="inp" @click="replaceInput($event)"  @change="ChangeRes($event, objs, 'img')">
    </div>
  </div>
</template>
<script>
import proCon from "./proCommon.vue";
export default {
  name: "proStage",
  extends: proCon,
  props: ["proData"],
  data() {
    return {
      objs: this.proData,
      resou_local: ""
    };
  }
};
</script>
<style>
.proImgBox {
  width: 100%;
  height: auto;
}
.imgWant {
  width: 2.8rem;
  height: 2rem;
  position: relative;
}
.imgWant img {
  width: 2.52rem;
  /*width:2.52rem;*/
  height: 1.45rem;
  margin-left: 0.14rem;
  margin-top: 0.11rem;
}
.inp {
  opacity: 0;
  z-index: 99;
  position: absolute;
  bottom: 0.02rem;
  left: 50%;
  margin-left: -0.45rem;
}
.btnChangeImg {
  width: 0.9rem;
  height: 0.3rem;
  background: #666;
  color: #fff;
  border: none;
  outline: none;
  border-radius: 0.05rem;
  position: absolute;
  bottom: 0.02rem;
  left: 50%;
  margin-left: -0.45rem;
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
</style>

