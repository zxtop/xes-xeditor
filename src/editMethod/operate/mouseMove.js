
import {drawRect,rectSelect} from "../selectTarget/moreSelect";
import {Atom,Active} from "../undo";


let moveStatus,moveType,keyArr=[],rectOk = {};
export const mouseMoveFun = (context,paramerer)=>{
  moveStatus=context.state.moveTargetObj;
  let event = paramerer.event;
  let beginX = moveStatus.beginX,beginY=moveStatus.beginY,nowX = event.clientX,nowY = event.clientY;
  let scale=context.state.stageParentSize.scale;
  let moveList,endX,endY,selectEdit,beginPositionToParent,nowPositionTopParent;
  keyArr=[];
  if(moveStatus.type==="move"||moveStatus.type==="moreMove"){
    moveType = "moveSelect";
    selectEdit = moveStatus.selectEdit;
    moveList = context.state.selectorObj.selectList;
    beginPositionToParent = moveList[0].parent.toLocal({ x:beginX, y:beginY});//如果拖元素
    nowPositionTopParent = moveList[0].parent.toLocal({ x:nowX, y:nowY});
    moveList.map((obj,i)=>{
      endX = selectEdit.arr[i].x1+(nowPositionTopParent.x-beginPositionToParent.x)/scale;
      endY = selectEdit.arr[i].y1+(nowPositionTopParent.y-beginPositionToParent.y)/scale;
      setObj(context,obj,"x",endX,selectEdit.arr[i].x1);
      setObj(context,obj,"y",endY,selectEdit.arr[i].y1);
    })
  }else if(context.state.stageMove&&moveStatus.isDown){//拖动舞台的位置
    moveType = "moveStage";
    let stageStartPosition = moveStatus.stageStartPosition;
    endX = (nowX-beginX)/scale+stageStartPosition.x;
    endY = (nowY-beginY)/scale+stageStartPosition.y;
    setObj(context,context.state.rootStageObj,"x",endX,stageStartPosition.x);
    setObj(context,context.state.rootStageObj,"y",endY,stageStartPosition.y);
  }else if(moveStatus.type==="targetIsStage"||moveStatus.type==="targetNoMove"||moveStatus.type ==="noTarget"||rectOk.type==="rectOk"){//框选
    drawRect({x:beginX||rectOk.beginX,y:beginY||rectOk.beginY},nowX,nowY);
    rectSelect(context);
  }
};
const setObj = (context,obj,key,endValue,startValue)=>{
  if(endValue===startValue){
  }else{
    keyArr.push(key);
    context.commit("SET_SELECT_OBJ_VALUE", {arr:[obj], key:key, value:endValue});
  }
};


export const mousesUpStage=(context,paramerer)=>{
  context.state.moveTargetObj = {};
  rectOk = {};
  let dom  = document.getElementById("selectRect");
  if(dom){//框选
    dom.parentNode.removeChild(dom);
  }else{//拖动
     let stack = new Active("拖动元素","CHANGE_PROPERTY");
     if(moveType==="moveStage"){
       let stage = context.state.rootStageObj;
       let startPosition = moveStatus.stageStartPosition;
       keyArr.map((key,i)=>{
         console.log(startPosition,key)
         stack.list.push(new Atom({id:stage.id,key:key,startValue:startPosition[key],endValue:stage[key]}))
       })
     }else if(moveType==="moveSelect"){
       let starPosition = moveStatus.selectEdit;
       let endPosition = context.state.selectorObj.editSelect();
       context.state.selectorObj.selectList.map((obj,i)=>{
         keyArr.map((key)=>{
             stack.list.push(new Atom({id:obj.id,key:key,startValue:starPosition.arr[i][key+1],endValue:endPosition.arr[i][key+1]}))
         })
       });
     }
     if(stack.list.length>0){
       context.dispatch("ADD_STACK",{content:stack});
     }
  }
};


export const mouseDownFun = (context,paramerer)=>{
  context.state.stagePageFoucs = false;
  context.commit("SET_INPUT_EDIT",{obj:null});
  if(paramerer.event.target.className==="contentBox"){
    context.state.selectorObj.selectList = context.state.rootStageObj;
    rectOk.beginX = paramerer.event.clientX;
    rectOk.beginY = paramerer.event.clientY;
    rectOk.type = "rectOk";
  }
  let blur = (dom) => {
    if (dom && dom.nodeType === 1 && dom.tagName === 'INPUT' || dom.tagName === 'TEXTAREA') dom.blur();
    var i = 0, childNodes = dom.childNodes, item;
    for(; i < childNodes.length; i++) {
      item = childNodes[i];
      if (item.nodeType === 1) blur(item)
    }
  }
  if (event.target.nodeName !== "TEXTAREA" && event.target.nodeName !== "INPUT") blur(event.path[event.path.length - 2])
};


export const mouseWheelFun=(context,paramerer)=>{
  if(context.state.stageMove){
    let target = context.state.rootStageObj;
    let scaleX,scaleY;
    scaleX = target.scale.x+paramerer.event.deltaY/1000;
    scaleY = target.scale.y+paramerer.event.deltaY/1000;
    context.dispatch("SCALE_STAGE",{scaleX:scaleX,scaleY:scaleY});
  }
};
