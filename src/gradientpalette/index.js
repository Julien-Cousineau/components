import style from './style.scss'
import Color from '../color';
import Gradient from '../gradient';
export default  class GradientPalette {
  constructor(options){
    if(!options)options={};
    const gradients = this.gradients = Gradient.parseuigradients();
    
    for(const id in gradients)gradients[id]={gradient:gradients[id]}
    
    
    this.groups = {
        clear:{color:"repeating-linear-gradient(-45deg,white,red 2px,white 2px,white 4px)"},
        red:{color:Color.parseString("#cb2d3e").rgb2str()},
        orange:{color:Color.parseString("#d76b26").rgb2str()},
        yellow:{color:Color.parseString("#ffd200").rgb2str()},
        green:{color:Color.parseString("#159957").rgb2str()},
        cyan:{color:Color.parseString("#1cb5e0").rgb2str()},
        blue:{color:Color.parseString("#155799").rgb2str()},
        magenta:{color:Color.parseString("#ef32d9").rgb2str()},
        white:{color:Color.parseString("#eaeaea").rgb2str()},
        gray:{color:Color.parseString("#c0c0cb").rgb2str()},
        black:{color:Color.parseString("#333333").rgb2str()},
    }
    
    this.callback = options.callback || function(color){console.log(color)};
  }
  render(element){
      this.element = element;
     const {gradients,groups}=this;
     const container=this.container = element.append('div').attr('class','container-fluid gradientpalette')
     const rowheader= container.append('div').attr('class','row')
     const colgroup=this.colgroup = rowheader.append('div').attr('class','col-sm-8  order-2 order-sm-1')
                                             .append('div').attr('class','color-group btn-group d-flex')
     const self=this;
     for(let id in groups){
         
      const btn = groups[id].btndom = colgroup.append('button').attr('class','btn w-100').on('click',()=>self.clickbtn(id))   
      const color = groups[id].colordom = btn.append('div').attr('class','gcolor').style('background',groups[id].color)   
     }
     
     const colsearch=this.colsearch = rowheader.append('div').attr('class','col-sm-4  order-1 order-sm-2')
     const input = colsearch.append('input')
     .attr('type','text')
     .attr('class','form-control')
     .attr('placeholder','Search')
     .attr('autocomplete','off')
     .on('change paste keyup',()=>{self.removeActive();self.createPalette(null,input.node().value)})
     
     
     
     this.colbody= container.append('div').attr('class','row').style('padding-bottom','5px')
                             .append('div').attr('class','col')
                             .append('div').attr('class','colorpanels')
    this.createPalette()

  }
  createPalette(colorgroup,name){
     const {gradients,colbody,callback}=this;
     colbody.html('')
     for(let id in gradients){
         
         if(name && !id.toLowerCase().includes(name.toLowerCase()))continue;
         
         if(colorgroup && colorgroup!='clear' && !gradients[id].gradient.colorgroups().includes(colorgroup))continue;
         const dom = gradients[id].dom = colbody.append('div')
         .attr('class','colorpanel')
         .style('background',gradients[id].gradient.background)
         .style('color',gradients[id].gradient.fontColorstr())
         if(callback)dom.on('click',()=>callback(gradients[id].gradient))
        gradients[id].font = dom.append('div').attr('class','spancontainer').attr('title',id).append('div').attr('class','textcontainer').append('p').text(id)
     }      
  }
  clickbtn(id){
      const {gradients,groups}=this;
      this.removeActive();
      groups[id].btndom.attr('class','btn w-100 active')
      this.createPalette(id);
      
  }
  removeActive(){
      const {gradients,groups}=this;
      for(let id in groups)groups[id].btndom.attr('class','btn w-100')
      
  }
  
  
}
