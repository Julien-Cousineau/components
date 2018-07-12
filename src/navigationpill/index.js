

export default class NavigationPill{
   constructor(options){
     if(!options)throw new Error("NavigationPill needs options");        
     this.style = options.style || 'style1';
     this.pills = options.pills || [];    
   }
  render(element){
    if(!element)throw new Error("NavigationPill needs element to render");
    const {style}=this;
    this.element = element; 
    const row = element
       .append("div").attr('class','row {0}'.format(style));
    
     const list = this.list = row
       .append("div").attr('class','col-2')
       .append("div").attr('class','nav flex-column nav-pills').attr('role',"tablist").attr("aria-orientation","vertical");  
  
     const content = this.content = row
       .append("div").attr('class','col-10') 
       .append("div").attr('class',"tab-content");
     
     this.changePills();
  }
  changePills(_pills){    
    const {list,content} = this;    
    this.pills = _pills || this.pills;            
    this.pills.forEach(pill=>pill.render(list,content));    
  }
  
}