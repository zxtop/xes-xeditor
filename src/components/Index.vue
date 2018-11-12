<template>
  <div @dragover="dropStart" @drop='dropEnd' class="contentBox" @mousedown="contentBoxClickFun($event)">
    <div class="head_title">
      <div class="imgHead">
        <img :src=logo alt="">
      </div>
      <div class="templateHead"></div>

      <div class="operationHead">
        <p class="operationHeadOnep" v-if="baoBtnShow"
           @click="save()"
           @mouseover="mouse1()"
           @mouseout="mouseO1()">
          <img class="img1" ref="imgPublish" src="static/images/a9.png" alt="">
          <span class="spanb" ref="spanPublish" >保存</span>
        </p>
        <p class="operationHeadOnep" v-else><i class="el-icon-loading"></i></p>


        <p class="operationHeadTwop"  v-if="disBtnShow"
          @click="previewEv()"
          @mouseover="mouse2()"
          @mouseout="mouseO2()" >
          <img class="img2" ref="imgPreview" :src="img_btn_one" alt="">
          <span class="spany" ref="spanPreview">预览</span>
        </p>
        <el-button disabled class="disButton" v-else><img class="img3" :src="btn_img" alt=""><span class="spany1">预览</span> </el-button>


        <p class="operationHeadthree" v-if="uploadBox"
        @click="upLoad()"
        @mouseover="mouse3()"
        @mouseout="mouseO3()">
        <img  class="img4" ref="imgUpload" src="static/images/uploadone.png" alt="">
        <span class="spanc" ref="spanUpload">上传</span>
        </p>
        <p class="operationHeadthree" v-else><i class="el-icon-loading"></i></p>


      </div>
    </div>

    <div id="stageParent" style="width:9.42rem ;height:5.30rem;position:absolute;top:1.86rem;left: 2.20rem;background: black ;overflow: hidden">
      <dom-stage :stageObj="rootStageObj" tabindex="-1" v-if="hiddenTotals&&!canvasRenderer"></dom-stage>
      <canvas-stage :stageObj="rootStageObj" tabindex="-1" v-if="hiddenTotals&&canvasRenderer"></canvas-stage>
      <edit-box v-if="hiddenTotals"></edit-box>
    </div>
    <pro-index ref="children" v-on:ChildNodeS="listPartent" v-if="hiddenTotals"></pro-index>
    <p class="pps"></p>
    <showIndex></showIndex>
    <addRemark :addStage="pixiObj.stage"></addRemark>
    <typeIndex v-if="this.$store.state.frameAlert"  v-on:choseShow="getChose"></typeIndex>
    <lib-resource v-if="hiddenTotals"></lib-resource>
  </div>
</template>
<script>
import proIndex from "./property/proIndex";
import editBox from "./edit/edit";
import { domStage, domEE } from "xes_pixi_renderer";
import { canvasStage, canvasEE } from "xes_canvas_renderer";
import typeIndex from "./questionType/TypeIndex.vue";
import { API } from "../interfaceConfig/interface";
import { PixiExporter } from "xeditor-convertor";
import { GET_DATA_FROM_URL, status } from "xes_utils";
import showIndex from "./showBreviary/showIndex.vue";
import addRemark from "./remark/addRemark.vue";
import { EMIT_EVENT } from "../directives/stageEvent";
import LibResource from "./library/LibResource.vue";
// let mainJson = require('../../static/main.json') //
// let resourceJson = require('../../static/resource.json') //
let copy = require("clipboard-copy");

