require('dotenv').config();
const { open } = require('fs/promises');
const ReadStream = require('./CustomStreams/customReadStream');
const WriteStream = require('./CustomStreams/customWriteStream');

(async () => {
    const rs = new ReadStream({ filename: process.env.SOURCE_FILE });
    const ws = new WriteStream({ filename: process.env.DESTINATION_FILE });

    rs.on('data', chunk => {
        if (!ws.write(chunk)) {
            rs.pause();
        }
    });

    rs.on('end', () => {
        console.log('file transfer completed');
        rs.destroy();
        ws.destroy();
    });

    ws.on('drain', () => {
        rs.resume();
    });

    rs.on('error', () => {
        console.log('Error in reading data from file. Tip: Make sure file is present in Source folder');
    });

    ws.on('error', () => {
        console.log('Error in writing data to a file.');
    });
})();