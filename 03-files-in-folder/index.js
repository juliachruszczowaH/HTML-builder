const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const folderPath = path.resolve(__dirname, './secret-folder');

async function readDirectory() {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });
    files
      .filter((i) => i.isFile())
      .forEach((file) => {
        const pathsToCheck = path.join(folderPath, file.name);
        fs.stat(pathsToCheck, (err, stats) => {
          console.log(`${path.parse(file.name).name} - ${path.extname(file.name).replace(/^\./, '')} - ${stats.size}b`);
        });
      });
  } catch (err) {
    console.error(err);
  }
}
readDirectory();
