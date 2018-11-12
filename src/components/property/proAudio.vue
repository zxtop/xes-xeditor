<template>
  <div class="audioBox">
    <div class="fuBox">
      <div class="default">
      <div class="pngOraudio" >
        <img :src="getImgType(objs,'default')" alt="">
      </div>
      <button class="ChangeKong"  style="width:0.89rem;height:0.3rem;border:none;outline: none;background: #666;position: absolute;right:0.2rem;top:0.3rem;margin-top:0.2rem;border-radius: 0.05rem;color: #fff;">默认图</button>
      <input id="testInput" type="file" class="controlInput" @click="replaceInput($event)" @change="ChangeRes($event, objs, 'img', 'default')">

      </div>

      <div class="loading">
        <div class="pngOraudio" >
          <img v-if="changeText" :src="getImgType(objs,'click')" alt="">
          <span  v-else class="span_audio">暂无图片</span>
        </div>
        <button class="loadingbtn" >播放图片</button>
        <input id="testInp" type="file" class="controlInput" @click="replaceInput($event)" @change="ChangeRes($event, objs, 'img', 'click')">

      </div>


      <div class="audioSrc">
        <div calss="audioP">
          <button  v-if="audioPlay" class="audioMp3Btn"  @click="clickAudio()">点击播放</button>
          <button  v-else class="audioMp3Btn">播放中...</button>
          <audio class="audioMp3"  id="audio"  :loop="audioOnceAuto" style="display:block;" :src="audioM" @ended="playOver()"></audio>
          <button class="audioCh" v-if="$store.state.limitAlert">上传音频</button>
          <button class="audioCh" v-else>上传中...</button>
          <input name="dataInput" type="file" class="inputVF" @click="replaceInput($event)" @change="ChangeAudio($event,'audio')">
        </div>

      </div>
      <div class="playNum">
        <div class="Num">
          <button class="autoNum" @click="once_auto_play()">循环播放</button>
          <button class="onceNum" @click="once_auto_play()">播放一次</button>
           <span class="autoSpan" v-if="audioOnceAuto" ><img :src="question" style="width:0.28rem;height:0.28rem" alt=""></span>
           <span class="onceSpan" v-else><img :src="question" style="width:0.28rem;height:0.28rem" alt=""></span>
       </div>
        
      </div>
    </div>
  </div>
