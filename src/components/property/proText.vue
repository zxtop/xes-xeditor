<template>
   <div class="proTextBox">
        <textarea name="textArea"  style="resize:none;font-size:0.14rem" @keydown.ctrl="inputUndo($event)"
                                   @focus="focusEvent($event)"
                                   @blur="blurEvent()"
                                   class="textareaBox"
                                   ref="textareaBox"
                                   v-model="areaDatas"
                                   id="textArea"
                                   @input="change('text',$event,false)"
                                   maxlength="1000"
                                   @change="change('text',$event,true)"></textarea>
     <div class="bbx">
       <div class="divFont" v-for="(item ,index) in bigObj">
         <span class="divSpan">{{item.title}}</span>
         <el-select :value="getStyleValue(objs,item.type)" placeholder="Select" @keydown.ctrl="inputUndo($event)" class="select_class">
           <el-option v-for="(value,i) in item.parameter"
                      :key="i"
                      :value="value"
                      @click.native="DivShowNo(item.type,$event,i,index,true)"
                      class="options_class">
           </el-option>
         </el-select>
         <input type="number" onkeyup="value=value.replace(/[^\d]/g,'')" class="ctrlnput" @keydown.ctrl="inputUndo($event)" @keydown="keyblur"
                :value="getStyleValue(objs,item.type)"
                @focus="focusFont(index,$event)"
                @change="change(item.type,$event,true)"
                ref="fontClass"
                style="width:1.4rem;height:0.28rem;text-indent:0.18rem;background: red;outline: none;border:none;position: absolute;top:0.01rem;left:0.7rem;z-index: 9;border:none;outline: none;background: #666;color:#fff;font-size:0.12rem;border-radius: 0.05rem;"
                v-if="index != 1">

       </div>
     </div>
     <p class="textPPS">
       <span class="spTextPPs">透明度</span>&nbsp;
       <input class="inpText transparentInput" @keydown.ctrl="inputUndo($event)" type="number" @keydown="keyblur"
              ref="transparentRef"
              v-model="font"
              step="0.01"
              @change="change('alpha',$event,true)"
              @focus="focusAlpha($event)">
       <span class="left" ><img @click="reduceAn()" src="../../../static/images/right_03.png" alt=""></span>
       <span class="right" ><img @click="addAn()" src="../../../static/images/right_05.png" alt=""></span>
     </p>
     <colorPicker :proData="proData"></colorPicker>
     <div class="fontType">
      <div class="typeBIU">
        <ol>
          <li v-for="item ,index in imgFontData">
            <span class="spanFontP" ref="spanRef"></span>
            <img :src=item.icon alt="" @mouseover="weight(index)" @mouseout="weightout(index)" @click="weightClick(index)">
          </li>
        </ol>
      </div>
       <div class="typeCLR">
       <ul>
         <li v-for="item ,index in imgAlignData">
           <span class="spanAlignP" ref="spanicon"></span>
           <img :src=item.icon alt="" @mouseover="alignOver(index)" @mouseout="alignout(index)" @click="alignClick(index)">
         </li>
       </ul>
       </div>
     </div>
     <proTitleImg v-if="tuwenHidden" :imgTW="twImg"></proTitleImg>
     <!-- <div>
     eknvlkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj  
     </div>   -->
   </div>
