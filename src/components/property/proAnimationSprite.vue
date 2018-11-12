<template>
  <div class="proAnimation">
    <!-- <p class="pps_animation">操作按钮</p> -->
    <input type="file" id="uploadAnimationInput" @click="replaceInput($event)" @keydown.ctrl="inputUndo($event)" multiple="multiple" @change="fileChange($event)">
    <span class="classify_span animationSpan" >替换</span>
    <span class="animationSpan" @click="play">{{playStatus}}</span>
    <div class="numberDiv">
    <!-- <p class="pps_animation"> <span>播放次数：</span> <input type="text" class="playNumber"> </p> -->
    <p class="pps_animation"> <span>动画次数:</span> 
    </p>
    <div class="loopDiv">
      <button @click="btn_loop_auto('autoPlay')">自动播放</button>
       <span v-if="objs.autoPlay"><img :src="question" style="width:0.28rem;height:0.28rem" alt=""></span><span v-else></span>  
    </div>
    <div class="onceDiv">
      <button @click="btn_loop_once('oncePlay')">默认一次</button>
      <span v-if="objs.oncePlay"><img :src="question"  style="width:0.28rem;height:0.28rem" alt=""></span><span v-else></span>  
    </div>
    </div>
   
  </div>
</template>
<script>
  import proCon from "./proCommon.vue";
  import { API } from "../../interfaceConfig/interface";
  import {Active,Atom,stackadd} from "../../editMethod/undo";
  export default {
    props: ["proData"],
    extends: proCon,
    data() {
      return {
        loopHidden:'',
        onceHidden:'',
        objs: this.proData,
        startEnd:true,
        question:require('../../../static/images/duihao.png'),
        numInput:'',
        numPlay:['无数次','一次'],
        animationSet:0,
        playStatus:"播放",
      };
    },
    mounted() {
      if( this.objs.playing  === false){
            this.playStatus = '播放'
      }else if( this.objs.playing === true){
            this.playStatus = '暂停'
      }
    },
    created() {
    },
    methods: {
      btn_loop_auto(name){
         this.objs.autoPlay = !this.objs.autoPlay;
      },
      btn_loop_once(name){
        // this.$store.state.onceStart  = false;
         this.objs.oncePlay = !this.objs.oncePlay;
        if(this.playStatus == '暂停'){
          this.objs.stop();
          this.playStatus = '播放'
          this.$store.state.animationBool = true 
        }
      },
      play(){
        if(this.objs.playing){
                  this.objs.stop();
                  this.playStatus = "播放"
                   if(this.objs.oncePlay == false){
                       this.$store.state.animationBool = true; 
                  }
                }else{
                  
                  this.objs.gotoAndPlay(0);
                  this.playStatus = "暂停";
                  this.objs.onLoop = ()=>{};
                  if(this.objs.oncePlay){
                    this.objs.onLoop = ()=>{
                       this.objs.gotoAndStop(0);
                      this.playStatus = "播放";   
                    }
                  }else{
                    this.objs.play();
                    this.$store.state.animationBool = false;
                  }
                }
      },
      replaceInput(e) {
        let input = e.target;
        input.value = "";
      },
      fileChange(event){
        let that = this.$store;
        window.localStorage.setItem("resourceId",undefined);
        let lastId = this.$store.state.selectorObj.selectList[0].defaultResId;
        let lastJson = XPIXI.ResourceManager.getInstance().getResourceById(lastId);
        let target = event.target.files;
        if(target.length!==2){
          console.log("上传文件个数有问题")
        }else{
          let typeArr = [target[0].name.split(".")[1].toLowerCase(),target[1].name.split(".")[1].toLowerCase()];
          let nameArr = [target[0].name.split(".")[0],target[1].name.split(".")[0]];
          if(typeArr.indexOf("json")<0||typeArr.indexOf("png")<0){
            console.log("请核对文件格式")
          }else if(nameArr[0]!==nameArr[1]){
            console.log("请核对图片和json数据是否匹配")
          }else{
            console.log("可以上传");
            let slicePngObj = this.sliceFile(target[typeArr.indexOf("png")],undefined,true);
            let sliceJsonObj = this.sliceFile(target[typeArr.indexOf("json")],undefined,true);
            let targetThis = this;
            targetThis.uploadFun(slicePngObj.data,(url1)=>{
              XPIXI.ResourceManager.getInstance()
                .addFromLoader(url1)
                .then((resource1) =>{
                  
                  targetThis.uploadFun(sliceJsonObj.data,(url)=>{
                    let str = url.split("/").pop();
                    resource1.name = nameArr[0]+str.substr(0,str.length-5);
                    XPIXI.ResourceManager.getInstance()
                      .addFromLoader(url)
                      .then((resource) =>{  
                        this.objs.addNewRes(resource)
                        let stack = new Active("改变动画","CHANGE_ANIMATION");
                        stack.list.push(new Atom({id:this.objs.id,startValue:lastJson.id,endValue:resource.id}))
                        that.state.stack.add(that.state.rootStageObj.id,stack);
                      });
                  })
                });
            })
          }
        }
      },
      sliceFile(file,sliceSize,slice){
        let targetSize = file.size;
        let shardSize = sliceSize||5 * 1024 * 1024; //以1MB为一个分片
        let shardCount = Math.ceil(targetSize / shardSize); //总片数
        let uploadId = "";
        let dataList = [];
        if(slice){
          for(let i = 0; i < shardCount; i++){
            let start = i * shardSize,
              end = Math.min(targetSize, start + shardSize);
            let form = new FormData();
            form.append("multiName", file.slice(start, end)); //slice方法用于切出文件的一部分
            form.append("name", file.name); //文件名称
            form.append("allPart", shardCount); //总片数
            form.append("curPart", i + 1); //当前是第几片
            form.append("isLocalRequest", true);
            dataList.push(form);
          }
        }else{
          dataList = file;
        }
        return {data:dataList,shardCount:shardCount}
      },
      uploadFun(data,callback) {
        let uploadId="";
        let fun1 = (data, num) => {
          if (num > data.length - 1) {console.log("上传过程完毕");return;}
          let form = data[num];
          form.append("uploadId", uploadId);//上传ID
          let resourceId = window.localStorage.getItem("resourceId");
          if (resourceId&&resourceId!=="undefined"){
            form.append("resourceId", resourceId);
          }
          API.funRequest(
            API.URLS.upload,
            "post",
            form,
            e =>{
              uploadId = e.data.data.uploadId;
              console.log(e);
              if (e.status === 200){
                  window.localStorage.setItem("resourceId", e.data.data.resourceId);
                if (e.data.data.fileUrl) {
                  callback(e.data.data.fileUrl); //重新执行一遍
                }
              }
              return e.data.data.fileUrl;
              fun1(data, (num += 1));
            },
            e => {
              console.log(e);
              // alert("上传失败");
              this.$store.commit('ALERT',{data:'上传失败',this:this})

              
            }
          );
        };
        fun1(data,0);
      }
    }
  };
