<template>
  <div class="propertyBox">
    <pro-location v-if="!isStage" :prosObj = "propertyObj"  v-on:child-say="listenToMyBoy" :key="propertyObj.id" :name="propertyObj.id"></pro-location>
    <proArena v-else :prosObj="propertyObj"></proArena>
  </div>
</template>
<script>
  import proLocation from "./proLocation";
  import proArena from './proArena.vue'
  import proCon from "./proCommon.vue";
  export default {
    name:'proIndex',
    extends:proCon,
    components:{
      proLocation,
      proArena
    },
    data(){
      return {
        childWords:'',
        Whole_Single:true
      }
    },
    methods:{
      listenToMyBoy: function (somedata){
        this.childWords = somedata;
        this.fun();
      },
      fun(){
        this.$emit('ChildNodeS',this.childWords);
      }
    },
    created(){
      // console.log(this.propertyObj)
    },
    computed:{
      propertyObj(){
        return this.$store.state.selectorObj.propertyObj
      },
      isStage(){
        return this.$store.state.selectorObj.propertyObj.type === this.$store.state.typeObj.typeElement.STAGE;
      }
    },
    watch:{
    },
    updated(){

    }
  }
</script>
<style>
.propertyBox{
    height:8.40rem;
    width:2.80rem;
    position: absolute;
    /* background: pink; */
    right:0px;
    top:0.6rem;
    background: #383838;
  }
.properTittle{
            width:100%;
            height: 0.5rem;
            line-height: 0.5rem;
            text-indent: 0.1rem;
            font-size:0.18rem;
            /*border: 2px dashed #ccc;*/
        }
  .btn_release{
            width:100%;
            height:0.5rem;
            line-height: 0.5rem;
            text-align: center;
            font-size:0.18rem;
            outline: none;
            border:none;
            border:2px dashed #ccc;
            position: absolute;
            bottom: 0rem;
            left:0rem;
            background: #eeeeee;
        }
 .btn_preview{
            width:100%;
            height:0.5rem;
            line-height: 0.5rem;
            text-align: center;
            font-size:0.18rem;
            outline: none;
            border:none;
            border:2px dashed #ccc;
            position: absolute;
            bottom: 1rem;
            left:0rem;
            background: #eeeeee;
        }
</style>
