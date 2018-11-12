<template>
 <canvas id="editCanvas" :width="stageParentSize.width" :height="stageParentSize.height" :style="canvasStyle"></canvas>
</template>

<script>
  import com from "./editCommon"
  export default{
    props:["arr"],
    extends:com,
    data(){
      return {
      }
    },
    components:{
    },
    methods:{
      drawCanvas(){
        let context = document.getElementById("editCanvas").getContext("2d");
        context.fillStyle="#000";
        context.fillRect(0,0,this.stageParentSize.width,this.stageParentSize.height);
        context.clearRect(this.rect.x,this.rect.y,this.rect.width,this.rect.height)
      }
    },
    mounted(){
      this.drawCanvas()
    },
    computed:{
      canvasStyle(){
        return {
          opacity:0.5,
          pointerEvents:"none",
          width:this.stageParentSize.width+"px",
          height:this.stageParentSize.height+"px",
          position:"absolute",
          top:"-1px",
          left:"-1px"
        }
      },
      stageParentSize(){
        return this.$store.state.stageParentSize;
      },
      objId(){
        return this.arr.id
      },
      rect(){
        return this.getMoreBounds(this.arr.children).rect
      },
    },
    watch:{
      objId:function(){
        this.drawCanvas()
      },
      rect:function () {
        this.drawCanvas()
      }
    }
  }
</script>

<style>

</style>

