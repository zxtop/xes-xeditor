import {Atom,Active} from "../undo";

/**
 * 舞台缩放，亦可以设置任何元素缩放；
 * @param context
 * @param scaleParameter:{target:{},type:string,scaleX:num,scaleY:num};
 */
export const changeStageScale = (context,scaleParameter)=>{
  let type = scaleParameter.type,scaleX,scaleY;
  let target = scaleParameter.target||context.state.rootStageObj;
  let startWidth = target.width, startHeight = target.height,startScale = {x:target.scale.x,y:target.scale.y},startX = target.x,startY = target.y;
  if(type === "reduce"){//默认减小参数0.1
    scaleX = target.scale.x-0.1;
    scaleY = target.scale.y-0.1;
  }else if(type === "blowup"){
    scaleX = target.scale.x+0.1;
    scaleY = target.scale.y+0.1;
  }
  scaleX = scaleParameter.scaleX||scaleX;//优先读取设置值
  scaleY = scaleParameter.scaleY||scaleY;
  target.scale.set(scaleX,scaleY);
  if (target.scale.x < 0.1) { target.scale.x = 0.1 }
  if (target.scale.y < 0.1) { target.scale.y = 0.1 }
  if (target.scale.x > 1.9) { target.scale.x = 2 }
  if (target.scale.y > 1.9) { target.scale.y = 2 }
  target.x = (startWidth - target.width) / 2 + startX;
  target.y = (startHeight - target.height) / 2 + startY;

  if(!context.state.isUndoAfter){
    let endScale={x:target.scale.x,y:target.scale.y};
    if(startScale.x.toFixed(2)!=endScale.x.toFixed(2)||startScale.y.toFixed(2)!=endScale.y.toFixed(2)){
      let stack = new Active("舞台缩放","CHANGE_PROPERTY");
      stack.list.push(new Atom({id:target.id,key:"scale",startValue:startScale,endValue:endScale}));
      stack.list.push(new Atom({id:target.id,key:"x",startValue:startX,endValue:target.x}));
      stack.list.push(new Atom({id:target.id,key:"y",startValue:startY,endValue:target.y}));
      context.dispatch("ADD_STACK",{content:stack});
    }
  }else{
    context.state.isUndoAfter = false;
  }
};



/**
 * 元素复制
 * @param context
 * @param copyParamerer{copyObjArr:[]}
 */
export const copy = (context,copyParamerer)=>{
  let list;
  if (context.state.stagePageFoucs === false) {//如果复制的是舞台上的元素
    list=copyParamerer.copyList||context.state.selectorObj.selectList;
  } else if (context.state.stagePageFoucs === true) { {//如果复制的是真个舞台
    let targetJson = context.state.rootStageObj.toJson()
    targetJson.name = 'stage' + (context.state.stageArr.length + 1);
    list = [new XPIXI.Stage(targetJson)];
  }

  }
  // console.log(list)
   if(list.length<=0){
     console.warn("没有需要复制的数据")
   }else{
     context.state.copyObjArr = [];
     list.map((obj)=>{
       context.state.copyObjArr.push(obj.copySelf())
     })
   }
};




/**
 * 全选
 * @param context
 * @param checkParamerer
 */
export const checkUp = (context,checkParamerer) => {
  let index = -1;
  if (context.state.selectorObj.selectList.length < 1) {
    return;
  } else if (context.state.selectorObj.selectList.length == 1) {
    index = getIndex(context.state.stageObj.children, context.state.selectorObj.clickId, 'up')
  } else {
    if (context.state.selectorObj.selectList[0].id == context.state.selectorObj.clickId) {
      index = getIndex(context.state.stageObj.children, context.state.selectorObj.selectList[context.state.selectorObj.selectList.length - 1].id, 'up')
    } else {
      context.state.selectorObj.selectList.shift()
      return;
    }
  }
  context.state.stageObj.children.map((obj, i) => {
    if (index == i) context.state.selectorObj.selectList.push(obj)
  })
}
//获取索引
export const getIndex = (children, id, type) => {
  let index = -1;
  children.map((obj, i) => {
    if(obj.id == id) {
      if(type == 'up') {
        index = i + 1
      } else if (type == 'down') {
        index = i - 1
      }
    }
  })
  return index
}
export const checkDown = (context,checkParamerer) => {
  let index = -1;
  if (context.state.selectorObj.selectList.length < 1) {
    return;
  } else if (context.state.selectorObj.selectList.length == 1) {
    index = getIndex(context.state.stageObj.children, context.state.selectorObj.clickId, 'down')
  } else {
    if (context.state.selectorObj.selectList[0].id == context.state.selectorObj.clickId) {
      context.state.selectorObj.selectList.pop()
      return;
    } else {
      index = getIndex(context.state.stageObj.children, context.state.selectorObj.selectList[0].id, 'down')
    }
  }
  context.state.stageObj.children.map((obj, i) => {
    if (index == i) context.state.selectorObj.selectList.unshift(obj)
  })
}
export const checkAll = (context,checkParamerer)=>{
  let list = checkParamerer.list||context.state.stageObj.children;
    context.state.selectorObj.clearSelectList();
    context.state.selectorObj.selectType=2;
    list.map((item)=>{
    context.commit("SET_SELECT_LIST", { obj:item});
  });
  context.state.selectorObj.selectType=1;
    return list;
};



/**
 * 取消全选
 * @param context
 * @param checkParamerer
 */
export const cancelCheckAll = (context,checkParamerer)=>{
  let list = context.state.selectorObj.selectList;
  context.state.selectorObj.clearSelectList();
  return list;
};
