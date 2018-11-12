<template>
  <div class="pageOne" @click="clickFoucs">
    <SlickList lockAxis="y" :value="arr" @sortStart="start" @sortEnd="end" @sortMove="move">
      <div @dblclick="clickName" class="scrollPage" @click="squareClick" ref="showPageIndex" v-if="showList">
        <SlickItem class="square" v-for="(item,index) in arr" :index="index" :key="index">
          <i class="el-icon-document" style="opacity: 0"></i>
            <i style="width:0.2rem;height: 0.2rem;">
              <img style="width:0.19rem;height: 0.31rem;position: absolute;left:0.2rem;top:0.1rem"
                  src="../../../static/images/textjia.png" alt="">
            </i>
            <b class="bbXing" v-if="fingerShow == item.id">
              <img :src="finger" alt="">
            </b>
            <input v-show="index == aa" type="text"
                  class="input_page"
                  @blur="blurInput($event,index)"
                  :value="item.name"
                  @focus="inputEvent(index)"
                  @keydown="keyEvent($event,index)"/>
                  <span v-show="index != aa" @contextmenu="show(index,$event)" class="btn_page" @mouseover="over_square(index)" @mouseout="out_square(index)">{{item.name}}</span>
        </SlickItem>
        <div class="rightEvent" ref="rightEvent">
        <ol @mouseleave="hiddenOver($event)">
          <li @click="addPage">新建</li>
          <li @click="name_dbl()" >重命名</li>
          <li @click="del_ol_page()" >删除</li>
        </ol>
      </div>
      </div>
    </SlickList>
  </div>
</template>
<script>
  import blankFile  from './blankFile.json';
  import {SlickItem, SlickList} from 'vue-slicksort';
  export default {
    data(){
      return {
        // imgjh:require('../../../static/images/images/jh.png'),
        finger:require('../../../static/images/finger-left (1).png'),
        moveIndex:null,
        targetIndex:null,
        aa:-1,
        fingerShow:null,
        showList:true,
        firstId:'',
        hackReset:true,
        nameLimit:'',
        indexEvent:'',
        index:null,
        item:null
      }
    },
    components: {
      SlickItem,
      SlickList
      // resourcePath
    },
    computed: {
      arr() {
        return this.$store.state.stageArr;
      },
      list () {
        return this.$store.state.rootStageObj;
      }
    },
    watch: {
      list (value) {
        this.item = value;
        this.fingerShow = this.item.id
      }
    },
    created(){
      var that = this;
      let idFinger = localStorage.getItem('idFinger')
      this.fingerShow = idFinger
      this.firstId = this.$store.state.stageArr[0];
      this.item = this.$store.state.rootStageObj;
    },
    methods:{
      clickName () {
        this.aa = this.index;
        // console.log(event.target.children[this.index])
          // event.target.children[this.index].focus();
          // event.target.children[this.index].select();
          // event.target.children[this.index].readOnly = false;
      },
      // 拖动开始
      start(Node) {
        this.index = Node.index;
        this.$store.state.stageArr.map((obj,i) => {
          if (i == this.index) this.item = obj;
        })
      },
      // 拖动结束
      end(Node) {
        let stage = this.$store.state.stageArr.splice(Node.oldIndex,1)
        this.$store.state.stageArr.splice(Node.newIndex,0,...stage)
        this.index = Node.newIndex;
        this.active()
      },
      move(Node) {
      },
      inputEvent(index){
        this.nameLimit = this.$store.state.stageArr[index].name
      },
      hiddenOver(e){
        this.$refs.rightEvent.style.display = 'none'
      },
      keyEvent(ev,index){
        if(ev.keyCode == 13) ev.target.blur();
      },
      over_square(index){
        //鼠标滑过
        this.$nextTick(()=>{
          this.$refs.showPageIndex.children[index].style.background = '#666666';
        })
      },
      out_square(index){
        //鼠标离开
        this.$nextTick(()=>{
          this.$refs.showPageIndex.children[index].style.background = '#383838';
        })
      },
      squareClick(){
        //点击切换页面
        this.$refs.rightEvent.style.display = 'none';
        this.fingerShow = this.item.id || this.$store.state.rootStageObj.id;
        // localStorage.setItem("idFinger",this.item.id)
        this.$store.commit("ROOT_STAGE_OBJ",this.$store.state.stageArr[this.index]);
        this.active();
      },
      active() {
        if(this.$store.state.rootStageObj.modelType){
          this.$store.state.frameAlert = false;
        }else{
          this.$store.state.frameAlert = true;
        }
      },
      del_ol_page(){
        //删除舞台数据
        if(this.fingerShow == this.$store.state.stageArr[this.indexEvent.index].id){
          this.fingerShow = this.firstId;
          this.hackReset = false
          this.$nextTick(() => {
            this.hackReset = true
            this.fingerShow = this.$store.state.stageArr[0].id;
          })
          this.rightAnswer = this.$store.state.stageArr[0];
        }
        this.$store.dispatch("DELETE_STAGE",{id:this.$store.state.stageArr[this.indexEvent.index].id})
        this.$refs.rightEvent.style.display = 'none'
      },
      name_dbl(){
        //重命名
        this.aa = this.indexEvent.index;
         var dom = document.getElementsByClassName('scrollPage')[0].children[this.aa]
        setTimeout(()=>{
          dom.getElementsByClassName('input_page')[0].focus();
          dom.getElementsByClassName('input_page')[0].select();
          dom.getElementsByClassName('input_page')[0].readOnly = false
        },100);
        this.$refs.rightEvent.style.display = 'none'
      },
      addPage(){
        //点击下方添加
        //创建舞台
        // blankFile.name = 'stage' + (this.$store.state.stageArr.length + 1);
        let copyStage = new XPIXI.Stage(blankFile);
        copyStage.name = 'stage' + this.$store.state.stageNameIndex++;
        if (this.$store.state.stageArr.length < 10) {
          this.$store.state.stageArr.push(copyStage);
          this.$store.dispatch("ADD_STAGE", {obj:copyStage});
        }
      },
      show:function(index,event){
        //右击事件;
        var e = event || window.event;
        var widHig = document.getElementsByClassName('square')[index].getBoundingClientRect();
        this.indexEvent ={
          index:index,
          postionX:widHig.width,
          postionY:widHig.top
        }
        this.$refs.rightEvent.style.display = 'block'
        this.$refs.rightEvent.style.position = 'absolute';
        this.$refs.rightEvent.style.top = Number(this.indexEvent.postionY)/window.base-0.8+'rem';
        this.$refs.rightEvent.style.left = '1.6rem'
        window.event.returnValue=false;
      },
      clickFoucs(){
        this.$store.state.stagePageFoucs = true;
      },
      blurInput(ev,index){
        //失去焦点事件 ，
        let new_value = ev.target.value;
        if(new_value != ''){
          if(new_value.length>8){
            this.$store.state.stageArr[index].name   = this.nameLimit
            // alert('该区域最大限度为8个字符')
            this.$store.commit('ALERT',{data:'该区域最大限度为8个字符',this:this})
          } else {
            if (this.nameLimit != new_value) this.$store.dispatch("REN_STAGE", {id:this.$store.state.stageArr[index].id,key:'name',value:new_value,startContent:this.$store.state.stageArr[index].name});
            this.$store.state.stageArr[index].name = new_value;
          }
        }
        this.aa = -1;
      },
    },
  }
