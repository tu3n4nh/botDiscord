const path = require('path');
const fs = require('fs');

module.exports = async ( client ) => {
    const eventPath = path.join(__dirname, "..", "events");
    const eventFile = fs.readdirSync(eventPath).filter((file) => file.endsWith(".js"));
    // For each file in folder events require it
    for (const file of eventFile) {
        const event = require(`../events/${file}`);
        const eventName = file.slice(0, file.indexOf(".js"));
        client.on(eventName, event.bind(null, client));
    }
}