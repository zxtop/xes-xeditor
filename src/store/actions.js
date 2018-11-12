import {KeyMap} from "../editMethod/keyMap/KeyMap";
import {align} from "../editMethod/operate/align";
import {create} from "../editMethod/operate/create";
import {changeStageScale,copy,checkAll,cancelCheckAll,checkDown,checkUp} from "../editMethod/operate/sundry";
import {undo,redo,addStack} from "../editMethod/undo";
import {deleteElement} from "../editMethod/operate/delete";
import {changeLayer} from "../editMethod/operate/moveLayer";
import {editLimits} from "../editMethod/operate/editLimits";
import {mousesDownStage,dblclickStage,ctrlMouseDownStage} from "../editMethod/operate/clickStage";
import {mouseMoveFun,mousesUpStage,mouseDownFun,mouseWheelFun} from "../editMethod/operate/mouseMove";
import {deleteStage,addStage,moveStageLayer,renStage} from "../editMethod/operate/moreStageEdit";
import {group,cancelGroup} from "../editMethod/operate/group";
import {stageResource} from "../editMethod/operate/resource";



// 响应doument事件,
export const DOCUMENT_ACTIVE = (context,ev)=>{
    let event = new KeyMap() ;event.transformEvent(ev);
    let dom = document.getElementById("selectRect");
    
    
    if(((ev.target.nodeName==="TEXTAREA" || ev.target.nodeName === "INPUT") && ev.type === "mousemove" &&  !dom) 
    || (ev.target.nodeName==="INPUT" && (ev.type !== "mousemove")) 
    || (ev.target.nodeName==="TEXTAREA" && ev.type !== "mousemove" &&  ev.type !== "mouseup") 
    || ev.target.className.split(' ')[0] === "el-select-dropdown__item"
    || ev.target.className.split(' ')[0] === "node-span"){
    }else{
      ev.returnValue=false;
      let command = event.seekCommand();
      if(command){
        command.command.map((com)=>{
          context.dispatch(com,{event:ev});
        });
      }
    }
};


// 响应stage区域事件
export const STAGE_ACTIVE = (context,ev)=>{
  // console.log(ev);
    let event = new KeyMap("stage");
    event.transformEvent(ev.originalEvent);
    let command = event.seekCommand();
    if (command){
      command.command.map((com) =>{
        console.log(com)
        context.dispatch(com,{event:ev})
      });
    }
};



// 空格判断是否拖动舞台
export const SPACEBAR_DOWN =(context,paramerer)=>{
  context.state.stageMove = true;
};
export const SPACEBAR_UP = (context,paramerer)=>{
  context.state.stageMove = false;
};



// 鼠标拖动,框选，拖动舞台
export const MOUSE_MOVE =(context,paramerer)=>{
  mouseMoveFun(context,paramerer);
};
export const MOUSE_UP = (context,paramerer) =>{
  mousesUpStage(context,paramerer);
};
export const MOUSE_DOWN = (context,paramerer)=>{
  mouseDownFun(context,paramerer);
};
export const MOUSE_WHEEL = (context,paramerer)=>{
  mouseWheelFun(context,paramerer);
};




// 鼠标选择
export const SELECT_ONE = (context,paramerer)=>{
  // console.log(context,paramerer);
  mousesDownStage(context,paramerer)
};
//多选
export const SELECT_MORE = (context,paramerer)=>{
  // console.log(paramerer);
  ctrlMouseDownStage(context,paramerer)
};
//舞台双击
export const STAGE_DBLCLICK = (context,paramerer)=>{
  dblclickStage(context,paramerer)
};



//添加需要撤销的操作步骤{id:,content:[]}
export const ADD_STACK = (context,stackParamerer) =>{
  // console.log(stackParamerer)
  addStack(context,stackParamerer);
};
//撤销{id:}
export const UNDO = (context,undoParamerer)=>{
undo(context,undoParamerer)
};
//反撤销{id:}
export const REDO = (context,redoParamerer)=>{
  redo(context,redoParamerer)
};



//复制{copyList:[]}
export const COPY = (context,copyParamerer)=>{
  copy(context,copyParamerer);
};
//粘贴
export const PASTE = (context,pasteParamerer)=>{
  create(context,{base:context.state.copyObjArr})
};
//创建元素
export const CREATE_ELEMENT = (context,createParameter)=>{
  return create(context,createParameter)
};
//删除元素
export const DELETE = (context,deleteParamerer)=>{
  deleteElement(context,deleteParamerer);
};
//创建一个文本
export const CREATE_TEXT = (context,paramerer) =>{
  create(context,{type:"text"})
};



//四个方向键控制元素位置
export const MOVE_UP = (context,paramerer)=>{
  context.commit("SET_SELECT_OBJ_VALUE", { arr:context.state.selectorObj.selectList, key: "y", addValue:-1});
};
export const MOVE_DOWN = (context,paramerer)=>{
  context.commit("SET_SELECT_OBJ_VALUE", { arr:context.state.selectorObj.selectList, key: "y", addValue:1});
};
export const MOVE_LEFT = (context,paramerer)=>{
  context.commit("SET_SELECT_OBJ_VALUE", { arr:context.state.selectorObj.selectList, key: "x", addValue:-1});
};
export const MOVE_RIGHT = (context,paramerer)=>{
  context.commit("SET_SELECT_OBJ_VALUE", { arr:context.state.selectorObj.selectList, key: "x", addValue:1});
};