</template>
<script>
import proCon from "./proCommon.vue";
import colorPicker from './colorPicker';
import proTitleImg from "./proTitleImg";
 import LibResource from '../library/LibResource.vue';
  export default {
    name:'proText',
    extends: proCon,
    props:["proData"],
    data(){
        return{
          value: '',
          datas:'',
          proDatas:{},
          objs:"",
          twImg:'',
          font:"",
          tuwenHidden:false,
          valu:'',
          imgFontData:[
            {"icon":require('../../../static/images/b2.png')},
            {"icon":require('../../../static/images/b5.png')},
          ],
          imgAlignData:[
            {"icon":require('../../../static/images/b1.png')},
            {"icon":require('../../../static/images/b3.png')},
            {"icon":require('../../../static/images/a23.png')},
          ],
          bigObj:[
            {title:'字号',
              parameter:[6,8,9,10,11,12,14,18,24,30,36,48,60,72],
               type:'fontSize'
            },
            {title:'字体',
              parameter:['KaiTi','SimSun',"Microsoft YaHei",'Century Gothic','Century Gothic bold','FZCuYuan-M03S','FZZhunYuan-M02S'],
              type:'fontFamily'
            },
            {title:'字间距',
              parameter:[-100,-75,-50,-25,-10,-5,0,5,10,25,50,75,100,200],
              type:'letterSpacing'
            },
            {title:'行间距',
              parameter:[6,8,9,10,11,12,14,18,24,30,36,48,60,72],
              type:'leading'
            }
          ],
          beginArea:'',
          beginSize:'',
          beginSpacing:'',
          beginLeading:'',
          beginAlpha:'',
          beginSizeSelect:''


        }

    },
    components:{
      colorPicker,proTitleImg,LibResource
    },
    created(){
      this.font = this.proData.alpha;
      this.twImg = this.proData;
      if(this.proData.type == '7'){
        this.objs = this.proData.singleText;
        this.tuwenHidden = true;
      }else if(this.proData.type == '3'){
        this.objs = this.proData;
      }
      this.beginFamilySelect = this.getStyleValue(this.objs,'fontFamily')
      // console.log(this.beginFamilySelect)
    },
    mounted(){//每个样式的下拉选项
      this.datas = this.getStyleValue(this.objs,'text');
      if(this.getStyleValue(this.objs,'alpha')  == undefined){
        this.font = 1;
      }
    },
    methods:{
      focusAlpha(ev){
        if (typeof ev.target.value == 'number' && (ev.target.value > 0 || ev.target.value < 1)) this.beginAlpha = ev.target.value;
      },
      focusFont(index,ev){
        if(index == 0){
          this.beginSize = ev.target.value;
        }else if(index == 2){
          this.beginSpacing = ev.target.value
        }else if(index == 3){
          this.beginLeading = ev.target.value;
        }
      },
      focusEvent(ev){
        this.beginArea = ev.target.value;
        this.$refs.textareaBox.style.color = '#fff';
      },
      blurEvent(){
        this.$refs.textareaBox.style.color = '#ccc';
      },
       weight(index){
        this.$refs.spanRef[index].style.background = '#666';
      },
      weightout(index) {
        this.$refs.spanRef[index].style.background = '';
      },
      weightClick(index){
        this.clickBlur(event)
        this.$refs.spanRef[index].style.background = '#202020';
        if(index == 0){
          let indexWeight = this.getStyleValue(this.objs,'fontWeight');
          if(indexWeight == 'normal'){
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'fontWeight',value:'bold',isStack:{modifyState:true,startContent:indexWeight}});
          }else if(indexWeight == 'bold'){
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'fontWeight',value:'normal',isStack:{modifyState:true,startContent:indexWeight}});
          }
        }else if(index == 1){
          let indexStyle = this.getStyleValue(this.objs,'fontStyle');
          if(indexStyle == 'normal'){
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'fontStyle',value:'italic',isStack:{modifyState:true,startContent:indexStyle}});
          }else if(indexStyle == 'italic'){
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'fontStyle',value:'normal',isStack:{modifyState:true,startContent:indexStyle}});
          }
        }else if(index == 2){
          let indexText = this.getStyleValue(this.objs,'textDecoration');
          if(indexText == 'none'){
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'textDecoration',value:'underline',isStack:{modifyState:true,startContent:indexText}});
          }else if(indexText == 'underline'){
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'textDecoration',value:'none',isStack:{modifyState:true,startContent:indexText}});
          }
        }
        console.log(this.objs)
      },
      alignOver(index){
        this.$refs.spanicon[index].style.background = '#666'
      },
      alignout(index){
        this.$refs.spanicon[index].style.background = ''
      },
      alignClick(index){
        this.clickBlur(event)
        this.$refs.spanicon[index].style.background = '#202020'
        let alignType = this.getStyleValue(this.objs,'align')
        console.log(alignType)
        if(index == 0){
          this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'align',value:'left',isStack:{modifyState:true,startContent:alignType}});
        }else if(index == 1){
          this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'align',value:'center',isStack:{modifyState:true,startContent:alignType}});
        }else if(index == 2){
          this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'align',value:'right',isStack:{modifyState:true,startContent:alignType}});
        }
      },
      reduceAn(){
        let trans = Number(this.$refs.transparentRef.value);
        trans = Number(trans)
        this.beginAlpha = trans;
         trans -= 0.1;
         trans = trans.toFixed(1);

         this.font = trans;
         if(this.font  < 0.1){
           this.font = 0;
           this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'alpha',value:0.01,isStack:{modifyState:true,startContent:this.beginAlpha}});
         }else if(this.font > 0.1){
           this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'alpha',value:this.font,isStack:{modifyState:true,startContent:this.beginAlpha}});
         }
      },
      addAn(){
        let trans = Number(this.$refs.transparentRef.value);
            trans = Number(trans)
            this.beginAlpha = trans;

            trans += 0.1;
            trans = trans.toFixed(1);
            this.font = trans;
        if(this.font >= 1){
          this.font = 1
        }
        this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:'alpha',value:this.font,isStack:{modifyState:true,startContent:this.beginAlpha}});
      },
      FOver(index){
        $('.ulsFSize li').eq(index).css({'background':'#999'}).siblings().css({'background':''})
      },
       change(names, event,bool) {
        // console.log(bool,'11111111')
        let valueB = event.target.value;
         let reg = /^-?\d*\.?\d*$/;
        if(names === 'fontSize'){
          let str = valueB.split('')
              str = ['1','2','3'];
          if(!reg.test(valueB)){
            // alert('请输入正确的字体大小仅为数值')
            this.$store.commit('ALERT',{data:'请输入正确的字体大小仅为数值',this:this})

          }else{
            if(valueB  == ''){
              valueB = 1;
            }
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:names,value:Number(valueB),isStack:{modifyState:bool,startContent:this.beginSize}});
          }
          }else if(names === 'leading'){
          if(!reg.test(valueB) ){
            this.$store.commit('ALERT',{data:'请输入正确的行间距的数值',this:this})
          }else{
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:names,value:Number(valueB),isStack:{modifyState:bool,startContent:this.beginLeading}});
           }
          }else if(names == 'letterSpacing'){
          if(valueB < -100 || valueB > 200){
            this.$store.commit('ALERT',{data:'请输入正确的字间距的数值-100到200',this:this})
          }else{
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:names,value:Number(valueB),isStack:{modifyState:bool,startContent:this.beginSpacing}});
          }
        }else if(names === 'alpha'){
          if(valueB == 0){
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:names,value:0.01,isStack:{modifyState:bool,startContent:this.proData.alpha}});
          }else if(valueB>1 || valueB<0){
            this.$store.commit('ALERT',{data:'透明度的范围在0-1之间',this:this});
            this.font = this.proData.alpha;
          }else{
            this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:names,value:Number(valueB),isStack:{modifyState:bool,startContent:this.proData.alpha}});
          }
        }else{
          this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:names,value:valueB,isStack:{modifyState:bool,startContent:this.beginArea}});
        }

       },
      DivShowNo(names,ev,ind,indexT,bool){
        if(indexT == 0){
          let sizeSelect  = this.$refs.fontClass[indexT].value
          let newFontSize = ev.target.innerText;
          this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.objs],key:names,value:Number(newFontSize),isStack:{modifyState:bool,startContent:sizeSelect}});
        }else if(indexT == 1){
          let newFontSpacing = ev.target.innerText;
          this.$store.commit("SET_SELECT_OBJ_VALUE",{arr:[this.objs],key:names,value:newFontSpacing,isStack:{modifyState:bool,startContent:this.beginFamilySelect}});
          this.beginFamilySelect = newFontSpacing;
        }else if(indexT == 2){
          let spacingSelect = this.$refs.fontClass[indexT-1].value
          let newFontFamily = ev.target.innerText;
          this.$store.commit("SET_SELECT_OBJ_VALUE",{arr:[this.objs],key:names,value:newFontFamily,isStack:{modifyState:bool,startContent:spacingSelect}});
        }else if(indexT == 3){
          let leadingSelect = this.$refs.fontClass[indexT-1].value
          let newFontleading = ev.target.innerText;
          this.$store.commit("SET_SELECT_OBJ_VALUE",{arr:[this.objs],key:names,value:newFontleading,isStack:{modifyState:bool,startContent:leadingSelect}});
        }
      },
    },
    computed: {
      areaDatas: {
        get: function () {
          this.datas = this.getStyleValue(this.objs,'text');
               return this.datas
        },
        set: function () {
        }
      }
    }
  }
