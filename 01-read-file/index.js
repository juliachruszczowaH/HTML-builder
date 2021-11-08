const path = require('path');
const fs = require('fs');
async function readFileData(filePath) {
  let data = '';
  const stream = fs.createReadStream(filePath, 'utf-8');
  for await (const chunk of stream) {
    data += chunk;
  }
  console.log(data.trim());
}

readFileData(path.resolve(__dirname, 'text.txt'));
