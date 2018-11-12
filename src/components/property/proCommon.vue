<script>
import { API } from "../../interfaceConfig/interface";
import { createPixiObj } from "xeditor-convertor";
import { resolve } from "url";
import { Atom, Active, addStack } from "../../editMethod/undo";
// import { PixiTexture, xSprite } from 'xPixi';
export default {
  name: "proCommon",
  data() {
    return {
      uploadUrl: "",
      urlPicture: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    clickBlur(event) {
      this.blur(event.path[event.path.length - 4]);
    },
    blur(dom) {
      if (
        (dom && dom.nodeType === 1 && dom.tagName === "INPUT") ||
        dom.tagName === "TEXTAREA"
      )
        dom.blur();
      var i = 0,
        childNodes = dom.childNodes,
        item;
      for (; i < childNodes.length; i++) {
        item = childNodes[i];
        if (item.nodeType === 1) this.blur(item);
      }
    },
    keyblur(e) {
      if (e.keyCode == 13) e.target.blur();
    },
    inputUndo(e) {
      if (e.keyCode == 90 || e.keyCode == 89) {
        let obj = e.keyCode == 90 ? "UNDO" : "REDO";
        e.preventDefault();
        e.path[0].blur();
        this.$store.dispatch(obj, { id: this.$store.state.stageObj.id });
      }
    },
    replaceInput(e) {
      let input = e.target;
      input.value = "";
    },
    ChangeRes(ev, pixiElement, type, evType) {
      let startId = pixiElement? pixiElement.defaultResId: null;
      let thisTarget = this;
      let imgUrl = "";
      let target = ev.target.files;
      let uploadFun = this.uploadFun;
      if (target.length > 0) {
        switch (type) {
          case "img":
            if (
              target[0].type !== "image/png" &&
              target[0].type !== "image/jpeg"
            ) {
              this.$store.commit("ALERT", {
                data: "图片类型不是jpg或者jpeg,png,请重新选择",
                this: this
              });
            } else {
              let ths = this;
              return new Promise((resolve, reject) => {
                let file = target[0];
                let reader = new FileReader();
                reader.onload = function(e) {
                  let data = e.target.result;
                  //加载图片获取图片真实宽度和高度
                  let image = new Image();
                  image.onload = function() {
                    let width = image.width;
                    let height = image.height;
                    if (width > 5000 || height > 5000) {
                      ths.$store.commit("ALERT", {
                        data: "图片宽度大于5000或者高度大于5000，请重新上传",
                        this: ths
                      });
                      reject();
                    } else {
                      let outerResolve = resolve;
                      uploadFun(target[0], pixiElement, function(url) {
                        let res;
                        if (pixiElement) {
                          // res = pixiElement.addNewRes(url,evType);
                          let imgSrc = thisTarget.getImgType(
                            pixiElement,
                            evType
                          );
                          let startId = pixiElement.defaultResId;
                          pixiElement.addNewRes(url, evType, () => {
                            let stack = new Active("更改图片", "CHANGE_IMAGE");
                            stack.list.push(
                              new Atom({
                                id: pixiElement.id,
                                key: "CHANGE_IMAGE",
                                startValue: startId,
                                endValue: pixiElement.defaultResId
                              })
                            );
                            ths.$store.state.stack.add(
                              ths.$store.state.rootStageObj.id,
                              stack
                            );
                          });
                          res = url;
                          resolve(res);
                        } else {
                          XPIXI.ResourceManager.getInstance()
                            .addFromLoader(url)
                            .then(resource => {
                              resolve(resource);
                            });
                        }
                      });
                    }
                  };
                  image.src = data;
                };
                reader.readAsDataURL(file);
              });
            }
            break;
          case "audio":
            if (target[0].type !== "audio/mp3") {
              this.$store.commit("ALERT", {
                data: "文件类型仅支持mp3,请重新选择",
                this: this
              });
              break;
            } else {
              return new Promise((resolve, reject) => {
                uploadFun(target[0], pixiElement, function(url) {
                  let filePath = url;
                  let res = XPIXI.ResourceManager.getInstance()
                    .addFromLoader(filePath)
                    .then(res => {
                      resolve(res);
                    });
                });
              });
            }
            break;
          default:
            break;
        }
      }
    },
    uploadFun(file, pixiElement, callback) {
      let targetSize = file.size;
      let shardSize = 5 * 1024 * 1024; //以1MB为一个分片
      let shardCount = Math.ceil(targetSize / shardSize); //总片数
      let uploadId = "";
      let dataList = [];
      for (let i = 0; i < shardCount; i++) {
        let start = i * shardSize,
          end = Math.min(targetSize, start + shardSize);
        let form = new FormData();
        form.append("multiName", file.slice(start, end)); //slice方法用于切出文件的一部分
        form.append("name", file.name); //文件名称
        form.append("allPart", shardCount); //总片数
        form.append("curPart", i + 1); //当前是第几片
        form.append("isLocalRequest", true);
        dataList.push(form);
      }
      let fun1 = (data, num) => {
        if (num > data.length - 1) {
          console.log("上传过程完毕");
          return;
        }
        let form = data[num];
        form.append("uploadId", uploadId); //上传ID
        let resourceId = window.localStorage.getItem("resourceId");
        if (resourceId) {
          form.append("resourceId", resourceId);
        }
        API.funRequest(
          API.URLS.upload,
          "post",
          form,
          e => {
            uploadId = e.data.data.uploadId;
            // console.log(uploadId)
            if (e.data.data.fileUrl == undefined) {
              alert(e.data.data);
              this.$store.state.limitAlert = true;
              return;
            }
            // console.log(e);
            if (e.status === 200) {
              window.localStorage.setItem("resourceId", e.data.data.resourceId);
              if (e.data.data.fileUrl) {
                callback(e.data.data.fileUrl); //重新执行一遍
              }
            }
            return e.data.data.fileUrl;

            fun1(data, (num += 1));
          },
          e => {
            // console.log(e);
            // alert("上传失败");
          }
        );
      };
      fun1(dataList, 0);
    },
    getStyleValue(obj, styleN) {
      //根据对象和key获得指定的属性值
      if (obj.type === "stage") {
        return "";
      }
      if (styleN === "x" || styleN === "y") {
        if (obj.parent) {
          let pivot = obj.parent.toLocal(obj.pivot, obj, undefined, true); //中心点位置相父元素
          let zero = obj.parent.toLocal(
            obj.getBounds(true),
            undefined,
            undefined,
            true
          ); //边界位置相对父元素
          return obj[styleN] - pivot[styleN] + zero[styleN];
        } else {
          return obj.getBounds(true)[styleN];
        }
      } else if (styleN in obj) {
        return obj[styleN];
      } else if ("style" in obj && styleN in obj.style) {
        return obj.style[styleN];
      } else if (styleN === "imageUrl") {
        return obj.texture.baseTexture.imageUrl;
      } else {
        return "没有此属性";
      }
    },
    getGlobalPosition(obj, x, y) {
      if (obj.parent) {
        return this.getGlobalPosition(obj.parent, obj.x + x, obj.y + y);
      } else {
        return { x: obj.x + x, y: obj.y + y };
      }
    },
    getObjType(obj) {
      if (obj === undefined) return;
      let temp = "";
      if (obj.type === this.$store.state.typeObj.typeElement.TEXT) {
        temp = "proText";
      } else if (obj.type == this.$store.state.typeObj.typeElement.IMG) {
        temp = "proImg";
      } else if (obj.type == this.$store.state.typeObj.typeElement.CONTAINER) {
        temp = "proContainer";
      } else if (obj.type == this.$store.state.typeObj.typeElement.STAGE) {
        temp = "proStage";
      } else if (obj.type == this.$store.state.typeObj.typeElement.IMAGE_TEXT) {
        temp = "proText";
      } else if (obj.type == this.$store.state.typeObj.typeElement.AUDIO) {
        temp = "proAudio";
      } else if (
        obj.type == this.$store.state.typeObj.typeElement.ANIMATED_SPRITE
      ) {
        temp = "proAnimationSprite";
      }
      return temp;
    },
    getTypeTwo(obj) {
      if (obj === undefined) {
        return;
      }
      let temp_question = false;
      if (obj.modelType == this.$store.state.typeObj.typeQuestion.CHOICE) {
        temp_question = "ChoosePanel";
      } else if (
        obj.modelType == this.$store.state.typeObj.typeQuestion.FILLVACANCY
      ) {
        temp_question = "TypeFillVacancy";
      } else if (
        obj.modelType == this.$store.state.typeObj.typeQuestion.CLASSIFY
      ) {
        temp_question = "ClassifyPanel";
      } else if (
        obj.modelType == this.$store.state.typeObj.typeQuestion.ONLINE
      ) {
        temp_question = "OnlinePanel";
      }
      return temp_question;
    },
    getImgType(obj, typeState) {
      if (typeState == "click") {
        return XPIXI.ResourceManager.getInstance().getResourceUrlById(
          obj.clickResId
        );
      } else if (typeState == "default") {
        return XPIXI.ResourceManager.getInstance().getResourceUrlById(
          obj.defaultResId
        );
      }
    }
  }
};
</script>
<style>
</style>