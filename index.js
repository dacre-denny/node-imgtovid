const process = require('process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const commandExistsSync = require('command-exists').sync;
const execSync = require('child_process').execSync;

const TEMP = 'processed_'
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
 */
function deleteProcessedFile() {

    const filepath = path.join(os.tmpdir(), TEMP);

    if (!fs.existsSync(filepath)) {
        return
    }

    const files = readFiles(filepath);

    files.forEach((filepath, idx, list) => {

        logProgress(idx, list);

        const filename = path.basename(filepath) || '';

        if (filename.match(`${OUTPUT_PREFIX}_[a-zA-Z-_]+.jpg$`, 'gi')) {
            console.info(`deleting file ${ filepath }`);
            fs.unlinkSync(filepath);
        }
    });
}

/**
 * Processes input image file. Applies uniform/box resize, centers and captions the image. The result is prefixed with OUTPUT_PREFIX for subsequent processing
 * @param {*} file 
 * @param {*} idx 
 * @param {*} list 
 */
function processImages(inputPath) {

    const pattern = `[a-zA-Z\-]+.jpg$`

    const files = readFiles(inputPath)
        .filter(file => file.match(`${ pattern }`, 'gi'));
    
    const outputPath = path.join(os.tmpdir(), TEMP);
    
    if(!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    files.forEach((filepath, idx, list) => {
        
        logProgress(idx, list);

        var matches = filepath.match(`${pattern}`, 'gi');

        if (!matches || matches.length < 1) {
            console.error('error. failed to parse filename for:', filepath)
            return
        }

        var caption = matches[0]
            .replace(/.jpg/gi, '')
            .replace(/-/gi, ' ')
            .replace(/(?:^|\s)\S/g, c => c.toUpperCase())
            .replace(/and/gi, 'and')
            .replace(/with/gi, 'with');
        console.log('file', filepath)
        console.log(caption)

        const output = path.join(outputPath, `${ OUTPUT_PREFIX }${ idx }.jpg`)  
        console.log('output',output)
        execSync(`magick "${filepath}" -gravity Center -background black -resize 1920x1080 -extent 1920x1080 -font Arial-Bold -pointsize 60 -stroke black -strokewidth 2 -fill white -gravity SouthEast -draw "text 30,30 '${ caption }'" ${ output }`)
    })
}

/**
 * Processes processed images files, sequencing them into a single mp4 video file. Deletes exsiting output file if it already exsits.
 */
function sequenceImages(outputPath) {

    const output = path.join(outputPath, `${ OUTPUT_NAME }.mp4`)
    
    if (fs.existsSync(output)) {
        console.info(`deleting existing file ${ output }`);
        fs.unlinkSync(output);
    }
    
    const tempPath = path.join(os.tmpdir(), TEMP, `${ OUTPUT_PREFIX }%d.jpg`);
    console.info(`sequencing new video file ${ output }`);
    execSync(`ffmpeg -r 1/${ TIME_PER_IMAGE } -i ${ tempPath } -c:v libx264 -vf "fps=25,format=yuv420p" ${ output }`, {
        stdio: [0, 1, 2]
    })
}

/**
 * Returns file listing array of full filepaths, for specified path
 * @param {*} dir 
 */
function readFiles(dir) {

    return fs.readdirSync(dir)
        .map(file => path.join(dir, file))
}

/**
 * Utility method to get an process arguments value
 * @param {*} key 
 */
function getArg(key) {

    const args = process.argv;
    const idx = args.findIndex(argument => (argument || '').toLowerCase() === key);

    return args[idx];
}

/**
 * Utility method to get an process arguments path value. The convention used is that the path value is in the arg directly following
 * the keyed argument, if found. Allows default value to be supplied if not matching key found
 * @param {*} key 
 * @param {*} defaultValue 
 */
function getArgPath(key, defaultValue) {

    const args = process.argv;
    const idx = args.findIndex(argument => (argument || '').toLowerCase() === key);

    if (idx < 0) {
        return defaultValue;
    } else {
        return args[idx + 1];
    }
}


if (!commandExistsSync('ffmpeg')) {
    throw new Error('ffmpeg is not installed. install ffmpeg version 3.4. https://ffmpeg.org/download.html')
}

if (!commandExistsSync('magick')) {
    throw new Error('magick not found. install ImageMagick 7.0.8. https://www.imagemagick.org/script/index.php')
}

if(getArg('-h')) {

    console.log(`help`)

    process.exit(1);
}

var inputPath = getArgPath('-i', './');
var outputPath = getArgPath('-o', './');

deleteProcessedFile();
processImages(inputPath);
sequenceImages(outputPath);