export default {
  data() {
    return {
      pixiObj: {},
      showHidden: true,
      ProjectileFrame: false,
      hiddenTotal: false,
      hiddenTotals: false,
      hideType: true,
      showTemplate: "",
      show: true,
      disBtnShow: false,
      baoBtnShow: true,
      uploadBox: true,
      urlSrc: "",
      modconfig: "",
      resou_local: "",
      page_id: "",
      logo: require("../../static/images/logo.png"),
      imgOne: require("../../static/images/images/1.png"),
      btn_img: require("../../static/images/a21.png"),
      img_btn_one: require("../../static/images/a21.png"),
      canvasRenderer: true,
      isDebugMode: false
    };
  },
  components: {
    proIndex,
    domStage,
    canvasStage,
    editBox,
    typeIndex,
    addRemark,
    showIndex,
    LibResource
  },
  mounted() {
        this.$confirm(
        "是否要重新拉取默认资源，本地保存的操作记录将被覆盖！",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          GET_DATA_FROM_URL(this);
        })
        .catch(() => {
          this.inFun();
        });
  },
  computed: {
    proportionNum() {
      return this.$store.state.proportionSize;
    },
    rootStageObj() {
      return this.$store.state.rootStageObj;
    }
  },
  methods: {
    dropStart(e) {
      e.preventDefault();
    },
    dropEnd(e) {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        let fileType = e.dataTransfer.files[0].name.split(".")[1];
        if (
          (fileType && fileType == "png") ||
          fileType == "jpg" ||
          fileType == "jpeg"
        ) {
          e.target.files = e.dataTransfer.files;
          this.$refs.children.ChangeRes(e, null, "img").then(value => {
            this.$store.dispatch("CREATE_ELEMENT", {
              type: "img",
              content: value,
              base: undefined
            });
          });
        } else {
          this.$store.commit("ALERT", { data: "图片格式不正确", this: this });
        }
      }
    },
    save(isShowLoading = true) {
      window.localStorage.setItem("main", this.$store.state.pixiObj.toJson());
      window.localStorage.setItem(
        "resource",
        XPIXI.ResourceManager.getInstance().toJson()
      );
      window.localStorage.setItem(
        "moduleConfig",
        JSON.stringify({ version: "1.0.0" })
      );
      if (isShowLoading) {
        this.baoBtnShow = false;
        setTimeout(() => {
          this.baoBtnShow = true;
        }, 500);
      }
    },
    upLoad() {
      //上传按钮
      this.save(false);
      this.uploadBox = false;
      if (!this.isDebugMode) {
        this.publish();
        return;
      }
      let params = new URLSearchParams();
      params.append("main", mainJson);
      params.append("resource", resourceJson);
      params.append("moduleConfig", moduleConfigJson);
      API.funRequest(
        "http://module.design.xesimg.com/xeditor/textToFile",
        "post",
        params,
        e => {
          this.uploadBox = true;
          let resourceID = e.data.data.name;
          resourceID = resourceID.match(/[^/]+/gi);
          resourceID = resourceID[resourceID.length - 1];
          copy(resourceID);
          this.$notify({
            title: "提示",
            message:
              "已将resourceID拷贝至剪切板，直接在脚手架粘贴吧！或者手动复制 \nresourceID :" +
              resourceID,
            duration: 0
          });
        },
        e => {
          this.disBtnShow = false;
          this.uploadBox = true;
          this.$notify({
            title: "警告",
            message: "保存失败",
            duration: 0
          });
          console.log(e);
        }
      );
    },
    contentBoxClickFun(ev) {
      //点击外侧显示舞台面板
      if (ev.target.className === "contentBox") {
        this.$store.commit("STAGE_OBJ", this.$store.state.stageObj.parent); //parent是代表当前舞台值
        this.$store.commit("SET_SELECT_LIST", {
          obj: this.$store.state.stageObj
        });
      }
    },
    page_show(Bpage) {
      this.showTemplate = Bpage;
    },
    listPartent: function(boar) {
      this.hideType = boar;
    },
    getChose(chose) {
      this.hideType = chose;
    },
    inFun() {
      let resJson = JSON.parse(window.localStorage.getItem("resource"));
      resJson.isAbsolutePath = true;
      window.localStorage.setItem("resource", JSON.stringify(resJson));
      let pixi = new XPIXI.PixiExporter(
        JSON.parse(window.localStorage.getItem("main")),
        JSON.parse(window.localStorage.getItem("resource")),
        // mainJson, //
        // resourceJson, //
        (current, all) => {
          // console.log("资源加载个数：" + current);
          // console.log("资源总个数：" + all);
        },
        () => {
          this.$store.commit("INIT_STAGE", { pixi: pixi });
          EMIT_EVENT(this.canvasRenderer ? canvasEE : domEE, this);
          this.pixiObj = this.$store.state.pixiObj.pixiApp;
          if (this.modconfig == null) {
            this.hiddenTotal = false;
            this.hiddenTotals = true;
          } else {
            this.hiddenTotal = true;
            this.hiddenTotals = true;
          }
          localStorage.setItem("idFinger", this.pixiObj.stage.id);
          window.ss = this.pixiObj.stage;
          // this.rootStageObj = this.pixiObj.stage
          for (let i = 0; i < this.$store.state.stageArr.length; i++) {
            const element = this.$store.state.stageArr[i];
            XPIXI.ResourceManager.getInstance().initResUseCount(element);
          }
        }
      );
      //处理是否可预览
      if (this.page_id) {
        this.disBtnShow = true;
      }
      //选择题型显示
      // console.log(JSON.parse(window.localStorage.getItem('main')).pages[0].modelType)
      if (JSON.parse(window.localStorage.getItem("main")).pages[0].modelType) {
        this.$store.state.frameAlert = false;
      } else {
        this.$store.state.frameAlert = true;
      }
    },
    previewEv() {
      //预览事件
      if (this.page_id) {
        window.open(this.urlSrc);
      } else {
        // alert('不能预览哦')
        this.$store.commit("ALERT", { data: "不能预览哦", this: this });
      }
    },
    publish() {
      this.disBtnShow = false;
      let mainJson = this.$store.state.pixiObj.toJson();
      let resourceJson = XPIXI.ResourceManager.getInstance().toJson();
      let moduleConfigJson = JSON.stringify({ version: "1.0.0" });
      // window.localStorage.setItem("main", mainJson);
      // window.localStorage.setItem("resource", resourceJson);
      // window.localStorage.setItem("moduleConfig", moduleConfigJson);
      let userC = localStorage.getItem("JsonText");
      let userCa = localStorage.getItem("pageInfo");
      let templateId = localStorage.getItem("templateId");
      let objs = JSON.stringify([
        {
          main: JSON.parse(mainJson),
          resource: JSON.parse(resourceJson),
          moduleConfig: JSON.parse(moduleConfigJson)
        }
      ]);

      let form = new FormData();
      form.append("type", "2");
      // if (window.localStorage.getItem("resourceId")) {
      //   form.append("resourceId", window.localStorage.getItem("resourceId"));
      // }
      form.append("templateId", JSON.parse(templateId));
      form.append("pageId", this.page_id);
      form.append("jsonData", objs);
      form.append("pageInfo", userCa);
      let coursewareId = window.localStorage.getItem("coursewareId");
      if (coursewareId) {
        form.append("coursewareId", JSON.parse(coursewareId));
      }
      let packageAttr = window.localStorage.getItem("packageAttr");
      if (packageAttr) {
        form.append("packageAttr", JSON.parse(packageAttr));
      }

      // form.append("isLocalRequest", 1) ;

      API.funRequest(
        API.URLS.publish,
        "post",
        form,
        e => {
          console.log(e);

          if (e.data.data.pageId) {
            this.page_id = e.data.data.pageId;
          }
          if (e.data.data.url) {
            this.urlSrc = e.data.data.url;
            // window.localStorage.setItem(
            //   "resourceId",
            //   this.urlSrc.split("/")[this.urlSrc.split("/").length - 1]
            // );
          }
          this.disBtnShow = true;
          this.uploadBox = true;
          if (e.data.data == "http://admin.xesv5.com") {
            window.open(e.data.data);
          }
        },
        e => {
          this.disBtnShow = false;
          this.uploadBox = true;
          // alert('保存失败')
          this.$store.commit("ALERT", { data: "保存失败", this: this });
          console.log(e);
        }
      );
    },
    mouse1() {
      this.$refs.imgPublish.src = "static/images/a10.png";
      this.$refs.spanPublish.style.color = "#fff";
    },
    mouseO1() {
      this.$refs.imgPublish.src = "static/images/a9.png";
      this.$refs.spanPublish.style.color = "#ccc";
    },
    mouse3() {
      this.$refs.imgUpload.src = "static/images/uploadteo.png";
      this.$refs.spanUpload.style.color = "#fff";
    },
    mouseO3() {
      this.$refs.imgUpload.src = "static/images/uploadone.png";
      this.$refs.spanUpload.style.color = "#ccc";
    },
    mouse2() {
      this.$refs.imgPreview.src = "static/images/a26.png";
      this.$refs.spanPreview.style.color = "#fff";
    },
    mouseO2() {
      this.$refs.imgPreview.src = "static/images/a21.png";
      this.$refs.spanPreview.style.color = "#ccc";
    }
  }
};
</script>

