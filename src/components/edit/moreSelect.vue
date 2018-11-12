<template>
  <div style="pointer-events: none;">
    <div v-for="(item, index) in objArr" :dataId="getId(item)"  >
      <dashed :item="item"></dashed>
    </div>
    <div :style="parentStyle"></div>
  </div>
</template>
<script>

  import com from "./editCommon"
  import oneSelect from "./oneSelect"
  import {getMoreBounds} from "../../editMethod/common"
  let dashed = {
    template:`
     <div>
        <div :style="getBlackStyle1"></div>
        <div :style="getBlackStyle2"></div>
        <div :style="getBlackStyle3"></div>
        <div :style="getBlackStyle4"></div>
    </div>
    `,
    props:["item"],
    extends:com,
    methods:{
       getStyle(position,position1){
        // let style = Object.assign({outline:"1px solid black", pointerEvents:"none"},this.getBaseStyle(this.obj));
        // return Object.assign({outline:"1px solid black", pointerEvents:"none"},this.getBaseStyle(this.obj))
        let x = position.x*this.canvasScale,y=position.y*this.canvasScale,x1 = position1.x*this.canvasScale,y1 = position1.y*this.canvasScale;
        let height = Math.sqrt(Math.pow((x-x1),2)+Math.pow((y-y1),2));
        let rotate = (270-Math.atan2(position1.x-position.x,(position1.y-position.y)))*180/Math.PI+10;
        // let line = "";
        // arguments.length > 2 ? line = "2px dashed #462828" : line = "1px solid black";
        return Object.assign({outline:"0.01rem dashed #462828",height:height+"rem",pointerEvents:'none',position:"absolute",left:x+"rem",top:y+"rem",transformOrigin:"top left",transform:"rotate("+rotate+180+"deg)"});
      }, 
    },
    computed:{
        getBlackStyle1(){
          let position = this.item.toGlobal({x:0,y:0},undefined,true);
          let position1 = this.item.toGlobal({x:this.item.width/Math.abs(this.item.scale.x),y:0},undefined,true);
          return this.getStyle(position,position1,this.item)
        },
        getBlackStyle2(){
          let position = this.item.toGlobal({x:this.item.width/Math.abs(this.item.scale.x),y:0},undefined,true);
          let position1 = this.item.toGlobal({x:this.item.width/Math.abs(this.item.scale.x),y:this.item.height/Math.abs(this.item.scale.y)},undefined,true);
        return this.getStyle(position,position1,this.item)
          
        },
        getBlackStyle3(){
          let position = this.item.toGlobal({x:this.item.width/Math.abs(this.item.scale.x),y:this.item.height/Math.abs(this.item.scale.y)},undefined,true);
          let position1 = this.item.toGlobal({x:0,y:this.item.height/Math.abs(this.item.scale.y)},undefined,true);
          return this.getStyle(position,position1,this.item)
          
        },
        getBlackStyle4(){
          let position = this.item.toGlobal({x:0,y:this.item.height/Math.abs(this.item.scale.y)},undefined,true);
          let position1 = this.item.toGlobal({x:0,y:0},undefined,true);
          return this.getStyle(position,position1,this.item)
        },
        canvasScale(){
          return this.$store.state.stageParentSize.scale/window.base;
        }
      },
}
  
  export default{
    name:"moreSelect",
    props:["arr"],
    extends:com,
    components:{oneSelect,dashed},
    data(){
      return {
        fontSize:window.base/100,
        parentObj:this.arr[0].parent,
        rect:{}
      }
    },
    created(){
      // let rect = getMoreBounds(this.objArr);//选择的所有元素的边界；需要将边界方法到父容器中，考虑父容器边界位置；
      // let scale = this.$store.state.stageObj.scale;
      // let position = this.$store.state.stageObj.position;
      // let pivot = this.$store.state.stageObj.pivot;
      // this.$store.state.stageObj.addChild(this.containerObj);
      // this.containerObj._texture.orig.width =rect.width/scale.x;
      // this.containerObj._texture.orig.height =rect.height/scale.y;
      // this.containerObj.x =rect.x/scale.x-position.x/scale.x+pivot.x;
      // this.containerObj.y =rect.y/scale.y-position.y/scale.y+pivot.y;
      // this.objArr.map((obj)=>{
      //   this.parentObj.children.map((obj1,i)=>{
      //     if(obj1.id === obj.id){
      //       let childObj = this.parentObj.children.splice(i, 1)[0];
      //       childObj.x = childObj.x -  this.containerObj.x;
      //       childObj.y = childObj.y -  this.containerObj.y;
      //       this.containerObj.addChild(childObj);
      //     }
      //   })
      // });
    },
    destroyed(){
      // let childrenList = this.containerObj.children;
      // const TRANSFORM = this.containerObj.transform.worldTransform;
      // while(childrenList.length>0){
      //   let obj = childrenList[0];
      //   console.log(obj);
      //   obj.transform.localTransform.apply(TRANSFORM);
      //   this.$store.state.stageObj.addChild(obj);
      // }
      // this.$store.state.stageObj.children.map((obj,i)=>{
      //   obj.id===this.containerObj.id?this.$store.state.stageObj.children.splice(i,1):"";
      // });
    },
    methods:{
      getId(obj){
        return obj.id;
      },
      // getStyle(obj){
      //   return Object.assign({outline:"2px dashed #462828"},this.getBaseStyle(obj))
      // }
    },
    computed:{
      objArr(){
        return this.arr
      },
      parentStyle(){
        let rect = getMoreBounds(this.objArr);//选择的所有元素的边界；需要将边界方法到父容器中，考虑父容器边界位置；
        return {
          width:rect.width*this.stageScale+"px",
          height:rect.height*this.stageScale+"px",
          position:"absolute",
          left:rect.x*this.stageScale+"px",
          top:rect.y*this.stageScale+"px",
          border:"1px solid red"
        }
      }

    }
  }
</script>

<style>
</style>

