const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_PREFIX = 'processed_'
const OUTPUT_NAME = 'output'
const TIME_PER_IMAGE = '4'

function deleteFiles(filepath) {

    const filename = path.basename(filepath);

    if (filename.match(`${OUTPUT_PREFIX}*`, 'gi')) {
        console.log('Delete')
        fs.unlinkSync(filepath);
        return false;
    } else {

        return true
    }
}

function readFiles(filepath) {
    
    return fs.readdirSync(filepath)
    .map(file => path.join(filepath, file))
}

function processFile(file, index, list) {

    console.log(`${ parseInt((index * 100) / list.length) }%`);

    var matches = file.match(/[A-Z\-]+.jpg/gi);

    if (!matches || matches.length < 1) {
        console.log('err', file)
        return
    }

    var caption = matches[0]
        .replace(/.jpg/gi, '')
        .replace(/-/gi, ' ')
        .replace(/(?:^|\s)\S/g, c => c.toUpperCase())
        .replace(/and/gi, 'and')
        .replace(/with/gi, 'with');

    console.log(caption)
    console.log('file', file)

    const cmd = `magick ${file} -gravity Center -background black -resize 1920x1080 -extent 1920x1080 -font Arial-Bold -pointsize 60 -stroke black -strokewidth 2 -fill white -gravity SouthEast -draw "text 30,30 '${ caption }'" ${ OUTPUT_PREFIX }${ index }.jpg`

    return execSync(cmd)
}

const files = readFiles('E:\/test\/')

files.forEach(deleteFiles)

console.log(files)
/*


const files = readFiles('E:\/test')
    .filter(file => deleteFiles(file))
    .filter(file => file.match(/[A-Z\-]+.jpg/gi))
    .map((jpg, index, list) => processFile(jpg, index, list));

execSync(`ffmpeg -r 1/${ TIME_PER_IMAGE } -i ${ OUTPUT_PREFIX }%d.jpg -c:v libx264 -vf "fps=25,format=yuv420p" ${ OUTPUT_NAME }.mp4`, {
    stdio: [0, 1, 2]
})
*/