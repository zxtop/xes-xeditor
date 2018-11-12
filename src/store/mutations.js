/**
 @Author: swls
 */
import {setValue} from "../editMethod/setObjValue";
import {Selector} from "../editMethod/selectTarget/Selector";
import typeJson from "../editMethod/typeJson";
import {StackArr,Stack} from "xes-revocation";
require('xes-choice');
require('xes_fillvacancy');
require('xes-classification');
require('xes-ligature');
require('xes-pixi-audio');
require('xes-submit');


/**
 * 初始化方法（初始化pixi对象，舞台对象，舞台集合，操作栈，选择对象，以及舞台相对舞台容器需要做的缩放比例）
 */
export const INIT_STAGE = (state, data) =>{
    let pixi = data.pixi;
    state.typeObj = typeJson;
    state.pixiObj = pixi;
    state.rootStageObj = pixi.pixiApp.stages[0];
    state.stageObj = pixi.pixiApp.stages[0];
    state.stageArr = pixi.pixiApp.stages;
    state.stack = new StackArr();
    state.selectorObj = new Selector(pixi.pixiApp.stage, pixi.pixiApp.stage);
    RENDERER_STAGE_SCALE(state,{})
};





/**
 * 设置当前渲染根舞台对象,多题，多舞台切换
 */
export const ROOT_STAGE_OBJ = (state, data) =>{
  if (data === undefined || data === null) return;
  state.pixiObj.pixiApp.stage = data;
  state.rootStageObj = data;
  state.stageObj = data;
  state.selectorObj.selectInit(data, data);
  RENDERER_STAGE_SCALE(state,{})
};
/**
 *当前组，进组退组操作对象
 */
export const STAGE_OBJ = (state, data) => {
  if (data === undefined || data === null) return;
  data.isNameExist = state.stageObj.isNameExist;
  state.stageObj = data;
  state.selectorObj.stageObj = data;
};
/**
 *当前多有舞台集合
 */
export const STAGE_ARR = (state, data) => {
  if (data){ state.stageArr = data.arr }
};


/**
 *设置舞台外壳大小******设置当前舞台相对于当前舞台容器所要进行的缩放比例
 */
export const STAGE_PARENT_SIZE = (state, data) => {
  state.stageParentSize.width = data.width;
  state.stageParentSize.height = data.height;
  RENDERER_STAGE_SCALE(state,{})
};

export const RENDERER_STAGE_SCALE = (state,data)=>{
  if (state.rootStageObj.width) {
    state.stageParentSize.widthScale = state.stageParentSize.width / state.rootStageObj.width * state.rootStageObj.scale.x;
    state.stageParentSize.heightScale = state.stageParentSize.width / state.rootStageObj.height * state.rootStageObj.scale.y;
    state.stageParentSize.scale = Math.min(state.stageParentSize.widthScale, state.stageParentSize.heightScale);
  }
};


export const PROPORTION_LOCK = (state, data) =>{//比例锁
  state.proportionLock = data
};



/**
 * 操作select对象的方法（设置选中对象，设置当前文本编辑对象，置空选择列表，设置选择类型）
 */
export const SET_SELECT_LIST = (state, data) =>{//向选择列表添加选中对象
  state.selectorObj.selectList = data.obj;
};

export const SET_INPUT_EDIT = (state, data) => {//添加当前需要编辑的文本对象
  state.selectorObj.inputEditObj = data.obj;
};

export const SET_SELECT_TYPE = (state, data) => {//设置当前的选择类型 0禁止  1单选 2多选
  state.selectorObj.selectType = data.type;
};

export const CLEAR_SELECT_LIST = (state, data) => {//置空当前选择列表
  state.selectorObj.clearSelectList();
};

/**
 * 设置选中对象的属性值（单个对象obj，多个对象arr）
 */
export const SET_SELECT_OBJ_VALUE = (state, data) =>{
  if (data === undefined) return;
  let key = data.key;
  let value = data.value;
  let addValue = data.addValue;
  let isStack = data.isStack||false;
  let objArr = data.arr || [state.selectorObj.propertyObj];
  objArr.map((obj, index) =>{
    if(addValue){
      let num = 0;
      let pivot = obj.parent.toLocal(obj.pivot,obj,undefined,true);//中心点位置相父元素
      let zero = obj.parent.toLocal(obj.getBounds());//边界位置相对父元素
      num = zero[key] - pivot[key]
      isStack = {};
      isStack.modifyState = true;
      isStack.startContent = state.selectorObj.getSelectValue(key, [obj])[0][key];
      isStack.startContent += num;
      value = isStack.startContent + addValue;
    }
    setValue(obj, key, value,isStack,state);
  });
};
//弹出框
export const ALERT = (state,data) => {
  data.this.$alert(data.data, {
    confirmButtonText: '确定',
    center:false,
    showClose:false,
   });
}












