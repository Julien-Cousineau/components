import {Navbar,Parent} from '../src/index.js';




const nb1  = new Navbar({
  items:{
    home:{title:'Name of Application',className:'active mr-md-2'},
    lang:{title:'en',callback:()=>console.log("language")},
    profile:{dropdown:{
        settings:{title:'Settings',icon:'fas fa-cog',callback:()=>console.log("setings")},
        info:{title:'Info',icon:'fas fa-info-circle',callback:()=>console.log("info")},
        github:{title:'Report Issues',icon:'fab fa-github',alt:'',callback:()=>console.log("report issues")},
        divider:{className:"dropdown-divider"},
        sign:{title:'Sign In',icon:"fas fa-sign-in-alt",callback:()=>{console.log('sign')}},
      }}
    }
});

nb1.render(Parent);




