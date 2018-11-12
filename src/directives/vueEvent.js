/**
 * vue自定义指令，用来处理某一个区域的事件
 */

import Vue from "vue";
export const event = Vue.directive("event",{
    // bind:function (el,binding){
    //     let store = binding.value;
    //     el.addEventListener("click",(ev)=>{
    //         // store.dispatch("EDIT_ACTION",ev)
    //     });
    //     el.addEventListener('mousedown',ev=>{
    //        // store.dispatch("EDIT_ACTION",ev)
    //     });
    //     el.addEventListener("dblclick",ev=>{
    //        store.dispatch("EDIT_ACTION",ev)
    //     });
    //     el.addEventListener("keydown",ev=>{
    //        store.dispatch("EDIT_ACTION",ev)
    //     });
    //    el.addEventListener("keypress",ev=>{
    //        // store.dispatch("EDIT_ACTION",ev)
    //    });
    //    el.addEventListener("keyup",ev=>{
    //        store.dispatch("EDIT_ACTION",ev)
    //    });
    // }
});
