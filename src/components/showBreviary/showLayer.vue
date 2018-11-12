<template>
  <div class="layerDiv" v-if="layerStage">
    <SlickList ref="tree"  @node-click="getNode" :allow-drop="allowDrog" :key="data4.length" :expand-on-click-node="false" @sortStart="changeLayerStart" @sortEnd="changeLayerEnd" @sortMove="handleMove" lockAxis="y" class="SlickList test" :value="data4">
      <div class="box" @click.ctrl.stop="clickCtrl" @click.shift="clickShift" @click="handleClick" @dblclick="reName">
        <SlickItem v-for="(item, index) in data4" :id="'choose_'+item.id" :index="index" class="SlickItem custom-tree-node" :key="index">
          <span  v-if="item!==nodes" class="node-span">{{ item.name }}</span>
          <input @keydown.13="keyEvent($event)"  v-else type="text"  @focus="changeName(item)" class="node_input" :id="'val_'+item.id" :value="nodes.name" @blur="reNameFinish({data: item})" />
          <span class="editImgSpan">
            <el-button :class="item.edit.layer.hide==true?'eyeImg':'eyeImgTwo'" type="text" v-on:click="targetChunk(item, 'hide',item.id)"></el-button>
            <el-button :class="item.edit.layer.lock==true?'lockImg':'lockImgTwo'" type="text" v-on:click="targetChunk(item, 'lock',item.id)"></el-button>
          </span>
        </SlickItem>
      </div>
    </SlickList>
  </div>
</template>
<script>
  import $ from "../../../build/jquery.min.js";
  import {SlickItem, SlickList} from 'vue-slicksort';
  export default {
  components: {
    SlickItem,
    SlickList,
  },
    data() {
      return {
        finger:require('../../../static/images/finger-right.png'),
        nodes: null,
        layerStage:true,
        firstName:'',
        nodeId:null,
        nodeIndex:null,
        indexEnd: null,
        ids: [],
        drag: true,
        id: 0,
        indexId:[]
      }
    },
    mounted(){
      this.changeTargetObj(this.$store.state.selectorObj.selectList);
    },
    computed:{
      data4(){
        if (this.$store.state.stageObj.children) {
          return this.$store.state.stageObj.children.slice().reverse()
        } else {
          return [];
        }
      },
      data3(){
        return this.$store.state.stageObj.children
      },
      lists () {
        return this.$store.state.selectorObj.selectList
      }
    },
    watch: {
      data3 () {
        this.changeTargetObj(this.$store.state.selectorObj.selectList);
      },
      lists (val) {
        this.changeTargetObj(val);
      },
    },
    methods:{
       keyEvent(e){
        //键盘回车事件
        if(e.keyCode == 13) e.target.blur();
      },
      // 点击事件
      handleClick(ev) {
        this.nodes = null;
        if (this.drag) {
          this.$store.state.stageObj.children.map((obj) => {
            if(obj.id == this.nodeId) {
              this.$store.state.selectorObj.clearSelectList();
              this.$store.state.selectorObj.selectList = obj;
            }
          })
        }
        this.drag = true;
      },
      // ctrl加点击的多选
      clickCtrl() {
        this.$store.state.stageObj.children.map((obj) => {
          if (obj.id == this.nodeId) {
            this.$store.state.selectorObj.selectType=2;
            this.$store.state.selectorObj.selectList = obj;
            this.$store.state.selectorObj.selectType=1;
          }
        })
        this.drag = false
      },
      // shift加点击的多选
      clickShift() {
        let indexs = [], max, min;
        this.$store.state.stageObj.children.map((obj, index) => {
          this.indexId.map((num) => {
            if (num == obj.id) indexs.push(index)
          })
        })
        max = indexs[0]
        min = indexs[0]
        for (var i = 1; i < indexs.length; i++) {
          if (indexs[i] < min) min = indexs[i]
          if (indexs[i] > max) max = indexs[i]
        }
        this.$store.state.selectorObj.clearSelectList();
        this.$store.state.stageObj.children.map((obj, index) => {
          if (index >= min && index <= max) {
              this.$store.state.selectorObj.selectType=2;
              this.$store.state.selectorObj.selectList = obj;
              this.$store.state.selectorObj.selectType=1;
          }
        })
        if (this.indexId.length > 1) this.indexId.pop();
        this.drag = false;
      },
      handleMove(event) {
        if (event.event.movementY != 0) {
          this.$store.state.stageObj.children.map((obj) => {
            if(obj.id == this.nodeId) {
              this.$store.state.selectorObj.selectList.map((data) => {
                this.ids.push(data.id)
              })
              this.$store.state.selectorObj.clearSelectList();
              this.$store.state.selectorObj.selectList = obj;
            }
          })
        }
      },
      changeLayerStart(event) { 
        let list = this.$store.state.selectorObj.selectList;
        if(list.length == 1 && !list[0].parent)  this.indexId = [];
        this.nodeId = parseInt(event.node.id.split('_')[1]);
        this.$store.state.selectorObj.clickId = this.nodeId;
        if (this.indexId.length >= 2) this.indexId.shift();
        this.indexId.push(this.nodeId);
      },
      changeLayerEnd (event) {
        let lt = this.data3.length - 1
        this.nodeIndex = lt - event.oldIndex
        this.indexEnd = lt - event.newIndex;
        if (this.nodeIndex != this.indexEnd) {
          this.$store.dispatch('MOVE_LAYR',{list:this.$store.state.selectorObj.selectList, index: this.indexEnd, type: 'drag'})
        }
      },
      changeTargetObj(val){
        if (this.$store.state.stageObj.children) {
          let index, indexs = [], len = this.$store.state.stageObj.children.length - 1;
           this.$store.state.stageObj.children.map((obj, i) => {
            val.map((data) => {
              if (obj.id == data.id) {
                indexs.push(len - i)
              }
            })
          })
          $('.box').children().map((i,data) => {
            $(data).removeClass('pitch')
            })
          indexs.map((index) => {
            $($('.box').children()[index]).addClass('pitch')
          })
        }
      },
      targetChunk (node, type, id) {
        this.nodeId = id;
        let layer = node.edit.layer;
        if(type==="lock"){
          this.$store.dispatch("LOCK",{list:[node]})
        }else if(type==="hide"){
          this.$store.dispatch("HIDE",{list:[node]})
        }
        this.changeTargetObj(this.$store.state.selectorObj.selectList)
      },
      getNode (obj, node, deep) {
        this.$store.commit('SET_SELECT_LIST', { obj: obj })
      },
      allowDrog (from, to, type) {
        const fromTarget = from.data.parent.id
        const toTarget = to.data.parent.id
        if (fromTarget === toTarget && type != 'inner') return true
        else return false
      },
      reName (node) {
        this.$store.state.stageObj.children.map((obj) => {
          if(obj.id == this.nodeId) {
            this.nodes = obj;
          }
        })
        setTimeout(()=>{
          document.getElementsByClassName('node_input')[0].focus();
          $('.node_input').select();
        },100);
      },
        changeName(node){
        this.firstName = node.name
      },
      reNameFinish (node) {
        // TODO: node 当前选中对象
        const nodeId = node.data.id
        this.data3.forEach(val => {
          if (val.id === nodeId && $(`#val_${nodeId}`).val().length > 0) {
            let name = val.name
            val.name = $(`#val_${nodeId}`).val()
            this.nodes = null
            if (name != val.name) this.$store.commit("SET_SELECT_OBJ_VALUE", {arr:[val],key:'name',value:val.name,isStack:{modifyState:true,startContent:name}});
          } else this.getChild(val, nodeId, $(`#val_${nodeId}`).val())
        })
        if (this.$store.state.stageObj.isNameExist(node.data, node.data.name)) {
          // alert('该名称已经存在，请重新命名')
          this.$store.commit('ALERT',{data:'该名称已经存在，请重新命名',this:this})
          node.data.name = this.firstName;
        }
        if(node.data.name.length>20){
          // alert('该区域最大限度为8个字符')
          this.$store.commit('ALERT',{data:'该区域最大限度为20个字符',this:this})
          node.data.name = this.firstName;
        }
        let reg = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        if (!reg.test(node.data.name)) {
          this.$store.commit('ALERT',{data:'该名称只能以字母和下划线开头，并且只能含有字母下划线和数字',this:this})
          node.data.name = this.firstName;
        }
      },
      getChild (child, nodeId, newName) {
        if (child.children.length > 0) {
          child.children.forEach(val => {
            if (val.id === nodeId) {
              val.name = newName
              this.nodes = null
            }
            else this.getChild(val, nodeId, newName)
          })
        } else return false
      },
    }
  };
