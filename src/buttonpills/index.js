export default class ButtonPills {
  constructor(options){
    options = options || {}
    
    this.vertical= (typeof options.vertical ==='undefined')?false:options.vertical;
    this.buttons = options.buttons || [];
    this.className = options.className || null;
    this.callbacks = options.callbacks || {events:{}};
    this.stroke = (typeof options.stroke ==='undefined')?false:options.stroke;
    this.toggle = (typeof options.toggle ==='undefined')?false:options.toggle;
    this.doms = {};
    
    
  }
  render(element){
    this.element = element;
    
    const {vertical,buttons,stroke,onClick,toggle} = this;
    // const {color,stroke,small,active,round,disabled,textsize} = this;
    
    const dom = this.doms['parent'] = element.append('div');
    
    (vertical)?dom.classed('flex-parent-inline flex-parent--column',true):dom.classed('flex-parent-inline',true);
    
    const n=buttons.length;
    for(let i=0;i<n;i++){
        const button = buttons[i];
        const btn_dom=button.render(dom)['button'];
        (!stroke)?btn_dom.classed('btn--pill',true):btn_dom.classed('btn--pill-stroke',true);
        if(button.active && stroke)btn_dom.classed('btn--stroke',false);
        if(i==0){vertical?btn_dom.classed('btn--pill-vt',true):btn_dom.classed('btn--pill-hl',true)}
        else if(i==n-1){vertical?btn_dom.classed('btn--pill-vb',true):btn_dom.classed('btn--pill-hr',true)}
        else{vertical?btn_dom.classed('btn--pill-vc',true):btn_dom.classed('btn--pill-hc',true)}
        if(toggle){
            const _onClick = onClick.bind(this);
            btn_dom.on('click.pills',()=>{_onClick(button)});
        }
    }
  }
  onClick(button){
      const {buttons}=this;
      buttons.forEach(btn=>btn.setActive(false));
      button.setActive(true);
      
  }
}
