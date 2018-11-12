import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'
const state = {
  "typeObj":{},//元素类型，题型类型等类型判定数据
  "pixiObj":{},//pixi对象 用来渲染
  "rootStageObj":{},//当前需要渲染的舞台对象根对象
  "stageObj":{},//当前显示组
  "stageArr":[],//当前舞台集合
  "stageMove":false,//是否拖动舞台
  "moveTargetObj":false,
  "stack":{},
  "stagePageFoucs":false,//判断stagePage是否得焦，舞台操作撤销
  "stageParentDom":{width:940,height:530,scale:1},//舞台容器的设计尺寸
  "stageParentSize":{width:940,height:530,widthScale:1,heightScale:1,scale:1},//舞台当前的实际尺寸，和stage对象需要进行的缩放比
  "stageNameIndex":1,
  "selectorObj":{},
  "proportionLock":false,
  "copyObjArr":[],
  "limitAlert":true,//音频上传判断弹框
  "typeOfQuestion":'',
  "frameAlert":false,
  "isUndoAfter":false,
  "lidContent":false,
  "animationBool":true,
  "onceStart":true,
};
Vue.use(Vuex);
export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
