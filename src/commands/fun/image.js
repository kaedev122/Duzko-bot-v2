const { MessageEmbed } = require('discord.js');
var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: true
    }
})

module.exports = {
    name: 'image',
    category: 'fun',
    aliases: ['i'],
    run: async (client, message, args) => {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 1024, dynamic: true });
        const image_query = args.join(' ');
        if (!image_query) return message.channel.send('Nhập tên ảnh bạn muốn tìm!');
        const image_results = await google.scrape(image_query, 20);
        number = Math.floor(Math.random() * 21);
        try{
            const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(image_query)
            .setURL(image_results[number].url)
            .setImage(image_results[number].url)
            .setTimestamp()
            .setFooter({
                text: user.displayName,
                iconURL: avatarURL
            });
        message.channel.send({
            embeds: [exampleEmbed]
        });
        } catch (e) {
            message.channel.send("Something wrong! ERROR: " + e)
        }
    }
}