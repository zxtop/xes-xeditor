<template>
  <div class="proLocation">
  <p class="editorOrtype">属性</p>    
    <div class="hiddenOr" v-if="editorHidden" >
      <div class="topClass">
        <div class="proHeadTitle" >
          <ul>
            <li v-for="item,index in imgsData">
              <span class="spanPli"  ref="liSpan"></span>
              <img :src=item.icon alt=""  @mouseover="imgliOver(index)" @mouseout="imgliOut(index)" @click="imgliClick(index)">
            </li>
          </ul>
        </div>

        <div class="propertyUls" v-if="stagePage">

          <p>
            <span style="margin-left: 0.1rem;font-size:0.18rem;">X:</span>
            <input type="number"
            @keydown.ctrl="inputUndo($event)"
                   @keydown="keyXy($event)"
                   :value="Math.round(this.getStyleValue(prosObj,'x'))"
                   id="idx"
                   @input="change('x',$event,false)"
                   @change="change('x',$event,true)"
                   @focus="focusX($event)"
            ><small></small><span style="margin-left:0.05rem;font-size:0.18rem;">Y:</span>
            <input type="number"
            @keydown.ctrl="inputUndo($event)"
                   id="idy"
                   @keydown="keyXy($event)"
                   :value="Math.round(this.getStyleValue(this.selectObj,'y'))"
                   @input="change('y',$event,false)"
                   @change="change('y',$event,true)"
                   @focus="focusY($event)">
          </p>

          <p v-if="textFontW">
            <span style="margin-left: 0.06rem;font-size:0.18rem;">W:</span><input
            @keydown.ctrl="inputUndo($event)"
                                         type="number"
                                         onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                                         class="widths"
                                         id="idwidth"
                                         :value="widths"
                                         :val="disTrue"
                                         @input="change('width',$event,false)"
                                         @change="change('width',$event,true)"
                                         @focus="focusWidth($event)">
            <img class="imgsReleva" v-if="lock" @click="lockChange()" :src=imga30 alt="">
            <img class="imgsReleva" v-if="lockno" @click="lockN()" :src=imga29 alt="">
            <span style="font-size:0.18rem;">H:</span>
            <input type="number"
            @keydown.ctrl="inputUndo($event)"
            @keydown="keyblur"
                   class="heights"
                   id="idHeight"
                   :value="heights"
                   onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                   :val="disTrue"
                   @input="change('height',$event,false)"
                   @change="change('height',$event,true)"
                   @focus="focusHeight($event)">
          </p>

          <p class="pps_FontW" v-else>
            <span class="FontWspan" style="margin-left: 0.06rem">W:</span>
            <input type="number"
            @keydown.ctrl="inputUndo($event)"
            @keydown="keyblur"
                   onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                   class="FontWinput"
                   disabled="disabled"
                   :dis="disTrue"
                   :value="getStyleValue(selectObj,'width')"
                   @input="change('width',$event,false)"
                   @change="change('width',$event,true)"
                   >
            <img class="imgsReleva" :src=imga30  alt="">
            <span class="FontWspan">H:</span><input type="number"
           @keydown.ctrl="inputUndo($event)"
                                                    class="FontWinput"
                                                    :dis="disTrue"
                                                    onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                                                    disabled="disabled"
                                                    :value="getStyleValue(selectObj,'height')"
                                                    @input="change('height',$event,false)"
                                                    @change="change('height',$event,true)"
                                                    >
          </p>


          <p class="routerPPs">
            <span style="font-size:0.15rem">旋转角度</span>
            <input style="width:1.7rem;" type="number"
           @keydown.ctrl="inputUndo($event)"
           @keydown="keyblur"
                   id="rotationId"
                   :value="Math.round(180/Math.PI * this.getStyleValue(this.selectObj,'rotation'))"
                   @input="changes('rotation',$event,false)"
                   @change="changes('rotation',$event,true)"
                   @focus="focusRotation($event)"
                   @blur="RotationBlurName('rotation',$event,false)">
          </p>

          <p class="name_pps">
            <span style="font-size:0.15rem">元素名称</span>
            <input  style="width:1.7rem;"
           @keydown.ctrl="inputUndo($event)"
           @keydown="keyblur"
                    @change="blurName('name',$event,true)"
                    type="text"
                    :value="getStyleValue(this.selectObj,'name')"
                    @input="changeName('name',$event,false)"
                    @focus="focusName($event)">
          </p>
        </div>

        <p class="titleHidden">{{contMessage}}</p>
      </div>
      <div class="typeBox">

        <el-collapse-transition>
          <component :is="getObjType(selectObj)" :proData="selectObj" :key="selectObj.id" v-if="componentHidden"></component>
        </el-collapse-transition>
        <div class="fillDiv" v-if="title_question_show">
          <p class="titleHidden">配置信息</p>
          <div class="kongDivImg">
            <img class="imgJia_picic" v-if="kong_pic_show"   @click="addPic()" :src=imgbjia alt="">
            <img class="imgJia_picic" v-if="kong_pic_hidden" @click="reducePic()" :src=imgbjian alt="">
          </div>
        </div>

        <el-collapse-transition>
          <component :is="getTypeTwo(satgeLocal)" v-if="kong_show" :typeObjs="prosObj" :key="satgeLocal.modelType"></component>
        </el-collapse-transition>
      </div>

    </div>
    <answerCont v-else :loca="moLocal"></answerCont>

    <div class="spreadOrpack">
      <img class="imgSP imgSpJ" v-if="hiddenSP"  @click="Spclick()" :src=imgbjia alt="">
      <img class="imgSP" v-if="hiddenSPTwo" @click="Spclickto()" :src=imgbjian alt="">
    </div>


  </div>
