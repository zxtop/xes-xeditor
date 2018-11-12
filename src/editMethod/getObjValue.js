/**
 @Author: swls
 */
//寻找runObj元素的key值
export const getValue = (runObj,key) =>{
  let value = null;
  if(runObj===undefined){return}
  if(key==="x"||key==="y"){
    value =  runObj[key]-runObj.pivot[key];
  }else if(key in runObj){
    value =  runObj[key]
  }else if("style" in runObj && key in runObj.style){
    value = runObj.style[key]
  }else if(key === 'imageUrl'){
    value =  XPIXI.ResourceManager.getInstance().getResourceUrlById(runObj.defaultResId);
  }else if(key === 'default'){
    value = XPIXI.ResourceManager.getInstance().getResourceUrlById(runObj.defaultResId);
  }else if(key === 'click'){
    value = XPIXI.ResourceManager.getInstance().getResourceUrlById(runObj.clickResId);
  }else{
    console.error("getValue方法中未找到"+key+"属性");
  }
  return value;
};
