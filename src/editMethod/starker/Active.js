
/**
 @Author: swls
 @ps: 编辑器撤销步骤类
 */
class Active{
  get list() {
    return this._list;
  }
  constructor(activeName,activeType){
    this._activeName = activeName||"";
    this._activeType = activeType||"";
    this._list = [];
  };
  deleteStage (data, index) {
    let list = [
      {
        activeName: this._activeName,
        activeType: this._activeType,
        activeObj: {
          data: data,
          index: index
        }
      }
    ]
    this._list = list;
    return list
  }
  changeLayer(layerId, indexStart, indexEnd) {
    let list = [
      {
        activeName: this._activeName,
        activeType: this._activeType,
        activeObj: {
          layerId: layerId,
          indexStart: indexStart,
          indexEnd: indexEnd
        }
      }
    ];
    this._list = list;
    return list
  }
  createDelete(targetList,parentObjId,parentObjType,indexArr){
    let list = [];
    targetList.map((obj,i)=>{
      list.push({
        activeName:this._activeName,
        activeType:this._activeType,
        activeObj:{
          parentType:parentObjType||"",
          parentId:parentObjId||"",
          targetId:obj.id,
          targetIndex:indexArr[i],
          targetObj:obj.toJson()
        }})
    });
    this._list = list;
    return list
  }
  createEdit(targetList,key,value){
    let list = [];
    targetList.map((obj)=>{
      list.push({
        activeName:this._activeName,
        activeType:this._activeType,
        activeObj:{
          targetId:obj.id,
          key:key,
          value:value,
        }
      })
    });
    this._list = list;
    return list;
  }
  createAdd(targetList,parentObjId,parentObjType){
    let list = [];
    targetList.map((obj)=>{
      list.push({
        activeName:this._activeName,
        activeType:this._activeType,
        activeObj:{
          parentType:parentObjType||"",
          parentId:parentObjId||"",
          targetId:obj.id,
          targetObj:obj.toJson()
        }
      })
    });
    this._list = list;
    return list;
  }

  createChangeProperty(changeObjList,changeKeyList,changeValueList){
    let list  = [];
    changeObjList.map((obj,index)=>{
      changeKeyList.map((keyObj,keyIndex)=>{
        list.push({
          activeName:this._activeName,
          activeType:this._activeType,
          activeObj:{
            changeTarget:obj.toJson(),
            targetId:obj.id,
            key:keyObj,
            startValue:changeValueList[keyIndex][index][0],
            endValue:changeValueList[keyIndex][index][1]
          }
        })
      })
    });
    this._list = list;
    return list;
  }
  toJson(){
    return JSON.parse(this._list);
  }
}
export{Active}

