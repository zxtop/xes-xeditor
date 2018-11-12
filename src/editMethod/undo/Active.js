/**
 @Author: swls
 @ps: 编辑器撤销步骤类
 */
class Active{
  constructor(activeName,activeType,listId){
    this._activeName = activeName;
    this._activeType = activeType;
    this._listId = listId;
    this._list = [];
  };

  get activeType() {
    return this._activeType;
  }

  get list() {
    return this._list;
  }
  set list(value){
    this._list.push(value)
  }
  toJson(){
    return JSON.parse(this._list);
  }
}
export{Active}

const type = {
  "DELETE_STAGE":"1",//删除舞台
  "DELETE":"2",//删除普通元素
  "ADD_STAGE":"3",//添加舞台
  "ADD":"4",//添加普通元素
  "LOCK":"5",//锁定
  "HIDE":"6",//隐藏
  "GROUP":"7",//打组
  "CANCEL_GROUP":"8",//取消打组
  "CHANGE_LAYER":"9",//改变普通元素层级
  "CHANGE_STAGE_LAYER":"10",//改变舞台层级
  "CHANGE_PROPERTY":"11"//改变普通属性
};
