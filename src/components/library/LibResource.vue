<template>
    <div class="resWrap"  v-if="isShowStage"  @click="resourceClick">
        <div class="resHeader">
         <p class="arena_pps">资源库</p >
        </div> 
         <div class="resPreview">
            <img :src=previewSrc alt="" v-if="resType === 1" @mousedown="onItemMouseDown($event, currentIndex)">
            <div v-if="resType === 2"><audio :src=previewSrc controls class="audio"></audio></div>
            <div v-if="resType === 3"></div>
        </div> 
        <div class="resList"  >
          <span class="resulSpan">名称</span>
          <span class="resulSpan" style="margin-left: 1rem;">扩展名</span>
          <div class="ulWrap" ref="ulWrap" id="scroller" >
          <div class="scroll">
          <iscroll-view class="ulWrap" ref="ulWrap" id="scroller" :options="{mouseWheel:true,preventDefault: false}">
            <ul ref="resUl">
                <li v-for="(item, index) in getResList()" :key="item.id" @dblclick="onItemDbclick($event, index)" @blur="onItemBlur()" 
                @mousedown="onItemMouseDown($event, index)" @contextmenu="onRightClick($event, index)">
                  <img :src="imgzy"  class="img_class_zy" alt="">
                  <!-- <input v-show="index === renameIndex" ref="resInput" type="text" class="input-rename" @keydown="keyEvent($event, item, index)"> -->
                  <span class="resName" v-show="index !== renameIndex">{{item.name}}</span>
                  <span style="float: right; margin-right: .6rem;">{{item.ext}}</span>
                  <!-- <span class="resCount">{{item.count}}</span> -->
                </li>
            </ul>
          </iscroll-view>
             </div>
            <div class="resRight" ref="resRight">
              <ol>
                <li @click="resRename()" >重命名</li>
                <li @click="resDelete()" >删除</li>
              </ol>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
