import {setValue} from "../setObjValue";
import {getObj} from "../interation";
import { getMoreBounds } from '../common.js';

/**
 @Author: swls
 */
export const CHANGE_PROPERTY = (context,obj,type)=>{
  obj.map((obj)=>{
    let targetObj = getObj(context.state.rootStageObj,obj.id);
    let key = obj.key;
    let value = type==="undo"?obj.startValue:obj.endValue;
    setValue(targetObj,key,value);
  })
};
export const CHANGE_ANIMATION = (context,obj,type)=>{
   let value = type === "undo" ? obj[0].startValue : obj[0].endValue;
   let objId = obj[0].id;
   context.state.stageObj.children.map(data => {
     if (data.id === objId) {
       data.addNewRes({id: value})
     }
   })
}
export const CHANGE_IMAGE = (context,obj,type) => {
let value = type==="undo"?obj[0].startValue:obj[0].endValue;
context.state.stageObj.children.map((data) => {
  if (data.id === obj[0].id) {
    data.defaultResId = value;
    data.changeTexture('default');
  }
})
}

export const DELETE =(context,obj,type)=>{
  type==="undo"?context.state.selectorObj.clearSelectList():context.state.selectorObj.selectList = context.state.rootStageObj;
  obj.map((obj)=>{
    let target = new XPIXI[obj.json.conName](obj.json);
    // target.id = obj.id;
    let parent = getObj(context.state.rootStageObj,obj.parentId);
    let index = obj.index;
    type==="undo"?addFun(context,target,parent,index):deleteFun(context,target,parent,index);
  })
};

export const ADD = (context,obj,type)=>{
  type==="undo"?context.state.selectorObj.selectList = context.state.rootStageObj:context.state.selectorObj.clearSelectList();
  obj.map((obj)=>{
    let target = new XPIXI[obj.json.conName](obj.json);
    target.id = obj.id
    let parent = getObj(context.state.rootStageObj,obj.parentId);
    let index = obj.index;
    type==="undo"?deleteFun(context,target,parent,index):addFun(context,target,parent,index);
  })
};

const addFun=(context,obj,parent,index)=>{
  parent.addChild(obj);
  if(index>=0){
    parent.setChildIndex(obj,index)
  }
  context.state.selectorObj.selectType = 2;
  context.state.selectorObj.selectList = obj;
  context.state.selectorObj.selectType = 1;
  //处理资源使用次数
  XPIXI.ResourceManager.getInstance().addResCount(obj.id);
};

const deleteFun=(context,obj,parent)=>{
 parent.children.map((b,i)=>{
   if(b.id===obj.id){
     parent.children.splice(i,1);
     //处理资源使用次数
     XPIXI.ResourceManager.getInstance().reduceResCount(obj.defaultResId);
   }
 })
};

export const LOCK = (context,obj,type)=>{
  type==="undo"?context.state.selectorObj.clearSelectList():context.state.selectorObj.selectList = context.state.rootStageObj;
  obj.map((obj)=>{
    let value = type === "undo"?obj.startValue:obj.endValue;
    let target=getObj(context.state.rootStageObj,obj.id);
    target.edit.layer.lock = value;
    if(!value){
      context.state.selectorObj.selectType = 2;
      context.state.selectorObj.selectList = target;
      context.state.selectorObj.selectType = 1;
    }
  })
};

export const HIDE = (context,obj,type)=>{
  type==="undo"?context.state.selectorObj.clearSelectList():context.state.selectorObj.selectList = context.state.rootStageObj;
  obj.map((obj)=>{
    let value = type === "undo"?obj.startValue:obj.endValue;
    let target=getObj(context.state.rootStageObj,obj.id);
    target.edit.layer.hide = value;
    target.hide = value;
    if(!value){
      context.state.selectorObj.selectType = 2;
      context.state.selectorObj.selectList = target;
      context.state.selectorObj.selectType = 1;
    }
  })
};

export const CHANGE_LAYER = (context,obj,type) =>{
  let len = obj.length - 1, i = len;
  if (type === 'undo') {
    for (i; i >= 0; i--) {
      let target = getObj(context.state.rootStageObj,obj[i].id);
      let value = type==="undo"?obj[i].startValue:obj[i].endValue;
      target.parent.setChildIndex(target,value);
      context.state.selectorObj.selectList = target;
    }
  } else if (type === 'redo') {
    obj.map((obj) => {
      let target = getObj(context.state.rootStageObj,obj.id);
      let value = type==="undo"?obj.startValue:obj.endValue;
      target.parent.setChildIndex(target,value);
      context.state.selectorObj.selectList = target;
    })
  }
};

