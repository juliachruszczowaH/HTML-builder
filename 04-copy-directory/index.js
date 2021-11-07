const fs = require('fs');
const path = require('path');
const { readdir, mkdir, rm } = require('fs/promises');
const folderPath = path.resolve(__dirname, './files');
const copiedPath = path.join(__dirname, './files-copy');
async function createFolder(path) {
  try {
    await rm(path, { recursive: true });
    await mkdir(path, { recursive: true });
  } catch (err) {
    console.error(err);
  }
}

async function copyDirectory(resourceFolder, newFolder) {
  try {
    const files = await readdir(resourceFolder);
    files.forEach((file) => {
      fs.createReadStream(path.join(resourceFolder, file)).pipe(fs.createWriteStream(path.join(newFolder, file)));
    });
  } catch (err) {
    console.error(err);
  }
}
async function copyDir(resourceFolder, newFolder) {
  try {
    await createFolder(newFolder);
    await copyDirectory(resourceFolder, newFolder);
  } catch (err) {
    console.error(err);
  }
}

copyDir(folderPath, copiedPath);
