'use strict';
var AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });

module.exports.decrypt = async text => {
    var kms = new AWS.KMS();

    const params = {
        CiphertextBlob: Buffer.from(text, 'base64'),
    };

    const { Plaintext } = await kms.decrypt(params).promise();
    return Plaintext.toString();
}