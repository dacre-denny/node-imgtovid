const fs = require('fs');
const os = require('os');
const path = require('path');
var commandExistsSync = require('command-exists').sync;
const {
    execSync
} = require('child_process');

const OUTPUT_PREFIX = 'processed_'
const OUTPUT_NAME = 'output'
const TIME_PER_IMAGE = '4'

/**
 * Logs the precentage of progress for an active process
 * @param {*} idx 
 * @param {*} list 
 */
function logProgress(idx, list) {

    if (list.length) {

        console.info(`${ parseInt((idx * 100) / list.length) }%`);
    }
}

/**
 * Deletes a file if file's path matches processed prefix
 * @param {*} filepath 
 */
function deletePrefixedFile(filepath, idx, list) {

    logProgress(idx, list);

    const filename = path.basename(filepath) || '';

    if (filename.match(`${OUTPUT_PREFIX}_[a-zA-Z-_]+.jpg$`, 'gi')) {

        console.info(`deleting file ${ filepath }`);
        fs.unlinkSync(filepath);
    }
}

/**
 * Processes input image file. Applies uniform/box resize, centers and captions the image. The result is prefixed with OUTPUT_PREFIX for subsequent processing
 * @param {*} file 
 * @param {*} idx 
 * @param {*} list 
 */
function processFile(file, idx, list) {

    logProgress(idx, list);

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
    console.log('file', file)
    console.log(caption)
    
    return execSync(`magick "${file}" -gravity Center -background black -resize 1920x1080 -extent 1920x1080 -font Arial-Bold -pointsize 60 -stroke black -strokewidth 2 -fill white -gravity SouthEast -draw "text 30,30 '${ caption }'" ${ OUTPUT_PREFIX }${ idx }.jpg`)
}

function sequenceImages() {

    execSync(`ffmpeg -r 1/${ TIME_PER_IMAGE } -i ${ OUTPUT_PREFIX }%d.jpg -c:v libx264 -vf "fps=25,format=yuv420p" ${ OUTPUT_NAME }.mp4`, {
        stdio: [0, 1, 2]
    })
}

function readFiles(filepath) {

    return fs.readdirSync(filepath)
        .map(file => path.join(filepath, file))
}


if(!commandExistsSync('ffmpeg')) {
    throw new Error('ffmpeg is not installed. install ffmpeg version 3.4. https://ffmpeg.org/download.html')
}

if(!commandExistsSync('magick')) {
    throw new Error('magick not found. install ImageMagick 7.0.8. https://www.imagemagick.org/script/index.php')
}

const files = readFiles('E:\/test\/')

files.forEach(deletePrefixedFile);

files.forEach(processFile); 

sequenceImages()
/*
console.log(files)


const files = readFiles('E:\/test')
    .filter(file => deleteFiles(file))
    .filter(file => file.match(/[A-Z\-]+.jpg/gi))
    .map((jpg, index, list) => processFile(jpg, index, list));

execSync(`ffmpeg -r 1/${ TIME_PER_IMAGE } -i ${ OUTPUT_PREFIX }%d.jpg -c:v libx264 -vf "fps=25,format=yuv420p" ${ OUTPUT_NAME }.mp4`, {
    stdio: [0, 1, 2]
})
*/