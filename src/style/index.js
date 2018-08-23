
export default  class Style {
  constructor(options){
      if(!options)options={}
      this.id = options.id || 'myid';
      this.paint = options.paint ||{
        circle:{
            "circle-color": "#888",
          },
        line:{
            "line-color": "#888",
        },      
        fill:{
            "fill-color": "#888",
          }
      }
  }
}