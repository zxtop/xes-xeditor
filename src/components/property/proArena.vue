<template>
  <div class="arenaDiv">
    <p class="arena_pps">舞台</p>
    <div class="block">
      <span class="demonstration">舞台大小</span>
      <el-slider v-model="scaleLocal" @input = 'changeEvent(scaleLocal)':min="1" :max="21"></el-slider>
    </div>
    <!--<div class="canvasSize">-->
      <!--<p class="size_pps">画布尺寸</p>-->
      <!--<div class="divs_radio">-->
        <!--<h2 class="radio_p"><input class="input_radio" disabled="disabled" name="size" type="radio" value=""><span class="spans">4：3</span></h2>-->
        <!--<h2 class="radio_p"><input class="input_radio" disabled="disabled" name="size" type="radio" value=""><span class="spans">16:9</span></h2>-->
        <!--<h2 class="radio_p"><input class="input_radio" disabled="disabled" name="size" type="radio" value=""><span class="spans">自定义</span></h2>-->
      <!--</div>-->
      <!--<div class="width_h">-->
        <!--<h3>-->
          <!--<span style="font-size:0.18rem;color: #555555;position: absolute;top: 0rem;left:0.25rem;">W:</span>-->
          <!--<input style="position: absolute;top:0rem;left:0.48rem" class="wh_input" type="text" disabled @input="changeXY()">-->
          <!--<img class="imgA" :src="imga30" @click="chaImg($event)" alt="">-->
          <!--<span style="font-size:0.18rem;position: absolute;top: 0rem;left:1.65rem;color: #555555">H:</span>-->
          <!--<input style="position: absolute;top:0rem;left:1.85rem"  class="wh_input" disabled type="text">-->
        <!--</h3>-->
        <!--<h4></h4>-->
      <!--</div>-->
    <!--</div>-->
    <div class="back">
      <p class="back_color" style="height: 0.3rem;line-height:0.3rem;">背景颜色</p>
      <proArenaColor></proArenaColor>
    </div>
    <!--<div class="bg_div">-->
      <!--<p class="bg_p">背景图片</p>-->
      <!--<p class="file_p">-->
        <!--<input class="inp_file" type="text" :value="getStyleValue(this.objs,'imageUrl')">-->
        <!--<button class="change_file">更改图片</button>-->
        <!--<input name="dataInput" type="file" class="btn_file" @click="replaceInput($event)" @change="ChangeRes($event, null, 'img')">-->
      <!--</p>-->
      <!--<h3 class="h3_hidden"><span></span><small>隐藏</small></h3>-->
    <!--</div>  -->
    <!--<div class="bg_div">-->
      <!--<p class="bg_p">背景音频</p>-->
      <!--<p class="file_p">-->
        <!--<input class="inp_file" type="text" placeholder="../../../static/images/a30.png">-->
        <!--<button class="change_file">更改音频</button>-->
      <!--</p>-->
      <!--<h3 class="h3_hidden"><span></span><small>隐藏</small></h3>-->
    <!--</div>-->
   <!-- <iscroll-view class="ulWrap" ref="ulWrap" id="scroller" :options="{mouseWheel:true,preventDefault: false}"> -->

    <div class="NewButton">
      <div class="chooseBtn" v-if="this.$store.state.rootStageObj.modelType == 1">
      <p>选择添加</p>
      <ul class="uls_choose">
        <li v-for="(item,index) in button_new" >
          <img :src="item.img_btn" alt="" @click="btn_new(index)">
          <input type="file" id="input_index" v-if="item.imgs" @click="replaceInput($event)" @change="fileChange($event,index)">
          <span class="classify_span">{{item.text}}</span>
        </li>
      </ul>
      </div>
      <div class="classifyBtn" v-if="this.$store.state.rootStageObj.modelType == 3">
        <p>分类添加</p>
        <ul>
          <li v-for="(item,index) in classify_new" >
            <img :src="item.img_btn" alt="" @click="btn_new(index)">
            <input type="file" id="classify_input" v-if="item.imgs" @click="replaceInput($event)" @change="classChange($event,index)">
            <span class="classify_span">{{item.text}}</span>
          </li>
        </ul>
      </div>
      <div class="onlineBtn" v-if="this.$store.state.rootStageObj.modelType == 4">
        <p>连线添加</p>
        <ul>
          <li v-for="(item,index) in online_new"  >
            <img :src="item.img_btn" alt="" @click="btn_new(index)">
            <input type="file" id="online_input" v-if="item.imgs" @click="replaceInput($event)" @change="onLineChange($event,index)">
            <span class="classify_span">{{item.text}}</span>
          </li>
        </ul>
      </div>
      <div class="tiankongBtn" v-if="this.$store.state.rootStageObj.modelType == 2">
        <p>填空添加</p>
        <ul>
          <li v-for="(item,index) in fill_new" >
            <img :src="item.img_btn" alt="" @click="btn_new(index)">
            <input type="file" id="fill_input" v-if="item.imgs" @click="replaceInput($event)" @change="fillChange($event,index)">
            <span class="classify_span">{{item.text}}</span>
          </li>
        </ul>
      </div>
      <div class="wuBtnDiv"  v-if="this.$store.state.rootStageObj.modelType == 5">
       <p>添加</p>
         <ul>
          <li v-for="(item,index) in wu_new" >
            <img :src="item.img_btn" alt="" @click="btn_new(index)">
            <input type="file" id="wu_input" v-if="item.imgs" @click="replaceInput($event)" @change="wuChange($event,index)">
            <span class="classify_span">{{item.text}}</span>
          </li>
        </ul>
      </div>
      <div style="width:auto;height:auto;float:left;margin-top:0.1rem">
        <!-- <p style="line-height:0.7rem">动画添加</p>  -->
        <upload-animation></upload-animation>
        <!-- <div style="height:6rem;width:100%;background:red">dvnsdjvjwkjvnvnvjkvkjnkwnknwknkw</div> -->
        </div> 
           <!-- </iscroll-view> -->
    </div>
  </div>
