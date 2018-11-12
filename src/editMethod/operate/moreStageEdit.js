import {Atom,Active} from "../undo";
export const deleteStage = (context,paramerer)=>{
    let id = paramerer.id;
    let list =   context.state.stageArr;
    if(list.length ===1){console.log("最后一个舞台不能删除");return}
    list.map((obj,i)=>{
      if(obj.id===id){
        let stack = new Active("删除舞台", "DELETE_STAGE");
        stack.list.push(new Atom({startValue: obj}))
        context.state.stack.stageAdd(stack);
        list.splice(i,1);
        if(id===context.state.rootStageObj.id){context.commit("ROOT_STAGE_OBJ",context.state.stageArr[0])}
      }
    });
};

export const renStage = (context,paramerer) => {
  if (paramerer.value != paramerer.startContent) {
    let stack = new Active("舞台重命名",'REN_STAGE');
    stack.list.push(new Atom({startValue:paramerer.startContent,endValue:paramerer.value,id:paramerer.id}));
    context.state.stack.stageAdd(stack)
  }
}

export const addStage = (context,paramerer)=>{
    let index  = paramerer.index;
    let obj = paramerer.obj;
      let stack = new Active("新建舞台","ADD_STAGE");
      stack.list.push(new Atom({key:"新建舞台",startValue:obj}));
      context.state.stack.stageAdd(stack);
};


export const moveStageLayer = (context,paramerer)=>{
     console.log("舞台改变层级方法开发中")
};
