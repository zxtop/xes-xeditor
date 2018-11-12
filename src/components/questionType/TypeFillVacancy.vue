<template>
  <div class="templateKong" v-if="FillShowTotal">
    <div class="kongDiv" >
      <!--<h4 class="config_h4">样式</h4>-->
      <!--<div class="pictureDiv">-->
        <!--<div class="ImgTop">-->
          <!--<span class="spanImg1">-->
            <!--<img class="imgs_mr" :src="getStyleValue(typeObjs,'imageUrl')" alt="">-->
          <!--</span>-->
          <!--<button @click="change_btn_click()">替换图片</button>-->
          <!--<input type="file" class="input_change" @click="replaceInput($event)" @change="ChangeRes($event,typeObjs, 'img')">-->
        <!--</div>-->
        <!--<div class="ImgBottom">-->
          <!--<h2 class="h2_bao" v-if="getImgType(typeObjs,'click')">-->
            <!--<img  class="imgs_dj" :src="getImgType(typeObjs,'click')" alt="">-->
          <!--</h2>-->
          <!--<span v-else class="spanImg2">暂无图片</span>-->
          <!--<button>替换图片</button>-->
          <!--&lt;!&ndash;<input  type="file" class="input_change" @click="replaceInput($event)" @change="changeFocus(ChangeRes($event,undefined,'img'),typeObjs)">&ndash;&gt;-->
          <!--<input  type="file" class="input_change" @click="replaceInput($event)" @change="ChangeRes($event, typeObjs, 'img','click')">-->
        <!--</div>-->
      <!--</div>-->
      <h2 class="answer_pps">正确答案</h2>
      <div class="addKong">
        <ul class="kongUls">
          <li><input type="text"  class="input_text" @input="change_text($event)" :value="rightAnswer"></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import TypeCom from './TypeCommon.vue';
  import proCon from "../property/proCommon.vue";
  export default {
    name:'TypeFillVacancy',
    props:["typeObjs"],
    extends: proCon,
    data(){
      return {
        FillShowTotal:false,
        rightAnswer:'',
      }
    },
    methods:{
      changeFocus(pro,obj){
        pro.then((url) => {
          console.log(url)
          // let res = obj.addNewRes(url)，;
          obj.focusTexture = XPIXI.ResourceManager.getInstance().getResourceUrlById(url.id)
          console.log(obj);
        })
      },
      change_text(ev){
        this.typeObjs.rightAnswer = ev.target.value
        console.log(this.typeObjs)
      },
      addControl(){
        let cvArray = this.typeObjs;
        let copyObj = cvArray.copySelf();
        copyObj = createPixiObj(copyObj);
        let parentChild = this.typeObjs.parent
        parentChild.addChild(copyObj);
      },
      kong_del(){
        this.$store.commit("DELETE_OBJ",[this.typeObjs])
      }
    },
    created(){
      console.log(this.getStyleValue(this.typeObjs,'focusTexture'))
      console.log(this.typeObjs.rightAnswer)
      if(this.typeObjs.groupType == 'blank'){
        this.FillShowTotal = true;

      }
      this.rightAnswer = this.typeObjs.rightAnswer;
    }

  }
