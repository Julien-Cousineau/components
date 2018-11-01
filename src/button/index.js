export default class Button {
  constructor(options){
    options = options || {}
    this.text = options.text || null;
    this.title = options.title || null;  
    this.className = options.className || null;
    this.callbacks = options.callbacks || {events:{click:()=>console.log("click")}};
    this.doms = {};
    
    this.color = options.color || null;
    this.stroke = options.stroke || null;
    this.small = (typeof options.small ==='undefined')?false:options.small;
    this.active = (typeof options.active ==='undefined')?false:options.active;
    this.round = (typeof options.round ==='undefined')?false:options.round;
    this.disabled = (typeof options.disabled ==='undefined')?false:options.disabled;
    this.textsize = options.textsize || null; // xl,l,m,s,xs
    this.activable = (typeof options.activable ==='undefined')?false:options.activable;
    
  }
  render(element){
    this.element = element;
    
    const {text,title,className,callbacks,onClick} = this;
    const {color,stroke,small,active,round,disabled,textsize} = this;
    
    const dom = this.doms['button'] = element.append('button').attr('class','btn');
    
    if(color)dom.classed('btn--' + color, true);
    if(stroke)dom.classed('btn--stroke' + '{0}'.format(stroke==1?'':' stroke'), true);
    if(small)dom.classed('btn--s', true);
    if(active)dom.classed('is-active', true);
    if(round)dom.classed('round', true);
    if(className)dom.classed(className, true);
    if(textsize)dom.classed('txt-' + textsize, true);
    
    if(disabled)dom.attr('disabled',true);
    if(title)dom.attr('title',title);
    if(text)dom.text(text);
    
    for(let id in callbacks.events)dom.on(id,callbacks.events[id]);  
    
    dom.on('click.this',onClick.bind(this));
    return this.doms;
  }
  onClick(){
    const {activable} = this;
    if(activable)this.setActive(!this.active);
  }
  setActive(active){
    this.active=active;
    const dom = this.doms['button'];
    (active)?dom.classed('is-active', true):dom.classed('is-active', false);
  }
}
