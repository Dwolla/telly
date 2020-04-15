'use strict';
const env = process.env['ENVIRONMENT'];

const axios = require('axios');
const kms = require(`./utility/kms`)
const channels = require(`./mappings/${env}/channels.json`);

module.exports.handler = async event => {
    let message = event.Records[0];

    let attributes = message.messageAttributes;
    let channel = attributes.Channel.stringValue;
    let service = attributes.Service.stringValue;
    let link = attributes.Link ? attributes.Link.stringValue : '';

    console.log(channel);
    console.log(channels);
    console.log(service);
    console.log(link);

    var url = await kms.decrypt(channels[channel]);
    console.log(url);

    let body = attributes.Link ? buildMessageWithLink(message.body, service, link) : buildMessageNoLink(message.body, service);

    console.log(body);
    return axios.post(url, body, { headers: { 'Content-type': 'application/json' } })
        .then(response => {
            console.log(response);
            return res('success');
        }).catch(error => {
            console.log(JSON.stringify(error.response.data));
            throw res('failure');
        });
};

function buildMessageWithLink(message, service, link) {
    return {
        'text': message,
        'blocks': [
            {
                'type': 'section',
                'text': {
                    'type': 'mrkdwn',
                    'text': message
                },
                'accessory': {
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': 'View',
                        'emoji': true
                    },
                    'url': link
                }
            },
            {
                'type': 'context',
                'elements': [
                    {
                        'type': 'mrkdwn',
                        'text': `*Sent from:* ${service}`
                    }
                ]
            },
            {
                'type': 'divider'
            }
        ]
    }
}


function buildMessageNoLink(message, service) {
    return {
        'text': message,
        'blocks': [
            {
                'type': 'section',
                'text': {
                    'type': 'mrkdwn',
                    'text': message
                }
            },
            {
                'type': 'context',
                'elements': [
                    {
                        'type': 'mrkdwn',
                        'text': `*sent from:* ${service}`
                    }
                ]
            },
            {
                'type': 'divider'
            }
        ]
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