// import myIscroll from "iscroll";
// import IScrollView from 'vue-iscroll-view';
// import IScroll from 'iscroll';
export default {
  name: "LibResource",
  props: {},
  data() {
    return {
      myscroll: "",
      rm: null, //resourceManager对象
      resList: [], //当前显示资源列表
      resType: 1, //1图片 2音频 3帧动画
      previewSrc: "static/images/default.jpg", //默认预览图
      currentIndex: -1, //当前选中元素下标
      renameIndex: -1, //哪个元素正在重命名
      imgzy: require("../../../static/images/piczy.png")
    };
  },
  computed: {
    isShowStage() {
      if (
        this.$store.state.selectorObj.propertyObj.type ===
        this.$store.state.typeObj.typeElement.STAGE
      ) {
        this.$store.state.lidContent = true;
      } else {
        this.$store.state.lidContent = false;
      }
      return this.$store.state.lidContent;
    }
  },
  mounted() {
    this.rm = XPIXI.ResourceManager.getInstance();
  },
  methods: {
    getResList() {
      this.resList = XPIXI.ResourceManager.getInstance().resourceList;
      let anim = [];
      for (let i = 0; i < this.resList.length; i++) {
        const element = this.resList[i];
        if (element.ext === 'json' && element.data && element.data.data.meta) {
          anim.push(element.data.data.meta.image.split('.')[0]);
        }
      }
      return this.resList.filter(item => {
        return item.ext !== "json" && (item.data && !anim.includes(item.name));
      });
    },
    onBeforeScrollStart: function(e) {
      var target = e.target;
      while (target.nodeType != 1) target = target.parentNode;
      if (
        target.tagName !== "SELECT" &&
        target.tagName !== "INPUT" &&
        target.tagName !== "TEXTAREA"
      )
        e.preventDefault();
    },
    resourceClick() {
      this.$store.state.stagePageFoucs = "resource";
    },
    onSearch(keyWords) {
      this.resList = this.resList.filter(item => {
        return item.name.indexOf(keyWords) !== -1;
      });
    },
    onPreviewMouseDown() {},
    onItemMouseDown(ev, index) {
      //如果不是鼠标左键不触发mousedown
      if (ev.button !== 0) return;
      if (index !== -1) {
        this.currentIndex = index;
      }
      //设置预览图像
      let item = this.resList[index];
      this.previewSrc = this.rm.getResourceUrlById(item.id);
      //处理资源类型
      switch (item.ext) {
        case "png":
        case "jpg":
          this.resType = 1;
          break;
        case "mp3":
          this.resType = 2;
          return;
          break;
        default:
          return;
          break;
      }
      let stageParent = document.getElementById("stageParent");
      let stageBound = stageParent.getBoundingClientRect();
      let divRect = document.createElement("div");
      // console.log(item);
      let divWidth = item.data.texture.baseTexture.width;
      let divHeight = item.data.texture.baseTexture.height;
      let moveCallback;
      let upCallback;
      let enterCallback = () => {
        //修改背景色
        let li = this.$refs.resUl.querySelectorAll("li");
        for (let i = 0; i < li.length; i++) {
          li[i].style.backgroundColor = "";
        }
        ev.target.style.backgroundColor = "#606266";
        //生成矩形框
        divRect.setAttribute("id", "tempDiv");

        divRect.style.width =
          (divWidth / window.base) *
            this.$store.state.rootStageObj.scale.x *
            this.$store.state.stageParentSize.scale +
          "rem";
        divRect.style.height =
          (divHeight / window.base) *
            this.$store.state.rootStageObj.scale.y *
            this.$store.state.stageParentSize.scale +
          "rem";
        divRect.style.border = "dashed black 1px";
        divRect.style.position = "absolute";
        divRect.style.left = 0;
        divRect.style.top = 0;
        stageParent.appendChild(divRect);

        moveCallback = ev => {
          divRect.style.left =
            (ev.clientX - stageBound.x) / window.base -
            parseFloat(divRect.style.width) / 2 +
            "rem";
          divRect.style.top =
            (ev.clientY - stageBound.y) / window.base -
            parseFloat(divRect.style.height) / 2 +
            "rem";
        };
        stageParent.addEventListener("mousemove", moveCallback);
        upCallback = ev => {
          stageParent.removeEventListener("mousemove", moveCallback);
          stageParent.removeEventListener("mouseup", upCallback);
          stageParent.removeEventListener("mouseenter", enterCallback);
          let stageObj = this.$store.state.stageObj;
          //创建元素
          this.$store
            .dispatch("CREATE_ELEMENT", {
              type: "img",
              content: {
                id: item.id
              }
            })
            .then(element => {
              let position = stageObj.toLocal({
                x:
                  (ev.clientX - stageBound.x) /
                    this.$store.state.stageParentSize.scale -
                  element.width / 2,
                y:
                  (ev.clientY - stageBound.y) /
                    this.$store.state.stageParentSize.scale -
                  element.height / 2
              });
              Object.assign(element.position, position);
            });
        };
        stageParent.addEventListener("mouseup", upCallback);
      };
      stageParent.addEventListener("mouseenter", enterCallback);
      let winMouseUp = ev => {
        if (document.getElementById("tempDiv")) {
          stageParent.removeChild(document.getElementById("tempDiv"));
        }
        stageParent.removeEventListener("mousemove", moveCallback);
        stageParent.removeEventListener("mouseup", upCallback);
        stageParent.removeEventListener("mouseenter", enterCallback);
        window.removeEventListener("mouseup", winMouseUp);
      };
      window.addEventListener("mouseup", winMouseUp);
    },
    onRightClick(ev, index) {
      //初始化弹出框
      window.event.returnValue = false;
      let resRightStyle = this.$refs.resRight.style;
      resRightStyle.display = "block";
      // resRightStyle.top = 2.5 + (index + 1) * 0.2 - (this.$refs.ulWrap.scrollTop / this.$refs.ulWrap.scrollHeight * (0.2 * this.resList.length - 1.9)) + "rem";
      resRightStyle.top = "2.5rem";
      resRightStyle.left = "1.2rem";
      this.currentIndex = index;

      //点击其他区域隐藏弹出框
      let winMouseUp = ev => {
        resRightStyle.display = "none";
        window.removeEventListener("mouseup", winMouseUp);
      };
      window.addEventListener("mouseup", winMouseUp);
    },
    onItemDbclick(ev, index) {
      this.renameIndex = index;
      this.itemFocus(index);
    },
    itemFocus(index) {
      let inputs = this.$refs.resUl.querySelectorAll("input");
      let focusInput = this.getFocusInput(index);
      focusInput.setAttribute("value", this.resList[index].name);
      setTimeout(() => {
        focusInput.focus();
        focusInput.select();
      }, 0);

      //点击其他区域取消选中
      let winMouseUp = ev => {
        this.renameIndex = -1;
      };
      window.addEventListener("mouseup", winMouseUp);
    },
    getFocusInput(index) {
      return this.$refs.resUl.querySelectorAll("input")[index];
    },
    keyEvent(ev, item, index) {
      if (ev.keyCode == 13) {
        this.onItemBlur(ev, item, index);
      }
    },
    onItemBlur(ev, item, index) {
      if (
        ev.target.value.length <= 20 &&
        !this.rm.isNameExist(ev.target.value)
      ) {
        this.$store.dispatch("STAGE_RESOURCE", {
          type: "资源重命名",
          id: item.id,
          start: item.name,
          end: ev.target.value
        });
        item.name = ev.target.value;
      }
      this.$refs.resUl.querySelectorAll("input")[index].blur();
      this.renameIndex = -1;
      // this.currentIndex = -1;
    },
    resRename() {
      this.renameIndex = this.currentIndex;
      this.itemFocus(this.currentIndex);
    },
    resDelete() {
      if (this.resList[this.currentIndex].count === 0) {
        this.$store.dispatch("STAGE_RESOURCE", {
          type: "删除资源",
          start: this.resList[this.currentIndex],
          index: this.currentIndex
        });
        this.rm.remove(this.resList[this.currentIndex].id);
      } else {
        // alert("有使用该资源的元素，不能删除");
        this.$store.commit("ALERT", {
          data: "有使用该资源的元素，不能删除",
          this: this
        });
      }
      this.$refs.resRight.style.display = "none";
    }
  }
};
</script>

