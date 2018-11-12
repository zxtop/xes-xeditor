let a = ['a','b','v'],b={list:['1']}
a.map(function(){
  console.log(this)
},b)
console.log(b)
