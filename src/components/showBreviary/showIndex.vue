<template>
  <div class="pageOrcontrol" >
    <ul>
      <li @click="pageOne()" ref="pageO" class="pageO">页面</li>
      <li @click="pageTwo()" ref="pageT" class="pageT">图层</li>
    </ul>
    <showPage v-if="pageS" @showbox="toshow"></showPage>
    <showLayer v-else></showLayer>
  </div>
</template>
<script>
  import showPage from './showPage.vue';
  import showLayer from './showLayer.vue'
  export default {
    name:'showIndex',
    data(){
      return{
        pageS:false,
        someData:'',
        isRouterAlive:true,

      }
    },
    created(){
    },
    watch:{
      someData:function(){
         this.reload();
      }
    },
    methods:{
      toshow: function (somedata){
          this.someData = somedata
      },
      reload () {
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      },
      pageOne(){
        var pageO = document.getElementsByClassName('pageO')[0];
        var pageT = document.getElementsByClassName('pageT')[0];
            pageO.style.backgroundColor = '#383838';
            pageT.style.backgroundColor = '#292929';
        this.pageS = true;

      },
      pageTwo(){
        var pageO = document.getElementsByClassName('pageO')[0];
        var pageT = document.getElementsByClassName('pageT')[0];
            pageO.style.backgroundColor = '#292929';
            pageT.style.backgroundColor = '#383838';
        this.pageS = false;
      }

    },
    components:{
      showPage,
      showLayer,
    }

  }

</script>
<style>
::-webkit-scrollbar {
  background-color: #888;
  width: 0.17rem;
}
::-webkit-scrollbar-thumb {
  background-color: #666;
}
  .pageOrcontrol{
    width:2.20rem;
    height:8.38rem;
    background: #383838;
    position: relative;
  }
  .pageOrcontrol ul {
    width:100%;
    height:0.44rem;
    background:yellow;
    font-size:0.18rem;
  }
  .pageOrcontrol ul li{
    width:50%;
    height:100%;
    display: inline-block;
    float: left;
    line-height: 0.44rem;
    text-align: center;
    color:#fff
  }
  .pageOrcontrol ul li:nth-child(1){
    background: #292929;
  }
  .pageOrcontrol ul li:nth-child(2){
    background: #383838;
  }
</style>
