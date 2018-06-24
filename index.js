const fs = require('fs');
const {
    execSync
} = require('child_process');

function readFiles(path) {

    return new Promise((resolve, reject) => {

        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err)
            } else {
                resolve(files)
            }
        })
    })
}

function processFile(file) {

    const cmd = `magick ${file} -size 240x240 -resize 1920x1080 -font Arial-Bold -pointsize 80 -stroke black -strokewidth 3 -fill white -gravity SouthEast -draw "text 30,30 'Copyright'" processed_${ file }`
    console.log(cmd)

    return execSync(cmd)
}

readFiles('.')
    .then(files => files.filter(file => file.match(/\w+.jpg$/gi)))
    .then(files => {
        return Promise.all(files.map(jpg => processFile(jpg)))
    })
    .then(result => {
        console.log('done', result)
    }, err => {

    });