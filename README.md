# node-imgtovid
node app that generates a single video from a folder of images.

## Why?

I was looking for a quick way to convert a large collection of personal photos into a single video. 
The photos I needed to process where named with a particular naming convention - this app takes advantage 
of this to automatically place captions over each photo in the resulting video.

## Installation

Install app dependencies:
- [ffmpeg version 3.4](https://ffmpeg.org/download.html)
- [ImageMagick 7.0.8](https://www.imagemagick.org/script/index.php)

Clone repository and install node dependencies:
```js
    git clone https://github.com/mooce/node-imgtovid
    cd node-imgtovid
    npm install
```

## Usage

#### Introduction
Place source images in app directory.
From terminal run app:
```js
  node index.js
```

The app will generate:
```js
output_video.mp4
```
in the app directory.

#### Advance usage
The app supports the following arguments
- `-i [PATH]`, specify source directory for photos
- `-o [PATH]`, specify destination directory for `output_video.mp4`
- `-d [NUMBER]`, specify the duration in seconds for each photo in the output video
- `-h`, help summary of supported app arguments
