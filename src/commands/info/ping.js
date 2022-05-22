module.exports = {
    name: 'ping', 
    category: 'info',
    run: (client, message, args) => {
        message.reply(`Ping: \`${client.ws.ping}ms\``);
    }
}