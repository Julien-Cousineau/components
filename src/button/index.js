export default class Button {
  constructor(options){
    if(!options)throw new Error("Button needs options");
    this.title = options.title || '{Name}';  
    this.classes = options.classes || 'btn btn-primary';
    this.callback = options.callback || null;
  }
  render(element){
    const {title,classes,callback} = this;
    const dom = this.dom = element.append('button')
    .attr('class','{0}'.format(classes))
    .text(title);    
    if(callback)dom.on('click',callback);
  }
}
