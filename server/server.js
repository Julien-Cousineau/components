const path = require('path');
const fs = require('fs');
const express = require('express');
// const http = require('http');
const cors = require('cors');
const compress = require('compression');
const bodyParser = require('body-parser');


// require('dotenv').config();


const app = express();
app.use(cors());
app.use(compress()); 
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
    })); 
    
app.use(express.static(path.join(__dirname, '../build')));


export default app;