</template>
<script>
  import proArenaColor from './proArenaColor.vue'
  import uploadAnimation from "./uploadAnimation";
  import { APIStock, host1, host2 } from "../../interfaceConfig/interface";
  import proCon from './proCommon.vue';
  export  default {
    extends: proCon,
    props: ["prosObj"],
    data(){
      return{
        radio: '',
        imga30:require('../../../static/images/a30.png'),
        imga29:require('../../../static/images/a29.png'),
        objs:this.prosObj,
        indexNum:0,
        value2:50,
        scaleX:'',
        button_new:[
          {"img_btn":require('../../../static/images/picture.png'),"imgs":true,'text':'图片'},
          {"img_btn":require('../../../static/images/text2.png'),"imgs":false,'text':'文本'},
          {"img_btn":require('../../../static/images/dianji2.png'),"imgs":true,'text':'暂不可用'},
          {"img_btn":require('../../../static/images/yinpin.png'),"imgs":true,'text':'音频'},
          // {"img_btn":require('../../../static/images/yinpin.png'),"imgs":true,'text':'动画'}
        ],
        classify_new:[
          {"img_btn":require('../../../static/images/picture.png'),"imgs":true,'text':'图片'},
          {"img_btn":require('../../../static/images/text2.png'),"imgs":false,'text':'文本'},
          {"img_btn":require('../../../static/images/fenlei.png'),"imgs":true,'text':'项'},
          {"img_btn":require('../../../static/images/lei.png'),"imgs":true,'text':'类'},
          {"img_btn":require('../../../static/images/yinpin.png'),"imgs":true,'text':'音频'},
        ],
        online_new:[
          {"img_btn":require('../../../static/images/picture.png'),"imgs":true,'text':'图片'},
          {"img_btn":require('../../../static/images/text2.png'),"imgs":false,'text':'文本'},
          {"img_btn":require('../../../static/images/online.png'),"imgs":true,'text':'项'},
          {"img_btn":require('../../../static/images/leimu.png'),"imgs":true,'text':'类'},
          {"img_btn":require('../../../static/images/yinpin.png'),"imgs":true,'text':'音频'},
        ],
        fill_new:[
          {"img_btn":require('../../../static/images/picture.png'),"imgs":true,'text':'图片'},
          {"img_btn":require('../../../static/images/text2.png'),"imgs":false,'text':'文本'},
          {"img_btn":require('../../../static/images/check.png'),"imgs":true,'text':'填空'},
          {"img_btn":require('../../../static/images/yinpin.png'),"imgs":true,'text':'音频'},
        ],
        wu_new:[
          {"img_btn":require('../../../static/images/picture.png'),"imgs":true,'text':'图片'},
          {"img_btn":require('../../../static/images/text2.png'),"imgs":false,'text':'文本'},
          {"img_btn":require('../../../static/images/yinpin.png'),"imgs":true,'text':'音频'},
        ],
        scaleLocal:0
      }
    },
    components: {
      proArenaColor,uploadAnimation
    },
    created(){


      this.scaleLocal = this.$store.state.rootStageObj.scale.x*10;
      // console.log(this.$store.state.typeOfQuestion)
    },
    computed:{
      stageScaleXY(){
        return this.$store.state.rootStageObj.scale.x
      }
    },
    watch:{
      stageScaleXY(){
        this.scaleLocal = this.$store.state.rootStageObj.scale.x*10;
      }
    },
    mounted(){
    },
    methods:{
      // chaImg(ev){
      //   if($('.imgA').hasClass('imgB')){
      //     $(".imgA").attr('src','../../../static/images/a30.png');
      //     $('.imgA').removeClass('imgB')
      //   }else {
      //     $(".imgA").addClass("imgB");
      //     $(".imgA").attr('src','../../../static/images/a29.png');
      //   }
      // },
      changeEvent(val){
        this.$store.dispatch("SCALE_STAGE",{scaleX:val/10,scaleY:val/10});
      },
      classChange(ent,index){//分类
        if(index == 0) {
          this.ChangeRes(ent, null, 'img').then((value) => {
            this.$store.dispatch("CREATE_ELEMENT",{type:"img",content:value,base:undefined});
          })
        }else if(index == 2){
          this.ChangeRes(ent,null,'img').then((value)=>{
            this.$store.dispatch("CREATE_ELEMENT",{type:"Classification_class",content:value,base:undefined});
          })
        }else if(index == 3){
          this.ChangeRes(ent,null,'img').then((value)=>{
            this.$store.dispatch("CREATE_ELEMENT",{type:"Classification_item",content:value,base:undefined});
          })
        }else if(index == 4){
          this.ChangeRes(ent,null,'img').then((value)=>{
            this.$store.dispatch("CREATE_ELEMENT",{type:"audio",content:value,base:undefined});
          })
        }
      },
      onLineChange(ent,index){//连线模板
        let stageObj = this.$store.state.stageObj
        let rootStageObj = this.$store.state.rootStageObj
        let stack = this.$store.state.stack
        if(index == 0) {
          this.ChangeRes(ent, null, 'img').then((value) => {
            this.$store.dispatch("CREATE_ELEMENT",{type:"img",content:value,base:undefined});
          })
        }else if(index == 2){
          this.ChangeRes(ent,null,'img').then((value)=>{
            this.$store.dispatch("CREATE_ELEMENT",{type:"Ligature_stem",content:value,base:undefined});
          })
        }
        else if(index == 3){
            this.ChangeRes(ent,null,'img').then((value)=>{
              this.$store.dispatch("CREATE_ELEMENT",{type:"Ligature_answer",content:value,base:undefined});
            })
        }else if(index == 4) {
          this.ChangeRes(ent, null, 'img').then((value) => {
            this.$store.dispatch("CREATE_ELEMENT", {type: "audio", content: value, base: undefined});
          })
         }
        },
      btn_new(index){//新建文本按钮
        if(index == 1){
          this.$store.dispatch("CREATE_ELEMENT",{type:"text"});
        }
      },
      fileChange(ent,index){//选择模板
        if(index == 0) {
          this.ChangeRes(ent, null, 'img').then((value) => {
            this.$store.dispatch("CREATE_ELEMENT",{type:"img",content:value,base:undefined});

          })
        }else if(index == 2){
          this.ChangeRes(ent,null,'img').then((value)=>{
            this.$store.dispatch("CREATE_ELEMENT",{type:"choice",content:value,base:undefined});

          })
        }else if(index == 3) {
          this.ChangeRes(ent, null, 'img').then((value) => {
            this.$store.dispatch("CREATE_ELEMENT", {type: "audio", content: value, base: undefined});
          })
        }
      },
      fillChange(ent,index){//填空模板
        if(index == 0) {
          this.ChangeRes(ent, null, 'img').then((value) => {
            this.$store.dispatch("CREATE_ELEMENT",{type:"img",content:value,base:undefined});
          })
        }else if(index == 2){
          this.ChangeRes(ent,null,'img').then((value)=>{
            this.$store.dispatch("CREATE_ELEMENT",{type:"filling",content:value,base:undefined});
          })
        }else if(index == 3){
          this.ChangeRes(ent,null,'img').then((value)=>{
            this.$store.dispatch("CREATE_ELEMENT",{type:"audio",content:value,base:undefined});
          })
        }
      },
      wuChange(ent,index){//无模板
        if(index == 0){
         this.ChangeRes(ent, null, 'img').then((value) => {
            this.$store.dispatch("CREATE_ELEMENT",{type:"img",content:value,base:undefined});
          })
        }else if(index == 2){
         this.ChangeRes(ent,null,'img').then((value)=>{
            this.$store.dispatch("CREATE_ELEMENT",{type:"audio",content:value,base:undefined});
          })
        }
      },
      replaceInput(e) {
        let input = e.target;
        input.value = "";
      },

    },
  }
