const {
    MessageEmbed
} = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
    name: 'wiki',
    aliases: ['w', 'wiki'],
    category: 'fun',
    run: async (client, message, args) => {
        const wiki = args.join(' ').trim();
        if (!wiki) return message.reply("Hãy nhập từ khóa cần tìm kiếm!");
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const avatarURL = user.displayAvatarURL({
            format: 'png',
            size: 1024,
            dynamic: true
        });
        const url = `https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wiki)}`;
        console.log(url);
        let response;
        try {
            response = await fetch(url).then(res => res.json());
        } catch (e) {
            return message.reply("Có gì đó không ổn, thử lại đi bro!");
        }
        try {
            if (!("thumbnail" in response)) {
                const embed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(response.title)
                    .setURL(response.content_urls.desktop.page)
                    .setDescription(response.extract)
                    .setTimestamp()
                    .setFooter({
                        text: user.displayName,
                        iconURL: avatarURL
                    });
                message.channel.send({ embeds: [embed] })
                if (message.deletable) message.delete();
            } else {
                const embed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(response.title)
                    .setThumbnail(response.thumbnail.source)
                    .setURL(response.content_urls.desktop.page)
                    .setDescription(response.extract)
                    .setTimestamp()
                    .setFooter({
                        text: user.displayName,
                        iconURL: avatarURL
                    });
                message.channel.send({ embeds: [embed] })
                if (message.deletable) message.delete();
            }
        } catch {
            return message.reply('Không tìm thấy!')
        }
    }
}