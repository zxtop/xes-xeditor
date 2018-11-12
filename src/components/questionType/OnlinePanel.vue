<template>
   <div class="onLine_div" v-if="online_show">
     <div class="online_Img"  v-for="(item ,index) in objs_imgs">
       <input type="checkbox" class="check_input" ref="check_input" @click="change_term(index)">
       <div class="img_onlin_show">
         <img :src=item alt="">
       </div>
     </div>
   </div>
</template>
<script>
  export default{
    name:'OnlinePanel',
    props:["typeObjs"],
    data(){
      return{
        online_show:false,
        objs_term:[],
        objs_imgs:[],
        objs_class:[],
      }
    },
    methods:{
      getNum(arr,index){
        for(var k=0;k<arr.length;k++){
          if(arr[k].indexOf(this.objs_term[index].name) != -1){
            return k
          }
        }
      },
      getNumTwo(arr,index){
        for(var z=0;z<arr.length;z++){
          if(arr[z].indexOf(this.typeObjs.name) != -1){
            return z
          }
        }
      },
      change_term(index){
        if(this.objs_term[index].matchItems.indexOf(this.typeObjs.name) != -1){
          let z =  this.getNumTwo(this.objs_term[index].matchItems,index)
          this.objs_term[index].matchItems.splice(z,1)
        }else {
          this.objs_term[index].matchItems.push(this.typeObjs.name)
        }


        if(this.typeObjs.matchItems.indexOf(this.objs_term[index].name) != -1){

          let k =  this.getNum(this.typeObjs.matchItems,index)
          this.typeObjs.matchItems.splice(k,1)
        }else {
          this.typeObjs.matchItems.push(this.objs_term[index].name)
        }
      }
    },
    created(){
      if(this.typeObjs.groupType == "ligature_answer" ){
        this.online_show = true;
      }
      let objs = this.$store.state.stageObj.toObj();
      for(var value  in objs){
        if(objs[value].groupType == "ligature_stem"){
          this.objs_term.push(objs[value])
          this.objs_imgs.push(objs[value].texture.baseTexture.imageUrl)
        }else if(objs[value].groupType == "ligature_answer"){
          this.objs_class.push(objs[value])
        }
      }
    },
    mounted(){
      if(this.typeObjs.groupType == "ligature_answer"){
        for(var i=0 ;i<this.typeObjs.matchItems.length;i++){
          for(var j=0;j<this.objs_term.length;j++){
            if(this.typeObjs.matchItems[i] == this.objs_term[j].name){
              this.$refs.check_input[j].checked = 'checked';
              // $('.check_input').eq(j).attr('checked',"checked")
            }
          }
        }
      }
    },

  }

</script>
<style lang="scss" scoped>
  .onLine_div{
    width:100%;
    height:auto;
    margin-top: -0.2rem;
    .online_Img{
      width:80%;
      height:0.8rem;
      /*background: yellow;*/
      position: relative;
      input{
        top:45%;
        width:0.15rem;
        height:0.15rem;
        left:0.2rem;
        position: absolute;
        transform: translate3d(0,0,0);
      }
      .img_onlin_show{
        width:80%;
        height:80%;
        position: absolute;
        top:0.15rem;
        left:0.6rem;
        img{
          width:100%;
          height:100%;
          position: absolute;
          top:50%;
          transform: translate3d(0,-50%,0);
        }
      }

    }
  }
</style>
