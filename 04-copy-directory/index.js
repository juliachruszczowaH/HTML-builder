const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const folderPath = path.resolve(__dirname, './files');
const copiedPath = path.join(__dirname, './files-copy');
fs.mkdir(copiedPath, { recursive: true }, (err) => {
  if (err) console.log(`Error creating directory: ${err}`);
  // Directory now exists.
});

async function copyDirectory() {
  try {
    const files = await readdir(folderPath);
    files.forEach((file) => {
      fs.createReadStream(path.join(folderPath, file)).pipe(fs.createWriteStream(path.join(copiedPath, file)));
    });
  } catch (err) {
    console.error(err);
  }
}
copyDirectory();
