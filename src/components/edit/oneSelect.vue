<template>
  <div>
    <div :style="getBlackStyle1"></div>
    <div :style="getBlackStyle2"></div>
    <div :style="getBlackStyle3"></div>
    <div :style="getBlackStyle4"></div>

    <div :style="getBoundsStyle"></div>

    <div v-if="obj.type!==$store.state.typeObj.typeElement.TEXT">
      <span @mousedown="moveDown($event,'topLeft',0,0)" :style="topLeftStyle"></span>

      <span @mousedown="moveDown($event,'topCenter')"  :style="topCenterStyle"></span>
      <span @mousedown="moveDown($event,'topRight')" :style="topRightStyle"></span>
      <span @mousedown="moveDown($event,'leftCenter')"  :style="leftCenterStyle"></span>
      <span @mousedown="moveDown($event,'rightCenter')"  :style="rightCenterStyle"></span>
      <span @mousedown="moveDown($event,'bottomLeft')"  :style="bottomLeftStyle"></span>
      <span @mousedown="moveDown($event,'bottomCenter')"  :style="bottomCenterStyle"></span>
      <span @mousedown="moveDown($event,'bottomRight')"  :style="bottomRightStyle"></span>
    </div>

    <span :style="lineStyle"></span>

    <span :style="Object.assign({},topCenterStyle,{pointerEvents:'none'})"></span>
    
    <span id="turnPoint" :style="turnPointStyle" @mousedown="moveDown($event,'turnPoint')"></span>

    <span @mousedown="moveDown($event,'topTurn')" :style="topTurnStyle"></span>

  </div>