<style scoped lang="scss">
.resWrap {
  z-index: 9;
  width: 2.8rem;
  height: 4rem;
  position: absolute;
  right: 0px;
  top: 4.9rem;
  font-size: 0.12rem;
  color: white;
  // overflow: hidden;
}
.resSearch {
  width: 1.8rem;
}
.resulSpan {
  width: 100%;
  height: 0.3rem;
  text-indent: 0.15rem;
  line-height: 0.3rem;
  color: #ccc;
  font-size: 0.16rem;
  margin-left: 0.3rem;
}
.resPreview {
  width: 100%;
  background: #222;
  height: 1.4rem;
  position: relative;
}
.resPreview img {
  height: auto;
  width: 1.35rem;
  margin-left: 10%;
  position: absolute;
  left: 39.8%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  vertical-align: middle;
}
.resList {
  margin-top: 0.1rem;
  width: 100%;
  height: 1.9rem;
}
#scroller {
  height: 1.8rem;
  // overflow-y: scroll;
  // position: fixed;
}
.resList ul {
  width: 100%;
  height: auto;
  list-style: none;
  font-size: 0.15rem;
}
.resList li {
  padding-bottom: 0.1rem;
  padding-top: 0.1rem;
  position: relative;
}
.resList li:hover {
  background: #666666;
}
.resRight {
  width: 1.4rem;
  height: 0.7rem;
  font-size: 0.1rem;
  background: #444;
  display: none;
  border-radius: 4px;
  box-shadow: 0rem 0.02rem 0rem rgba(56, 56, 56, 0.2);
  z-index: 99;
  position: absolute;
}
.resRight ol {
  list-style: none;
  color: #fff;
  font-size: 0.12rem;
  text-align: center;
  background: #444;
}
.resRight ol li {
  height: 0.26rem;
  line-height: 0.26rem;
  position: relative;
}
.resRight ol li:hover {
  background: #666666;
}
.resRight ol li:nth-child(1) {
  margin-top: 0.055rem;
}
.resRight p {
  width: 80%;
  margin-left: 10%;
  text-align: center;
  color: #fff;
  border-radius: 0.1rem;
  font-size: 0.12rem;
  position: absolute;
  bottom: 0.06rem;
}
.rightEvent p:hover {
  background: #666666;
}
.input-rename {
  background: #666666;
  border: none;
  border-radius: 3px;
  // line-height:0.3rem;
  // text-align:left;
}
.resName {
  width: 0.6rem;
  margin-left: 0.14rem;
  position: absolute;
  top: 0.125rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.resCount {
  float: right;
  margin-right: 0.42rem;
}
.audio {
  width: 80%;
  height: 1.6rem;
  margin-left: 10%;
}
.arena_pps {
  width: 2.8rem;
  height: 0.5rem;
  line-height: 0.5rem;
  background: #666666;
  font-size: 0.2rem;
  color: #fff;
  text-indent: 0.1rem;
}
.img_class_zy {
  width: 0.22rem;
  height: 0.2rem;
  margin-left: 0.3rem;
  // position: absolute;
  // top:0.125rem;
  // position: absolute;
  // left:0.2rem;
}
.scroll {
  width: 100%;
  height: 1.8rem;
  overflow: scroll;
}
#wrapper {
  width: 100%;
  height: auto;
  position: relative;
  // overflow:hidden;
  //  overflow:scroll;
}
</style>