</script>
<style>
  .divFont .el-select{
    width:1.80rem;
    height:0.32rem;
    position:absolute;
    left: 0.7rem;
    border-radius:0.05rem;
  }
  .el-select>.el-input{
    width:100%;
    height: 100%;
    border-radius:0.05rem;
  }
  .el-select>.el-input>input{
    width: 100%;
    height: 100%;
    background: #666;
    border:none;
    font-size:0.12rem;
    /*background: #ffcf93;*/
    color: #fff;
    border-radius:0.05rem;
  }
  .el-select>.el-input>span>span>i{
    line-height:0.14rem;
  }
  .option_box .el-scrollbar{
    height:1.3rem;
    /* width:1.82rem; */
  }
  .el-select-dropdown {
      width:.5rem;
  }
  .el-popper{
    background: #666;
    /* background: yellow; */
  }
   .divFont  .el-scrollbar__view{
    width:100%;
    /* height:1.3rem!important; */
    /* background:pink; */
  }
   .select_class{
     /* background: pink; */
   }
   .options_class{
     background: #666;
     color: #fff;
     height:0.35rem;
     line-height: 0.35rem;
     font-size:0.10rem;
     text-align: center;
     width:100%;

   }
  .proTextBox >.bbx >.divFont .el-select-dropdown{
    border:none;
    /* background: #666; */
    height:1.3rem;
    border:none;
    background: yellow;
   
    border-radius:0.05rem;
  }
  .proTextBox >.bbx >.divFont .el-select-dropdown {
    background: red;
  }
