'use strict';
// import style from './style.scss';
// const d3 = require('../../dist/d3.min.js');
// import Bar  from '../bar';
// const {extend} = require('@julien.cousineau/util');
// const { debounceD3Event, transparencyBackground } = require('../d3util');
export default class Header {
  constructor(options) {
    if (!options) options = {}
  

  }

  get parentwidth() { return this.parent.node().getBoundingClientRect().width }
  get parentheight() { return this.parent.node().getBoundingClientRect().height }
  

  render(parent) {
  
    this.parent = parent;
    const element = this.element = parent.append("div")
      .attr('class', 'header')
    const navbar =element.append('nav')
                        .attr('class','navbar navbar-expand-lg navbar-dark bg-dark')
    
    const  logo = navbar.append('span').attr('class',"navbar-brand")
                        .append('img').attr('class',"toplogo invert")
    
    const button = navbar.append('button')
                .attr('class','navbar-toggler')
                .attr('type','button')
                .attr('data-toggle','collapse')
                .attr('data-target','#navbarNavDropdown')
                .attr('aria-controls','navbarNavDropdown')
                .attr('aria-expanded','false')
                .attr('aria-label','Toggle navigation')
                .append('span')
                .attr('class',"navbar-toggler-icon")
    const iconscontainer = navbar.append('div').attr('class','collapse navbar-collapse').attr('id',"navbarNavDropdown")
                                 .append('ul').attr('class','nav navbar-nav ml-auto')
    
   
   iconscontainer.append('li').attr('class','nav-item').append('a').attr('class','nav-link').text('icon1')
   
   

// <div class="header">        

//           <div class="jumbotroncontainer">
//             <input id="radio-1" type="checkbox">
//             <div class="jumbotron jumbotron-fluid">
//               <div class="container-fluid">
//                 <div class="row" style="min-height: 60px;">
//                   <div class="col-sm-12 col-md-4 d-none d-md-block">
//                     <div class="centerContainer">
//                       <span style="text-align: right;"><h1 class="bannerTitle small" keyword="titles" keywordtype="text">{1}</h1><h1 class="bannerTitle large" keyword="titlel" keywordtype="text">{2}</h1></span>
//                     </div>
//                   </div>
//                   <div class="col-sm-12 col-md-4">
//                     <div class="centerContainer">
//                       <h1 class="bannerTitle center" keyword="titlec" keywordtype="text">{3}</h1>
//                     </div>
//                   </div>
//                   <div class="col-sm-12 col-md-4 d-none d-md-block">
//                     <div class="centerContainer">
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//             </div>
//             <label for="radio-1" class="noselect"></label>
//           </div>
//         </div>
  
      


    
  }


}