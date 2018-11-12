<template>
  <div class="ImgTitle" >

  <div class="boxs">
   <div class="img_el">
    <img class="imgTit" :src="url"   alt="">
   </div>
   
    <button class="btnCImg">更改图片</button>
    <input name="dataInput" type="file" @keydown.ctrl="inputUndo($event)" class="btnCImg inpimg" @click="replaceInput($event)" @change="changeRes($event, objs, 'img','default')">
      <span class="spanEvent">默认</span>
    </div>

     <div class="boxs" ref="clickQuestion" v-if="clickQuestion">
      <div class="img_el" id="imgborder">
        <img class="imgTit" :src="getImgType(objs,'click')"  alt="">
      </div>
      <button class="btnCImg">更改图片</button>
      <input name="dataInput" type="file" @keydown.ctrl="inputUndo($event)" class="btnCImg inpimg" @click="replaceInput($event)" @change="changeRes($event, objs, 'img','click')">
      <span class="spanEvent">点击</span>
    </div>

  </div>
</template>
<script>
import proCon from "./proCommon.vue";
// import { constants } from 'http2';
export default {
  extends: proCon,
  props: ["proData"],
  data() {
    return {
      objs: this.proData,
      imgU: "",
      resouId: "",
      resou_local: "",
      imgjh:require('../../../static/images/images/jh.png'),
      value: '',
      indexRecord:'',
      clickQuestion:false,
      urlData: '',
      // numBox:[{options:[
      //     {value:'选项二',label:"点击"},
      //     {value:'选项三','label':'滑过'}
      //   ]}],
      // totalState:[
      //   {options:[
      //       {value:'选项一',label:'默认'},
      //     ]}
      // ],
      // defauleNum:['点击','滑过','默认'],
      hidden_del_list:'',
    };
  },
  computed: {
    url () {
      if (this.$store.state.selectorObj.selectList[0]) {
        this.urlData = this.$store.state.selectorObj.selectList[0]._texture.baseTexture.imageUrl
      }
      return this.urlData
    }
  },
  mounted(){
  },
  created(){
    if(this.objs.groupType == "choice" || this.objs.groupType == 'blank'){
        this.clickQuestion = true;
    }
    
    let locaImg0  = localStorage.getItem('itotal0')
    let locaImg1  = localStorage.getItem('itotal1')
  },
  methods:{
    changeRes(e,obj,type,data) {
      let width = this.$store.state.selectorObj.selectList[0].width;
      let height = this.$store.state.selectorObj.selectList[0].height;
      this.ChangeRes(e,obj,type,data);
      this.$store.state.selectorObj.selectList[0].width = width
      this.$store.state.selectorObj.selectList[0].height = height
    },
    deepCopy(obj){
      if(typeof obj != 'object'){
        return obj;
      }
      var newobj = [];
      for ( var attr in obj) {
        newobj[attr] = this.deepCopy(obj[attr]);
      }
      return newobj;
    },
    deep(obj){
      if(typeof obj != 'object'){
        return obj;
      }
      var newobj = {};
      for ( var attr in obj) {
        newobj[attr] = this.deep(obj[attr]);
      }
      return newobj;
    },
    addImgAssembly(){
      console.log(this.totalState.length)
      if(this.totalState.length == 1){
        this.totalState.push(this.numBox[0])
      }else if(this.totalState.length == 2){
        var hash = this.deepCopy(this.numBox[0]);
        hash.options.splice(this.indexRecord,1)
        // console.log(this.numBox[0].options[this.indexRecord])
        hash = this.deep(hash)
        this.totalState.push(hash)
        console.log(this.totalState)
      }else if(this.totalState.length == 3){
        // alert('不可再添加图片状态')
          this.$store.commit('ALERT',{data:'不可再添加图片状态',this:this})

      }
    },
    eventOption(itotal,index,val){
      if(itotal == 1) {
        this.indexRecord = index
      }
    },
    delListEvent(index){
      console.log(index)
      this.totalState.splice(index,1)
      console.log(this.totalState)

      // console.log(this.totalState)
      // console.log(this.numBox)
      for(var j=0;j<this.defauleNum.length;j++){
        for(var i=0;i<this.totalState.length;i++){
          console.log(this.totalState[i])
          console.log()
          if(this.defauleNum[j] != this.totalState[i].options[0].label){
            console.log(this.defauleNum[j]);
          }


        }
      }

    }

  }

};
</script>
<style lang="scss" scoped>
.ImgTitle {
  width: 2.8rem;
  height: auto;
  // background: #75ddee;
  position: relative;
  margin: 0rem;
  padding: 0rem;
}
.boxs{
  position: relative;
}
.img_el {
  width: 1.02rem;
  height: 1rem;
  display: inline-block;
  /*background: #f98d9d;*/
  margin-left: 0.2rem;
  margin-top: 0.2rem;
  position: relative;
  .imgTit {
    width: 100%;
    position: absolute;
    transform: translate3d(-50%,-50%,0);
    left:50%;
    top:50%;
  }
}
.spanEvent{
  width:0.9rem;
  height:0.28rem;
  position:absolute;
  left:1.4rem;
  top:0.9rem;
  /*background: #666;*/
  border-radius: 0.05rem;
  color: #ffffff;
  line-height:0.28rem;
  text-align:center;
  font-size:0.12rem;
  border:1px dashed #666666;
}
.btnCImg {
  width: 0.9rem;
  height: 0.28rem;
  border: none;
  outline: none;
  background: #666;
  border-radius: 0.05rem;
  position: absolute;
  top: 0.3rem;
  left: 1.4rem;
  font-size:0.12rem;
  color: #fff;
}
.inpimg {
  opacity: 0;
  position: absolute;
  top: 0.3rem;
  left: 1.4rem;
}
.addAssembly{
  width: 70%;
  height: 0.35rem;
  text-align: center;
  line-height: 0.3rem;
  background: #666666;
  border-radius: 0.03rem;
  position: relative;
  margin-left: 15%;
      img{
        position: absolute;
        top:55%;
        left:50%;
        transform: translate3d(-50%,-50%,0);
        width:10%;
        height: 50%;
      }
  /*left:50%;*/
}
#imgborder{
  border:1px dashed #666;
}
select::-ms-expand{ display: none; }
option::-ms-expand{ display: none; }
option{
  -moz-appearance:none; /* Firefox */
  -webkit-appearance:none; /* Safari 和 Chrome */
  appearance:none;
}
</style>
