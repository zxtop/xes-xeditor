<template>
  <div class="contain">
    <div class="page-loading">
      <span class="loadingText">loading...</span>
      <button class="inBtn" @click="inFun">加载内容页面</button>
    </div>
  </div>
</template>
<script>
  import { PAGE_DATA_FROM_URL } from 'xes_utils';
  export default{
    name:'Home',
    data(){
      return{
        obj:{},
        dataOk:false
      }
    },
    methods:{

    },
    created(){

    }
  }
</script>
<style>
  /* @import './styles/preload.css'; */
  .contain {
    width: 14.40rem;
    height: 9rem;
    margin:0 auto;
    background-color: #75ddee;
  }

  .page-loading {
    width: 100%;
    height: 100%;
    background-color: #75ddee;
    background-size: cover;
    position: relative;
    /* text-align: center; */
  }
  .loadingText {
    display: block;
    color: #849bfe;
    font-size: .7rem;
    font-weight: 900;
    font-family: Comic Sans MS;
    position: absolute;
    top:30%;
    /* background: red; */
    left:50%;
    width:3.5rem;
    height:1rem;
    /* transform: translate3d(-30%,-50%,0); */
    margin-left:-1.55rem;
    margin-top:-0.5rem;
    text-shadow: #ffffff .03rem 0 0, #ffffff 0 .03rem 0, #ffffff -.03rem 0 0, #ffffff 0 -.03rem 0;
    -webkit-text-shadow: #ffffff .03rem 0 0, #ffffff 0 .03rem 0, #ffffff -.03rem 0 0, #ffffff 0 -.03rem 0;
    -moz-text-shadow: #ffffff .03rem 0 0, #ffffff 0 .03rem 0, #ffffff -.03rem 0 0, #ffffff 0 -.03rem 0;
  }
  .inBtn{
    width: 3rem;
    height:.8rem;
    padding:0.05rem;
    position: absolute;
    top:50%;
    left:50%;
    /* transform: translate3d(-50%,-50%,0); */
    margin-top:-0.4rem;
    margin-left: -1.5rem;
    border:none;
    outline: none;
    border-radius: 0.2rem;
    background:#75ddee;
    font-size:0.3rem;
    color: #ffff;
    border:2px solid #fff;
  }
</style>
