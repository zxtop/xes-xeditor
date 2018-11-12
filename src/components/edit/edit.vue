<template>
  <div style="width:0px;height:0px;position:absolute;top:0px;left:0px;">
    <canvas-edit v-if="stageObj.type!==$store.state.typeObj.typeElement.STAGE"  :arr="stageObj"></canvas-edit>
    <input-edit v-if="inputEditObj" :arr="inputEditObj"></input-edit>
    <more-select v-else-if="selectArr.length>1" :arr="selectArr"></more-select>
    <one-select v-else-if="selectArr.length===1&&selectArr[0].type!==$store.state.typeObj.typeElement.STAGE" :arr="selectArr"></one-select>
  </div>
</template>
<script>
  import moreSelect from "./moreSelect"
  import oneSelect from "./oneSelect"
  import inputEdit from "./inputEdit"
  import canvasEdit from "./canvasEdit"
  export default{
    data(){
      return {
      }
    },
    components:{moreSelect,oneSelect,inputEdit,canvasEdit},
    computed:{
      selectArr(){
        return this.$store.state.selectorObj.selectList;
      },
      inputEditObj(){
        return this.$store.state.selectorObj.inputEditObj;
      },
      stageObj(){
        // console.log(this.$store.state.stageObj)
        return this.$store.state.stageObj;
      }
    },
    methods:{
    }
  }
</script>

<style>

</style>
