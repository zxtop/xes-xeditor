
/**
 @Author: swls
 @ps: 描述当前操作对象的一个类
 */

class Selector {
  constructor(stageObj,propertyObj){
    this._stageObj = stageObj||{};
    this._selectList=[];
    this._propertyObj = propertyObj||{};
    this._inputEditObj=null;
    this._selectType =1;//0不可选，1单选，2多选
    this._editType=0;//0不可编辑，1可编辑
  }
  selectInit(stageObj,propertyObj){
    this._stageObj = stageObj||this._stageObj;
    this._selectList=[];
    this._propertyObj = propertyObj||this._propertyObj;
    this._inputEditObj=null;
    this._selectType =1;
    this._editType=0;
  }

  get stageObj(){
    return this._stageObj;
  }

  set stageObj(value){
    this._stageObj = value;
    this._selectList=[value];
  }

  get propertyObj() {
    return this._propertyObj;
  }
  set propertyObj(value) {
    this._propertyObj = value;
  }

  get inputEditObj() {
    return this._inputEditObj;
  }
  set inputEditObj(value) {
    this._inputEditObj = value;
  }

  get selectType(){
    return this._selectType;
  }
  set selectType(value) {
    this._selectType = value;
  }


  get editType(){
    return this._editType;
  }
  set editType(value) {
    this._editType = value;
  }


  get selectList(){
    return this._selectList;
  }
  set selectList(value){
    if(value.edit.layer.hide||value.edit.layer.lock){//选择对象为隐藏或者锁定元素
      return;
    }if(this._selectType===0){
      console.warn("当前状态为禁止选择状态")
    }else if(this._selectType===1){
      if(this.inSelect(value.id)>-1){
        //多选拖动判断
      }else{
        this.clearSelectList();
        this._selectList.push(value);
        this._propertyObj = value;
      }
    }else if(this._selectType === 2){
      if(value.id===this.stageObj.id){return}//多选禁止选中舞台
      if(this.inSelect(this.stageObj.id)>-1){this._selectList.splice(0, 1)}//有舞台则去除
      if(this.inSelect(value.id)>-1){
        this._selectList.splice(this.inSelect(value.id), 1)
      }else{
        this._selectList.push(value);
        this._propertyObj = this._selectList[0];
      }
    }
  }

  clearSelectList(num){
    if(num&&!Number.isNaN(num)){
      this._selectList.splice(num, 1);
    }else{
      this._selectList = [];
      this._propertyObj = this._stageObj;
    }
  }

  inSelect(id,objArr){//判断id元素  是否已经存在objArr里面
    let select = objArr||this._selectList;
    let len = select.length;
    for(let i=0 ;i<len;i++){
      if(select[i].id===id){
        return i
      }
    }
    return -1;
  }

  editSelect(list){//判断list对象的综合编辑权限
    let arr = [];
    let listArr = list||this._selectList;
    let move=true,remove=true,scale = true,rotate=true,permission,x,y,x1,y1;
    listArr.map((obj,index)=>{
      x = obj.x;y = obj.y;
      if(obj.parent){
        let pivot = obj.parent.toLocal(obj.pivot,obj,undefined,true);
        let zero = obj.parent.toLocal(obj.getBounds());
        x1 = obj.x-pivot.x+zero.x; y1 = obj.y-pivot.y+zero.y;
      }
      arr[index] = {x:x,y:y,x1:x1,y1:y1,pivotX:obj.pivot.x,pivotY:obj.pivot.y};
      permission = obj.edit.control.permission;
      if(permission[0]<1){remove = false}
      if(permission[1]<1){move=false}
      if(permission[2]<1){scale = false}
      if(permission[3]<1){rotate = false}
    });
    return {arr,remove,move,scale,rotate};
  };


  getSelectValue(key,objArr){
    let arr = [];
    let listArr = objArr||this._selectList;
    listArr.map((obj,index)=>{
      if(key==="position"){
        arr[index] = {x:obj.x,y:obj.y}
      }else{
        if(key==="x"||key==="y"){
          arr[index]={[key]:obj[key]};
        }else if(key in obj) {
          arr[index] = {[key]: obj[key]};
        }else if("style" in obj && key in obj.style){
          arr[index]={[key]:obj.style[key]}
        }else if(key === 'imageUrl'){
          arr[index]={imageUrl:obj.texture.baseTexture.imageUrl}
        }else{
          console.error("getSelectValue方法未找到"+key+"属性");
        }
      }
    });
    return arr;
  }
}
export {Selector}
