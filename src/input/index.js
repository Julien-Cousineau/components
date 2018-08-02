export default  class Input {
  constructor(options){
    this.title  = options.title  || '';
    this.type   = options.type   || 'text';
    this.min    = options.min    || null;
    this.max    = options.max    || null;
    this.value  = options.value  || 0;
    this.margin = options.margin || '0 0.5rem';
    this.callback = options.callback|| function(){console.log(this.value)};
  }
  render(element){
    const {title,margin,type,min,max,value,callback} = this;
    const fg = element.append('div').attr('class','form-group');
    if(title!='')this.label = fg.append('label').style('margin',margin).text(title);
    const input = this.input = fg.append('input')
    .attr('class','form-control input-sm')
    .attr('type',type)
    .style('width','2.5rem')
    .style('padding','0 0 0 0.2rem')
    .style('font-size','0.75rem')
    .style('text-align','center')
    .attr('value',value)
   
   
    
    if(type=='text'){
      input.style('width', '4.5rem')
      input.style('padding', '0 0.3rem')
       input.on('change paste',()=>callback(this.input.node().value))
    }
    if(type=='number'){
      if(min)input.attr('min',min)
      if(max)input.attr('max',max)   
      input.on('change keydown paste input',()=>callback(this.input.node().value))
    }
    return fg
  }
}