import Color from '../src/color';

const t = require('tape');
t('Color.parse', (t) => {
    t.deepEqual(Color.parseString('red'), new Color({r:255, g:0, b:0,a:1}));
    t.deepEqual(Color.parseString('#ff00ff'), new Color({r:255, g:0, b:255,a:1}));
    t.deepEqual(Color.parseString('invalid'), undefined);
    t.deepEqual(Color.parseString(null), undefined);
    t.deepEqual(Color.parseString(undefined), undefined);
    t.end();
});

t('Color#toString', (t) => {
    const purple = Color.parseString('purple');
    t.deepEqual(purple && purple.rgba2str(), 'rgba(128,0,128,1)');
    const translucentGreen = Color.parseString('rgba(26, 207, 26, .73)');
    t.deepEqual(translucentGreen && translucentGreen.rgba2str(), 'rgba(26,207,26,0.73)');
    t.end();
});

