const { Writable } = require('stream');
const { open } = require('fs/promises');

class WriteStream extends Writable {
    constructor(iOptions) {
        super();
        this.filename = iOptions.filename || 'destination.txt';
    }

    async _construct(callback) {
        try {
            this.fileHandler = await open(`./Destination/${this.filename}`, 'w');
            callback();
        } catch (err) {
            callback(err);
        }
    }

    async _write(chunk, encoding, callback) {
        try {
            await this.fileHandler.write(chunk, 0, chunk.length);
            callback();
        } catch (err) {
            callback(err);
        }
    }

    async _destroy(error1, callback) {
        try {
            await this.fileHandler.close();
            callback(error1);
        } catch (error2) {
            callback(error2);
        }
    }
}

module.exports = WriteStream;