<template>
  <div class="addRemark" v-if="show_remark">
    <textarea onclick="focus()" @keydown.ctrl="handle($event)" name="textarea"  style="resize:none"
              :value="this.$store.state.rootStageObj.remark"
              @change="change_message($event,true)"
              id="textAreaBox"
              cols="30"
              rows="10">
     </textarea>
  </div>
</template>
<script>
  export default {
    name:'addRemark',
    props: ["addStage"],
    data(){
      return{
        remark:this.$store.state.rootStageObj.remark,
        show_remark:true,
      }
    },
    created(){
      // console.log('vmksdvsk ')
    },
    mounted(){
    },
    methods:{
      handle(event) {
        if (event.keyCode == 90) {
          event.preventDefault();
          event.path[0].blur();
          this.$store.dispatch("UNDO",{id:this.$store.state.stageObj.id})
        } else if (event.keyCode == 89) {
          event.preventDefault();
          event.path[0].blur();
          this.$store.dispatch("REDO",{id:this.$store.state.stageObj.id})
        }
      },
      change_message(ev,bool){
        this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.$store.state.rootStageObj],key:'remark',value:ev.target.value,isStack:{modifyState:bool,startContent:this.$store.state.rootStageObj.remark}});
      }
    },
    watch:{
    },
    mounted(){
    }

  }
</script>
<style scoped lang="scss">
  .addRemark{
    width:9.4rem;
    height:1.39rem;
    background: pink;
    position: absolute;
    bottom:0.44rem;
    left:2.2rem;
  }
  .pps_head{
    width:auto;
    height:0.5rem;
    position: absolute;
    top:0rem;
    left:0.1rem;
    font-size:0.15rem;
    color:#fff;
  }
  #textAreaBox{
    width:100%;
    height: 100%;
    outline: none;
    border:none;
    background: #181818;
    color: #eee;
    font-size:0.15rem;
    // overflow-y: scroll;
    line-height: 0.25rem;
  }
  .input_message{
    width:100%;
    height: auto;
  }

</style>
