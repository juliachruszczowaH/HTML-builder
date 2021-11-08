const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const folderPath = path.resolve(__dirname, './styles');
const outputStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

async function bundleCss() {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });
    files.forEach(async (file) => {
      if (file.isFile() && path.extname(file.name) == '.css') {
        const stream = fs.createReadStream(path.join(folderPath, file.name), 'utf-8');
        for await (const chunk of stream) {
          outputStream.write(`${chunk}\n`);
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}
bundleCss();
