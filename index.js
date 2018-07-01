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

/**
 * Processes processed images files, sequencing them into a single mp4 video file. Deletes exsiting output file if it already exsits.
 */
function sequenceImages() {
    
    const outputpath = `${ OUTPUT_NAME }.mp4`

    if(fs.existsSync(outputpath)) {
        console.info(`deleting existing file ${ outputpath }`);
        fs.unlinkSync(outputpath);
    }
    
    console.info(`sequencing new video file ${ outputpath }`);
    execSync(`ffmpeg -r 1/${ TIME_PER_IMAGE } -i ${ OUTPUT_PREFIX }%d.jpg -c:v libx264 -vf "fps=25,format=yuv420p" ${ outputpath }`, {
        stdio: [0, 1, 2]
    })
}

/**
 * Returns file listing array of full filepaths, for specified path
 * @param {*} path 
 */
function readFiles(path) {

    return fs.readdirSync(path)
        .map(file => path.join(path, file))
}


if(!commandExistsSync('ffmpeg')) {
    throw new Error('ffmpeg is not installed. install ffmpeg version 3.4. https://ffmpeg.org/download.html')
}

if(!commandExistsSync('magick')) {
    throw new Error('magick not found. install ImageMagick 7.0.8. https://www.imagemagick.org/script/index.php')
}

console.info('reading files');

const files = readFiles('E:\/test\/')

console.info('deleting old files');

files.forEach(deletePrefixedFile);

console.info('processing images');

files.forEach(processFile); 

console.info('sequencing videos');
sequenceImages()