<style>
.contentBox {
  width: 14.4rem;
  height: 9rem;
  margin: 0rem auto;
  position: relative;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
  background: #202020;
}

.head_title {
  width: 100%;
  height: 0.6rem;
  background: #444;
  /*border-bottom: 1px solid #000;*/
}

.el-icon-loading {
  color: #fff;
  position: absolute;
  top: 0.18rem;
  font-size: 0.3rem;
  margin-left: 0.2rem;
}

.imgHead {
  width: 1.35rem;
  height: 0.48rem;
  margin-left: 0.2rem;
  position: relative;
}

.imgHead img {
  width: 1.1rem;
  height: 0.33rem;
  position: absolute;
  top: 0.18rem;
  left: 0px;
}

.templateHead {
  width: 0.6rem;
  height: 0.6rem;
  position: absolute;
  left: 6.9rem;
  top: 0rem;
}

.templateHead img {
  width: 0.3rem;
  height: 0.3rem;
  position: absolute;
  top: 0.07rem;
  left: 0.1rem;
  display: block;
}

.templateHead small {
  text-align: center;
  display: block;
  font-size: 0.16rem;
  display: block;
  color: #ccc;
  margin-top: 0.35rem;
  margin-left: -0.09rem;
  text-align: center;
}

.operationHead {
  width: 2.82rem;
  height: 0.6rem;
  position: absolute;
  background: #444444 !important;
  top: 0px;
  right: 0px;
}

