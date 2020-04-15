const channels_dev = require(`./mappings/dev/channels.json`);
const channels_prod = require(`./mappings/prod/channels.json`);
var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
var regex = new RegExp(expression);

let urls = Object.values(channels_dev).concat(Object.values(channels_prod));

let rawUrl = urls.find(u => u.match(regex));
if(rawUrl) {
    console.log('\nYou need to encrypt your urls before committing your code.\n');
    process.exit(1);
} else {
    console.log("\nChannels have been encrypted.\n");
    process.exit(0); 
}