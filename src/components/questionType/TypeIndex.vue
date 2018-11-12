<template>
  <div>
  <div class="draw_box" v-show="drawDivShow">
  </div>
   <div class="indexDiv" v-if="hidden_ty"  @click="wrap_Div($event)">
     <div class="headType">
       <p class="pTitle">请选择想要编辑的题型:</p>
     </div>
     <div class="typePageState">
       <dl v-for="(item ,index) in pageState">
         <dt @click="ChoiceType(index)"><img :src="item.img" alt=""></dt>
         <dd>{{item.text}}</dd>
       </dl>
     </div>
     <!--<component :dataName = "getWriteType(type)" :is="getWriteType(type)" :typePr="modJson"></component>-->
     <div class="bottomBox">
       <p class="ppBottom">
         <!--<button @click="finish()">完成</button>-->
       </p>
     </div>

   </div>
  </div>
</template>
<script>
  import TypeCom from './TypeCommon.vue';
  export default {
    name:'TypeIndex',
    // props:["modJson"],
    extends: TypeCom,
    data(){
      return{
        type:this.modJson,
        chose:false,
        hidden_ty:true,
        drawDivShow:true,
        main_choise:'',
        pageState:[
          {"img":require('../../../static/images/back1.jpg'),"text":'选择'},
          {"img":require('../../../static/images/back4.jpg'),"text":'填空'},
          {"img":require('../../../static/images/back2.jpg'),"text":'分类'},
          {"img":require('../../../static/images/back3.jpg'),"text":'连线'},
          {"img":require('../../../static/images/back3.jpg'),"text":'无'},
        ]
      }
    },
    methods:{
      wrap_Div(ev){
          if (ev.target.className === "typePageState") {
            console.log('dvnjsdnkvjnskvjnsdkjvjskd')
        // this.$store.commit("STAGE_OBJ", this.$store.state.stageObj.parent); //parent是代表当前舞台值
        // this.$store.commit("SET_SELECT_LIST", {
        //   obj: this.$store.state.stageObj
        // });
      }
      },
      ChoiceType(index){
        this.$store.state.frameAlert = false;
        this.$store.state.rootStageObj.modelType = index+1
      },
      finish(){
        this.$emit('choseShow',this.chose)
      },

    },
    mounted(){
    },
    created(){
    },
    components:{
    },
    computed:{
    }


  }

</script>
<style lang="scss" scope>
  .indexDiv{
    width:11rem;
    height:7rem;
    background: #ffffff;
    position: absolute;
    top:1rem;
    font-size:0.2rem;
    left:1.7rem;
    z-index: 99;
    .headType{
      width:100%;
      height:1rem;
      z-index: 9;
      background-color:#E4EFF9;
      /*background: #eee;*/
      border-bottom: 1px solid #ddd;

      .pTitle{
        width:80%;
        height:1rem;
        margin-left:5%;
        font-size: 0.2rem;
        line-height: 1rem;
        /*text-align: left;*/
        position: relative;
        color: #51A2F3;;
      }
      span{
        position: absolute;
        top:0.35rem;
        left:0.2rem;
        color: #51A2F3;;
      }
    }
    }
    .bottomBox{
      width:100%;
      height: 0.6rem;
      position: absolute;
      bottom: 0rem;
      border-top:1px solid #eee;
      background-color:#E4EFF9;
      button{
        width:1.2rem;
        height:0.35rem;
        background: white;
        border:none;
        outline: none;
        position: absolute;
        bottom: 0.125rem;
        right:0.3rem;
        background: #51A2F3;
        border-radius: 0.05rem;
        color: #fff;
      }
    }

  .draw_box{
    width:14.4rem;
    height:9rem;
    position: absolute;
    top:0rem;
    left:0rem;
    background: #000000;
    opacity:0.5;
    z-index: 10;
  }
  .typePageState{
    width:80%;
    margin-left: 12.5%;
    height:4rem;
    // background-color: yellow;
    margin-top: 0.2rem;
     dl{
       width:20%;
       height:1.5rem;
       /*background: #f98d9d;*/
       float: left;
       margin-right:5%;

         dt{
           width:100%;
           height:1rem;
           /*background: #13ce66;*/
             img{
               width:100%;
               height:100%;
             }
         }
       dd{
         width:100%;
         text-align: center;
         height:0.5rem;
         line-height: 0.5rem;
       }
     }
  }

</style>
