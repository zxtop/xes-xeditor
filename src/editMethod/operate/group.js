import { getMoreBounds } from '../common.js';
import { Atom, Active } from '../undo';

let stack;
export const group = (context, paramerer)=>{

  let list  = context.state.selectorObj.selectList; //当前选择的所有元素

  if (list.length < 2) return false;

  let rect   = getMoreBounds(list);
  // console.log(rect);
  let root   = context.state.rootStageObj;

  let parent = context.state.stageObj;

  
  let newContainer = new XPIXI.Container();

  let texture  = new PIXI.Texture(new PIXI.BaseTexture());

  newContainer._texture = texture;
  newContainer._texture.orig.width  = rect.width;
  newContainer._texture.orig.height = rect.height;
  newContainer.x = rect.x;
  newContainer.y = rect.y;
  newContainer.type = "2";
  root.addChild(newContainer);

  newContainer.updateTransform(root.transform);

  let tran = newContainer.worldTransform.clone();  //Matrix {a: 1, b: 0, c: 0, d: 1, tx: 300, …}
  let pwt = parent.worldTransform.clone();  //Matrix {a: 1, b: 0, c: 0, d: 1, tx: 0, …}

  //console.log("1",newContainer.transform);

  parent.addChild(newContainer);

  newContainer.transform.setFromMatrix(tran.append(pwt.invert()));
  //console.log("2",newContainer.transform);
  console.log(newContainer);
  Object.assign(newContainer.position,parent.toLocal({x:rect.x,y:rect.y}));

  // 图层顺序记录
  let indexArr = [];
  list.sort((a,b)=>{
    return a.parent.getChildIndex(a)-b.parent.getChildIndex(b)
  });
  list.map((obj)=>{
    indexArr.push(parent.getChildIndex(obj));
  });
  parent.setChildIndex(newContainer, Math.min.apply(null, indexArr))

  list.map(obj => {
    parent.children.map((child, i) =>{
      if(child.id === obj.id){
        let childObj = parent.children.splice(i, 1)[0];
        let position = childObj.getGlobalPosition();
        let tran = childObj.worldTransform.clone();
        let pwt = newContainer.worldTransform.clone();
        newContainer.addChild(childObj);
        childObj.transform.setFromMatrix(tran.append(pwt.invert()));
        Object.assign(childObj.position,newContainer.toLocal({x:position.x,y:position.y}));
      }
    })
  });

  stack = new Active('打组', 'GROUP', context.state.rootStageObj.id);
  let chindId = [];
  newContainer.children.map(item => {
    chindId.push(item.id)
  })
  stack.list.push(new Atom({
    id: chindId,
    json:newContainer.toJson(),
    parentId:newContainer.id,
    index:indexArr
  }));
  context.dispatch("ADD_STACK", { content: stack });
  context.state.selectorObj.clearSelectList();
  context.state.selectorObj.selectList = newContainer;
};



export const cancelGroup = (context, paramerer)=>{

  let selectorList = context.state.selectorObj.selectList;

  if(selectorList.length>1){
    console.log("选中多个元素无法拆组")
  }else if(selectorList.length == 1 && selectorList[0].children.length == 0){
    console.log("当前没有可以进行拆组的对象");
  }else{

    let newContainer = selectorList[0];
    let containerJson = selectorList[0].toJson();
    let parent = context.state.stageObj;
    let childs = [...newContainer.children];
    let childId = [];
    let indexArr = [];
    let parentIndex = parent.getChildIndex(newContainer);
    childs.map((child, i) =>{
      childId.push(child.id);
      let childObj = child;
      let position = childObj.getGlobalPosition();
      let tran = childObj.worldTransform.clone();
      let pwt  = parent.worldTransform.clone();
      parent.addChild(childObj);
      // 设置图层顺序
      parent.setChildIndex(child, parentIndex + i);
      childObj.transform.setFromMatrix(tran.append(pwt.invert()));
      Object.assign(childObj.position,parent.toLocal({x:position.x,y:position.y}));
    });

    // TODO: 拆完组之后才可进行记录
    childs.map((obj)=>{
      indexArr.push(parent.getChildIndex(obj));
    });
    parent.removeChild(newContainer);
    stack = new Active('拆组', 'CANCEL_GROUP', context.state.rootStageObj.id);
    stack.list.push(new Atom({
      id: childId,
      json:containerJson,
      parentId:newContainer.id,
      index:indexArr
    }))
    context.dispatch("ADD_STACK", { content: stack });
    context.state.selectorObj.clearSelectList();
    context.commit("SET_SELECT_TYPE",{type:2});
    childs.map((obj)=>{
      context.state.selectorObj.selectList = obj;
    })
    context.commit("SET_SELECT_TYPE",{type:1});

  }
};
