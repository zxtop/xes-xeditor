import {getMoreBounds} from "../common";
import {Atom,Active} from "../undo";

//left ,right,top,bottom,vertical,level,verticalIsometric,levelIsometric

export const align = (context, editParameter)=>{
  let direction = editParameter.direction;
  let stage = context.state.stageObj;
  let list = context.state.selectorObj.selectList;
  let selectEdit = context.state.selectorObj.editSelect();
  let stack = new Active("对齐操作","CHANGE_PROPERTY",context.state.rootStageObj.id);
  if (!selectEdit.move){return}
  let topList = [...list].sort((a, b) =>{
    return a.y - b.y;
  });
  let leftList = [...list].sort((a, b) =>{
    return a.x - b.x;
  });
  let rect = getMoreBounds(list);
  let width = rect.width, height = rect.height, minX = rect.x-stage.x, minY = rect.y-stage.y, maxX = minX + width, maxY = minY + height;
  if (list.length === 1) {
    let obj = list[0],key,value,startValue;
    if (direction === "left") {
      key = "x";value = 0; startValue = selectEdit.arr[0].x1;
    } else if (direction === "right") {
      key = "x";value = (stage.width - width)/stage.scale.x;startValue = selectEdit.arr[0].x1;
    } else if (direction === "top") {
      key = "y";value = 0;startValue = selectEdit.arr[0].y1;
    } else if (direction === "bottom"){
      key = "y";value = (stage.height - height)/stage.scale.y;startValue = selectEdit.arr[0].y1;
    } else if (direction === "vertical"){
      key = "x";value = (stage.width / 2 - width / 2)/stage.scale.x;startValue = selectEdit.arr[0].x1;
    } else if (direction === "level"){
      key = "y";value = (stage.height / 2 - height / 2)/stage.scale.y;startValue = selectEdit.arr[0].y1;
    }
    setObj(obj,key,value,startValue)
  } else if (list.length > 1){
    let positionX = minX;
    let positionY = minY;
    let intervalX =  (rect.width - rect.sumWidth)/(list.length-1);
    let intervalY =  (rect.height - rect.sumHeight)/(list.length-1);
    let targetObj,key,value,startValue;
    list.map((obj,index)=>{
      targetObj = obj;
      if (direction === "left"){
        key = "x";value = minX/stage.scale.x;startValue = selectEdit.arr[index].x1;
      } else if (direction === "right"){
        key = "x";value =  (maxX - obj.getBounds(true).width)/stage.scale.x;startValue = selectEdit.arr[index].x1;
      } else if (direction === "top"){
        key = "y"; value = minY/stage.scale.y;startValue = selectEdit.arr[index].y1;
      } else if (direction === "bottom") {
        key = "y"; value = (maxY - obj.getBounds(true).height)/stage.scale.y;startValue = selectEdit.arr[index].y1;
      } else if (direction === "vertical"){
        key = "x"; value = ((minX + maxX) / 2 - obj.getBounds(true).width / 2)/stage.scale.x;startValue = selectEdit.arr[index].x1;
      } else if (direction === "level") {
        key = "y"; value = ((minY + maxY) / 2 - obj.getBounds(true).height / 2)/stage.scale.y;startValue = selectEdit.arr[index].y1;
      } else if (direction === "verticalIsometric"){
        targetObj = leftList[index]; key = "x"; value = positionX/stage.scale.x;startValue = context.state.selectorObj.editSelect(leftList).arr[index].x1;
        positionX=positionX+leftList[index].getBounds(true).width+intervalX;
      } else if (direction === "levelIsometric") {
        targetObj = topList[index]; key = "y"; value = positionY/stage.scale.y;startValue = context.state.selectorObj.editSelect(topList).arr[index].y1;
        positionY = positionY + topList[index].getBounds(true).height+intervalY;
      }
      setObj(targetObj,key,value,startValue)
    });
  }


  function setObj(obj,key,value,startValue){
    if(key){
      context.commit("SET_SELECT_OBJ_VALUE", {arr:[obj], key:key, value:value});
      stack.list.push(new Atom({id:obj.id,key:key,startValue:startValue,endValue:value}))
    }
  }
  if(stack.list.length>0){
    let boolr = true;
    stack._list.map((obj) => {
      if (obj.startValue != obj.endValue) boolr = false;
    })
    if (!boolr) context.dispatch("ADD_STACK",{content:stack});
  }
};