//锁定元素
export const LOCK = (context,lockParamerer)=>{
  let list;
  if(lockParamerer){
    list = lockParamerer.list
  }
  editLimits(context,{type:"lock",list:list});
};
//隐藏元素
export const HIDE = (context,hideParamerer)=>{
  Object.assign(hideParamerer,{type:"hide"});
  editLimits(context,hideParamerer);
};
//锁定全部
export const LOCK_ALL = (context,lockParamerer)=>{
  Object.assign(lockParamerer,{type:"lockAll",value:true});
  editLimits(context,lockParamerer);
};
//隐藏全部
export const HIDE_ALL = (context,hideParamerer)=>{
  Object.assign(hideParamerer,{type:"hideAll",value:true});
  editLimits(context,hideParamerer);
};
//全部取消锁定
export const CENCEL_LOCK_ALL = (context,lockParamerer)=>{
  Object.assign(lockParamerer,{type:"lockAll",value:false});
  editLimits(context,lockParamerer);
};
//全部取消隐藏
export const CENCEL_HIDE_ALL = (context,hideParamerer)=>{
  Object.assign(hideParamerer,{type:"hideAll",value:false});
  editLimits(context,hideParamerer);
};





//选择上一个
export const CHECK_UP = (context, checkParamerer)=>{
  checkUp(context,checkParamerer)
}
//选择下一个
export const CHECK_DOWN = (context, checkParamerer)=>{
  checkDown(context,checkParamerer)
}
//全选
export const CHECK_ALL = (context,checkParamerer)=>{
  checkAll(context,checkParamerer)
};
//取消全选
export const CANCEL_CHECK_ALL = (context,checkParamerer)=>{
  cancelCheckAll(context,checkParamerer)
};




//对齐
export const ALIGN_ACTION = (context, direction)=>{
  align(context,{direction:direction})
};
//左对齐
export const ALIGN_LEFT = (context)=>{
  align(context,{direction:"left"})
};
//右对齐
  export const ALIGN_RIGTH = (context) => {
    align(context, {direction: 'right'})
  }
//上对齐
  export const ALIGN_TOP = (context) => {
    align(context, {direction: 'top'})
  }
//下对齐
  export const ALIGN_BOTTOM = (context) => {
    align(context, {direction: 'bottom'})
  }
//垂直对齐
  export const ALIGN_VERTICAL = (context) => {
    align(context, {direction: 'vertical'})
  }
//水平对齐
  export const ALIGN_LEVEL = (context) => {
    align(context, {direction: 'level'})
  }
//垂直均匀分布
  export const ALIGN_VERTICAL_DISTRIBUTION = (context) => {
    align(context, {direction: 'verticalIsometric'})
  }
//水平均匀分布
  export const ALIGN_LEVEL_DISTRIBUTION = (context) => {
    align(context, {direction: 'levelIsometric'})
  }

//上移一个图层
  export const MOVE_LAYR = (context, paramerer) => {
    changeLayer(context, paramerer)
  }
  export const UP_LAYER = (context, layerParamerer) => {
    changeLayer(context, {type: 'up'})
  }
//下移一个图层
  export const DOWN_LAYER = (context, layerParamerer) => {
    changeLayer(context, {type: 'down'})
  }
//顶层
  export const STAER_LAYER = (context, layerParamerer) => {
    changeLayer(context, {type: 'top'})
  }
//底层
  export const END_LAYER = (context, layerParamerer) => {
    changeLayer(context, {type: 'bottom'})
  }

// 缩放舞台
  export const SCALE_STAGE = (context, scaleParamerer) => {
    changeStageScale(context, {scaleX: scaleParamerer.scaleX, scaleY: scaleParamerer.scaleY})
  }
//舞台放大
  export const BLOWUP_STAGE = (context) => {
    changeStageScale(context, {type: 'blowup'})
  }
//舞台缩小
  export const REDUCE_STAGE = (context) => {
    changeStageScale(context, {type: 'reduce'})
  }

//删除舞台
  export const DELETE_STAGE = (context, paramerer) => {
    deleteStage(context, paramerer)
  }
//舞台重命名
  export const REN_STAGE = (context, paramerer) => {
    renStage(context, paramerer)
  }
//新增舞台
  export const ADD_STAGE = (context, paramerer) => {
    addStage(context, paramerer)
  }
  export const MOVE_STAGE_LAYER = (context, paramerer) => {
    moveStageLayer(context, paramerer)
  }
  export const NEW_TEXT = (context, createParameter) => {
    if(context.state.selectorObj.selectList[0] && !context.state.selectorObj.selectList[0].parent) {
      createParameter.type = "text";
      return create(context,createParameter)
    }

  }
//资源组件的操作
export const STAGE_RESOURCE = (context,paramerer) => {
  stageResource(context,paramerer)
}
//打组
  export const GROUP = (context, paramerer) => {
    console.log(paramerer);
    group(context, paramerer)
  }
//拆组
  export const CANCEL_GROUP = (context, paramerer) => {
    cancelGroup(context, paramerer)
  }
