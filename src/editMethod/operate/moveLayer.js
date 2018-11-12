import {Atom,Active} from "../undo";

let stack;
export const changeLayer = (context,paramerer)=>{
  let list = paramerer.list||context.state.selectorObj.selectList;
  let index = paramerer.index;
  let type = paramerer.type;
  stack = new Active("元素层级改变","CHANGE_LAYER");
  if(type==="top"||type==="bottom"){
    top(context,list,type);
  }else if(type ==="up"||type==="down"){
    up(context,list,type);
  }else if(index>=0){
    if(list.length===1&&list[0].id!==context.state.rootStageObj.id){
      setLayer(context,list[0],index);
      context.dispatch("ADD_STACK",{content:stack});
    }
  }
};



const up = (context,list,type)=>{
  let indexArr=[];
  let parent = list[0].parent;
  let len = parent.children.length-1;
  let len1 = list.length-1;
  let move = true;
  let upList = [...list].sort((a, b) =>{
    return parent.getChildIndex(a) - parent.getChildIndex(b);
  });
  upList.map((obj)=>{
    let index = parent.getChildIndex(obj);
    indexArr.push(index);
    let a  = type==="up"?index+1:index-1;
    if(a<0||a>len){move = false}
  });

  if(move){
    upList.map((obj,i)=>{
      let index = type==="up"?indexArr[len1-i]+1:indexArr[i]-1;
      let target = type==="up"?upList[len1-i]:obj;
      if(index<0){
        index = 0;
      }else if(index>len){
        index = len;
      }
      setLayer(context,target,index)
    });
    context.dispatch("ADD_STACK",{content:stack});
  }
};


const top = (context,list,type)=>{
  if(list.length===1&&list[0].id!==context.state.rootStageObj.id){
    let parent=list[0].parent;
    let index = type==="top"?parent.children.length-1:0;
    setLayer(context,list[0],index);
    context.dispatch("ADD_STACK",{content:stack});
  }
};

const setLayer=(context,target,index)=>{
  let startValue = target.parent.getChildIndex(target);
  stack.list.push(new Atom({id:target.id,startValue:startValue,endValue:index}));
  target.parent.setChildIndex(target,index);
};





