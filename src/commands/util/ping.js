module.exports = {
    name: "ping",
    description: "Xem tốc độ phản ứng của bot.",
    run: async (client, interaction) => {
        interaction.reply({ content: `Pong! ${client.ws.ping}ms!`});
    }
}