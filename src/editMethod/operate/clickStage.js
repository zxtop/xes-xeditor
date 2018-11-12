import {createEventObj} from "../createEditEvent";

export const mousesDownStage = (context,paramerer)=>{
  // console.log(context,paramerer);
  if(paramerer&&paramerer.event){//这里的是pixi事件；
    // console.log(paramerer)
    let moveTarget={};
    let event = paramerer.event;
    moveTarget.isDown = true;
    moveTarget.beginX = event.originalEvent.clientX;
    moveTarget.beginY = event.originalEvent.clientY;

    let stage = context.state.stageObj;
    let dataEvent = createEventObj({ev:event},stage);
    let target = dataEvent.stageLayerObj;
    if(target&&!context.state.stageMove){//有点击到舞台目标
      if(target.id===context.state.rootStageObj.id||target.id===context.state.stageObj.id){
        moveTarget.type = "targetIsStage";
        context.state.selectorObj.selectList =context.state.rootStageObj;
      }else if(target.edit.layer.lock||target.edit.layer.hide){//目标不可选中
        moveTarget.type = "targetNoMove";
        context.state.selectorObj.selectList =context.state.rootStageObj;
      }else{
        if(context.state.selectorObj.inSelect(target.id)>=0){//目标属于当前选择列表中的元素
          moveTarget.type = "moreMove"
        }else{
          context.state.selectorObj.clearSelectList();
          context.state.selectorObj.selectList = target;
          moveTarget.type = "move";
        }
      }
      let selectEdit=context.state.selectorObj.editSelect();
      moveTarget.selectEdit = selectEdit;
    }else if(context.state.stageMove){//当前是拖动舞台
      let stageStartPosition = {x:context.state.rootStageObj.x,y:context.state.rootStageObj.y};
      moveTarget.stageStartPosition = stageStartPosition;
    }else{
       moveTarget.type = "noTarget";
      context.state.selectorObj.selectList =context.state.rootStageObj;
    }
    context.state.moveTargetObj = moveTarget;
    context.state.selectorObj.clickId = paramerer.event.id
    // console.log(moveTarget,"点击结果");
  }
};


export const ctrlMouseDownStage = (context,paramerer)=>{
  if(paramerer&&paramerer.event){
    let stage = context.state.stageObj;
    let dataEvent = createEventObj({ev:paramerer.event},stage);
    // console.log(dataEvent);

    let target = dataEvent.stageLayerObj;
    if(target&&!context.state.stageMove){
      if(target.edit.layer.lock||target.edit.layer.hide){
        // console.log("元素不可以选中")
      }else{
        // console.log("多选情况")
          context.state.selectorObj.selectType=2;
          context.state.selectorObj.selectList = target;
          context.state.selectorObj.selectType=1;
          // console.log(context.state.selectorObj)
      }
    }
  }
};



export const dblclickStage = (context,paramerer)=>{
  if(paramerer&&paramerer.event){
    let noDblclick = context.state.stageMove;
    if(noDblclick){return}
    let stage = context.state.stageObj;
    let dataEvent = createEventObj({ev:paramerer.event},stage);
    let target = dataEvent.targetObj;
    let stageLayer = dataEvent.stageLayerObj;
    if(target){
      if(stageLayer.edit.layer.hide||stageLayer.edit.layer.lock){//元素不可操作
        return;
      }if(stageLayer.id === target.id&&target.type === context.state.typeObj.typeElement.TEXT){//双击当前input
        let maxX = parseFloat(target.x) + parseFloat(target.width);
        let maxY = parseFloat(target.y) + parseFloat(target.height); 
        let x = parseFloat(event.target.width);
        let y = parseFloat(event.target.height);
        if(maxX >= x || maxY >= y){
          // context.commit("ALERT", { data: "文本框超出编辑范围，请拖回舞台", this:{$store:context} });
          alert("文本框超出编辑范围，请将文本拖回舞台编辑，或在属性面板编辑")
        }else{
          context.commit("SET_INPUT_EDIT", { obj:stageLayer});
        }
        context.commit("SET_SELECT_LIST", { obj: stageLayer });
      }else if(stageLayer.id===stage.id&&stageLayer.type!==context.state.typeObj.typeElement.STAGE){//退组
        context.commit("STAGE_OBJ",stage.parent);
      }else if(eval(stageLayer.type) === eval(context.state.typeObj.typeElement.CONTAINER)){//进组
        context.commit("STAGE_OBJ", stageLayer);
        context.state.selectorObj.clearSelectList();
        context.commit("SET_SELECT_TYPE",{type:2});
        stageLayer.children.map((obj)=>{
          context.commit("SET_SELECT_LIST",{obj:obj});
        });
        context.commit("SET_SELECT_TYPE",{type:1});
      }
    }else {
      if (stage.parent) {//退组
        context.commit("STAGE_OBJ", stage.parent)
      }
    }
  }
};
