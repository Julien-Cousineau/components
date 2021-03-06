const path = require('path');
const fs = require('fs');
const express = require('express');
// const http = require('http');
const cors = require('cors');
const compress = require('compression');
const bodyParser = require('body-parser');


// require('dotenv').config();

const PORT = 8080;
const app = express();
app.use(cors());
app.use(compress()); 
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
    })); 
    
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});


app.listen(PORT,'0.0.0.0', function() {
  console.log('Webserver is listening on port %d!',PORT);
});

