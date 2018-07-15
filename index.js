const commandExistsSync = require('command-exists').sync;

const Args = require('./args');
const Process = require('./process');

if (!commandExistsSync('ffmpeg')) {
    throw new Error('ffmpeg is not installed. install ffmpeg version 3.4. https://ffmpeg.org/download.html')
}

if (!commandExistsSync('magick')) {
    throw new Error('magick not found. install ImageMagick 7.0.8. https://www.imagemagick.org/script/index.php')
}

if(Args.hasKey('-h') || !Args.hasAnyArgs()) {

    console.log(`
run the app via node:
    node index.js -i PATH -o PATH -d NUMBER -h

supported argument:
    -i : specify source directory for photos
    -o : specify destination directory for output_video.mp4
    -d : specify the duration in seconds for each photo in the output video
    -process-images [true|false] : controls if photos in source direction are processed (defaults to true)
    -process-video [true|false] : controls video is generated from processed photos (defaults to true)
    -h : display this help summary
    `)
}
else {

    const inputPath = Args.getArg('-i', './');
    const outputPath = Args.getArg('-o', './');
    const duration = parseInt(Args.getArg('-d', '4'));

    if(isNaN(duration) || duration < 1) {
        throw Error('duration must be 1 or more')
    }
    
    if(Args.getArg('-process-images', 'true') !== 'false') {
        Process.deleteProcessedFile();
        Process.processImages(inputPath);
    }
    else {
        console.log('Skipping image processing')
    }
    
    if(Args.getArg('-process-video', 'true') !== 'false') {
        Process.sequenceImages(outputPath, duration);
    }
    else {
        console.log('Skipping video processing')
    }
}