import style from './style.scss'
import Color from '../color';
export default  class ColorPalette {
  constructor(options){
    if(!options)options={};
    this.colors = Color.materialcolors();
    this.hues = ['red','pink','purple','deepPurple','indigo','blue','lightBlue','cyan','teal','green','lightGreen','lime','yellow','amber','orange','deepOrange','brown','grey','blueGrey','white','black']
    // this.hues = ['red']
    this.shades = [50,100,200,300,400,500,600,700,800,900,'a100','a200','a400','a700'];
    this.callback = options.callback || function(color){console.log(color)};
  }
  render(element){
     const {colors,hues,shades}=this;
     const table=this.table = element.append('table').attr('class','colorpalette color_table')
     const tbody=this.tbody = table.append('tbody');
     
     // Header  
     const tr = tbody.append('tr');
     for(let h=0;h<hues.length;h++){
         const hue = hues[h];
         if(hue=='black' || hue=='white')this.createtr(tr,hue,hue);
         const color = colors[hue][500];
         if(color)this.createtr(tr,color,hue);
     }
     //  Main
     for(let s=0;s<shades.length;s++){
         const shade = shades[s];
         const tr = tbody.append('tr');
        for(let h=0;h<hues.length;h++){
            const hue = hues[h];
            const color = colors[hue][shade];
            if(color)this.createtr(tr,color,shade);
        }
     }
     
  }
  createtr(tr,color,title){
      const {callback}=this;
      const td = tr.append('td')
      .style('background',color)
      .attr('title',title);
      
      const fontcolor = (Color.parseString(color)).fontColor().rgba2str();
      
      td.append('p').text(title).style('color',fontcolor);
      if(callback)td.on('click',()=>callback(Color.parseString(color)));
      
  }
  
}