</template>
<script>
  import proText from "./proText";
  import proAudio from './proAudio';
  import proImg from "./proImg";
  import proContainer from "./proContainer";
  import proStage from './proStage.vue';
  import TypeFillVacancy from '../questionType/TypeFillVacancy.vue'
  import ChoosePanel from '../questionType/ChoosePanel.vue'
  import ClassifyPanel from '../questionType/ClassifyPanel.vue'
  import OnlinePanel from '../questionType/OnlinePanel.vue'
  import proAnimationSprite from "./proAnimationSprite";
  import proCon from "./proCommon.vue";
  export default {
    name: "proLocation",
    extends: proCon,
    components: {
      proText,
      proImg,
      proContainer,
      proAudio,
      proStage,
      TypeFillVacancy,
      ChoosePanel,
      ClassifyPanel,
      OnlinePanel,
      proAnimationSprite
    },
    props: ["prosObj"],
    data() {
      return {
        selectObj:{},
        stagePage:true,
        stageHidden:false,
        Fwidth:'',
        Fheight:'',
        moLocal:'',
        textFontW:false,
        editorHidden:'true',
        hiddenSP:'true',
        hiddenSPTwo:'false',
        componentHidden:'true',
        kong_show:true,
        kong_pic_show:"true",
        kong_pic_hidden:"false",
        title_question_show:true,
        proportion:'',
        somedata:true,
        lock:true,
        lockno:false,
        namechange:'',
        local:"",
        satgeLocal:'',
        imga30:require('../../../static/images/a30.png'),
        imga29:require('../../../static/images/a29.png'),
        imgbjian:require('../../../static/images/b-.png'),
        imgbjia:require('../../../static/images/b+.png'),
        imgsData:[
          {"icon":require('../../../static/images/a2.png')},
          {"icon":require('../../../static/images/a3.png')},
          {"icon":require('../../../static/images/a7.png')},
          {"icon":require('../../../static/images/a5.png')},
          {"icon":require('../../../static/images/a1.png')},
          {"icon":require('../../../static/images/a6.png')},
          {"icon":require('../../../static/images/a8.png')},
          {"icon":require('../../../static/images/a4.png')}
        ],
        beginRotation:'',
        beginName:'',
        beginY:'',
        beginX:'',
        beginHeight:'',
        beginWidth:'',
        RatioHeight:'',
        RatioWidth:'',
        startWorldTransform:[]
      };
    },
    created(){
      if(this.prosObj.groupType == undefined || this.prosObj.groupType == 'classification_class' || this.prosObj.groupType == 'ligature_stem'){
        this.title_question_show = false;
      }else{
        this.title_question_show = true;
      }

      this.scaleX = this.$store.state.stageObj.scale.x
      this.satgeLocal  = this.$store.state.rootStageObj;
      this.moLocal = localStorage.getItem('moduleConfig');
      this.selectObj = this.prosObj;
      this.$store.state.lidContent = false;
      this.local = 'local'+ this.selectObj.id
      let closeLoacl = localStorage.getItem(this.local)
      closeLoacl = JSON.parse(closeLoacl);
      if(closeLoacl == null ){
        this.$store.commit("PROPORTION_LOCK",false);
      }else {
        this.$store.commit("PROPORTION_LOCK",true);
        this.lockno = true;
        this.lock = !this.lockno;
      }
      if(this.selectObj.type == this.$store.state.typeObj.typeElement.STAGE){
        this.stagePage = false;
        this.stageHidden = !this.stagePage
      }
      this.namechange = this.getStyleValue(this.selectObj,'name');

    },
    mounted(){
      this.RatioHeight = this.getStyleValue(this.selectObj,'height')
      this.RatioWidth = this.getStyleValue(this.selectObj,'width')
      this.Fwidth = Math.round(this.getStyleValue(this.selectObj,'width'));
      this.Fheight = Math.round(this.getStyleValue(this.selectObj,'height'));
      this.proportion = this.Fwidth/this.Fheight;
      this.proportion = Math.round(this.proportion*1000)/1000;
    },
    methods: {
      RotationBlurName (names, event,bool) {
        let obj = this.$store.state.selectorObj.selectList[0];
        if ( 360 < event.target.value || event.target.value < 0) event.target.value = (event.target.value % 360);
        let pi = Math.PI / 180;
        let value = event.target.value;
        let key = names;
        value = pi * value*1
        this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.selectObj],key:key,value:value,isStack:{modifyState:bool,startContent:this.beginRotation,startWorldTransform:this.startWorldTransform}});
      },
      focusWidth(ev){
        this.beginWidth = ev.target.value;
        let obj = this.$store.state.selectorObj.selectList[0];
        this.startWorldTransform = [obj.worldTransform.clone(),obj.getGlobalPosition().clone()]
      },
      focusHeight(ev){
        this.beginHeight = ev.target.value;
         let obj = this.$store.state.selectorObj.selectList[0];
        this.startWorldTransform = [obj.worldTransform.clone(),obj.getGlobalPosition().clone()]
      },
      focusX(ev){
        this.beginX = ev.target.value;
         let obj = this.$store.state.selectorObj.selectList[0];
        this.startWorldTransform = [obj.worldTransform.clone(),obj.getGlobalPosition().clone()]
      },
      focusY(ev){
        this.beginY = ev.target.value;
         let obj = this.$store.state.selectorObj.selectList[0];
        this.startWorldTransform = [obj.worldTransform.clone(),obj.getGlobalPosition().clone()]
      },
      focusName(ev){
        this.beginName = ev.target.value
      },
      focusRotation(ev){
        this.beginRotation = ev.target.value;
         let obj = this.$store.state.selectorObj.selectList[0];
        this.startWorldTransform = [obj.worldTransform.clone(),obj.getGlobalPosition().clone()]
      },
      keyXy(ev){
        if (ev.keyCode == 13) this.keyblur(ev);
        if(ev.target.value == 0){
          if(ev.keyCode == 8){
            ev.target.value = 0;
          }
        }
      },
      blurName(names,event,bool){
        let value = event.target.value;
        if (this.$store.state.stageObj.isNameExist(this.selectObj, value)) {
          // alert('该名称已经存在，请重新命名')
          this.$store.commit('ALERT',{data:'该名称已经存在，请重新命名',this:this})

           value = this.namechange ;
        }
        if(event.target.value == ''){
          value = this.namechange ;
        }
        if(event.target.value.length > 20){
          // this.$store.state.selectorObj.clearSelectList();
          this.$store.commit('ALERT',{data:'该区域最大限制为20个字符',this:this})
          value = this.namechange;
        }
        let reg = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        if (!reg.test(event.target.value)) {
          this.$store.commit('ALERT',{data:'该名称只能以字母和下划线开头，并且只能含有字母下划线和数字',this:this})
          value = this.namechange;
        }
        let key = names;//
        this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.selectObj],key:key,value:value,isStack:{modifyState:bool,startContent:this.beginName}});
        this.namechange = value;
      },
      changeName(names,event,bool){
        let value = event.target.value;
        let key = names;
        this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.selectObj],key:key,value:value,isStack:{modifyState:bool,startContent:this.beginName}});
      },
      addPic(){
        this.kong_pic_show = false;
        this.kong_pic_hidden = !this.kong_pic_show;
        this.kong_show = true;
      },
      reducePic(){
        this.kong_pic_hidden = false;
        this.kong_pic_show = !this.kong_pic_hidden;
        this.kong_show = false
      },
      lockChange(){
        this.lock = false;
        this.lockno  = !this.lock
        const obj = {
          id:this.selectObj.id
        }
        // localStorage.setItem(this.local , JSON.stringify(obj))
      },
      lockN(){
        this.lockno = false;
        this.lock = !this.lockno
        let closeLoacl = localStorage.getItem(this.local)
            closeLoacl = JSON.parse(closeLoacl);
        // if(this.selectObj.id == closeLoacl.id){
        //   localStorage.removeItem(this.local);
        // }

      },
      Spclick(){
        this.hiddenSP = false;
        this.hiddenSPTwo = !this.hiddenSP
        this.componentHidden = true;
      },
      Spclickto(){
        this.hiddenSPTwo = false
        this.hiddenSP = !this.hiddenSPTwo;
        this.componentHidden = false;
      },
      imgliOver(index){
        this.$nextTick(()=>{
          this.$refs.liSpan[index].style.background = '#666';
        })
      },
      imgliOut(index){
        this.$nextTick(()=>{
          this.$refs.liSpan[index].style.background = '';
        })
      },
      imgliClick(index){
        this.$nextTick(()=>{
          this.$refs.liSpan[index].style.background = '#292929';
        })
        if(index == 0){
          this.$store.dispatch("ALIGN_ACTION","left")
        }else if(index == 1){
          this.$store.dispatch("ALIGN_ACTION","vertical")
        }else if(index == 2){
          this.$store.dispatch("ALIGN_ACTION","right")
        }else if(index == 3){
          this.$store.dispatch("ALIGN_ACTION","verticalIsometric")
        }else if(index == 4){
          this.$store.dispatch("ALIGN_ACTION","top")
        }else if(index == 5){
          this.$store.dispatch("ALIGN_ACTION","level")
        }else if(index == 6){
          this.$store.dispatch("ALIGN_ACTION","bottom")
        }else if(index == 7){
          this.$store.dispatch("ALIGN_ACTION","levelIsometric")
        }
      },
      // ulis(){
      //   this.editorHidden = true;
      //   this.hiddenSP = true;
      //   $('.lisS').css({'background':'#383838','color':'#fff'})
      //   $('.lisT').css({'background':'#292929','color':'#ccc'})
      // },
      // ulisNO(){
      //   this.editorHidden = false;
      //   this.hiddenSPTwo = false;
      //   this.hiddenSP = false;
      //   $('.lisT').css({'background':'#383838','color':'#fff'})
      //   $('.lisS').css({'background':'#292929','color':'#ccc'})
      // },
      changes(names, event,bool){
        let pi = Math.PI / 180;
        let value = event.target.value;
        let key = names;
        value = pi * value*1
        this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.selectObj],key:key,value:value,isStack:{modifyState:bool,startContent:this.beginRotation,startWorldTransform:this.startWorldTransform}});
      },
      change(names,event,bool) {
        let obj = this.$store.state.selectorObj.selectList[0];
        if(event.target.value.length>4){
          //  alert('输入内容超过最大限制')
          this.$store.commit('ALERT',{data:'输入内容超过最大限制',this:this})

           event.target.value = this.getStyleValue(this.selectObj,names)
        }else{
          if(event.data === "."){
            event.target.value = "123";
            return;
          }
          let value = event.target.value;
          let key = names;
          if(value == '-'){
            value= 0;
          }
          if(names == 'x'){
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.selectObj],key:key,value:value,isStack:{modifyState:bool,startContent:this.beginX,startWorldTransform:this.startWorldTransform}});
          }else if(names == 'y'){
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.selectObj],key:key,value:value,isStack:{modifyState:bool,startContent:this.beginY,startWorldTransform:this.startWorldTransform}});
          }else if(names == 'width'){

            this.Fwidth = value;
            if(this.lockno == true){
              this.Fheight = value*1 / this.proportion*1;
              this.Fheight = Math.round(this.Fheight)
              this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.selectObj],key:"height",value:this.Fheight,isStack:{modifyState:bool,startContent:this.RatioHeight,startWorldTransform:this.startWorldTransform}});
              this.RatioHeight = this.Fheight;
            }
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.selectObj],key:key,value:value,isStack:{modifyState:bool,startContent:this.beginWidth,startWorldTransform:this.startWorldTransform}});
          }else if(names == 'height'){
            this.Fheight = value;
            if(this.lockno == true){
              this.Fwidth = value*Number(this.proportion);
              this.Fwidth = Math.round(this.Fwidth);
              this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.selectObj],key:"width",value:this.Fwidth,isStack:{modifyState:bool,startContent:this.RatioWidth,startWorldTransform:this.startWorldTransform}});
              this.RatioWidth = this.Fwidth;
              console.log(this.Fwidth)
              console.log(this.RatioWidth)
              //
            }
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.selectObj],key:key,value:value,isStack:{modifyState:bool,startContent:this.beginHeight,startWorldTransform:this.startWorldTransform}});
          }

        }

      },

    },
    computed: {
      disTrue() {
        if (this.selectObj.type == this.$store.state.typeObj.typeElement.TEXT) {
          return false;
        } else {
          this.textFontW = true;
          return true;
        }
      },
      contMessage() {
        if (this.selectObj.type == this.$store.state.typeObj.typeElement.STAGE) {
          return '背景图'
        } else if (this.selectObj.type == this.$store.state.typeObj.typeElement.CONTAINER) {
          return '容器'
        } else if (this.selectObj.type == this.$store.state.typeObj.typeElement.IMAGE_TEXT) {
          return '图文混合'
        } else if (this.selectObj.type == this.$store.state.typeObj.typeElement.IMAGE_AUDIO) {
          return '音频'
        } else if (this.selectObj.type == this.$store.state.typeObj.typeElement.IMG) {
          return '图片'
        }else  if (this.selectObj.type == this.$store.state.typeObj.typeElement.AUDIO){
          return '音频'
        }else if(this.selectObj.type == this.$store.state.typeObj.typeElement.TEXT){
          return '文字'
        }else if(this.selectObj.type == this.$store.state.typeObj.typeElement.ANIMATED_SPRITE){
          return '动画'
        }

      },
      widths(){
        this.Fwidth = Math.round(this.getStyleValue(this.selectObj,'width'));
        return this.Fwidth;
      },
      heights(){
        this.Fheight = Math.round(this.getStyleValue(this.selectObj,'height'));
        return this.Fheight;
      },
    }
  };
