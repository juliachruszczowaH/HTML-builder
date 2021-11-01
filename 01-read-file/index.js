const path = require('path');
const fs = require('fs');
const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'),'utf-8');
stream.on('data', partData => console.log(partData.trim()));