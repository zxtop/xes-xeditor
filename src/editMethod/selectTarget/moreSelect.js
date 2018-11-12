import {getMoreBounds} from "../common";
import {SAT} from 'xeslive_databox/src/math/arithmetic/SAT'
/**
 * 鼠标点击舞台拖动的时候绘制一个拖选框
 */
export const drawRect = (moveObj,nowX,nowY)=>{
  let stageParent = document.getElementById("stageParent");
  let fontSize = parseFloat(document.documentElement.style.fontSize);
  let left = stageParent.getBoundingClientRect().x;
  let top = stageParent.getBoundingClientRect().y;
  let width = parseFloat(stageParent.style.width) * fontSize;
  let height = parseFloat(stageParent.style.height) * fontSize;
  let rightMax = left + width ;
  let bottomMax = top + height ;
  nowX > rightMax ? nowX = rightMax : nowX;
  nowX < left ? nowX = left : nowX;
  nowY > bottomMax ? nowY = bottomMax : nowY;
  let dom = document.getElementById("selectRect");
  let widthDiffer = (nowX-moveObj.x);
  let heightDiffer= (nowY-moveObj.y);
  let stageDom = document.getElementById("app");
  let bound = stageDom.getBoundingClientRect();
  let x = (moveObj.x-bound.left),y=(moveObj.y-bound.top);
  let domObj={dom:null,top:0,left:0,width:0,height:0,position:"absolute",backgroundColor:"#ccc",opacity:0.5};
  if(dom){
    dom.style.width = Math.abs(widthDiffer)+"px";
    dom.style.height = Math.abs(heightDiffer)+"px";
    dom.style.left = Math.min(x,x+widthDiffer)+"px";
    dom.style.top = Math.min(y,y+heightDiffer)+"px";
  }else{
    let div = document.createElement("div");
    div.id="selectRect";
    div.style.position="absolute";
    div.style.backgroundColor="#ccc";
    div.style.opacity="0.5";
    stageDom.appendChild(div);
  }
  return domObj;
};


/**
 * 根据绘制的rect计算框选中的当前舞台对象
 * @param context
 */
export const rectSelect = (context)=>{
  let dom  = document.getElementById("selectRect");
  let stageParent = document.getElementById("stageParent");
  let top = stageParent.getBoundingClientRect().y;
  let left =  stageParent.getBoundingClientRect().x;
  let stageScale = context.state.stageParentSize.scale;
  let objArr=[];
  let sat = new SAT();
  if(dom){
    let minX = (parseFloat(dom.style.left)-left)/stageScale,minY = (parseFloat(dom.style.top)-top)/stageScale;
    let maxX = parseFloat(dom.style.width)/stageScale+minX,maxY = parseFloat(dom.style.height)/stageScale+minY;
    let rectangle = new sat.rectangle({x:minX,y:minY,width:maxX-minX,height:maxY-minY})
    context.state.selectorObj.clearSelectList();
    let hit = false;
    context.state.stageObj.children.map((obj,index)=>{
      hitTest(obj,sat,hit,rectangle,objArr,context)
    });
  }
  context.commit("SET_SELECT_TYPE",{type: 1});
  return objArr;
};
function findParent(obj,context){
  if(!(obj.parent===context.state.stageObj)){
    return findParent(obj.parent,context);
  }else{
    return obj;
  }
}
function hitTest(obj,sat,hit,rectangle,objArr,context){
      let p1 = obj.toGlobal({x:0,y:0},undefined,true);
      let p2 = obj.toGlobal({x:obj.width/Math.abs(obj.scale.x),y:0},undefined,true);
      let p3 = obj.toGlobal({x:obj.width/Math.abs(obj.scale.x),y:obj.height/Math.abs(obj.scale.y)},undefined,true);
      let p4 = obj.toGlobal({x:0,y:obj.height/Math.abs(obj.scale.y)},undefined,true);
      let polygon = new sat.polygon([[p1.x,p1.y],[p2.x,p2.y],[p3.x,p3.y],[p4.x,p4.y]]);
      if(rectangle.width > 0 || rectangle.height > 0){
        hit = sat.sat(rectangle,polygon)
      }
      if(hit){
        let sw = true;
        parent = findParent(obj,context);
        objArr.forEach((item)=>{
        if(item.id == parent.id){
          sw = false;
         }
        })
        if(sw){
          context.commit("SET_SELECT_TYPE",{type:2});
          context.commit("SET_SELECT_LIST",{obj:parent});
          objArr.push(parent);
        }
      }
    if(obj.children && obj.children.length > 0 ){
      obj.children.map((child)=>{
        hitTest(child,sat,hit,rectangle,objArr,context)
      })
    }
}
