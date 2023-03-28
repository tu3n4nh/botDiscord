const { ActivityType } = require('discord.js');

module.exports = async (client) => {
    console.log(`${client.user.username} on!`);

    await client.application.commands.set(client.command.map((x)=> x));

    client.user.setPresence({
        status: "online",
        activities: [{
            name: "CTF!",
            type: ActivityType.Playing,
        }]
    })
}