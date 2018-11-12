<template>
  <div class="Classify_div" v-if="Classify_show">
    <p class="pps_interfere" v-if="class_inter_show"><input type="radio" name="radios" value="1" v-model="param" @click="interferer_check()" class="interfere">干扰项</p>
    <div class="parentImg"  v-for="(item ,index) in objs_imgs">
      <input type="radio" name="radios" class="check_input" ref="check_input" @click="change_term(index)">
      <div class="imgshow">
        <img :src=item alt="">
      </div>
    </div>

  </div>
</template>
<script>
   export default {
     name:'ClassifyPanel',
     props:["typeObjs"],
     data(){
       return{
         Classify_show:'',
         objs_term:[],
         objs_class:[],
         objs_imgs:[],
         class_inter_show:true,
         param:'',
       }
     },
     created(){
        if(this.typeObjs.className == ''){
              this.param = 1;
          }

       if(this.typeObjs.groupType == "classification_item" ){
         this.Classify_show = true;
       }
       let objs = this.$store.state.stageObj.toObj();
       for(var value  in objs){
         if(objs[value].groupType == "classification_class"){
           this.objs_term.push(objs[value])
           this.objs_imgs.push(objs[value].texture.baseTexture.imageUrl)

         }else if(objs[value].groupType == "classification_item"){
           this.objs_class.push(objs[value])
         }
       }
     },
     mounted(){
       if(this.typeObjs.groupType == "classification_item"){
         for(var i=0;i<this.objs_term.length;i++){
           if(this.objs_term[i].name == this.typeObjs.className){
             // $('.check_input').eq(i).attr('checked',"checked");
             console.log('11111111111')
             this.$refs.check_input[i].checked  = 'checked';
           }
         }
       }
     },
     methods:{
       interferer_check(){
          this.typeObjs.className = '';
       },
       getNum(arr,index){
         for(var k=0;k<arr.length;k++){
           if(arr[k].indexOf(this.objs_term[index].name) != -1){
             return k
           }
         }
       },
       change_term(index){
         this.typeObjs.className = this.objs_term[index].name;
         this.param = '';
       }
     }
   }

</script>
<style lang="scss" scoped>
   .Classify_div{
      width:100%;
      height:auto;
      margin-top: -0.2rem;
      .pps_interfere{
        width:100%;
        height:0.6rem;
        line-height:0.6rem;
        font-size:0.15rem;
        text-indent:0.8rem;
        position: relative;
        font-weight: bold;
        /*text-align: center;*/
        /*background: #555555;*/
        color: #ffffff;
          .interfere{
            width:0.18rem;
            height:0.18rem;
            position: absolute;
            left:0.2rem;
            top:0.2rem;

          }

      }
      .parentImg{
        width:80%;
        height:0.8rem;
        /*background: yellow;*/
        position: relative;
           input{
             width:0.18rem;
             height:0.18rem;
             top:45%;
             left:0.2rem;
             position: absolute;
             transform: translate3d(0,0,0);
           }
             .imgshow{
               width:50%;
               height:100%;
               position: absolute;
               top:0rem;
               left:0.6rem;
               /*background: #13ce66;*/
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
