'use strict';
import style from './style.scss';
const d3 = require('../../dist/d3.min.js');
const { debounceD3Event, transparencyBackground } = require('../d3util');
export default class Popover {
  constructor(options) {
    if (!options) options = {}
    this.title = options.title || "{Name}";
    this._width = options.width || 0;
    this._height = options.height || 0;
    this.isheader = (typeof options.isheader === 'undefined') ? true : options.isheader;
    this.isstatic = (typeof options.isstatic === 'undefined') ? false : options.isstatic;
    this.isresize = (typeof options.isresize === 'undefined') ? true : options.isresize;
    this.datum = options.datum || { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, origin: { x: 0, y: 0 } };
    this.threshold = options.threshold || 20;
    this.relativeposition = (typeof options.relativeposition === 'undefined') ? false : options.relativeposition;
    this.callbacks = options.callbacks || {};



  }
  get height() { return this._height <= 0 ? 'auto' : this._height + "px" }
  get width() { return this._width <= 0 ? '100%' : this._width + "px" }
  get elementwidth() { return this.element.node().getBoundingClientRect().width }
  get elementheight() { return this.element.node().getBoundingClientRect().height }
  get containerwidth() { return this.container.node().getBoundingClientRect().width }
  get containerheight() { return this.container.node().getBoundingClientRect().height }

  setTop(opts) { this.setH(opts) }
  setBottom(opts) { this.setH(opts, true).style('top', '').style('bottom', 0) }
  setLeft(opts) { this.setV(opts) }
  setRight(opts) { this.setV(opts, true).style('right', 0) }

  setH(opts, bottom) {
    const { type, x, y } = opts;
    const { container, elementheight, containerheight } = this;
    const offset = (bottom) ? elementheight - containerheight : 0;
    if (type == 'end') this.datum.origin = { x: x, y: offset }

    this.container
      .style('width', 'auto')
      .style('top', 0)
      .style('bottom', '')
      .style('left', 0)
      .style('right', 0)
      .style('margin',0)
      .style("transform", "translate(0px,0px)");
    return container;
  }
  setV(opts, right) {
    const { type, x, y } = opts;
    const { container, threshold, elementwidth, containerwidth } = this;
    const offset = (right) ? elementwidth - containerwidth : 0;
    if (type == 'end') this.datum.origin = { x: offset, y: threshold + 1 }
    this.container
      .style('height', 'auto')
      .style('top', 0)
      .style('bottom', 0)
      .style('left', '')
      .style('right', '')
      .style('margin',0)
      .style("transform", "translate(0px,0px)");
    return container;
  }
  setFloat(opts) {
    const { type, x, y } = opts;
    if (type == 'end') this.datum.origin = { x: x, y: y }
    const { width, height, container } = this;
    container
      .style('width', width)
      .style('height', height)
      .style('top', this.topposition)
      .style('bottom', '')
      .style('left', '')
      .style('right', '')
      .style("transform", "translate({0}px,{1}px)".format(x, y));
  }
  drag() {

  }
  show(){
    this.container.style('display','')
  }
  hide(){
    this.container.style('display','none')
  }
  get topposition(){
    return (this.relativeposition)?'':0;
  }
  render(element) {
    const { title, width, height, isheader, datum, threshold, isresize, isstatic,topposition,callbacks } = this;
    this.element = element;
    
    
    
    const container = this.container = element.append("div")
      .attr('class', 'uipopover')
      .style('width', width)
      .style('height', height)
      .style('top', topposition)
      .style("transform", "translate({0}px,{1}px)".format(datum.origin.x, datum.origin.y));

    const trans = container.append("div")
      .attr('class', 'trans');


    if (isresize) {
      const handler = this.handler = {};
      handler.top = container.append("div").attr('class', 'handle top')
      handler.bottom = container.append("div").attr('class', 'handle bottom')
      handler.left = container.append("div").attr('class', 'handle left')
      handler.right = container.append("div").attr('class', 'handle right')
    }

    if (isheader) {
      const titlebar = container.append("div")
        .attr('class', 'header')
        
        
      const self = this;
      if (!isstatic) {
        const ondrag = function(d) {
          const { type, sourceEvent } = d3.event;
          if (type == 'start') {
            d.start = { x: sourceEvent.clientX, y: sourceEvent.clientY };
            d.end = { x: sourceEvent.clientX, y: sourceEvent.clientY };
          }

          if (type == 'drag' || type == 'end') d.end = { x: sourceEvent.clientX, y: sourceEvent.clientY };

          let x = Math.max(d.origin.x + (d.end.x - d.start.x), threshold);
          let y = Math.max(d.origin.y + d.end.y - d.start.y, threshold);
          let opts = { type: type, x: x, y: y };

          if (x <= threshold) return self.setLeft(opts);
          if (y <= threshold) return self.setTop(opts);
          if (x >= self.elementwidth - self._width - threshold) return self.setRight(opts);
          if (y >= self.elementheight - self._height - threshold) return self.setBottom(opts);
          self.setFloat(opts);

        };


        const d3drag = this.d3drag = d3.drag()
          .on("start drag end", debounceD3Event(ondrag, 10));


        titlebar.datum(datum).call(d3drag)
      }

      const titledom = titlebar.append("span").append("h2")
        .style('display', 'inline-block')
        .style('white-space', 'nowrap')
        .style('text-overflow', 'ellipsis')
        .style('font-size', '15px')
        .style('margin-bottom', '0')
        .text(title);

      const nav = titlebar.append("ul")
        .attr('class', 'nav navbar-right icons')
        .style('float', 'right!important')
        .style('margin-right', 0)

      const close = nav.append('li').append('a').attr('class', 'close-link')
      const closeicon = close.append('i').attr('class', 'fa fa-times')
      
      close.on('click',()=>self.hide())
      titlebar.append('div').attr('class', "clearfix");

    }
    const contentp = this.contentp = container.append('div').attr('class', "contentp");
    const content = this.content = contentp.append('div').attr('class', "content");
    return content;
  }


}