</script>
<style>
  .scrollPage{
    width:100%;
    height:7.25rem;
    /* overflow-y: scroll;  */
    position: relative;
  }
  .addOr{
    width:1.82rem;
    height:0.4rem;
    background: #666;
    font-size: 0.5rem;
    line-height: 0rem;
    text-align:center;
    outline: none;
    border:none;
    color: #fff;
    border-radius: 0.05rem;
    position: absolute;
    bottom: 0.1rem;
    left:0.19rem;

  }
  .addOr img{
    margin-top:0.08rem;
    width:0.25rem;
    height: 0.25rem;
  }
  .rightEvent{
    width:1.40rem;
    height:0.7rem;
    font-size:0.16rem;
    background: #444;
    display: none;
    border-radius:4px;
    box-shadow:0rem 0.02rem 0rem rgba(56,56,56,0.2);
    z-index:99;
  }
  .rightEvent ol{
    list-style: none;
    color: #fff;
    font-size:0.12rem;
    text-align: center;
    background: #444;
  }
  .rightEvent ol li{
    height:0.26rem;
    line-height: 0.26rem;
  }
  .rightEvent ol li:hover{
    /* background: #666666; */
  }
  .rightEvent ol li:nth-child(1){
    margin-top:0.055rem;
  }
  .rightEvent p{
    width:80%;
    margin-left: 10%;
    text-align:center;
    color: #fff;
    border-radius:0.1rem;
    font-size:0.12rem;
    position: absolute;
    bottom: 0.06rem;
  }
  .rightEvent p:hover{
    /* background: #666666; */
  }
  .square{
    width:100%;
    height:0.5rem;
    position: relative;
    display: block;
    font-size:0.3rem;
  }
  .input_page{
    width:75%;
    margin-left:10%;
    height:0.35rem;
    line-height:0.35rem;
    font-size:0.14rem;
    position: absolute;
    top:50%;
    margin-top:-0.17rem;
    text-align:left;
    color:#eee;
    border:none;
    outline: none;
    background-color:transparent;

  }
  .btn_page{
    width:80%;
    margin-left:10%;
    height:100%;
    line-height:0.35rem;
    font-size:0.14rem;
    position: absolute;
    color:#eee;
    text-align: left;
    padding-top:0.09rem;
    border:none;
    outline: none;
    background-color:transparent;
  }

  .el-icon-document{
    width:0.08rem;
    height:0.08rem;
    margin-top:0.1rem;
    margin-left:0.15rem;
    background-color: transparent;
    color: #ccc;
  }
  .bbXing{
    position: absolute;
    right:0.1rem;
    top:18%;
    color: #fff;
    width:0.35rem;
    height: 0.25rem;
  }
  .bbXing img{
    width:100%;
    height: 100%;
  }
</style>
