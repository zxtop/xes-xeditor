<template>
  <div>
    <div :style="getStyle">
      <textarea :value="value" id="editText" @blur="blurFun" @input="inputFun" :style="getStyleText" :dataName="lines" :key="obj.id">
      </textarea>
    </div>
  </div>
</template>
<script>
  import com from "./editCommon"
  import {Atom,Active} from "../../editMethod/undo";

  export default{
    name:"inputEdit",
    props:["arr"],
    extends:com,
    data(){
      return{
        startValue:"",
        targetDom:""
      }
    },
    methods:{
      inputFun(e){
        let maxX = parseFloat(this.obj.x) + parseFloat(this.obj.width);
        let maxY = parseFloat(this.obj.y) + parseFloat(this.obj.height); 
        let x = parseFloat(this.$store.state.stageObj.width);
        let y = parseFloat(this.$store.state.stageObj.height);
        
        if(maxX >= x || maxY >= y){
          // context.commit("ALERT", { data: "文本框超出编辑范围，请拖回舞台", this:{$store:context} });
          alert("文本框超出编辑范围，请将文本拖回舞台编辑，或在属性面板编辑")
        }else{
          this.$store.commit("SET_SELECT_OBJ_VALUE",{arr:[this.obj],key:"text",value:e.target.value});
        }
      },
      blurFun(e){
        if(this.startValue !== this.value){
          let stack = new Active("文本内容更改","CHANGE_PROPERTY");
          stack.list.push(new Atom({id:this.obj.id,key:"text",startValue:this.startValue,endValue:this.value}));
          this.$store.dispatch("ADD_STACK",{content:stack});
        }
        
        this.$store.commit("SET_INPUT_EDIT",{obj:null});
      }
    },
    computed:{
      obj(){
        return this.arr;
      },
      value(){
        return this.obj.text;
      },
      lines(){
        return this.obj.text.split(/(?:\r\n|\r|\n)/).length
      },
      getStyle(){
        return Object.assign({background:"#fff",outline:"1px solid red",overflow:"hidden"},this.getBaseStyle(this.obj))
      },
      getStyleText(){
        return {
          width:"100%",
          height:"100%",
          position:"absolute",
          top:!(this.lines-1)?0:-(this.obj.style.leading/2-10)*this.stageScale+"px",
          lineHeight:!(this.lines-1)?this.getStyleValue(this.obj,"height")*this.stageScale+"px":(this.getStyleValue(this.obj,"leading")+this.getStyleValue(this.obj,"fontSize"))*this.stageScale+"px",
          left:0,
          border:"none",
          textAlign:this.getStyleValue(this.obj,"align"),
          color:this.getStyleValue(this.obj,"fill"),
          fontFamily:this.getStyleValue(this.obj,"fontFamily"),
          fontSize:this.getStyleValue(this.obj,"fontSize")*this.stageScale+"px",
          fontStyle:this.getStyleValue(this.obj,"fontStyle"),
          fontVariant:this.getStyleValue(this.obj,"fontVariant"),
          fontWeight:this.getStyleValue(this.obj,"fontWeight"),
          background:"none",
          letterSpacing:this.obj.style.letterSpacing*this.stageScale*0.96+"px",
          overflow:"hidden"
        }
      },
    },
    mounted(){
      this.targetDom = document.getElementById("editText");
      this.targetDom.focus();
      this.startValue = this.value;
    },
    destroyed(){
    }
  }
</script>

<style>
</style>

