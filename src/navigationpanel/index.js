import GUISProgram from '../stylegui/sprogram.js'
// import GUIAttributeSLF from '../stylegui/styleattributeslf.js'
  function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
export default class NavigationPanel {
  constructor(options){
    // if(!options)throw new Error("NavigationPanel needs options");        
    // this.styles = options.styles || [];   
    this.slayer = null;
    this.slayer = null;
    this.callbacks = options.callbacks || {};
  }
  render(element){
    if(!element)throw new Error("NavigationPanel needs element to render");   
    this.element = element; 
    this.trow   =  this.element.append('div').attr('class','row');
    this.title =  this.trow.append('div').attr('class','col-sm-6').append('h4');
    this.a =  this.trow.append('div').attr('class','col-sm-6').append('a');
    this.a.append('i').attr('class','far fa-save');
    this.a.on('click',()=>{
      downloadObjectAsJson(this.slayer.obj,'style')
    })
    

    this.row = element
      .append("div")
      .attr('class','row')
      .style("margin",'1px')
      .append("div")
      .attr('class','col-sm-12')
    // this.show();   
    return this;
  }
    show(slayer,attribute){    
    const {row} = this;    
    this.slayer = slayer;
    this.title.text(attribute.title);
    row.html("")
    const callbacks=this.callbacks;
    // const stylegui = new StyleGUIAttributeSLF({_attribute:()=>attribute,callbacks:callbacks})
    // stylegui.render(row);
    return this;

  }
}