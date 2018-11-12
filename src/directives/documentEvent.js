/**
 * 绑定document全局事件，多用来处理全局快捷键
 */
let storeObj;
export const documentBindEvent = (store)=>{
  storeObj = store;
  document.addEventListener("keydown",keyDownFun);
  document.addEventListener("keyup",keyUpFun);
  document.addEventListener("mousemove",mouseMoveFun);
  document.addEventListener("mousedown",mouseDownFun);
  document.addEventListener("mouseup",mouseUpFun);
  window.onmousewheel=document.onmousewheel= mousewheelFun
};

const keyDownFun=(ev)=>{
  storeObj.dispatch("DOCUMENT_ACTIVE",ev)
};
const keyUpFun = (ev)=>{
  storeObj.dispatch("DOCUMENT_ACTIVE",ev)
};
const mouseMoveFun=(ev)=>{
  storeObj.dispatch("DOCUMENT_ACTIVE",ev)
};
const mouseDownFun = (ev)=>{
  storeObj.dispatch("DOCUMENT_ACTIVE",ev)
};
const mouseUpFun = (ev)=>{
  storeObj.dispatch("DOCUMENT_ACTIVE",ev)
};
const mousewheelFun = (ev)=>{
  storeObj.dispatch("DOCUMENT_ACTIVE",ev)
};
