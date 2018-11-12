/**
 @Author: swls
 */
import * as fun  from "./undeRedoFun"
export const addStack = (context,addParamerer)=>{
  let id = addParamerer.id||context.state.rootStageObj.id;
  let content = addParamerer.content||[];
  // console.log("添加栈",id,content);
  context.state.stack.add(id,content);
};

export const undo = (context,undoParamerer)=>{
  // console.log(undoParamerer);
  let undoContent, id;
  if (context.state.stagePageFoucs == 'resource') {//如果撤销的是资源组件
    undoContent = context.state.stack.undo('resource')
  } else if (context.state.stagePageFoucs === true) {//如果撤销的是页面的操作
    undoContent = context.state.stack.undo()
  } else {//如果是舞台内元素的操作
    id = undoParamerer.id||context.state.rootStageObj.id;
    undoContent = context.state.stack.undo(id);
  }
  // console.log("撤销内容",undoContent);
  if(undoContent){
    fun[undoContent.activeType](context,undoContent.list,"undo")
  }
};

export const redo = (context,redoParmerer)=>{
  let redoContent, id;
  if (context.state.stagePageFoucs == 'resource') {//如果撤销的是资源组件
    redoContent = context.state.stack.redo('resource');
  } else if (context.state.stagePageFoucs === true) {//如果撤销的是页面的操作
    redoContent = context.state.stack.redo();
  } else {//如果是舞台内元素的操作
    id = redoParmerer.id||context.state.rootStageObj.id;
    redoContent = context.state.stack.redo(id);
  }
  // console.log("反撤销内容",redoContent);
  if(redoContent){
     // console.log(redoContent.activeType);
    fun[redoContent.activeType](context,redoContent.list,"redo")
  }
};
