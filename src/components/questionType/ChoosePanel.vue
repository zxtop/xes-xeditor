<template>
    <div class="Choose_div" v-if="choosePage">
       <div class="radio_Choose">
         <p>
           <input type="checkbox"  class="inp_radio" ref="inp_radio" @click="checkClick()">
           <b class="pp_b">是否勾选为正确答案</b>
         </p>
       </div>
    </div>
</template>
<script>
  import { PixiExporter, createPixiObj } from "xeditor-convertor";
   export default {
     props:["typeObjs"],
     data(){
       return{
         objArray:[],
         dataArray:[],
         param:'',
         text_que:'',
         items:[],
         choosePage:false,
       }
     },
     methods:{
       checkClick(){
         if(this.typeObjs.isRight == true){
            this.typeObjs.isRight = false
         }else{
           this.typeObjs.isRight = true;
         }
       },
     },
     created(){
       if(this.typeObjs.groupType == 'choice'){
         this.choosePage = true;
       }
     },
     mounted(){
       if(this.typeObjs.isRight == true){
         this.$refs.inp_radio.checked = 'checked';
       }
     }

   }//
</script>
<style lang="scss" scoped>
  .Choose_div{
    width:100%;
    height:auto;
    margin-top: -0.2rem;
      .pps_choose{
        width:100%;
        height:0.55rem;
        line-height:0.55rem;
        text-indent:0.2rem;
        font-size:0.14rem;
        color: #fff;
      }
    .radio_Choose{
      width:100%;
      height:auto;
        p{
          width:100%;
          height:0.4rem;
          margin-bottom:0.05rem;
          position: relative;
           .inp_radio{
             position: absolute;
             top:40%;
             left:0.3rem;
             width:0.19rem;
             height:0.19rem;
             transform: translate3d(-50%,-50%,0);
           }
          .inp_text{
            position: absolute;
            width:70%;
            height:0.3rem;
            line-height:0.3rem;
            border:none;
            outline: none;
            border-radius: 0.05rem;
            background: #666666;
            text-indent:0.1rem;
            color: #fff;
            left:0.5rem;
            font-size:0.13rem;
          }
        }
    }
  }
  .add_choose_btn{
    width:50%;
    height:0.35rem;
    border:none;
    outline:none;
    background: #666;
    color: #ffffff;
    border-radius: 0.05rem;
    font-size:0.13rem;
    margin-left: 25%;

  }
  .spanPostion{
    position: absolute;
    right:0.05rem;
    top:40%;
    font-size:0.12rem;
    transform: translate3d(-50%,-50%,0);
    color: #fff;
  }
  .pp_b{
    width:70%;
    height:0.35rem;
    font-size:0.12rem;
    font-weight: normal;
    position: absolute;
    top:0.03rem;
    left:0.5rem;
    color: #fff;
  }
</style>