</script>
<style lang="scss" >
.proAnimation{
  width:90%;
  margin-left:5%;
  position: relative
}
.animationSpan{
  width:0.5rem;
  height:0.5rem;
  background:#666;
  display: inline-block;
  font-size:0.15rem;
  color:#fff;
  border-radius: 50%;
  text-align: center;
  line-height: 0.5rem;
  margin:0rem 0.3rem 0rem 0.3rem;
  box-shadow: 0px 0px 4px 3px #777;
}
#uploadAnimationInput{
  width: .5rem;
  height: .5rem;
  position: absolute;
  top:0.7rem;
  left:0.15rem;
  border-radius: 50%;
  opacity: 0;
}

.numberDiv{
  width:2.8rem;
  height:1.3rem;
  position: absolute;
  // background: red;
  overflow: hidden;
  left:-0.12rem;
  top:1.5rem;
     .pps_animation{
       width:100%;
       height:0.6rem;
       position: relative;
         span{
           font-size:0.16rem;
           height:0.45rem;
           line-height:0.45rem;
           display: inline-block;
           position: absolute;
           left:0.1rem;
           color: #fff;
           top:0rem;
           letter-spacing:3px;
          
         }
         input{
           width:1.5rem;
           height:0.3rem;
           position: absolute;
           right:0.1rem;
           top:0.05rem;
           border:none;
           border-radius: 4px;
           background: #666;
           border:1px solid #888; 
           text-align: center;
           color:#fff;

         }
     }
}
.loopDiv{
  width:50%;
  height:0.7rem;
  // background: pink;
  position: absolute;
  left:0rem;
  top:0.5rem;
     button{
       width:1rem;
       height:0.35rem;
       background: #666;
       border:none;
       border-radius:0.05rem;;
       position: absolute;
       left:0.2rem;
       color: #fff;
     }
       span{
         font-size: 0.15rem;
         position: absolute;
         bottom:0rem;
         left:45%;
color: #fff;
       }
}
.onceDiv{
  width:50%;
  height:0.7rem;
  // background: pink;
  position: absolute;
  right:0rem;
  top:0.5rem;
     button{
       width:1rem;
       height:0.35rem;
       background: #666;
       border:none;
       border-radius:0.05rem;;
       position: absolute;
       left:0.2rem;
       color: #fff;
     }
       span{
         font-size: 0.15rem;
         position: absolute;
         bottom:0rem;
         left:45%;
         color: #fff;
       }
}

</style>
