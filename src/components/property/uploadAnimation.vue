<template>
  <div class="uploadAnimation" >
    <img   :src=animationImg alt="" class="imgAnim">
    <input type="file" class="imgAnim uploadAnimationInput"  multiple ="multiple" @change="fileChange($event)">
    <span  class="classify_span">动画</span>
  </div>
</template>
<script>
  import { API } from "../../interfaceConfig/interface";
  export default {
    props: ["proData"],
    data() {
      return {
        animationImg:require('../../../static/images/animationImg.png'),
      };
    },
    mounted(){
    },
    created(){
    },
    methods:{
      replaceInput(e) {
        let input = e.target;
        input.value = "";
      },
      fileChange(event){
        window.localStorage.setItem("resourceId",undefined);
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
                        this.$store.dispatch("CREATE_ELEMENT",{type:"animation",content:resource,base:undefined});
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
            console.log(resourceId,"jiji")
          }else{
            form.append("resourceId", "");
            console.log("1212121")
          }
          API.funRequest(
            API.URLS.upload,
            "post",
            form,
            e =>{
              uploadId = e.data.data.uploadId;
              console.log(e);
              this.$store.state.onceStart  = true;
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
<style lang="scss" scoped>
  .uploadAnimation{
    width:0.5rem;
    height:0.65rem;
    font-size:24px;
    margin:0.15rem;
    margin-top:-0.1rem;
    // background: #eee;
    position: relative;
  }
  .imgAnim{
    width:0.4rem;
    height:0.4rem;
  }
  .uploadAnimationInput{
    width:0.4rem;
    height:0.5rem;
    // margin-top:-1rem;
    position: absolute;
    bottom:0.03rem;
    z-index: 9;
    opacity: 0;
    left:0rem;

  }
  .classify_span{
    font-size:0.1rem;
    position: absolute;
    bottom:0.05rem;
    left:0rem;
    color: #eee;
    text-align: center;
    // background:brown;
    width:0.45rem;
  }
</style>

