<script>
  export default{
    name:'editCommon',
    data(){
      return {
      }
    },
    methods:{
      getStyleValue(obj,styleN){//根据对象和key获得指定的属性值
        if(obj.type === "stage"){return""};
        if(styleN in obj){
          return obj[styleN]
        }else if ('style' in obj && styleN in obj.style){
          return obj.style[styleN]
        }else if(styleN === 'imageUrl'){
          return obj.texture.baseTexture.imageUrl;
        }else{
          return '没有此属性'
        }
      },
      getWidthHeight(obj){
        return {
          width:Math.abs(obj.width/obj.scale.x*this.stageScale)+"px",
          height:Math.abs(obj.height/obj.scale.y*this.stageScale)+"px",
        }
      },
      getWorldTransform(obj){
        let getFun  = (obj1,key)=>{
          if(key==="tx"||key==="ty"){return obj1.worldTransform[key]*this.stageScale}
          return obj1.worldTransform[key]
        };
        let matrix = getFun(obj,"a")+","+getFun(obj,"b")+","+getFun(obj,"c")+","+getFun(obj,"d")+","+getFun(obj,"tx")+","+getFun(obj,"ty");
        return"matrix("+matrix+")"
      },
      getWordScale(obj,x,y){
        let x1=x||1,y1=y||1;
       if(obj.parent){
         return this.getWordScale(obj.parent,obj.parent.scale.x*x1,obj.parent.scale.y*y1);
       }else{
         return{x:obj.scale.x*x1,y:obj.scale.y*y1,x1:x1,y1:y1};
       }
      },

      getBounds(pixiObj){
        let bounds = pixiObj.getBounds(true);
        // console.log('bounds',bounds);
        let rect={};
        rect.x = bounds.x*this.stageScale;
        rect.y = bounds.y*this.stageScale;
        rect.width = bounds.width*this.stageScale;
        rect.height = bounds.height*this.stageScale;
        return {rect:rect}
      },

      getMoreBounds(objArr){
        let minX =10000,minY=10000,maxX = -10000,maxY = -10000,sumWidth=0,sumHeight=0;
        objArr?objArr.map((obj,index)=>{
          let rect = obj.getBounds(true);
          sumHeight = rect.height+sumHeight;
          sumWidth = rect.width + sumWidth;
          minX = Math.min(parseInt(rect.x),minX);
          minY = Math.min(parseInt(rect.y),minY);
          maxX = Math.max(parseInt(rect.x+rect.width),maxX);
          maxY = Math.max(parseInt(rect.y+rect.height),maxY);
        }):"";
        let rect={};
        rect.x = minX*this.stageScale;
        rect.y = minY*this.stageScale;
        rect.width = (maxX-minX)*this.stageScale;
        rect.height = (maxY-minY)*this.stageScale;
        return {rect:rect}
      },
      getBaseStyle(obj){
       return {
         width:this.getWidthHeight(obj).width,
         height:this.getWidthHeight(obj).height,
         position:"absolute",
         left:"0rem",
         top:"0rem",
         transformOrigin:"left top",
         transform:this.getWorldTransform(obj)
       }
      }
    },
    computed:{
      stageScale(){
        return this.$store.state.stageParentSize.scale
      }
    }
  }
</script>
<style>
</style>

