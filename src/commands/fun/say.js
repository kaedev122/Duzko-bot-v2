const {
    getAudioUrl
} = require('google-tts-api');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    AudioPlayerStatus,
    NoSubscriberBehavior,
    VoiceConnectionStatus
} = require('@discordjs/voice');
module.exports = {
    name: 'say',
    aliases: ['s', 'say'],
    category: 'fun',
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send('🤐');
        let language = args[0];
        const lang_index = ['ja', 'ko', 'zh-CN', 'zh-TW', 'en', 'fr', 'ru'];
        if (lang_index.indexOf(language) > -1) {
            args.shift();
        } else {
            language = 'vi';
        }
        const string = args.join(' ');
        if (string.length > 200) {
            message.react("❌")
            return message.channel.send('Tôi không thể nói quá 200 từ =(((');
        }
        const channel = message.member.voice.channel;
        if (!channel) return message.reply('Hãy vào room trước!');
        const audioURL = await getAudioUrl(string, {
            lang: language,
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        })
        const resource = createAudioResource(audioURL);
        const player = createAudioPlayer({behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        const subcription = connection.subscribe(player);
        connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
            } catch (error) {
                connection.destroy();
            }
        });
        if (subcription) {
            setTimeout(() => subcription.unsubscribe(), 15_000);
        }
        try {
            player.on(AudioPlayerStatus.Playing, () => {
                message.react("👌")
            })
            player.play(resource);
        } catch (error) {
            message.react("❌")
            message.channel.send("ERROR: " + error)
        }
    }
}