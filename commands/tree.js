const fs = require('fs')
const path = require('path')
const treeFn = (dirPath) => {
    if (!dirPath) {
        console.log('Using Current dir to display tree.....');
        dirPath = process.cwd()
    } else if (!fs.existsSync(dirPath)) {
        console.log('Invalid path to direcory.');
        return;
    }
    console.log('Building tree...');
    treeHelper(dirPath);
}
function treeHelper(dirPath, padCount = 0) {
    const childFiles = fs.readdirSync(dirPath, { encoding: 'utf-8' })
    for (const fileName of childFiles) {
        let indent = ''.padStart(padCount, ' ')
        const filePath = path.join(dirPath, fileName)
        const stats = fs.lstatSync(filePath)
        if (stats.isFile()) {
            console.log(indent, `├── ${fileName}`);
        } else {
            console.log(indent, `└── ${fileName}`);
            treeHelper(filePath, padCount + fileName.length + 4);
        }
    }
}
module.exports = treeFn