# node-imgtovid
Simple app that batch processes a folder of images and converts the processed images into a single video

## Why?

I was looking for a quick way to convert a large collection of personal photos into a single video. 
The photos I needed to process where named with a particular naming convention - this app takes advantage of this naming convention to extract meaningful captions from photo filenames, which are then added as captions to photo in the resulting video.

This app also batch processes copies of all input photos, resizing, centering and compressing them for use in the output final video.

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