</script>
<style lang="scss" scoped>
  .editorOrtype{
    width:100%;
    height:0.3rem;
    font-size:0.17rem;
    line-height: 0.5rem;
    text-align: center;
    color: #fff;
  }
  .editorOrtype ul {
    width:100%;
    height:100%;
    list-style:none;
  }
  .editorOrtype ul li {
    width:100%;
    height: 100%;
    font-size: 0.15rem;
    line-height: 0.45rem;
    text-align: center;
  }
  .editorOrtype .lisT{
    background: #292929;
    color: #ccc;
  }
  .proLocation {
    width: 100%;
    height:100%;
    border-top: none;
    /*overflow: scroll;*/
    border-top: none;
  }
  .propertyUls {
    width: 2.80rem;
    height:1.8rem;
    position: relative;
    border-top:0.5px solid #222;
  }
  p {
    font-size: 0.18rem;
    text-indent: 0.1rem;
    width: 100%;
    height: 0.5rem;
    color: #fff;
    line-height: 0.5rem;
  }
  .propertyUls small{
    width:0.42rem;
    display:inline-block;
  }
  .propertyUls input {
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
    text-indent:0.07rem;
    font-size:0.12rem;
  }

  .proHeadTitle{
    width:100%;
    height:0.45rem;
  }
  .proHeadTitle ul{
    width:100%;
    height:100%;
  }
  .proHeadTitle ul li{
    float:left;
    width:11.4%;
    height:90%;
    font-size:0rem;
    height:0.35rem;
    position: relative;
    list-style: none;
    margin-top: 0.03rem;
  }
  .proHeadTitle ul li:nth-child(4){
    margin-right:0.13rem;
  }
  .proHeadTitle ul li:nth-child(5){
    margin-left:0.1rem;
  }

  .proHeadTitle ul li img{
    width:0.18rem;
    height:0.21rem;
    position: absolute;
    top:0.12rem;
    left:0.05rem;
  }
  .title_pro{
    width:100%;
    height:0.51rem;
    background: #555;
    margin-top:0.1rem;
    text-indent: 0.15rem;
  }
  .pps_FontW{
    width:100%;
    height:100%;
  }
  .FontWspan{
    color: #555;
  }
  .FontWinput{
    background: #444;
    border:1px solid #555;
    color: #555;
  }
  .imgsReleva{
    width:0.27rem;
    height:0.1rem;
    margin-left:0.04rem;
    margin-right:0.04rem;
  }
  .spanPli{
    width:0.29rem;
    height:0.29rem;
    display:inline-block;
    margin-top:0.09rem;
    border-radius: 0.032rem;
    margin-left:0.028rem;
  }
  .spreadOrpack{
    width:0.3rem;
    height:0.3rem;
    .imgSP{
      width:0.2rem;
      height:0.2rem;
      position: absolute;
      right:0.2rem;
      top:2.85rem;
    }
  }
  .titleHidden{
    width:100%;
    height:0.45rem;
    font-size:0.15rem;
    color: #eee;
    line-height: 0.45rem;
    font-weight: bold;
    background: #555;
    margin-top:0.1rem;
    text-indent: 0.15rem;

  }
  .name_pps{
    position: absolute;
    top:1.37rem;
    left:0.09rem;
  }
  ::-webkit-scrollbar {display:none}
  .typeBox{
    width:100%;
    height:5rem;
    overflow-y: scroll;
    /*position: relative;*/
    .compiler{
      width:90%;
      height:0.35rem;
      border:1px solid #777;
      background: #666;
      font-size:0.15rem;
      margin-left: 4.5%;
      margin-top:10%;
      margin-bottom: 10%;
      border-radius:0.05rem;
      text-align: center;
      line-height: 0.35rem;
      color: #fff;
    }
  }
  .rotationId{
    /*position: absolute;*/
    /*right:0rem;*/
    /*margin-right:0.1rem;*/
  }
  .routerPPs{
    /*background:pink;*/
    width:auto;
    height:0.4rem;
    position: absolute;
    top:0.95rem;
    left:0.09rem;
    /*bottom:0rem;*/
    /*right:0.185rem;*/
  }
  .el-button el-button--default{
    display: none;
  }
  .btn_disable{
    width:100%;
    height:0.5rem;
    /*background: red;*/
    ul{
      width:100%;
      height:100%;
      li{
        width:16%;
        height:100%;
        list-style: none;
        float: left;
        position: relative;
        img{
          width:0.2rem;
          height:0.2rem;
          position: absolute;
          top:50%;
          left:50%;
          transform: translate3d(-50%,-50%,0);
        }
      }
    }
  }

  .kongDivImg{
    width:0.3rem;
    height:0.3rem;
  }
  .imgJia_picic{
    width:0.2rem;
    height:0.2rem;
    position:absolute;
    right:0.2rem;
    top:0.15rem;
  }
  .imgjian_pic{
    width:0.2rem;
    height:0.2rem;
    position:absolute;
    right:0.2rem;
    top:-0.35rem;
  }
  .kongDiv{
    width:100%;
    heigth:auto;
    position: relative;
  }
  .kongDiv p{
    width:100%;
    height:0.51rem;
    font-size:0.18rem;
    color: #eee;
    line-height: 0.55rem;
    font-weight: bold;
    background: #555;
    margin-top:0.1rem;
    text-indent: 0.15rem;
  }
  .config_h4{
    width:100%;
    font-weight:normal;
    height:0.3rem;
    text-indent: 0.15rem;
    font-size:0.14rem;
    line-height: 0.1rem;
    color:#fff;
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
        background: #ADADAD;
        display:inline-block;
        color:#fff;
        font-size:0.14rem;
        position: absolute;
        left:0.15rem;
        line-height: 1rem;
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
    .ImgBottom{
      width:100%;
      height:1rem;
      position: relative;
      margin-top: 0.2rem;
      .spanImg2{
        width:50%;
        display:inline-block;
        height:1rem;
        background: #ADADAD;
        color:#fff;
        font-size:0.14rem;
        position: absolute;
        left:0.15rem;
        line-height: 1rem;
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
          width:88%;
          height:0.35rem;
          position: absolute;
          left:0.06rem;
          text-indent:0.1rem;
          margin-left:0.15rem;
          height:0.5rem;
          border-radius: 0.05rem;
          border:none;
          background: #DADADA;
          font-size:0.12rem;
        }
      }
    }
    .btn_add_fill{
      width:50%;
      height:0.35rem;
      background: #DADADA;
      margin-left: 50%;
      transform: translate3d(-50%,0,0);
      border:none;
      border-radius:0.05rem;
      font-size:0.12rem;
    }
  }
  .fillDiv{
    position: relative;
  }


  .NewButton{
    width:100%;
    height:0.5rem;
    /*position: relative;*/
    /*background: red;*/
    ul{
      width:100%;
      height:100%;
      li{
        width:25%;
        height:100%;
        list-style: none;
        float: left;
        position: relative;
        img{
          width:0.22rem;
          height:0.22rem;
          position: absolute;
          top:50%;
          left:50%;
          transform: translate3d(-50%,-50%,0);
        }
        #input_index{
          width:0.22rem;
          height:0.3rem;
          position: absolute;
          background: yellow;
          border:none;
          outline:none;
          top:50%;
          left:50%;
          transform: translate3d(-50%,-50%,0);
          opacity:0;
          overflow: hidden;
        }
      }
    }

  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