</script>
<style scoped lang="scss">
  ::-webkit-scrollbar {display:none}
  .arenaDiv{
    width:2.8rem;
    height:8.4rem;
    overflow:scroll;
  }
  .arena_pps{
    width:2.8rem;
    height:0.5rem;
    line-height:0.5rem;
    background: #666666;
    font-size:0.2rem;
    color: #fff;
    text-indent: 0.1rem;
  }
  .canvasSize{
    width:2.8rem;
    height:2.05rem;
  }
  .size_pps{
    height:0.3rem;
    text-indent: 0.1rem;
    font-size:0.12rem;
    margin-top:0.1rem;
    color: #fff
  }
  .width_h{
    width:100%;
    height:0.3rem;
    position: absolute;
    top:2rem;
  }
  .width_height {
    font-size: 0.18rem;
    text-indent: 0.1rem;
    width: 100%;
    height: 0.5rem;
    color: #ccc;
    line-height: 0.5rem;
  }
  .width_height span{
    font-size:0.1rem;
  }
  .wh_input {
    width: 0.72rem;
    height: 0.26rem;
    color:#ccc;
    margin-left: 0.05rem;
    background-color: transparent;
    border: none;
    outline: none;
    background: #666;
    border:0.5px solid #888;
    border-radius: 0.05rem;
    text-indent: 5px;
    position: relative;
  }
  .width_h h3{
    font-weight: normal;
    height:0.3rem;
    width:100%;
    position: absolute;
    top:0rem;
  }
  .width_h h3 span{
    color: #fff;
  }
  .imgsReleva{
    width:0.27rem;
    height:0.12rem;
    margin-left:0.04rem;
    margin-right:0.04rem;
  }
  .back{
    width:100%;
    height:1rem;
    margin-top:0.1rem;
    margin-bottom: 0.05rem;
  }
  .back_color{
    width:100%;
    font-size: 0.12rem;
    color: #fff;
    text-indent:0.1rem;
  }
  .spans{
    font-size:0.14rem;
    color: #555555;
    position: absolute;
    left:0.6rem;
  }
  .input_radio{
    /*width:80%;*/
    position: absolute;
    top:0.055rem;
    left:0.25rem;
    width:0.14rem;
    height:0.14rem;
  }
  .radio_p{
    width:100%;
    height:0.3rem;
    position: relative;
    margin-top: 0.05rem;
  }
  .divs_radio{
    width:100%;
    height:1rem;
  }
  .divs_radio h2{
    font-weight:normal;
  }
  .imgA{
    position: absolute;
    top:0.08rem;
    left:1.35rem;
    width:0.22rem;
    height:0.10rem;
  }
  .bg_div{
    width:100%;
    height:1rem;
    /*background: #ffcf93;*/
    margin-top:0.08rem;
  }
  .bg_p{
    font-size:0.12rem;
    text-indent:0.1rem;
    color:#fff;
  }
  .file_p{
    width:100%;
    height:0.35rem;
    font-size:0.12rem;
    /*background: pink;*/
    position: relative;
  }
  .inp_file{
    position: absolute;
    top:0.1rem;
    background:transparent;
    left:0.25rem;
    color: #999999;
    display: inline-block;
    width:1.27rem;
    height:0.16rem;
    border:none;
    outline: none;
    font-size:0.12rem;

  }
  .change_file{
    display: inline-block;
    position: absolute;
    right:0.2rem;
    top:0.05rem;
    width:0.9rem;
    height: 0.28rem;
    border:1px solid #333333;
    font-size:0.14rem;
    outline: none;
    border-radius:0.04rem;
    background: #666666;
    color: #fff;
  }
  .btn_file{
    position: absolute;
    right:0rem;
    top:0rem;
    width:1rem;
    height:0.3rem;
    opacity: 0;
  }
  .h3_hidden{
    width:100%;
    height: 0.3rem;
    /*background: pink;*/
    font-size: 0.14rem;
    /*line-height: 0.1rem;*/
    color: #fff;
    position: relative;
  }
  .h3_hidden span{
    width:0.16rem;
    height: 0.16rem;
    background: #fff;
    display: inline-block;
    position: absolute;
    top:0.05rem;
    left:0.3rem;
    margin-right: 0.3rem;
  }
  .h3_hidden small{
    position: absolute;
    left:0.6rem;
  }
  .NewButton{
    width:100%;
    height:2rem;
    // background: pink;
    // height:auto;
    *overflow: scroll;
    p{
      font-size:0.12rem;
      color: #ffffff;
      text-indent: 0.1rem;
      width:100%;
      height:0.35rem;
      line-height: 0.4rem;
    }
  ul{
    width:100%;
    height:0.75rem;
    li{
      width:25%;
      height:100%;
      list-style: none;
      float: left;
      position: relative;
      img{
        width:0.27rem;
        height:0.25rem;
        position: absolute;
        top:0.2rem;
        left:50%;
        transform: translate3d(-50%,-50%,0);
      }
      #input_index{
        width:0.35rem;
        height:0.35rem;
        position: absolute;
        border:none;
        outline:none;
        top:30%;
        left:50%;
        transform: translate3d(-50%,-50%,0);
        opacity:0;
      }
      .classify_span{
        display: inline-block;
        font-size: 0.12rem;
        color:#ccc;
        position: absolute;
        bottom:0.1rem;
        text-align: center;
        width:100%;
      }
    }

    }

  }
  .uls_choose{

     li:nth-child(3){
       :nth-child(3){
        // background: pink;
        color: #777;
       }
       :nth-child(2){
        //  background: pink;
         display:none;
         opacity: 1;
       }
     }
  }
  .classifyBtn{
    width:100%;
    height:1rem;
    /*background: royalblue;*/
      p{
        font-size:0.12rem;
        color: #ffffff;
        text-indent: 0.1rem;
        height:0.3rem;
        line-height: 0.3rem;
      }
    ul{
      width:100%;
      height:0.7rem;
      li{
        width:25%;
        height:100%;
        list-style: none;
        float: left;
        position: relative;
        img{
          width:0.27rem;
          height:0.25rem;
          position: absolute;
          top:0.2rem;
          left:50%;
          transform: translate3d(-50%,-50%,0);
        }
        #classify_input{
          width:0.35rem;
          height:0.35rem;
          position: absolute;
          border:none;
          outline:none;
          top:30%;
          left:50%;
          transform: translate3d(-50%,-50%,0);
          opacity:0;
        }
        .classify_span{
          display: inline-block;
          font-size: 0.12rem;
          color: #cccccc;
          position: absolute;
          bottom:0.1rem;
          text-align: center;
          width:100%;
        }
      }
    }
  }
  #online_input{
    width:0.35rem;
    height:0.35rem;
    position: absolute;
    border:none;
    outline:none;
    top:30%;
    left:50%;
    transform: translate3d(-50%,-50%,0);
    opacity:0;
  }
  .onlineBtn{
    width:100%;
    height:1.1rem;
    /*background: #f98d9d;*/
  }
  .tiankongBtn{
    width:100%;
    /*background: yellow;*/
    height:1.2rem;
    p{
      font-size:0.12rem;
      color: #ffffff;
      text-indent: 0.1rem;
      width:100%;
      height:0.35rem;
      line-height: 0.4rem;
    }

  }
  #wu_input{
    width:0.35rem;
    height:0.35rem;
    position: absolute;
    border:none;
    outline:none;
    top:30%;
    left:50%;
    transform: translate3d(-50%,-50%,0);
    opacity:0;
  }
  #fill_input{
    width:0.35rem;
    height:0.35rem;
    position: absolute;
    border:none;
    outline:none;
    top:30%;
    left:50%;
    transform: translate3d(-50%,-50%,0);
    opacity:0;
  }
  .ulWrap{
     width:100%;
     height:3rem;

  }
</style>
<style>
  .block{
    margin-top:-0.8rem;
    width: 100%;
    height:auto;
    /*position: relative;*/
  }
  .demonstration{
    font-size:0.12rem;
    text-indent:0.1rem;
    color: #fff;
    width: 100%;
    display:inline-block;
    line-height:2.1rem;
    height:0.6rem;

  }
  .el-slider{
    margin-top: -0.2rem;
  }
  .el-slider__button{
    border:1px solid #fff;
  }
  .el-slider__button-wrapper .el-tooltip, .el-slider__button-wrapper::after{
    position: absolute;
    width:0.15rem;
    height:0.15rem;
    top:-0.01rem;
  }
  .el-slider__button-wrapper{
    top:-0.04rem;

  }
  .el-slider__button{
    height: 0.1rem;
    width:0.1rem;
  }
  .el-slider__runway{
    height: 0.06rem;
  }
  .el-slider__bar{
    background: #666666;
    height:0.06rem;
  }
  .el-tooltip__popper{
    width:0.2rem!important;
    height:0.2rem!important;
    text-align: center;
    font-size:0.12rem;
    line-height: 0.2rem;
  }
 
</style>
