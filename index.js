const fs = require('fs');
const {
    execSync
} = require('child_process');

const OUTPUT_PREFIX = 'processed_'

function deleteFiles(path) {

    if(path.match(`^${OUTPUT_PREFIX}*`,'gi')) {
        fs.unlinkSync(path);
        return false;
    }
    else {

        return true
    }
    
}

function readFiles(path) {

    return fs.readdirSync(path)
}

function processFile(file) {

    var caption = file.match(/[A-Z\-]+.jpg/gi)[0]
    .replace(/.jpg/gi,'')
    .replace(/-/gi,' ')
    .replace(/(?:^|\s)\S/g, c => c.toUpperCase());

    console.log( caption )

    const cmd = `magick ${file} -size 240x240 -resize 1920x1080 -font Arial-Bold -pointsize 80 -stroke black -strokewidth 3 -fill white -gravity SouthEast -draw "text 30,30 '${ caption }'" processed_${ file }`
    
    return execSync(cmd)
}

const files = readFiles('.')
.filter(file => deleteFiles(file))
.filter(file => file.match(/\w+.jpg$/gi))
.map(jpg => processFile(jpg));