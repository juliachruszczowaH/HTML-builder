const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');
const outputStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), 'utf-8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.stdout.write('\x1b[1;35mEnter your text:\x1b[0m\n');

rl.on('line', (line) => {
  if (line.trim() === 'exit') {
    rl.close();
  } else {
    outputStream.write(`${line}\n`)
  }

});
rl.on('close', () => {
  process.stdout.write('\x1b[1;33mGoodbye!\x1b[0m Check written file --> \x1b[4;34mtext.txt\x1b[0m \n');
  outputStream.end();
});

rl.on('SIGINT', () => {
  rl.close();
});
