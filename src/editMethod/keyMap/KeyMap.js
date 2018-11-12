import list from "./keymap.json";
import {include} from "./includeKey.json"
class KeyMap {
  constructor(typeName){
    this._keymapList = list[typeName||"document"]||[]; // 快键键所要完成的功能
    this._includeKey = include || []; // 快捷键的借助键
    this._eventList = [];
  }
  transformEvent(event){
    let temp = [];
    for(let key in event){
      if(event[key] === true && include.indexOf(key)>=0 &&event.code!==""){
        temp.push(key.toLowerCase());
      }
    }
    if((event.type === "keydown"||event.type==="keyup")&&event.keyCode!==16&&event.keyCode!==17&&event.keyCode!==18&&event.code!==""){
      temp.push(event.keyCode);
      temp.push(event.type);
    }else if(event.type !== "keydown"&& event.type!=="keyup"){
      temp.push(event.type);
    }
    this._eventList = temp;
    return temp;
  }
  seekCommand(type){
    return this._keymapList.find((obj)=>{
      let isOk = false;
      obj.key.map((obj)=>{
        isOk = isOk||(obj.sort().toString().toLowerCase() === this._eventList.sort().toString())
      });
      return isOk;
    });
  }
}
export {KeyMap}
