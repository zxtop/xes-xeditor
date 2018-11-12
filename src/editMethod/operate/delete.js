import { Atom, Active } from "../undo";

export const deleteObj = (context, deleteList, list) => {//删除元素的方法
  deleteList.map((target, i) => {
    list.map((obj, index) => {
      if (target.id === obj.id) {
        list.splice(index, 1);
        context.state.selectorObj.clearSelectList();
      }
    });
  });
};


export const deleteElement = (context, deleteParameter) => {
  let stack = new Active("删除普通元素", "DELETE", context.state.rootStageObj.id);
  let deleteList = deleteParameter.deleteList || context.state.selectorObj.selectList || [];
  let parent = null;
  if (deleteList.length > 0) parent = deleteList[0].parent;
  let indexList = [];
  if (parent) {
    deleteList.map((obj, i) => {
      if (parent) { }
      let index = parent.getChildIndex(obj);
      indexList.push(index);
      stack.list.push(new Atom({ id: obj.id, json: obj.toJson(), parentId: parent.id, index: index }));
      if (obj.defaultResId) {
        //处理资源使用次数
        XPIXI.ResourceManager.getInstance().reduceResCount(obj.defaultResId);
      }
    });
    context.state.selectorObj.selectList = context.state.rootStageObj;
    deleteObj(context, deleteList, parent.children);
    context.dispatch("ADD_STACK", { content: stack });
  }
};
