const Queue = require('bull');
const path = require('path');

// Get the current directory path
const currentPath = __dirname;

// Get the parent directory path
const parentPath = path.dirname(currentPath);
const redisUrl = 'redis://127.0.0.1:6379'
global.appRoot = parentPath;
global._pathconst = require('../api/helpers/constantdata/pathconst')

const uploadEmailProcessor = require('./processors/uploadEmail');

const uploadEmailQueue = new Queue('Email Queue', redisUrl);

uploadEmailQueue.process((job) => runWatchProcessor(job));



module.exports = {
    uploadEmailQueue,
};


