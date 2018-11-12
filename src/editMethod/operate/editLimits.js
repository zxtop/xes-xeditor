import {Atom,Active} from "../undo";

let stack;
export const editLimits = (context,paramerer)=>{
   let type = paramerer.type||undefined;
   let value = paramerer.value||false;
   let list = paramerer.list||context.state.selectorObj.selectList;
  if(type==="lock"){
    lock(context,list);
  }else if(type==="hide"){
    hide(context,list);
  }else if(type==="lockAll"){
     lockAll(context,value)
  }else if(type==="hideAll"){
    hideAll(context,value)
  }
  if(stack.list.length > 0) {
    context.dispatch("ADD_STACK",{content:stack});
    context.state.selectorObj.clearSelectList();
  }
};


export const lock = (context,list)=>{
  stack = new Active("锁定元素","LOCK",context.state.rootStageObj.id);
  let isLock;
    list.map((obj)=>{
      if(obj.id === context.state.rootStageObj.id){return}
      stack.list.push(new Atom({id:obj.id,key:"lock",startValue:obj.edit.layer.lock,endValue:!obj.edit.layer.lock}));
      obj.edit.layer.lock = !obj.edit.layer.lock;
      isLock = obj.edit.layer.lock;
    });
  setSelect(context,list,isLock);
};

export const hide = (context,list)=>{
  stack = new Active("锁定隐藏","HIDE",context.state.rootStageObj.id);
  let isHide;
    list.map((obj)=>{
      if(obj.id === context.state.rootStageObj.id){return}
      stack.list.push(new Atom({id:obj.id,key:"hide",startValue:obj.edit.layer.hide,endValue:!obj.edit.layer.hide}));
      obj.edit.layer.hide = !obj.edit.layer.hide;
      obj.hide = !obj.hide;
      isHide = obj.hide;
    });
  setSelect(context,list,isHide);
};

export const lockAll=(context,value)=>{
  stack = new Active("锁定所有","LOCK",context.state.rootStageObj.id);
  context.state.stageObj.children.map((obj)=>{
    if(obj.id === context.state.rootStageObj.id){return}
    stack.list.push(new Atom({id:obj.id,key:"lock",startValue:obj.edit.layer.lock,endValue:value}));
    obj.edit.layer.lock = value
  });
  setSelect(context,[],true);
};

export const hideAll = (context,value)=>{
  stack = new Active("隐藏所有","HIDE",context.state.rootStageObj.id);
  context.state.stageObj.children.map((obj)=>{
    if(obj.id === context.state.rootStageObj.id){return}
    stack.list.push(new Atom({id:obj.id,key:"hide",startValue:obj.edit.layer.hide,endValue:value}));
    obj.edit.layer.hide = value;
    obj.hide = value;
  });
  setSelect(context,[],true);
};


export const setSelect = (context,list,isSelect)=>{
  if(isSelect){
    // context.state.selectorObj.clearSelectList();
    // context.state.selectorObj.selectList = context.state.rootStageObj;
  }else{
    // context.state.selectorObj.clearSelectList();
    // list.map((obj)=>{context.state.selectorObj.selectList = obj});
  }
};
