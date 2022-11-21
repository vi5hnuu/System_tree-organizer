let inpArr = process.argv.slice(2)
const fs = require('fs')
const path = require('path')
const types = require('./utility')
//node main.js tree "directory path"
//node main.js organize "directory path"
//node main.js help

///////////////////////////////////////////////////////////////////
// const types = {
//     media: ["mp4", "mkv"],
//     archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
//     documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex', 'ppt'],
//     app: ['exe', 'dmg', 'pkg', "deb", "msi"],
//     images: ['png', 'jpeg']
// }
///////////////////////////////////////////////////////////////////
//node main.js tree "directory path"
let command = inpArr[0]
switch (command) {
    case 'tree': treeFn(inpArr[1]); break;
    case 'organize': organizeFn(inpArr[1]); break;
    case 'help': helpFn(inpArr[1]); break;
    default:
        console.log('Please Input Right Command.😊');
}

function treeFn(dirPath) {
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
            console.log(indent, `🖺 ${fileName}`);
        } else {
            console.log(indent, `📁 ${fileName} ↴ `);
            treeHelper(filePath, padCount + fileName.length + 5);
        }
    }
}

function organizeFn(dirPath) {
    //sudo code
    //1. input -> dir path given
    if (!dirPath) {
        console.log('Kindly enter the path.');
    } else if (!fs.existsSync(dirPath)) {
        console.log('Invalid path to direcory.');
        return;
    }

    //2. create ->  organized-files -> directory
    const destPath = path.join(dirPath, 'organized_files')
    if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath)
        console.log(`Directory created : ${destPath}`);
    } else {
        console.log(`
        Directory exist :
                Skipping Directory creation...
        `);
    }
    organizeHelper(dirPath, destPath);
}

function organizeHelper(sourceDir, destDirPath) {
    //3. check all files -> identify to which category they belong
    //files inside the source dir
    const childFiles = fs.readdirSync(sourceDir, { encoding: 'utf-8' })
    for (const fileName of childFiles) {
        const childAddress = path.join(sourceDir, fileName)
        const isFile = fs.lstatSync(childAddress).isFile()

        //4. copy / cut files to that organized directory to there particular directory.
        //if this is not file we skip.
        if (!isFile) {
            continue;
        }
        const category = getCategory(fileName);
        sendFile2(destDirPath, childAddress, category);
    }
}

function sendFile2(destBasePath, childAddress, category) {
    let categoryPath = path.join(destBasePath, category);
    const isPathExist = fs.existsSync(categoryPath);
    if (!isPathExist) {
        fs.mkdirSync(categoryPath);
    }
    //new file name same as orignial file name
    const newFileName = path.basename(childAddress);
    let destFilePath = path.join(categoryPath, newFileName);
    const isFileAlreadyExist = fs.existsSync(destFilePath);
    if (isFileAlreadyExist) {
        console.log('Duplicate found....');
        categoryPath = path.join(destBasePath, 'duplicates')
        const isPathExistt = fs.existsSync(categoryPath);
        if (!isPathExistt) {
            fs.mkdirSync(categoryPath);
        }
        destFilePath = path.join(categoryPath, newFileName);
    }
    console.log(`Copying ${childAddress} -> ${categoryPath}`);
    fs.copyFileSync(childAddress, destFilePath);
    fs.unlink(childAddress, () => {
        console.log(`Original file removed : ${childAddress}`);
    })
}
function getCategory(fileName) {
    const ext = path.extname(fileName).slice(1);
    for (const category in types) {
        for (extension of types[category]) {
            if (ext === extension) {
                return category;
            }
        }
    }
    //category not found
    return 'others'
}

function helpFn(dirPath) {
    console.log(`
    Valid Commands
            node main.js tree "directory path"
            node main.js organize "directory path"
            node main.js help
    `);
}