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
}
else {

    var inputPath = Args.getArg('-i', './');
    var outputPath = Args.getArg('-o', './');
    var duration = parseInt(Args.getArg('-d', '4'));

    if(isNaN(duration) || duration < 1) {
        throw Error('duration must be 1 or more')
    }
    
    Process.deleteProcessedFile();
    Process.processImages(inputPath);
    Process.sequenceImages(outputPath, duration);
}