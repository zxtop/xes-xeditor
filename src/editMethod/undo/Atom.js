
/**
 @Author: swls
 */
class Atom{
  constructor(obj){
   this.id = obj.id;//目标元素id
   this.index = obj.index;//目标元素层级位置
   this.parentId = obj.parentId;//目标元素的父级元素id
   this.key = obj.key;//变更量的key值
   this.startValue = obj.startValue;//初始值
   this.endValue = obj.endValue;//结束值
   this.json = obj.json;//对象的tojson数据
  };
  toJson(){
    
  }
}
export{Atom}