</script>
<style>
.SlickList {
  overflow-y: auto;
  overflow-x: hidden;
  height: 7.95rem;
}
  .SlickItem {
    box-sizing: border-box;
    color: #ffffff;
    width:100%;
    height: 0.4rem;
  }
  .layerDiv{
    width:100%;
    height:7.95rem;
    overflow:hidden;
  }
  .pitch {
    background: #666666!important;
  }
  .el-tree{
    background: #383838;
    overflow-x:hidden;
    overflow-y: scroll;
    height:100%;
    width:100%;
  }
  .el-tree-node__content{
    height:0.4rem;
    background: #383833;
    color: #ffffff;
    width:4rem;
  }
  .el-tree-node__content:hover{
    background: #383833;
  }
  .el-tree-node:focus>.el-tree-node__content{
    background:#777777;
    color: #ffffff;
    font-size:0.14rem;
  }
  .custom-tree-node{
    font-size:0.16rem;
    line-height:0.4rem;
    position: relative;
    padding-left: 0.2rem;
  }
  .el-tree__empty-text{
    font-size:0.12rem;
    color: #ffffff;
  }
  .node_input{
    width: 60%;
    text-align:left;
    color:#eee;
    border:none;
    outline: none;
    background-color:transparent;

  }

  .custom-tree-node .lockImg, .custom-tree-node .eyeImg{
    width:0.24rem;
    height:0.24rem;
    position: absolute;
  }
  .custom-tree-node .lockImgTwo, .custom-tree-node .eyeImgTwo{
    width:0.24rem;
    height:0.24rem;
    position: absolute;
  }

  .custom-tree-node .eyeImgTwo{
    background: url("../../../static/images/eye-open.png")center no-repeat;
    background-size:100%;
    top:0.07rem;
  }
  .custom-tree-node .eyeImg{
    background: url("../../../static/images/eye-close.png") center no-repeat;
    background-size:100%;
    top:0.07rem;
  }
  .custom-tree-node .lockImgTwo{
    background: url("../../../static/images/locked-1.png")center no-repeat;
    background-size:100%;
    top:0.06rem;
    margin-left:0.3rem;
  }
  .custom-tree-node .lockImg{
    background:url("../../../static/images/locked-4.png") center no-repeat;
    background-size:100%;
    top:0.06rem;
    margin-left:0.3rem;
  }
.el-tree-node__content>.el-tree-node__expand-icon{
display: none;
}
  .custom-tree-node .editImgSpan{ /*盛放锁定和隐藏图标的span容器*/
    display: block;
    height:100%;
    width:0.5rem;
    position: absolute;
    top:0rem;
    left:1.4rem;
  }
  .custom-tree-node .node-span{ /*类表显示名字的span容器*/
    display: block;
    width:1.2rem;
    height:100%;
    overflow: hidden;
  }


</style>
