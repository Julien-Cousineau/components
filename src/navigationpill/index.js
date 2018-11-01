

export default class NavigationPill{
   constructor(options){
     if(!options)throw new Error("NavigationPill needs options");        
     this.style = options.style || 'style1';
     this.ishorizontal = (typeof options.ishorizontal ==='undefined')?false: options.ishorizontal;
     this.pills = options.pills || {};    
   }
  render(element){
    if(!element)throw new Error("NavigationPill needs element to render");
    const {style,ishorizontal,pills}=this;
    this.element = element; 
    
    const row = element.append("div").attr('class','nocontainer').style('height','100%')
                       .append("div").attr('class','row no-gutters').style('height','100%');
    
    // const col1w = (ishorizontal)?1:3;
    // const col2w = (ishorizontal)?11:9;
    
     const list = this.list = row
       .append("div").attr('class','col-sm-1').style('background','#eceff1').style('box-shadow','inset rgba(0, 0, 0, 0.26) 0 0px 4px 0').style('-ms-flex','0 0 230px').style('flex','0 0 {0}px'.format((ishorizontal)?50:100))
       .append("div").attr('class','nav flex-column nav-pills').attr('role',"tablist").attr("aria-orientation","vertical");  
       

     const content = this.content = row
       .append("div").attr('class','col-sm-11') 
       .append("div").attr('class',"tab-content pillcontent");
     
     for(const id in pills){
         pills[id].render(list,content)
         
     }
  }
  show(id){
      const {pills}=this;
      pills[id].show();
      
  }
  
}