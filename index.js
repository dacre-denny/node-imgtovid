const process = require('process');
const commandExistsSync = require('command-exists').sync;


const {
    getArg,
    getArgPath
} = require('./args');

const Process = require('./process');





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

Process.deleteProcessedFile();
Process.processImages(inputPath);
Process.sequenceImages(outputPath);