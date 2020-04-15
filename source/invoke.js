'use strict';
const sqs = require('../utility/sqs');

module.exports.handler = async event => {
    let notification = event;
    console.log(notification);

    sqs.send(notificaton);
};