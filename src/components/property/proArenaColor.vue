<template>
  <div class="m-colorPicker" ref="colorPicker">
    <div class="colorBtn">
      <ul class="tColor">
        <li
          v-for="color of bColor"
          v-bind:style="{ backgroundColor: color.color }"
          @click="changeColor(color.color,$event)"
        ></li>
        <li @click="HTML5His()"><img :src=colorimg alt=""></li>
      </ul>

    </div>
    <input type="color"
           ref="html5Color"
           v-model="html5Color"
           v-on:change="updataValue(html5Color)">
  </div>
</template>

<script>
  import proCon from "./proCommon.vue";
  import styleColor from './proStyle.json'
  export default {
    name: "proArenaColor",
    extends:proCon,
    props: {
      proData:{},
      defaultColor: {
        type: String,
      },
      // 禁用状态
      disabled: {
        type: Boolean,
        default: false
      }

    },
    components: {
      styleColor
    },
    data() {
      return {
        // 面板打开状态
        openStatus: false,
        // 鼠标经过的颜色块
        hoveColor: null,
        color:'',
        objs:this.proData,
        value: {
          type: String,
          required: true
        },
        styleObjF:{
          background:'',
        },
        colorimg:require('../../../static/images/color.png'),
        bColor:null,
        html5Color:"",
        html5Color: this.value
      };
    },
    computed: {
      // 显示面板颜色
      showPanelColor() {
        if (this.hoveColor) {
          return this.hoveColor;
        } else {
          return this.showColor;
        }
      },
      // 显示颜色
      showColor() {
        if (this.value) {
          return this.value;
        } else {
          return this.defaultColor;
        }
      },
      // 颜色面板
      colorPanel() {
        let colorArr = [];
        for (let color of this.colorConfig) {
          colorArr.push(this.gradient(color[1], color[0], 5));
        }
        return colorArr;
      }
    },
    created(){
      this.bColor = styleColor.common
    },
    methods: {
      HTML5His(){
        this.$refs.html5Color.click()
      },
      // 更新组件的值 value
      changeColor(value,ev){
        let getColorBack = this.getStyleValue(this.$store.state.rootStageObj,'backgroundColor')
        this.$refs.html5Color.value = value;
        this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[this.$store.state.rootStageObj],key:"backgroundColor",value:value,isStack:{modifyState:true,startContent:getColorBack}});
      },
      updataValue(value,ev) {
        console.log(value)

        this.colo = value;
        this.$refs.html5Color.value = value;
        this.$store.state.rootStageObj.backgroundColor=value;
      },
      // 设置默认颜色
      // 格式化 hex 颜色值
      parseColor(hexStr) {
        if (hexStr.length === 4) {
          hexStr =
            "#" +
            hexStr[1] +
            hexStr[1] +
            hexStr[2] +
            hexStr[2] +
            hexStr[3] +
            hexStr[3];
        } else {
          return hexStr;
        }
      },
      // RGB 颜色 转 HEX 颜色
      rgbToHex(r, g, b) {
        let hex = ((r << 16) | (g << 8) | b).toString(16);
        return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
      },
      // HEX 转 RGB 颜色
      hexToRgb(hex) {
        hex = this.parseColor(hex);
        let rgb = [];
        for (let i = 1; i < 7; i += 2) {
          rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
        }
        return rgb;

      },
      // 计算渐变过渡颜色
      gradient(startColor, endColor, step) {
        // 讲 hex 转换为 rgb
        let sColor = this.hexToRgb(startColor);
        let eColor = this.hexToRgb(endColor);

        // 计算R\G\B每一步的差值
        let rStep = (eColor[0] - sColor[0]) / step;
        let gStep = (eColor[1] - sColor[1]) / step;
        let bStep = (eColor[2] - sColor[2]) / step;

        let gradientColorArr = [];
        // 计算每一步的hex值
        for (let i = 0; i < step; i++) {
          gradientColorArr.push(
            this.rgbToHex(
              parseInt(rStep * i + sColor[0]),
              parseInt(gStep * i + sColor[1]),
              parseInt(bStep * i + sColor[2])
            )
          );
        }
        return gradientColorArr;
      }
    },
  };
</script>
<style lang="scss" scoped>
  .m-colorPicker {
    position: relative;
    font-size: 0.18rem;
    height: 0.5rem;
    ul,
    li,
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    input {
      display: none;
    }
    .spans{
      width:0.8rem;
      text-align:right;
      height:0.4rem;
      line-height: 0.7rem;
      height:0.4rem;
      display: inline-block;
      color: #ccc;
      font-size:0.16rem;
      margin-top:0.1rem;
      margin-top:0.04rem;
      margin-left:0rem;
    }

    .colorBtn {
      width:1.8rem;
      height:0.48rem;
      margin-top: 0.05rem;
      position: absolute;
      left:0.3rem;
      font-size: 0px;
      top:0.1rem;
    }
    .colorBtn.disabled {
      cursor: no-drop;
    }
    .colorBtn .tColor {
      width:100%;
      height:100%;
      li {
        outline: 1px solid #000;
        width:0.15rem;
        height:31%;
        margin:0rem;
        margin: 0rem;
        padding:0rem;
        list-style: none;
        display: inline-block;
        img{
          width:100%;
          height:100%;
          /*border-top:1px solid #000*/

        }

      }
      li:active{
        transform: scale(1.2);
        -webkit-transform: scale(1.2);
        -moz-transform: scale(1.2);
      }

    }


  }
</style>
