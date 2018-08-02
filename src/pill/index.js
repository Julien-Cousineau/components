export default class Pill {
  constructor(options){
    if(!options)throw new Error("Pill needs options");
    // if(!options.element)throw new Error("Pill needs a parent element")
    if(!options.id)throw new Error("Pill needs an id");
    this.id = options.id;
    // this.element = options.element;
    this.title = options.title || options.id;
    this.navpanels = options.navpanels;
    this.active = (typeof options.active === undefined)?false:options.active;    
  }
  render(elementH,elementC){
    if(!elementH || !elementC)throw new Error("Pill needs two elements to render");        
    const {id,active,title,navpanels} = this;         
    this.tabheader = elementH
              .append("a")
              .attr('class','nav-link {0}'.format((active)?'active':''))
              .attr('data-toggle','pill')
              .attr('href','#nav_content_{0}'.format(id))
              .attr('role','tab')
              .attr('aria-controls','nav_content_{0}'.format(id))
              .attr('aria-selected','true')
              .text(title);
    
    const tabcontent = this.tabcontent = elementC
              .append("a")
              .attr('id','nav_content_{0}'.format(id))
              .attr('class','tab-pane fade {0}'.format((active)?'show active':''))
              .attr('role','tabpanel')
              .attr('aria-labelledby','nav_content_{0}'.format(id))
              .attr('aria-selected','true'.format(id));
    if(navpanels)navpanels.render(tabcontent);
    
  }    
}