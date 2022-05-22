const {
    getAudioUrl
} = require('google-tts-api');
ytdl = require('ytdl-core');

const { joinVoiceChannel, createAudioPlayer, StreamType, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
module.exports = {
    name: 'rick',
    aliases: ['rick'],
    category: 'fun',
    run: async (client, message, args) => {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply('Hãy vào room trước!');
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        })
        const resource = createAudioResource(ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=2s&ab_channel=RickAstley', {
            highWaterMark: 1024*1024*64,
            quality: "highestaudio",
        }));
        const player = createAudioPlayer();
        connection.subscribe(player);
        player.play(resource);
    }
}