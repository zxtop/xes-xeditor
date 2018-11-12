<script>
  export default {
    name:'TypeCommon',
    data(){
      return {
      }
    },
    methods:{
      getId(obj,id){
        let getIdObj = function(obj,id) {
          if ("id" in obj && obj.id === id * 1) {
            return obj
          } else if ("children" in obj && obj.children.length > 0) {
            let len = obj.children.length;
            for (let i = 0; i < len; i++) {
              if (getIdObj(obj.children[i], id)) {
                return getIdObj(obj.children[i], id);
              }
            }
          }
        }
        return getIdObj(obj,id)
      },
      getObj(obj,id){
        // console.log(id)
        let getIdObj = function(obj,id) {
          if ("id" in obj && obj.id === id * 1) {
            return obj
          } else if ("children" in obj && obj.children.length > 0) {
            let len = obj.children.length;
            for (let i = 0; i < len; i++) {
              if (getIdObj(obj.children[i], id)) {
                return getIdObj(obj.children[i], id);
              }
            }
          }
        }
        return getIdObj(obj,id).children[0].text
        console.log(getIdObj(obj,id).children[0].text)

      },
    }
  }
</script>
