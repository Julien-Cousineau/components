var fs = require('fs');
const path = './test/test2.binary'
const t = require('tape');
t('Write Binary File', async (t) => {
    const array = new Float32Array(582);
    for(let i=0;i<582;i++)array[i]=i / 582.0;
    
    const frombuffer = Buffer.from(array.buffer)
    await fs.writeFileSync(path, frombuffer);
    
    const buffer = await fs.readFileSync(path);
    
    const newarray = new Float32Array(buffer)
    t.deepEqual(array,newarray);
    t.end();
});
