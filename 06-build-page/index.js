const fs = require('fs');
const path = require('path');
const { readdir, rm, mkdir } = require('fs/promises');
const assetsFolderPath = path.join(__dirname, './assets');
const stylesFolderPath = path.join(__dirname, './styles');
const templatesPath = path.join(__dirname, './components');
const newPath = path.join(__dirname, 'project-dist');
async function createFolder(path) {
  try {
    await access(path);
  } catch (err) {
    try {
      await mkdir(path, { recursive: true });
    } catch (error) {
      console.error(error);
    }
  } finally {
    try {
      await rm(path, { recursive: true, force: true });
      await mkdir(path, { recursive: true });
    } catch (err) {
      console.error(err);
    }
  }
  return path;
}

async function copyDirectory(folder, outputFolder) {
  const pp = await createFolder(outputFolder);
  try {
    const files = await readdir(folder, { withFileTypes: true });
    files.forEach((file) => {
      if (file.isFile()) {
        fs.createReadStream(path.join(folder, `/${file.name}`)).pipe(fs.createWriteStream(path.join(pp, file.name)));
      } else {
        createFolder(path.join(outputFolder, file.name)).then((p) => {
          copyDirectory(path.join(folder, file.name), p);
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}
async function bundleCss(projectPath) {
  try {
    const files = await readdir(stylesFolderPath, { withFileTypes: true });
    const outputStreamCSS = fs.createWriteStream(path.join(projectPath, 'style.css'));
    files.forEach(async (file) => {
      if (file.isFile() && path.extname(file.name) == '.css') {
        const stream = fs.createReadStream(path.join(stylesFolderPath, file.name));

        stream.on('data', (partData) => outputStreamCSS.write(`${partData}\n`));
      }
    });
  } catch (err) {
    console.error(err);
  }
}
async function createHTML(projectPath) {
  try {
    const files = await readdir(templatesPath, { withFileTypes: true });
    const streamTemplate = fs.createReadStream(path.resolve(__dirname, 'template.html'));
    const outputStreamHTML = fs.createWriteStream(path.join(projectPath, 'index.html'));
    streamTemplate.on('data', (tempData) => {
      let result = tempData.toString();
      files.forEach((file, index) => {
        if (file.isFile() && path.extname(file.name) == '.html') {
          const stream = fs.createReadStream(path.join(templatesPath, file.name));
          stream.on('data', (partial) => {
            result = result
              .split(`{{${path.parse(file.name).name}}}`)
              .join(`\n${partial.toString()}\n`)
              .toString();

            if (index === files.length - 1) {
              outputStreamHTML.write(result);
            }
          });
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
}

async function createPage(newPath) {
  try {
    const folder = await createFolder(newPath);
    copyDirectory(assetsFolderPath, path.join(folder, 'assets'));
    createHTML(newPath);
    bundleCss(newPath);
  } catch (err) {
    console.log(err);
  }
}

createPage(newPath);
