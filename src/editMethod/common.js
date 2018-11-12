/**
 * 计算多选元素边界大小
 */
export const getMoreBounds =(objArr)=>{
  let minX =10000,minY=10000,maxX = -10000,maxY = -10000,sumWidth=0,sumHeight=0;
  objArr?objArr.map((obj,index)=>{
    let rect = obj.getBounds(true);
    sumHeight = rect.height+sumHeight;
    sumWidth = rect.width + sumWidth;
    minX = Math.min(parseInt(rect.x),minX);
    minY = Math.min(parseInt(rect.y),minY);
    maxX = Math.max(parseInt(rect.x+rect.width),maxX);
    maxY = Math.max(parseInt(rect.y+rect.height),maxY);
  }):"";
  return {width:maxX-minX,height:maxY-minY,x:minX,y:minY,sumWidth:sumWidth,sumHeight:sumHeight}
};



/**
 * 判断对象边界是不是出了舞台之外
 */
export const ifOverflow =(objArr,state,boundNum)=>{
  let rect = getMoreBounds(objArr);
  let stageSize = state.stageParentSize;
  let scale = stageSize.scale;
  let bound = boundNum||20;
  let flow = {x:0,y:0};
  let minX = rect.x*scale+rect.width*scale;
  let minY= rect.y*scale+rect.height*scale;
  let maxX = stageSize.width-rect.x*scale;
  let maxY = stageSize.height-rect.y*scale;
  minX<bound?flow.x = bound-minX:"";
  minY<bound?flow.y=bound-minY:"";
  maxX<bound?flow.x = maxX-bound:"";
  maxY<bound?flow.y=maxY-bound:"";
  return flow;
};
