'use strict';
const env = process.env['ENVIRONMENT'];
const repositories = require(`../mappings/${env}/repositories.json`);
const sqs = require('../utility/sqs');

module.exports.handler = async event => {
    let sns_message = JSON.parse(event.Records[0].Sns.Message);
    console.log(sns_message.detail);

    let sns_detail = sns_message.detail;
    sns_detail['region'] = sns_message.region;

    let notification = generate_notification(sns_detail);
    notification['channel'] = repositories[notification.repository];
    notification['service'] = "CodeCommit";

    console.log(notification);
    return await sqs.send(notification);
};

function generate_notification(details) {
    switch (details.event) {
        case 'pullRequestCreated':
            return created_event(details);
        case 'pullRequestStatusChanged':
            return changed_event(details);
        case 'pullRequestMergeStatusUpdated':
            return merged_event(details);
            break;
        default:
        // code block
    }
}

function created_event(details) {
    let notification = {
        'repository': details.repositoryNames[0],
        'event': 'Created',
        'name': details.title,
        'link': generate_link(details),
    };
    let message = `*${notification.repository}* - Pull Request ${notification.event}\n\n${notification.name}`;
    notification['message'] = message;
    return notification;
}

function merged_event(details) {
    let notification = {
        'repository': details.repositoryNames[0],
        'event': 'Merged',
        'name': details.title,
        'link': generate_link(details),
    };
    let message = `*${notification.repository}* - Pull Request ${notification.event}\n\n${notification.name}`;
    notification['message'] = message;
    return notification;
}

function changed_event(details) {
    let notification = {
        'repository': details.repositoryNames[0],
        'event': details.pullRequestStatus,
        'name': details.title,
        'link': generate_link(details),
    };
    let message = `*${notification.repository}* - Pull Request ${notification.event}\n\n${notification.name}`;
    notification['message'] = message;
    return notification;
}

function generate_link(details) {
    return `https://${details.region}.console.aws.amazon.com/codesuite/codecommit/repositories/${details.repositoryNames[0]}/pull-requests/${details.pullRequestId}?region=${details.region}`;
}