</script>
<style lang="scss" scoped>
  .templateKong{
    width:100%;
    height:auto;
    /*background: yellow;*/
    margin-bottom: 0.4rem;
  }
  .kongDivImg{
    width:0.3rem;
    height:0.3rem;
  }
  .imgJia_picic{
    width:0.22rem;
    height:0.22rem;
    position:absolute;
    right:0.2rem;
    top:0.15rem;
  }
  .imgjian_pic{
    width:0.22rem;
    height:0.22rem;
    position:absolute;
    right:0.2rem;
    top:-0.35rem;
  }
  .kongDiv {
    width: 100%;
    height:3rem;
    /*margin-bottom: 0.3rem;*/
    position: relative;
  }
  .kongDiv p {
    width: 100%;
    height: 0.51rem;
    font-size: 0.18rem;
    color: #eee;
    line-height: 0.55rem;
    font-weight: bold;
    background: #555;
    margin-top: 0.1rem;
    text-indent: 0.15rem;
  }
  .config_h4 {
    width: 100%;
    font-weight: normal;
    height: 0.5rem;
    text-indent: 0.15rem;
    font-size: 0.14rem;
    line-height: 0.5rem;
    color: #fff;
  }
  .pictureDiv{
    width:100%;
    height:auto;
    .ImgTop{
      width:100%;
      height:1rem;
      position: relative;
      .spanImg1{
        width:50%;
        height:1rem;
        /*background: #ADADAD;*/
        display:inline-block;
        color:#fff;
        font-size:0.14rem;
        position: absolute;
        left:0.15rem;
        line-height: 1rem;
        text-align: center;
        .imgs_mr{
          width:70%;
          position: absolute;
          top:50%;
          left:50%;
          transform: translate3d(-50%,-50%,0);
          /*height: auto;*/
          /*height:100%;*/
        }
      }
      button{
        position: absolute;
        right:0.25rem;
        top:50%;
        transform: translate3d(0,-50%,0);
        font-size:0.12rem;
        border:none;
        outline: none;
        width:0.9rem;
        height:0.35rem;
      }
    }
    .ImgBottom{
      width:100%;
      height:1rem;
      position: relative;
      margin-top: 0.2rem;
      .h2_bao{
        width:50%;
        height:1rem;
        /*background: #ADADAD;*/
        display:inline-block;
        color:#fff;
        font-size:0.14rem;
        position: absolute;
        left:0.15rem;
        line-height: 1rem;
        text-align: center;
        .imgs_dj{
          width:70%;
          /*width:0.2rem;*/
          position: absolute;
          top:50%;
          left:50%;
          transform: translate3d(-50%,-50%,0);
        }
      }
      .spanImg2{
        width:40%;
        display:inline-block;
        position: absolute;
        top:50%;
        left:50%;
        transform: translate3d(-100%,-50%,0);
        height:0.5rem;
        background: #ADADAD;
        color:#fff;
        font-size:0.14rem;
        line-height:0.5rem;
        text-align: center;
      }
      button{
        position: absolute;
        right:0.25rem;
        top:50%;
        transform: translate3d(0,-50%,0);
        font-size:0.12rem;
        border:none;
        outline: none;
        width:0.9rem;
        height:0.35rem;
      }
    }
  }
  .addKong{
    width:100%;
    height:auto;
    margin-top: 0.4rem;
    margin-bottom: 0.2rem ;
    /*position: relative;*/
    .kongUls{
      width:100%;
      height:auto;
      li{
        width:100%;
        height:0.35rem;
        position: relative;
        margin-bottom: 0.1rem;
        input{
          width:86%;
          height:0.4rem;
          position: absolute;
          left:0.06rem;
          line-height:0.4rem;
          text-indent:0.1rem;
          margin-left:0.15rem;
          border-radius: 0.05rem;
          border:none;
          background: #888888;
          font-size:0.12rem;
          color: #ffffff;
          margin-top: -0.3rem;
        }
      }
    }
    .btn_add_fill{
      width:30%;
      height:0.35rem;
      background: #DADADA;
      margin-left: 13.5%;
      margin-top: 0.2rem;
      float: left;
      border:none;
      border-radius:0.05rem;
      font-size:0.12rem;
    }
    .btn_del_fill{
      width:30%;
      height:0.35rem;
      background: #DADADA;
      margin-left: 13.5%;
      margin-top: 0.2rem;
      float: left;
      border:none;
      border-radius:0.05rem;
      font-size:0.12rem;
    }

  }
  .fillDiv{
    position: relative;
  }
  .input_change{
    width:0.8rem;
    height:0.35rem;
    /*background: red;*/
    position: absolute;
    right:0.3rem;
    top:0.32rem;
    overflow: hidden;
    opacity: 0;
  }
  .answer_pps{
    line-height: 0.4rem;
    height: 0.4rem;
    margin-top: 0.1rem;
    width:100%;
    font-size: 0.12rem;
    color:#fff;
    text-indent:0.1rem;
    font-weight: normal;
  }

</style>