export const DELETE_STAGE = (context, obj, type)=>{
  if (type == 'undo') {
    context.state.stageArr.push(obj[0].startValue)
  } else if (type == 'redo') {
    context.state.stageArr.map((data, index) => {
      if (data.id == obj[0].startValue.id) {
        context.state.stageArr.splice(index, 1)
      }
    })
  }
  //删除舞台
};
//舞台重命名
export const REN_STAGE = (context,obj,type) => {
  context.state.stageArr.map((data, index) => {
    if (data.id == obj[0].id) {
      if(type == 'undo') data.name = obj[0].startValue
      if (type == 'redo') data.name = obj[0].endValue
    }
  })
}
//资源的操作
export const STAGE_RESOURCE = (context,obj,type) => {//资源组件的撤销与反撤销
  if (type == 'undo') {
    if (obj[0].key == '资源重命名') {
      XPIXI.ResourceManager.getInstance().resourceList.map(node => {
        if (node.id == obj[0].id) {
          node.name = obj[0].startValue
        }
      })
    } else if (obj[0].key == '删除资源') {
      XPIXI.ResourceManager.getInstance().resourceList.splice(obj[0].index,0,obj[0].startValue)
    }
    // console.log(XPIXI.ResourceManager.getInstance().resourceList);
  } else if (type == 'redo') {
    if (obj[0].key == '资源重命名') {
      XPIXI.ResourceManager.getInstance().resourceList.map(node => {
        if (node.id == obj[0].id) node.name = obj[0].endValue
      })
    } else if (obj[0].key == '删除资源') {
      XPIXI.ResourceManager.getInstance().resourceList.splice(obj[0].index,1)
    }
  }
}

export const ADD_STAGE = (context,obj,type)=>{//添加舞台的撤销和反撤销
  if (type == "undo") {
    context.state.stageArr.map((stage,i) => {
      if (stage.id == obj[0].startValue.id) {
        if (obj[0].startValue.id == context.state.stageObj.id) {
          context.state.stageObj = context.state.stageArr[0]
          context.state.rootStageObj = context.state.stageArr[0]
        }
        context.state.stageArr.splice(i,1)
      }
    })
  } else if (type == "redo") {
    context.state.stageArr.push(obj[0].startValue);
  }
  //添加舞台
};

const group = (context, obj, type) => {
  let list = [];
  obj[0].id.map(item => list.push(getObj(context.state.rootStageObj, item)));
  let parent = list[0].parent;
  let newContainer = new XPIXI.Container(obj[0].json)
  parent.addChild(newContainer);
  parent.setChildIndex(newContainer, Math.min.apply(null, obj[0].index));
  obj[0].id.map(obj => {
    parent.children.map((child, i) =>{
      if(child.id === obj){
        parent.children.splice(i, 1)[0];
      }
    })
  });
  context.state.selectorObj.clearSelectList();
  context.state.selectorObj.selectList = newContainer;
}

const cancelGroup = (context, obj, type) => {
  let targetObj = getObj(context.state.rootStageObj,obj[0].id[0]).parent;
  let parent = targetObj.parent;
  obj[0].id.map(id =>{
    let childObj = getObj(context.state.rootStageObj,id);
    let position = childObj.getGlobalPosition();
    let tran = childObj.worldTransform.clone();
    let pwt  = parent.worldTransform.clone();
    parent.addChild(childObj);
    childObj.transform.setFromMatrix(tran.append(pwt.invert()));
    Object.assign(childObj.position,parent.toLocal({x:position.x,y:position.y}));
  });
  // 设置图层层级
  obj[0].index.map((item, i) => {
    let child = getObj(context.state.rootStageObj,obj[0].id[i]);
    parent.setChildIndex(child, item);
  })
  context.commit("STAGE_OBJ",parent);
  parent.removeChild(targetObj);
  console.log(parent)
  context.commit("SET_SELECT_TYPE",{type:2});
  context.state.selectorObj.clearSelectList();
  
  obj[0].id.map((obj)=>{
    context.state.selectorObj.selectList = getObj(context.state.rootStageObj,obj);
  })
  context.commit("SET_SELECT_TYPE",{type:1});
}

export const GROUP = (context,obj,type)=>{
  if (type == 'undo') {
    cancelGroup(context,obj,type)
    // console.log(obj);
  } else if (type == 'redo'){
    group(context,obj,type)
  }
};

export const CANCEL_GROUP = (context, obj,type)=>{
  if (type == 'redo') {
    cancelGroup(context,obj,type)
  } else if (type == 'undo'){
    group(context,obj,type)
    // console.log(obj);
  }
};

export const CHANGE_STAGE_LAYER = (obj,type)=>{
  //改变舞台层级
};
