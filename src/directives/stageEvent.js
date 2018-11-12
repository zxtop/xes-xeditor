/**
 *响应和触发渲染器发出的事件，主舞台区域事件；
 */
export const EMIT_EVENT = function (event,vueObj){
  event.on("click", ev => {
    vueObj.$store.dispatch("STAGE_ACTIVE",ev);
  });
  event.on("dblclick", ev => {
    vueObj.$store.dispatch("STAGE_ACTIVE",ev);
  });
  event.on("mousedown", ev => {
    vueObj.$store.dispatch("STAGE_ACTIVE",ev);
  });
  event.on("mouseup", ev => {
    // vueObj.$store.dispatch("STAGE_ACTIVE",ev);
  });
  event.on("mouseout", ev => {
    // vueObj.$store.dispatch("STAGE_ACTIVE",ev);
  });
  event.on("mouseover", ev => {
    // vueObj.$store.dispatch("STAGE_ACTIVE",ev);
  });
  event.on("mousemove",ev=>{
    // vueObj.$store.dispatch("STAGE_ACTIVE",ev);
  });
  event.on("keydown", ev => {
    vueObj.$store.dispatch("STAGE_ACTIVE",ev);
  });
  event.on("keyup", ev => {
    vueObj.$store.dispatch("STAGE_ACTIVE",ev);
  });
};

