import style from './style.scss'
export default class Pill {
  constructor(options){
    if(!options)throw new Error("Pill needs options");
    // if(!options.element)throw new Error("Pill needs a parent element")
    if(!options.id)throw new Error("Pill needs an id");
    this.id = options.id;
    // this.element = options.element;
    this.title = options.title || options.id;
    this.ishorizontal = (typeof options.ishorizontal ==='undefined')?false: options.ishorizontal;
    this.content = options.content || null;
    this.active = (typeof options.active === undefined)?false:options.active;    
    this.callbacks = options.callbacks || {};
  }
  render(elementH,elementC){
    if(!elementH || !elementC)throw new Error("Pill needs two elements to render");        
    const {id,active,title,content,ishorizontal} = this;         
    this.tabheader = elementH
              .append("a")
              .attr('class','nav-link {0}'.format((active)?'active':''))
              .attr('data-toggle','pill')
              .attr('href','#nav_content_{0}'.format(id))
              .attr('role','tab')
              .attr('aria-controls','nav_content_{0}'.format(id))
              .attr('aria-selected','true')
              .style('padding','5px')
    if(this.callbacks.click)this.tabheader.on('click',this.callbacks.click);
    
    this.p = this.tabheader.append('p').style('margin',0).style('text-align','center').text(title);
    
    if(ishorizontal)this.p.style('writing-mode','vertical-lr');
    
    const tabcontent = this.tabcontent = elementC
              .append("a")
              .attr('id','nav_content_{0}'.format(id))
              .attr('class','tab-pane fade {0}'.format((active)?'show active':''))
              .attr('role','tabpanel')
              .attr('aria-labelledby','nav_content_{0}'.format(id))
              .attr('aria-selected','true'.format(id));
    if(content && content.render)content.render(tabcontent);
    return this;
  }
  show(){
    $(this.tabheader.node()).tab('show');
    return this;
  }
  clear(){
    this.tabcontent.html("");
    return this;
  }
}