'use strict';
const env = process.env['ENVIRONMENT'];

var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const queue = process.env['NOTIFY_QUEUE'];
const channels = require(`../mappings/${env}/channels.json`);

module.exports.send = async notification => {
    let attributes = notification.link ? attributesWithLink(notification) : attributesNoLink(notification);

    var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

    var params = {
        MessageAttributes: attributes,
        MessageBody: notification.message,
        QueueUrl: queue
    };

    console.log(notification);
    console.log(channels);

    if (channels.hasOwnProperty(notification.channel)) {
        let msg = await sqs.sendMessage(params).promise();
        console.log(msg)
        return res('message queued successfully');
    } else {
        return res('channel not set up to receive messages');
    }
}

function res(message) {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: message
            },
            null,
            2
        ),
    };
}

function attributesWithLink(notification) {
    return {
        'Service': {
            DataType: 'String',
            StringValue: notification.service
        },
        'Channel': {
            DataType: 'String',
            StringValue: notification.channel
        },
        'Link': {
            DataType: 'String',
            StringValue: notification.link
        }
    }
}


function attributesNoLink(notification) {
    return {
        "Service": {
            DataType: 'String',
            StringValue: notification.service
        },
        "Channel": {
            DataType: 'String',
            StringValue: notification.channel
        }
    }
}