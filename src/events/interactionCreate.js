module.exports = async (client, interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.command.get(interaction.commandName);

        if (!interaction.guild) return interaction.reply({
            content: "Bạn chỉ có thể dùng lệnh của bot ở trong server!",
            ephemeral: true,
        });

        if (!command) return interaction.reply({
            content: "Lệnh này không còn tồn tại!",
            ephemeral: true,
        });

        await command.run(client, interaction);
    }
}