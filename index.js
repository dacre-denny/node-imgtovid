const process = require('process');
const commandExistsSync = require('command-exists').sync;


const Args = require('./args');

const Process = require('./process');

if (!commandExistsSync('ffmpeg')) {
    throw new Error('ffmpeg is not installed. install ffmpeg version 3.4. https://ffmpeg.org/download.html')
}

if (!commandExistsSync('magick')) {
    throw new Error('magick not found. install ImageMagick 7.0.8. https://www.imagemagick.org/script/index.php')
}

if(Args.hasKey('-h')) {

    console.log(`help`)

    process.exit(1);
}

var inputPath = Args.getPath('-i', './');
var outputPath = Args.getPath('-o', './');

Process.deleteProcessedFile();
Process.processImages(inputPath);
Process.sequenceImages(outputPath);