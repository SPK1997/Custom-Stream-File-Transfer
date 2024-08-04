const { Readable } = require('stream');
const { open } = require('fs/promises');

class ReadStream extends Readable {
    constructor(iOptions) {
        super();
        this.fileHandler;
        this.fileSize;
        this.positionToRead = 0;
        this.filename = iOptions.filename || 'source.txt';
    }

    async _construct(callback) {
        try {
            this.fileHandler = await open(`./Source/${this.filename}`, 'r');
            let fileStats = await this.fileHandler.stat();
            this.fileSize = fileStats.size;
            callback();
        } catch (err) {
            callback(err);
        }
    }

    async _read(size) {
        try {
            if (this.positionToRead >= 0) {
                let buffer = Buffer.alloc(size);
                await this.fileHandler.read(buffer, 0, size, this.positionToRead);
                if ((this.fileSize - this.positionToRead) <= buffer.length) {
                    this.positionToRead = -1;
                    let bufferToPush = buffer.slice(0, this.fileSize);
                    this.push(bufferToPush);
                } else {
                    this.positionToRead += buffer.length;
                    this.push(buffer);
                }
            } else {
                this.push(null);
            }
        } catch (err) {
            this.destroy(err);
        }
    }

    async _destroy(error1, callback) {
        try {
            if (this.fileHandler) {
                await this.fileHandler.close();
            }
            callback(error1);
        } catch (error2) {
            callback(error2);
        }
    }
}

module.exports = ReadStream;