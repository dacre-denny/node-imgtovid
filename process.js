const fs = require('fs');
const os = require('os');
const execSync = require('child_process').execSync;
const path = require('path');

const TEMP = 'imgtovid_processing'
const OUTPUT_NAME = 'output_video'

/**
 * Logs the precentage of progress for an active process
 * @param {*} idx 
 * @param {*} list 
 * @param {*} prefix 
 */
function logProgress(idx, list, prefix = '') {

    if (list.length) {
        console.info(`${ prefix} ${ parseInt((idx * 100) / list.length) }%`);
    }
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
 * Utility method to extract the caption from a filename
 * @param {*} filename 
 */
function extractCaption(filename) {
    
    return filename
    .replace(/.jpg/gi, '')
    .replace(/.png/gi, '')
    .replace(/-/gi, ' ')
    .replace(/(?:^|\s)\S/g, c => c.toUpperCase())
    .replace(/and/gi, 'and')
    .replace(/with/gi, 'with');
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

        logProgress(idx, list, 'deleting processed image');

        const filename = path.basename(filepath) || '';

        if (filename.match(`[a-zA-Z-_]+.[jpg|png]$`, 'gi')) {
            console.info(`deleting file ${ filepath }`);
            fs.unlinkSync(filepath);
        }
    });
}

/**
 * Processes input image file. Applies uniform/box resize, centers and captions the image. The result is put in os.temp for subsequent processing
 * @param {*} file 
 * @param {*} idx 
 * @param {*} list 
 */
function processImages(inputPath) {

    const pattern = `[a-zA-Z\-]+.[jpg|png]$`

    const files = readFiles(inputPath)
        .filter(file => file.match(`${ pattern }`, 'gi'));
    
    const outputPath = path.join(os.tmpdir(), TEMP);
    
    if(!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    files.forEach((filepath, idx, list) => {
        
        logProgress(idx, list, 'processing image');

        var matches = filepath.match(`${pattern}`, 'gi');

        if (!matches || matches.length < 1) {
            console.error('error. failed to parse filename for:', filepath)
            return
        }

        var caption = extractCaption(matches[0]);

        execSync(`magick "${filepath}" -gravity Center -background black -resize 1920x1080 -extent 1920x1080 -font Arial-Bold -pointsize 60 -stroke black -strokewidth 2 -fill white -gravity SouthEast -draw "text 30,30 '${ caption }'" ${ path.join(outputPath, `${ idx }.jpg`) }`)
    });
}

/**
 * Processes processed images files, sequencing them into a single mp4 video file. Deletes exsiting output file if it already exsits.
 * @param {*} outputPath 
 * @param {*} duration 
 */
function sequenceImages(outputPath, duration) {

    const output = path.join(outputPath, `${ OUTPUT_NAME }.mp4`)
    
    if (fs.existsSync(output)) {
        console.info(`deleting existing file ${ output }`);
        fs.unlinkSync(output);
    }
    
    const sourcePath = path.join(os.tmpdir(), TEMP, `%d.jpg`);
    console.info(`sequencing new video file from images matching: ${ sourcePath }`);

    execSync(`ffmpeg -r 1/${ duration } -i ${ sourcePath } -c:v libx264 -vf "fps=25,format=yuv420p" ${ output }`, {
        stdio: [0, 1, 2]
    });
    
    console.info(`new video file created: ${ output }`);
}

module.exports = {
    deleteProcessedFile,
    processImages,
    sequenceImages,
}