'use strict';
const sqs = require('../utility/sqs');

module.exports.handler = async event => {
    let notification = JSON.parse(event.body);
    console.log(notification);

    return await sqs.send(notification);
};