.el-scrollbar {
    /* background: orange; */
    height:1.4rem;
  }
  .proTextBox >.bbx >.divFont .el-select-dropdown__wrap {
    /* width:90%; */
    /* height:1.3rem; */
    /* border-radius:0.05rem; */
    background: green;
  }
 .el-select-dropdown__wrap{
 }
  .el-select-dropdown__item .option_box{
    color:#fff;
    font-size: 0.13rem;
    background:#666;
    text-align: center;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
  .el-select-dropdown__item.hover,.el-select-dropdown__item:hover{
    background-color:rgb(153, 153, 153);
  }
  .el-popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color:#666;
  }
  .el-popper[x-placement^=bottom] .popper__arrow{
    top:-0.08rem;
    border-bottom-color:#666;
  }
  .option_box .el-icon-arrow-up{
    position: absolute;
    right:0.1rem;
    top:0rem;
  }
  .option_box .el-icon-arrow-up:before{
    position: absolute;
    right:0.1rem;
    top:0.1rem;
  }
  .option_box .el-select-dropdown__item.selected{
    color: #eeeeee;
  }
.el-popper{
  border:none;
}
</style>
<style lang="scss" scoped>
  /*input[type="radio"]:checked+label {color:#a6a9ad;}*/
  .proTextBox{
     width:100%;
     height:auto;
   }
  #textArea{
    width:2.51rem;
    height:1.30rem;
    position: relative;
    border:none;
    outline: none;
    display: block;
    font-size:0.16rem;
    text-indent: 0.1rem;
    background: #666666;
    color: #bbb;
    border-radius: 0.1rem;
    margin-top:0.13rem;
    margin-left:0.14rem;
    text-decoration: none;
  }
  .textPPS{
    width:2.50rem;
    height:0.42rem;
    position: relative;
    margin-top:0.04rem;
  }
  .spTextPPs{
    width:0.7rem;
    text-align: right;
    height:0.4rem;
    display: inline-block;
    color: #ccc;
    position: absolute;;
    right:1.7rem;
    line-height: 0.55rem;
    height:0.4rem;
    font-size:0.16rem;
  }

   .proTextBox .inpText{
      width:1.8rem;
      height:0.32rem;
      border:none;
      border-radius:0.04rem;
     position: absolute;
     left:0.83rem;
     top:0.1rem;
     color: #ccc;
     appearance:none;
     -moz-appearance:none;
     -webkit-appearance:none;
      background: #666666;
     text-indent: 0.1rem;
     font-size:0.12rem;
   }
  .fontType{
    width:100%;
    height:0.6rem;
    margin-top: 0.1rem;
    position: relative;
  }
  .fontType ol{
    width:50%;
    height:100%;
    list-style: none;
    display: flex;
    position: absolute;
    left:0rem;
    top:-0.5rem;
  }
  .fontType ol li{
     justify-content: space-between;
    align-items: center;
  }
   .fontType ul{
     width:50%;
     height:100%;
     list-style: none;
     display: flex;
     position: absolute;
     left:0rem;
     top:-0.5rem;
   }
   .fontType ul li{
     justify-content: space-between;
     align-items: center;
   }
  .typeBIU{
    width:1.40rem;
    height:100%;
    position: absolute;
    left:0rem;
    top:0rem;
  }
  .typeBIU ol{
    width:100%;
    height:100%;
    position: absolute;
    top:0rem;
    left:0rem;
  }
  .typeBIU ol li {
    width:50%;
    height:100%;
    margin-top:0rem;
    position: relative;
  }
   .typeBIU ol li:nth-child(1){
     margin-left:0.2rem;
   }
   .typeBIU ol li img{
     width:0.19rem;
     height:0.20em;
     position: absolute;
     top:0.25rem;
   }
  .typeCLR{
    width:1.4rem;
    height:100%;
    position: absolute;
    right:0rem;
    top:0rem;
  }
  .typeCLR ul {
    width:100%;
    height:100%;
    position: absolute;
    left:0rem;
    top:0rem;
  }
  .typeCLR ul li {
    width:50%;
    height:100%;
    margin-left:1%;
    position: relative;
  }
  .typeCLR ul li img{
    width:0.20rem;
    height:0.22rem;
    position: absolute;
    top:0.23rem;

  }
  .divFont{
    width:90%;
    margin-left:0.13rem;
    height:0.34rem;
    position: relative;
    margin-top: 0.15rem;
  }
  .divSpan{
    font-size:0.14rem;
    display: inline-block;
    position: absolute;
    top:0rem;
    right:1.85rem;
    color: #fff;
    line-height:0.35rem;
  }
  .transparentInput{
    text-align: center;
  }
  .left{
    position: absolute;
    left:0.9rem;
    width:0.2rem;
    height:0.2rem;
    display:inline-block;
    top:0.05rem;
    z-index: 0;
    font-size: 0.3rem;
    color: #bbb;
        img{
          width:100%;
          height:100%;
        }
  }
  .right{
    position: absolute;
    right:-0.09rem;
    /*z-index: 99;*/
    width:0.2rem;
    height:0.2rem;
    font-size: 0.3rem;
    top:0.05rem;
    color: #bbb;
    img{
      width:100%;
      height:100%;
    }
  }
  .spanFontP{
    width:0.32rem;
    height:0.32rem;
    display: inline-block;
    position: absolute;
    top:0.2rem;
    left: -0.055rem;
    border-radius: 0.02rem;
  }
  .spanAlignP{
    width:0.32rem;
    height:0.32rem;
    height:0.32rem;
    display: inline-block;
    position: absolute;
    top:0.2rem;
    left: -0.055rem;
    border-radius: 0.02rem;
  }

</style>
