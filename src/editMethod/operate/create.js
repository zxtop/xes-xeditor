import { Atom, Active } from "../undo";
/**
 * 创建包括新建和粘贴
 * @param context
 * @param createParameter{type:string,content:string||obj,base:copyList,index:[num],parent}
 */

let stack;
export const create = (context, createParameter) => {
    console.log(createParameter);

    let type = createParameter.type;//新建类型
    let content = createParameter.content;//新建内容
    let base = createParameter.base||[];//基于base创建
    let indexArr = createParameter.index||[];//新元素放置层级位置
    let location = createParameter.location||context.state.stageObj;//放置的父元素对象
    context.state.selectorObj.clearSelectList();
    if (base.length > 0) {//基于创建
      for (let i = 0; i < base.length; i++) {
        //处理资源使用次数
        XPIXI.ResourceManager.getInstance().addResCount(base[i].defaultResId);
      }
      createPaste(context, base, location, indexArr);
    } else if (type) {//新建
      //处理资源使用次数
      if (content) {
        XPIXI.ResourceManager.getInstance().addResCount(content.id);
      }
      return createNew(context, type, content, location);
  }
};


export const createPaste = (context, base, parent, indexArr, isStack) => {
  stack = new Active("复制出来的对象", "ADD", context.state.rootStageObj.id);
  let copyObjArr = base || [], 
  indexList = indexArr || [], 
  bool = false;
  let copyTarget;
  let len = copyObjArr.length;
  console.log(stack);
  
  for (let i = 0; i < len; i++) {
    let obj = copyObjArr[i];
    copyTarget = new XPIXI[obj.conName](obj);

    if (!copyTarget.modelType && context.state.stagePageFoucs === false) {//如果粘贴的是舞台上的元素让其坐标增加20
      copyTarget.x += 20;
      copyTarget.y += 20;
    }

    if (context.state.stageArr.length < 10 || !copyTarget.modelType ) {
      if (copyTarget.modelType) copyTarget.name = 'stage' + context.state.stageNameIndex++;
      bool = true;
      // console.log(indexList[i]);
      addElement(context,copyTarget,parent,indexList[i]);
    }

  }

  if (copyTarget.modelType && context.state.stagePageFoucs === true && bool) {//如果粘贴的是整个舞台
    context.dispatch("ADD_STAGE",{obj:copyTarget});
  } else if (!copyTarget.modelType && context.state.stagePageFoucs === false && bool) {//如果粘贴的是舞台上的元素
    context.dispatch("ADD_STACK",{content:stack});
  }

};


export const createNew = (context, type, content, parent) => {
  stack = new Active("新建的对象", "ADD", context.state.rootStageObj.id);
  let obj;
  if (type === "text") {
    obj = new XPIXI.Text({
      "texture": {
        "type": "3"
      }
    });
  } else if (type === "img") {//新建图片
    obj = new XPIXI.Sprite({
      "texture": {
        "type": "4",
        "content": {
          "default": content.id,
          "click": ''
        }
      }
    });
  } else if (type === 'audio') {//音频新建按钮
    // console.log(data)
    obj = new XPIXI.XAudio({
      "defaultTexture": content.id,
      "changeTexture": content.id,
      "texture": {
        "type": "5",
        "content": {
          "default": content.id,
          "click": ''
        }
      }
    });
  } else if (type === "choice") {
    obj = new XPIXI.Choice({
      "conName": "Choice",
      "groupType": "choice",
      "isRight": false,
      "texture": {
        "type": "4",
        "content": {
          "default": content.id,
          "click": ""
        }
      }
    });
  } else if (type === "filling") {
    let filltext = new XPIXI.Text({
      "texture": {
        "type": "3"
      }
    });
    filltext.text = "";
    obj = new XPIXI.FillVacancy({
      "conName": "FillVacancy",
      "rightAnswer": "",
      "groupType": "blank",
      "defaultTexture": content.id,
      "focusTexture": content.id,
      "texture": {
        "type": "4",
        "content": {
          "default": content.id,
          "click": ""
        }
      }
    });
    obj.addChild(filltext);
  } else if (type === "Classification_class") {
    obj = new XPIXI.Classification({
      "groupType": "classification_class",
      "conName": "Classification",
      "texture": {
        "type": "4",
        "content": {
          "default": content.id,
          "click": ""
        }
      }
    });
  } else if (type === "Classification_item") {
    obj = new XPIXI.Classification({
      "groupType": "classification_item",
      "className": "",
      "conName": "Classification",
      "texture": {
        "type": "4",
        "content": {
          "default": content.id,
          "click": ""
        }
      }
    });
  } else if (type === "Ligature_stem" || type === "Ligature_answer") {//连线
    obj = new XPIXI.Ligature({
      "conName": "Ligature",
      "matchItems": [],
      "groupType": type.toLowerCase(),
      "texture": {
        "type": "4",
        "content": {
          "default": content.id,
          "click": ""
        }
      }
    });
  } else if (type === "animation") {
    console.log("新建一个动画");
    console.log(content);
    obj = new XPIXI.AnimatedSprite({
      "texture": {
        "type": "9",
        "content": {
          "default": content.id,
        }
      }
    })
  }
  obj.pivot.x = obj.width / 2;
  obj.pivot.y = obj.height / 2;
  obj.x = obj.x + obj.width / 2;
  obj.y = obj.y + obj.height / 2;
  window.obj = obj;
  let time = setInterval(() => {
    if (obj.width > 1) {
      addElement(context, obj, parent);
      context.dispatch("ADD_STACK", { content: stack });
      clearInterval(time);
    }
  });
  return obj;
};


export const addElement = (context, addObj, parent, index) => {//添加元素
  if (addObj.modelType && context.state.stagePageFoucs === true) {//往页面中添加舞台
    context.state.stageArr.push(addObj);
  } else if (!addObj.modelType && context.state.stagePageFoucs === false) {//往舞台中添加元素
    parent.addChild(addObj);
    if (index >= 0) {
      parent.setChildIndex(addObj, index)
    }
    stack.list.push(new Atom({ id: addObj.id, json: addObj.toJson(), parentId: parent.id, index: index }));
    context.state.selectorObj.selectType = 2;
    context.state.selectorObj.selectList = addObj;
    context.state.selectorObj.selectType = 1;
  }
};