</template>
<script>
  import com from "./editCommon"
  import {Atom,Active} from "../../editMethod/undo";
  export default{
    name:"oneSelect",
    props:["arr"],
    extends:com,
    data(){
      return {
        anchorObj:{},
        moveAnchorObj:{},
        moveEndObj:{},
        sizeBase:window.base/100,
        num1:"-0.06rem",
        num2:"50%",
        proportionLock:false,
        changeType:"",
        changeKey:[],
        changeValue:[],
      }
    },
    created(){
      // console.log(obj);
      document.body.addEventListener("keydown",this.shiftDown);
      document.body.addEventListener("keyup",this.shiftUp);
    },
    destroyed(){
      document.body.removeEventListener("keydown",this.shiftDown);
      document.body.removeEventListener("keyup",this.shiftUp);
      this.$store.commit("PROPORTION_LOCK",false)
    },
    methods:{


      getStyle(position,position1){
        // let style = Object.assign({outline:"1px solid black", pointerEvents:"none"},this.getBaseStyle(this.obj));
        // return Object.assign({outline:"1px solid black", pointerEvents:"none"},this.getBaseStyle(this.obj))
        let x = position.x * this.canvasScale,
            y = position.y * this.canvasScale,
            x1 = position1.x * this.canvasScale,
            y1 = position1.y * this.canvasScale;
        
        let height = Math.sqrt(Math.pow((x-x1),2)+Math.pow((y-y1),2));
        let rotate = (270-Math.atan2(position1.x-position.x,(position1.y-position.y)))*180/Math.PI+10;
        let line = "";
        arguments.length > 2 ? line = "0.01rem dashed #462828" : line = "0.01rem solid black";
        return Object.assign({outline:line,height:height+"rem",pointerEvents:'none',position:"absolute",left:x+"rem",top:y+"rem",transformOrigin:"top left",transform:"rotate("+rotate+180+"deg)"});
      },



      shiftDown(e){
        if(e.key==="Shift"){
          this.$store.commit("PROPORTION_LOCK",true);
          this.shiftInit();
        }
      },
      shiftUp(e){
        if(e.key==="Shift"){
          this.$store.commit("PROPORTION_LOCK",false);
          this.shiftInit();
        }
      },
      shiftInit(){
        this.initAnchorObj();
        this.moveAnchorObj.beginX = this.moveAnchorObj.endX;
        this.moveAnchorObj.beginY = this.moveAnchorObj.endY;

      },
      initAnchorObj(){
        this.anchorObj.x = this.getStyleValue(this.obj,"x");
        this.anchorObj.y = this.getStyleValue(this.obj,"y");
        this.anchorObj.width = this.getStyleValue(this.obj,"width");
        this.anchorObj.height = this.getStyleValue(this.obj,"height");
        this.anchorObj.rotation = this.getStyleValue(this.obj,"rotation");
        this.anchorObj.pivot = {x:this.obj.pivot.x,y:this.obj.pivot.y};
        this.anchorObj.matrix = this.obj.worldTransform.clone();
        this.anchorObj.scale ={x:this.obj.scale.x,y:this.obj.scale.y};
      },
      initMoveAnchorObj(type,x,y,point){
        this.moveAnchorObj.moveType = type;
        this.moveAnchorObj.beginX = x;
        this.moveAnchorObj.beginY = y;
        this.moveAnchorObj.endX = x;
        this.moveAnchorObj.endY = y;
        this.moveAnchorObj.turnPoint = point;
      },
      mouseupFun(){
        let type = this.changeType;
        let stack, boolr = true;
        if(type === "topTurn"){
          stack = new Active("旋转","CHANGE_PROPERTY");
          stack.list.push(new Atom({id:this.obj.id,key:"rotation",startValue:this.anchorObj.rotation,endValue:this.obj.rotation}));
        }else if(type === "turnPoint"){
          let start = this.obj.toGlobal(this.anchorObj.pivot);
          let end = this.obj.toGlobal(this.obj.pivot);
          stack = new Active("拖动旋转中心","CHANGE_PROPERTY");
          stack.list.push(new Atom({id:this.obj.id,key:"pivot",startValue:start,endValue:end}));
        }else{
          let xy = this.$store.state.selectorObj.editSelect([this.obj]).arr[0];
          let stratXY = {x:this.anchorObj.x-this.anchorObj.pivot.x,y:this.anchorObj.y-this.anchorObj.pivot.y};
          stack = new Active("拖动大小","CHANGE_PROPERTY");
          stack.list.push(new Atom({id:this.obj.id,key:'scale',startValue:{x:this.anchorObj.scale.x,y:this.anchorObj.scale.y},endValue:{x:this.obj.scale.x,y:this.obj.scale.y}}))
          // stack.list.push(new Atom({id:this.obj.id,key:"width",startValue:this.anchorObj.width,endValue:this.obj.width}));
          // stack.list.push(new Atom({id:this.obj.id,key:"height",startValue:this.anchorObj.height,endValue:this.obj.height}));
          // stack.list.push(new Atom({id:this.obj.id,key:"x",startValue:stratXY.x,endValue:xy.x1}));
          // stack.list.push(new Atom({id:this.obj.id,key:"y",startValue:stratXY.y,endValue:xy.y1}));
        }
        document.removeEventListener("mouseup",this.mouseupFun);
        if (stack.list[0].key == 'scale') {
          for(var k in stack.list[0].endValue) {
            if (stack.list[0].endValue[k] != stack.list[0].startValue[k]) boolr = false;
          }
        } else boolr = false;
        if (!boolr) this.$store.dispatch("ADD_STACK",{content:stack});
      },
      moveDown(e,type){
        document.addEventListener("mouseup",this.mouseupFun);
        this.changeType = type;
        let point = document.getElementById("turnPoint").getBoundingClientRect();
        this.initAnchorObj();
        this.initMoveAnchorObj(type,e.clientX,e.clientY,{x:point.x+point.width/2,y:point.y+point.height/2});
        document.addEventListener("mousemove",this.moveFun);//绑定move事件
        document.addEventListener("mouseup",()=>{
          document.removeEventListener("mousemove",this.moveFun);
        });
      },
      moveFun(e){
        this.moveAnchorObj.endX = e.clientX;
        this.moveAnchorObj.endY = e.clientY;
        let x = (e.clientX-this.moveAnchorObj.beginX)/this.stageScale;
        let y = (e.clientY-this.moveAnchorObj.beginY)/this.stageScale;
        let type = this.moveAnchorObj.moveType;
        if(type==="topTurn"){
          this.topTurnFun(e.clientX,e.clientY,this.moveAnchorObj.turnPoint.x,this.moveAnchorObj.turnPoint.y);
        }else if(type === "turnPoint"){
          this.turnPointFun(x,y);
        }else{
          this.changeSizeFun(type,x,y);
        }
      },
      changeSizeFun(type,x,y){
        if(this.obj.edit.control.permission[2]<1){return}
        let rad = this.obj.rotation;
        let width,height;
        let vectorMark = this.anchorObj.matrix.applyInverse({x:0,y:0});
        let vector = this.anchorObj.matrix.applyInverse({x:x,y:y});
        let w = (vector.x-vectorMark.x) * this.anchorObj.scale.x;
        let h = (vector.y-vectorMark.y) * this.anchorObj.scale.y;
        let wb = this.obj.pivot.x * this.anchorObj.scale.x / this.anchorObj.width;
        let hb = this.obj.pivot.y * this.anchorObj.scale.y / this.anchorObj.height;
        let fullWidth = 0,fullHeight = 0;
        if(type === "rightCenter" || type === "topRight" || type === "bottomRight"){
          if(this.anchorObj.scale.x < 0){
            w = -w;
            wb = Math.abs(wb)
          }
        }
        if(type === "bottomCenter" || type === "bottomRight" || type === "bottomLeft"){
          if(this.anchorObj.scale.y < 0){
            h = -h;
            hb = Math.abs(hb)
          }
        }
        if(type === "topCenter"){
          if(hb != 0) fullHeight = h / hb;
          width = this.anchorObj.width;
          height = this.anchorObj.height - fullHeight;
        }
        if(type === "rightCenter"){
          if(wb != 1)fullWidth = w / (1-wb);
          width = this.anchorObj.width + fullWidth;
          height = this.anchorObj.height;
        }
        if(type === "bottomCenter"){
          if(hb != 1)fullHeight = h / (1 - hb);
          width = this.anchorObj.width;
          height = this.anchorObj.height + fullHeight;
        }
        if(type === "leftCenter"){
          if(wb != 0)fullWidth =  w / wb;
          width = this.anchorObj.width - fullWidth;
          height = this.anchorObj.height ;
        }
        if(type === "topLeft"){
          if(wb != 0)fullWidth =  w / wb;
          if(hb != 0)fullHeight = h / hb;
          width = this.anchorObj.width - fullWidth;
          height = this.anchorObj.height - fullHeight;
        }
        if(type === "topRight"){
          if(wb != 1)fullWidth =  w / (1 - wb);
          if(hb != 0)fullHeight = h / hb;
          width = this.anchorObj.width + fullWidth;
          height = this.anchorObj.height - fullHeight;
        }
        if(type === "bottomRight"){
          if(wb != 1)fullWidth =  w / (1 - wb);
          if(hb != 1)fullHeight = h / (1 - hb);
          width = this.anchorObj.width + fullWidth;
          height = this.anchorObj.height + fullHeight;
        }
        if(type === "bottomLeft"){
          if(wb != 0)fullWidth =  w / wb;
          if(hb != 1)fullHeight = h / (1 - hb);
          width = this.anchorObj.width - fullWidth;
          height = this.anchorObj.height + fullHeight;
        }
        let realWidth = Math.abs(this.obj.width/this.obj.scale.x), realHeight = Math.abs(this.obj.height/this.obj.scale.y);
        if(this.anchorObj.scale.x < 0){
          realWidth = -realWidth;
        }
        if(this.anchorObj.scale.y < 0){
          realHeight = -realHeight;
        }
        if(this.$store.state.proportionLock){
          height = this.anchorObj.height * width / this.anchorObj.width;
          width = this.anchorObj.width * height / this.anchorObj.height;
        }

        this.obj.scale.x = width / realWidth;
        this.obj.scale.y = height / realHeight;
      },
      topTurnFun(x,y,x1,y1){ // 旋转按钮按下进行旋转（考虑当前角度和旋转中心）
        if(this.obj.edit.control.permission[3]<1){return};
        // Object.assign(this.obj.pivot,{x:Math.abs(this.obj.pivot.x),y:Math.abs(this.obj.pivot.y)});
        let run = Math.atan2(this.moveAnchorObj.beginX-x1,this.moveAnchorObj.beginY-y1)-Math.atan2(x-x1,y-y1);
        this.obj.rotation=this.anchorObj.rotation*1+run*1;
      },
      turnPointFun(x,y){ // 移动旋转中心时的变化，（考虑当前缩放和旋转等因素）
        let point = this.obj.toGlobal(this.anchorObj.pivot);
        this.$store.commit("SET_SELECT_OBJ_VALUE",{obj:this.obj,key:"pivot",value:{x:point.x+x,y:point.y+y}});
      },
      getcircleBaseStyle(x,y,left,top,background,isPivot){
        // console.log(isPivot);
        // console.log(!isPivot);

        if(!isPivot){
          this.obj.scale.x >= 0 ? x = x : x = -x;
          this.obj.scale.y >= 0 ? y = y : y = -y;
        }
        let position = this.obj.toGlobal({x:x/this.obj.scale.x,y:y/this.obj.scale.y},undefined,true);
        let x1 = position.x * this.canvasScale-0.035 , y1 = position.y * this.canvasScale-0.035;
        return {
          display:"block",
          width:"0.06rem",
          height:"0.06rem",
          position:"absolute",
          left:(left||x1)+"rem",
          top:(top||y1)+"rem",
          border:"1px solid black",
          borderRadius:"0.06rem",
          pointerEvents:"auto",
          background:background||"#fff",
        }
      },
    },
    watch:{
     
      tran:{
        handler(){
        },
        deep:true
      }
    },
    computed:{
      tran(){
        return this.obj.transform.localTransform;
      },
      canvasScale(){
        return this.$store.state.stageParentSize.scale/window.base;
      },
      obj(){
        // console.log(this)
        return this.arr[0]
      },
      getBoundsStyle(){
        //这里有持续的调用
        let rect = this.getBounds(this.obj).rect;
        return{
          width:rect.width+"px",
          height:rect.height+"px",
          position:"absolute",
          left:rect.x+"px",
          top:rect.y+"px",
          pointerEvents:"none",
          border:"0.01rem solid red"
        }
      },


      // getBlackStyle1
      getBlackStyle1(){
        let x0 = this.obj.scale.x,
            y0 = this.obj.scale.y,
            x1 = 0,
            y1 = 0,
            x2 = this.obj.width/this.obj.scale.x,
            y2 = 0;
        //console.log("x0",x0,"y0",y0,"x1",x1,"y1",y1,"x2",x2,"y2",y2)
        if(x0 < 0){
          x1 = -x1;
          x2 = -x2;
        }
        if(y0 < 0){
          y1 = -y1;
          y2 = -y2;
        }
        let position = this.obj.toGlobal({x:x1,y:y1},undefined,true);
        let position1 = this.obj.toGlobal({x:x2,y:y2},undefined,true);
        // console.log(this.getStyle(position,position1))
        return this.getStyle(position,position1)
      },


      getBlackStyle2(){
        let x0 = this.obj.scale.x,
            y0 = this.obj.scale.y,
            x1 = this.obj.width/this.obj.scale.x,
            y1 = 0,
            x2 = this.obj.width/this.obj.scale.x,
            y2 = this.obj.height/this.obj.scale.y;
        if(x0 < 0){
          x1 = -x1;
          x2 = -x2;
        }
        if(y0 < 0){
          y1 = -y1;
          y2 = -y2;
        }
        let position = this.obj.toGlobal({x:x1,y:y1},undefined,true);
        let position1 = this.obj.toGlobal({x:x2,y:y2},undefined,true);
        return this.getStyle(position,position1);
      },

      getBlackStyle3(){
        let x0 = this.obj.scale.x,
            y0 = this.obj.scale.y,
            x1 = this.obj.width/this.obj.scale.x,
            y1 = this.obj.height/this.obj.scale.y,
            x2 = 0,
            y2 = this.obj.height/this.obj.scale.y;
        if(x0 < 0){
          x1 = -x1;
          x2 = -x2;
        }
        if(y0 < 0){
          y1 = -y1;
          y2 = -y2;
        }
        let position = this.obj.toGlobal({x:x1,y:y1},undefined,true);
        let position1 = this.obj.toGlobal({x:x2,y:y2},undefined,true);
        return this.getStyle(position,position1)
      },

      getBlackStyle4(){
        let x0 = this.obj.scale.x,
            y0 = this.obj.scale.y,
            x1 = 0,
            y1 = this.obj.height/this.obj.scale.y,
            x2 = 0,
            y2 = 0;
        if(x0 < 0){
          x1 = -x1;
          x2 = -x2;
        }
        if(y0 < 0){
          y1 = -y1;
          y2 = -y2;
        }
        let position = this.obj.toGlobal({x:x1,y:y1},undefined,true);
        let position1 = this.obj.toGlobal({x:x2,y:y2},undefined,true);
        return this.getStyle(position,position1)
      },

      topLeftStyle(){
        let cursor = "nw-resize";
        let scaleX = this.obj.scale.x;
        let scaleY = this.obj.scale.y;
        if(scaleX < 0 && scaleY < 0){
          cursor = "se-resize";
        }else if(scaleX >= 0 && scaleY < 0){
          cursor = "sw-resize";
        }else if(scaleX < 0 && scaleY >= 0){
          cursor = "ne-resize";
        }else{
          cursor = "nw-resize";
        }
        return Object.assign({cursor:cursor},this.getcircleBaseStyle(0,0));
      },


      topCenterStyle(){
        return Object.assign({cursor:this.obj.scale.y >= 0 ? "n-resize" : "s-resize"},this.getcircleBaseStyle(this.obj.width/2,0))
      },


      topRightStyle(){
        let cursor = "ne-resize";
        let scaleX = this.obj.scale.x;
        let scaleY = this.obj.scale.y;
        if(scaleX < 0 && scaleY < 0){
          cursor = "sw-resize";
        }else if(scaleX >= 0 && scaleY < 0){
          cursor = "se-resize";
        }else if(scaleX < 0 && scaleY >= 0){
          cursor = "nw-resize";
        }else{
          cursor = "ne-resize";
        }
        return Object.assign({cursor:cursor},this.getcircleBaseStyle(this.obj.width,0))
      },
      leftCenterStyle(){
        return Object.assign({cursor:this.obj.scale.x >= 0 ? "w-resize" : "e-resize"},this.getcircleBaseStyle(0,this.obj.height/2))
      },
      rightCenterStyle(){
        return Object.assign({cursor:this.obj.scale.x >= 0 ? "e-resize" : "w-resize"},this.getcircleBaseStyle(this.obj.width,this.obj.height/2))
      },
      bottomLeftStyle(){
        let cursor = "sw-resize";
        let scaleX = this.obj.scale.x;
        let scaleY = this.obj.scale.y;
        if(scaleX < 0 && scaleY < 0){
          cursor = "ne-resize";
        }else if(scaleX >= 0 && scaleY < 0){
          cursor = "nw-resize";
        }else if(scaleX < 0 && scaleY >= 0){
          cursor = "se-resize";
        }else{
          cursor = "sw-resize";
        }
        return Object.assign({cursor:cursor},this.getcircleBaseStyle(0,this.obj.height))
      },
      bottomCenterStyle(){
        return Object.assign({cursor:this.obj.scale.y >= 0 ? "s-resize" : "n-resize"},this.getcircleBaseStyle(this.obj.width/2,this.obj.height))
      },
      bottomRightStyle(){
        let cursor = "se-resize";
        let scaleX = this.obj.scale.x;
        let scaleY = this.obj.scale.y;
        if(scaleX < 0 && scaleY < 0){
          cursor = "nw-resize";
        }else if(scaleX >= 0 && scaleY < 0){
          cursor = "ne-resize";
        }else if(scaleX < 0 && scaleY >= 0){
          cursor = "sw-resize";
        }else{
          cursor = "se-resize";
        }
        return Object.assign({cursor:cursor},this.getcircleBaseStyle(this.obj.width,this.obj.height))
      },
      topTurnStyle(){
        return Object.assign({cursor:"Move"},this.getcircleBaseStyle(this.obj.width/2,-50,0,0,"skyblue"))
      },
      turnPointStyle(){
        return Object.assign({cursor:"Move"},this.getcircleBaseStyle(this.obj.pivot.x*this.obj.scale.x,(this.obj.pivot.y)*this.obj.scale.y,0,0,"red",true))
      },
      lineStyle(){
        let x0 = this.obj.scale.x,
            y0 = this.obj.scale.y,
            x1 = this.obj.width/2/this.obj.scale.x,
            y1 = 0,
            x2 = this.obj.width/2/this.obj.scale.x,
            y2 = -50/this.obj.scale.y;
        if(x0 < 0){
          x1 = -x1;
          x2 = -x2;
        }
        if(y0 < 0){
          y1 = -y1;
          y2 = -y2;
        }
        let position = this.obj.toGlobal({x:x1,y:y1},undefined,true);
        let position1 = this.obj.toGlobal({x:x2,y:y2},undefined,true);
        let x = position.x*this.canvasScale,y=position.y*this.canvasScale,x3 = position1.x*this.canvasScale,y3 = position1.y*this.canvasScale;
        let height = Math.sqrt(Math.pow((x-x3),2)+Math.pow((y-y3),2));
        let rotate = (270-Math.atan2(position1.x-position.x,(position1.y-position.y)))*180/Math.PI+10;
        return Object.assign({outline:"1px solid black",height:height+"rem",pointerEvents:'none',position:"absolute",left:x+"rem",top:y+"rem",transformOrigin:"top left",transform:"rotate("+rotate+180+"deg)"});
      }
    }
  }
</script>

<style>
</style>
