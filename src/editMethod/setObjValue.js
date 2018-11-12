import {getValue} from "./getObjValue";
import {Atom,Active} from "./undo";
import {addStack} from "./undo";
// isStack:{modifyState:bool,startContent:this.RatioWidth}

export const setValue = (runObj,key,value,isStack,state) =>{
  let numTypeArr=["x","y","width","fontSize","height","leading","letterSpacing"];
  let setValue  = numTypeArr.indexOf(key)>=0?value*1:value;
  if(key==="x"||key==="y"){
    setPosition(runObj,key,setValue);
  }else if(key==="width"||key==="height"){
    setWidthHeight(runObj,key,setValue);
  }else if(key==="rotation"){
    setRotation(runObj,key,value);
  }else if(key === "pivot"){
    setPivot(runObj,key,value);
  }else if(key==="scale"){
    Object.assign(runObj.scale,setValue);
  }else if(key in runObj){
    runObj[key]= setValue;
  }else if("style" in runObj && key in runObj.style){
    runObj.style[key]= setValue
  }else if(key === 'imageUrl'){
    runObj.changeImg(value);
  }else{
    console.error("setValue方法没有找到"+key+"属性");
  }
  if(isStack&&isStack.modifyState){
    if (value == isStack.startContent) return;
      let stack = new Active("通过属性面板更改","CHANGE_PROPERTY");
      stack.list.push(new Atom({id:runObj.id,key:key,startValue:isStack.startContent,endValue:value}));
      state.stack.add(state.rootStageObj.id,stack);
    }
};


//改变xy值
export const setPosition=(obj,key,value)=>{
  if(obj.edit.control.permission[1]<1){return}//移动权限
  if(obj.parent){
    let pivot = obj.parent.toLocal(obj.pivot,obj,undefined,true);//中心点位置相父元素
    let zero = obj.parent.toLocal(obj.getBounds());//边界位置相对父元素
    obj[key] = value+pivot[key]-zero[key]
  }else{
    obj[key] = value;
  }
};


//大小更改权限
export const setWidthHeight=(obj,key,value)=>{
  if(obj.edit.control.permission[2]<1){return}
  obj[key] = value < 1 ? 1: value;
};


//旋转权限
export const setRotation = (obj,key,value)=>{
  if(obj.edit.control.permission[3]<1){return}
  obj.rotation = value;
};


//设置对象旋转中心位置
export const setPivot = (obj,key,value)=>{
  let pointPivot = obj.toLocal({x:value.x,y:value.y});
  let num = obj.width * 0.05 >= 15 ? 15 : (obj.width * 0.05 < 10 ? 10 : obj.width * 0.05);
  let width = obj.width/Math.abs(obj.scale.x);
  let height= obj.height/Math.abs(obj.scale.y);
  let px = pointPivot.x;
  let py = pointPivot.y;
  if(px > - num && px < num){ //吸附左边 上中下
    if(py > -num && py < num){
      pointPivot.x = 0;
      pointPivot.y = 0;
    }else if(py > height / 2 - num && py < height / 2 + num ){
      pointPivot.x = 0;
      pointPivot.y = height / 2;
    }else if(py > height - num && py < height + num ){
      pointPivot.x = 0
      pointPivot.y = height;
    }
  }else if(px > width / 2 - num && px < width / 2 + num){ //吸附中间 上中下
    if(py > -num && py < num){
      pointPivot.x = width / 2;
      pointPivot.y = 0;
    }else if(py > height / 2 - num && py < height / 2 + num ){
      pointPivot.x = width / 2;
      pointPivot.y = height / 2;
    }else if(py > height -num && py < height + num ){
      pointPivot.x = width / 2;
      pointPivot.y = height;
    }
  }else if(px > width - num && px < width + num){ //吸附右边 上中下
    if(py > -num && py < num){
      pointPivot.x = width;
      pointPivot.y = 0;
    }else if(py > height / 2 - num && py < height / 2 + num ){
      pointPivot.x = width;
      pointPivot.y = height / 2;
    }else if(py > height - num && py < height + num ){
      pointPivot.x = width;
      pointPivot.y = height;
    }
  }
  // if(pointPivot.x > width-num && pointPivot.x < width + num){pointPivot.x = width}
  // if(pointPivot.x>width/2-num&&pointPivot.x<width/2+num){pointPivot.x=width/2}
  // if(pointPivot.y>-num&&pointPivot.y<num){pointPivot.y=0}
  // if(pointPivot.y>height-num&&pointPivot.y<height+num){pointPivot.y=height}
  // if(pointPivot.y>height/2-num&&pointPivot.y<height/2+num){pointPivot.y=height/2}
  let pointPosition = obj.parent.toLocal(obj.toGlobal(pointPivot));
  Object.assign(obj.pivot,pointPivot);
  Object.assign(obj.position,pointPosition);
};