</template>
<script>
import proCon from "./proCommon.vue";
export default {
  props: ["proData"],
  extends: proCon,
  data() {
    return {
      duiHidden: true,
      objs: this.proData,
      resouId: "",
      reId: "",
      resou_local: "",
      button_aud: true,
      audioM: "",
      changeText: false,
      audioPlay: "true",
      publishAudio: "",
      audioOnceAuto:"",
      question:require('../../../static/images/duihao.png'),
    };
  },
  mounted() {
    this.audioOnceAuto = this.objs.loop;
    this.audioM = XPIXI.ResourceManager.getInstance().getResourceUrlById(
      this.objs.audioId
    );
  },
  created() {
    if (this.getStyleValue(this.objs, "changeTexture") == undefined) {
      this.changeText = false;
    } else {
      this.changeText = true;
    }
    this.audioM = XPIXI.ResourceManager.getInstance().getResourceUrlById(
      this.objs.audioId
    );
  },
  methods: {
    once_auto_play(){
      var audio = document.getElementById("audio");
      if(this.audioPlay === false ){
         audio.pause();
        audio.currentTime = 0;
         this.audioPlay = '点击播放';
      }
      this.objs.loop = !this.objs.loop;
      this.audioOnceAuto = !this.audioOnceAuto;
      console.log(this.objs.loop);
    },
    playOver() {
      this.audioPlay = true;
    },
    clickAudio() {
      console.log(this.objs.audioId);
      if (!this.objs.audioId) {
        alert("请先上传音频");
        return;
      } else {
        this.audioPlay = false;
      }
      var audio = document.getElementById("audio");
      audio.play();
    },
    ChangeAudio(ev, type) {
      let target = ev.target.files;
      if (target.length > 0) {
        switch (type) {
          case "audio":
            if (
              target[0].type !== "audio/mp3"
            ) {
              this.$store.commit("ALERT", {
                data: "文件类型仅支持mp3,请重新选择",
                this: this
              });
              return;
            }
            break;
        }
      }
      this.$store.state.limitAlert = false;
      // debugger;
      this.ChangeRes(ev, this.objs, "audio").then(value => {
        console.log(this.objs);
        this.audioM = XPIXI.ResourceManager.getInstance().getResourceUrlById(
          value.id
        );
        this.objs.audioId = value.id;
        this.objs.audioName = value.name;
        this.$store.state.limitAlert = true;
      });
    }
  }
};
</script>
<style lang="scss">
.audioBox {
  width: 100%;
  height: auto;
}
.pictureDefault {
  position: absolute;
  top: 0rem;
  right: 0rem;
  font-size: 0.12rem;
  /*color: #ffffff;*/
}
.pngOraudio {
  width: 0.9rem;
  height: 0.9rem;
  /*background: #adadad;*/
  display: inline-block;
  .span_audio {
    /*display:block;*/
    width: 0.8rem;
    height: 0.8rem;
    position: absolute;
    top: 0rem;
    left: 0.06rem;
    background: #adadad;
    margin-top: 0.12rem;
    font-size: 0.15rem;
    color: #ffffff;
    text-align: center;
    line-height: 0.9rem;
    margin-left: 0.25rem;
  }
  img {
    width: 100%;
    margin-top: 0.12rem;
    margin-left: 0.25rem;
  }
  .audioKcontainer {
    width: 100%;
    height: auto;
    position: relative;
  }
  .ChangeKong {
    width: 0.85rem;
    height: 0.26rem;
    border: none;
    outline: none;
    border-radius: 0.05rem;
    background: #666666;
    color: #fff;
  }
  p {
    position: absolute;
    top: 1.6rem;
    left: 0rem;
    width: 100%;
    height: 0.4rem;
    font-size: 0.2rem;
    line-height: 0.4rem;
    color: #fff;
    text-indent: 0.2rem;
  }
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
.audioSrc {
  width: 100%;
  height: 0.4rem;
  /*background: #f98d9d;*/
  position: relative;
}
.audioMp3Btn {
  position: absolute;
  left: 0.2rem;
  width: 2.4rem;
  height: 0.33rem;
  border: none;
  outline: none;
  background: #666;
  outline: none;
  background: #666;
  color: #fff;
  border-radius: 0.05rem;
}
.audioMp3 {
}
.audioCh {
  width: 2.4rem;
  height: 0.33rem;
  border: none;
  outline: none;
  background: #666;
  position: absolute;
  right: 0.2rem;
  top: 0.6rem;
  outline: none;
  background: #666;
  color: #fff;
  border-radius: 0.05rem;
}
.showPps {
  width: 100%;
  .small {
    width: 0.25rem;
    height: 0.25rem;
    background: #ffffff;
    display: inline-block;
    font-size: 0.2rem;
    text-align: center;
    line-height: 0.25rem;
  }
}
.showPps span {
  font-size: 0.18rem;
  line-height: 0.27rem;
  color: #ddd;
}
.inputVF {
  width: 2.4rem;
  height: 0.33rem;
  position: absolute;
  top: 0.6rem;
  left: 0.14rem;
  /*background: #f98d9d;*/
  opacity: 0;
}
.controlInput {
  width: 0.8rem;
  height: 0.24rem;
  position: absolute;
  top: 0.5rem;
  right: 0.28rem;
  opacity: 0;
}
.audioP {
  width: 100%;
  height: 0.4rem;
  font-size: 0.2rem;
  line-height: 0.4rem;
  color: #fff;
  text-indent: 0.2rem;
  position: absolute;
  top: 1.3rem;
  margin-bottom: 1rem;
}
.fuBox {
  width: 100%;
  position: relative;
}
.loading {
  position: relative;
}
.loadingbtn {
  width: 0.89rem;
  height: 0.3rem;
  border: none;
  outline: none;
  background: #666;
  position: absolute;
  right: 0.2rem;
  top: 0.3rem;
  margin-top: 0.2rem;
  border-radius: 0.05rem;
  color: #fff;
}
.playNum{
  width:100%;
  height:1rem;
  margin-top:0.7rem;
  // background: pink;
  position: relative;
     .autoNum{
  position: absolute;
  left:0rem;
  top:0.1rem;
       width:1rem;
       height:0.35rem;
       background: #666;
       border:none;
       border-radius:0.05rem;;
       position: absolute;
       left:0.2rem;
       color: #fff;
      
  }
.autoSpan{
         font-size: 0.15rem;
         position: absolute;
         bottom:0.2rem;
         left:20%;
         color: #fff;
}
   .onceNum{
  position: absolute;
  right:0rem;
  top:0.1rem;
       width:1rem;
       height:0.35rem;
       background: #666;
       border:none;
       border-radius:0.05rem;;
       position: absolute;
       right:0.2rem;
       color: #fff;
  }
}
.onceSpan{
        font-size: 0.15rem;
         position: absolute;
         bottom:0.2rem;
         right:20%;
         color: #fff;
}
</style>
