const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const assetsFolderPath = path.join(__dirname, './assets');
const stylesFolderPath = path.join(__dirname, './styles');
const templatesPath = path.join(__dirname, './components');
const newPath = path.join(__dirname, './project-dist');
const copiedPath = path.join(__dirname, 'project-dist', './assets');
const outputStreamCSS = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
const outputStreamHTML = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));

async function createFolder(folder) {
  fs.mkdir(folder, { recursive: true }, (err) => {
    if (err) console.log(`Error creating directory: ${err}`);
  });
}

async function copyDirectory(folder, outputFolder) {
  try {
    const files = await readdir(folder, { withFileTypes: true });
    files.forEach((file) => {
      if (file.isFile()) {
        fs.createReadStream(path.join(folder, `/${file.name}`)).pipe(
          fs.createWriteStream(path.join(outputFolder, file.name))
        );
      } else {
        createFolder(path.join(outputFolder, `/${file.name}`)).then(() => {
          copyDirectory(path.join(folder, `/${file.name}`), path.join(outputFolder, `/${file.name}`));
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}
async function bundleCss() {
  try {
    const files = await readdir(stylesFolderPath, { withFileTypes: true });
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) == '.css') {
        const stream = fs.createReadStream(path.join(stylesFolderPath, file.name));
        stream.on('data', (partData) => outputStreamCSS.write(`${partData}\n`));
      }
    });
  } catch (err) {
    console.error(err);
  }
}
async function createHTML() {
  try {
    const files = await readdir(templatesPath, { withFileTypes: true });
    const streamTemplate = await fs.createReadStream(path.resolve(__dirname, 'template.html'));
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
createFolder(newPath).then(async () => {
  createFolder(copiedPath);
});

copyDirectory(assetsFolderPath, copiedPath);
bundleCss();
createHTML();
