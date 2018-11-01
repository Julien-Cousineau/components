import GeoJSON from  '../src/geojson';



const t = require('tape');
t('GeoJSON', (t) => {
    const geo = GeoJSON.fromArray([{x:1.0,y:1.0,prop1:"MyName"}]);
    // console.log(geo.features)
    // t.deepEqual(gradient.obj, {0:'#ff0000ff',1:'#00ff00ff'});
    // t.deepEqual( Color.parseString(gradient.interpolate(0)), Color.parseString('rgb(255,0,0)'));
    // t.deepEqual( Color.parseString(gradient.interpolate(1)), Color.parseString('rgb(0,255,0)'));
    
    // // t.deepEqual( Color.parseString(gradient.interpolate(0.5)), Color.parseString('rgb(0,255,0)')); //TODO
    
    // const gradient2 = new Gradient({id:'newgradient',stops:[0,1],colors:[new Color({r:255, g:0, b:0,a:0}),new Color({r:255, g:0, b:0,a:1})]});
    // t.deepEqual( Color.parseString(gradient2.interpolate(0.5)), Color.parseString('rgba(255,0,0,0.5)'));
    // t.deepEqual(gradient2.interpolate([0,0.5,1.0]).map(v=> Color.parseString(v)), [Color.parseString('rgba(255,0,0,0.0)'),Color.parseString('rgba(255,0,0,0.5)'),Color.parseString('rgba(255,0,0,1.0)')]);
    
    
   
    // t.deepLooseEqual(Gradient.parseName('Skyline').colors, new Gradient({stops:[0,1],colors:[Color.parseString('#1488CC'),Color.parseString('#2B32B2')]}).colors);
    // t.deepLooseEqual(Gradient.parseName('Skyline').stops, new Gradient({stops:[0,1],colors:[Color.parseString('#1488CC'),Color.parseString('#2B32B2')]}).stops);
   
    // t.equal(Gradient.parseName('Skyline').toJSON(),'{"0":"#1488ccff","1":"#2b32b2ff"}')
    // t.equal(Gradient.parse({"0":"#1488cc","1":"#2b32b2"}).toJSON(),'{"0":"#1488ccff","1":"#2b32b2ff"}')
    // t.equal(Gradient.parse('Skyline').toJSON(),'{"0":"#1488ccff","1":"#2b32b2ff"}')
    
    t.end();
});