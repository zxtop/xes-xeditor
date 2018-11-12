import {getObj} from "./interation";
/**
 * 根据target对象 寻找stage的child层对象
 */
export const seekStageLayerObj = (target,stage)=>{
  if(!target){return undefined}
  if(target.id === stage.id){
    return target;
  }else{
    if(!target.parent){
      return {};
    }else if(target.parent.id === stage.id){
      return target
    }else{
      return seekStageLayerObj(target.parent,stage);
    }
  }
};

/**
 * 根据evObj重构一个符合编辑器需要的事件对象，evObj由渲染器提供，也是包装后的自定义事件对象；
 */
export const createEventObj = (evObj,stageObj)=>{
  let dataEvent ={},ev = evObj.ev;
  dataEvent.event = ev;
  dataEvent.targetObj = getObj(stageObj,ev.id);
  dataEvent.stageLayerObj = seekStageLayerObj(dataEvent.targetObj,stageObj);
  dataEvent.x = evObj.x;
  dataEvent.y = evObj.y;
  return dataEvent;
};