.operationHead .operationHeadOnep {
  width: 0.34rem;
  height: 0.6rem;
  display: inline-block;
  float: left;
  position: absolute;
  left: 0rem;
  top: 0rem;
}

.operationHead .operationHeadTwop {
  width: 0.34rem;
  height: 0.6rem;
  position: absolute;
  left: 0.6rem;
  display: inline-block;
  margin-left: 0.2rem;
}

.operationHead .operationHeadthree {
  width: 0.34rem;
  height: 0.6rem;
  position: absolute;
  left: 1.3rem;
  top: 0rem;
  margin-left: 0.2rem;
}

.operationHead .operationHeadOnep img {
  width: 0.245rem;
  height: 0.22rem;
  position: absolute;
  top: 0.07rem;
  left: 0.12rem;
  display: block;
}

.operationHead .operationHeadTwop img {
  width: 0.26rem;
  height: 0.18rem;
  position: absolute;
  top: 0.07rem;
  left: 0.01rem;
  display: block;
  margin-top: 0.04rem;
}

.operationHead .operationHeadthree img {
  width: 0.26rem;
  height: 0.23rem;
  position: absolute;
  top: 0.07rem;
  left: 0.04rem;
  display: block;
}

.operationHead .operationHeadOnep span {
  display: block;
  width: 0.5rem;
  height: 0.25rem;
  font-size: 0.16rem;
  line-height: 0.24rem;
  position: absolute;
  bottom: -0.02rem;
  left: 0.1rem;
  color: #ccc;
}

.operationHead .operationHeadOnep span:hover {
  color: #fff;
}

.operationHead .operationHeadTwop span {
  display: block;
  width: 0.5rem;
  height: 0.25rem;
  font-size: 0.16rem;
  line-height: 0.24rem;
  position: absolute;
  left: 0;
  bottom: 0rem;
  /*left:-0.1rem;*/
  color: #ccc;
}

.operationHead .operationHeadTwop span:hover {
  color: #fff;
}

.operationHead .operationHeadthree span {
  display: block;
  width: 0.5rem;
  height: 0.25rem;
  font-size: 0.16rem;
  line-height: 0.24rem;
  position: absolute;
  bottom: -0.02rem;
  left: 0rem;
  color: #ccc;
}

.operationHead .operationHeadthree span:hover {
  color: #fff;
}

.operationHead .operationHeadTwop:hover {
  color: #fff;
}

.pps {
  display: block;
  height: 0.42rem;
  width: 9.4rem;
  background: #292929;
  position: absolute;
  bottom: 0rem;
  left: 2.2rem;
}

.el-button--text:focus,
.el-button--text:hover {
  color: #fff;
}

.disButton {
  background: #444444 !important;
  border: 1px solid #444444 !important;
  position: absolute;
  top: 0rem;
  left: 0.5rem;
  width: 0.34rem;
  height: 0.6rem;
  display: inline-block;
  margin-left: 0.2rem;
}

.img3 {
  width: 0.26rem;
  height: 0.18rem;
  position: absolute;
  top: 0.04rem;
  left: 0.1rem;
  display: block;
  margin-top: 0.04rem;
}

.spany1 {
  display: block;
  width: 0.5rem;
  height: 0.25rem;
  font-size: 0.16rem;
  line-height: 0.24rem;
  position: absolute;
  bottom: -0.02rem;
  left: 0rem;
  color: #ccc;
}

#uploadEl {
  color: #fff;
  position: absolute;
  top: 0.18rem;
  font-size: 0.3rem;
  margin-left: 1.3rem;
}
.operationHead .operationHeadthree i {
  position: absolute;
  right: 0.1rem;
  top: 0.17rem;
}
</style>
