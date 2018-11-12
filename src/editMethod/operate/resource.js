import {Atom,Active} from "../undo";
export const stageResource = (context,paramerer)=>{//资源组件的操作
  console.log(context,paramerer.type)
  let stack = new Active(paramerer.type,"STAGE_RESOURCE");
  stack.list.push(new Atom({key:paramerer.type,id:paramerer.id,startValue:paramerer.start,endValue:paramerer.end,index:paramerer.index}));
  context.state.stack.stageResourceAdd(stack);
};