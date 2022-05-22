const { entersState, joinVoiceChannel, VoiceConnectionStatus, EndBehaviorType } = require('@discordjs/voice');
const { createWriteStream } = require('node:fs');
const prism = require('prism-media');
const { pipeline } = require('node:stream');
const ffmpeg = require('ffmpeg-static');
const sleep = require('util').promisify(setTimeout);
const { MessageAttachment } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'record',
    aliases: ['record'],
    category: 'fun',
    run: async (client, message, args) => {
        const voiceChannel = message.member.voice.channel
        let connection = client.voiceManager.get(message.channel.guild.id)
        if (!connection) {
            if (!voiceChannel) return message.channel.send("Vào room trước!")
            connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                selfDeaf: false,
                selfMute: true,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
            client.voiceManager.set(message.channel.guild.id, connection);
            await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
            const receiver = connection.receiver;
            receiver.speaking.on('start', (userId) => {
                if (userId !== message.author.id) return;
                createListeningStream(receiver, userId, client.users.cache.get(userId));
            });
            return message.channel.send(`🎙️ Đang ghi âm ${voiceChannel.name}`);
        } else if (connection) {
            const msg = await message.channel.send("Đang xử lý...")
            await sleep(5000)
            connection.destroy();
            client.voiceManager.delete(message.channel.guild.id)
            const filename = `./src/recordings/${message.author.id}`;
            const process = new ffmpeg(`${filename}.pcm`);
            process.then(function (audio) {
                audio.fnExtractSoundToMP3(`${filename}.mp3`, async function (error, file) {
                    await msg.edit({
                        content: `🔉 Record của ${voiceChannel.name}!`,
                        files: [new MessageAttachment(`./src/recordings/${message.author.id}.mp3`, 'recording.mp3')]
                    });
                    fs.unlinkSync(`${filename}.pcm`)
                    fs.unlinkSync(`${filename}.mp3`)
                });
            }, function (err) {
                return msg.edit(`❌ ERROR: ${err.message}`);
            });
        }
    }
}

function createListeningStream(receiver, userId, user) {
    const opusStream = receiver.subscribe(userId, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 100,
        },
    });

    const oggStream = new prism.opus.OggLogicalBitstream({
        opusHead: new prism.opus.OpusHead({
            channelCount: 2,
            sampleRate: 48000,
        }),
        pageSizeControl: {
            maxPackets: 10,
        },
    });

    const filename = `./src/recordings/${user.id}.pcm`;

    const out = createWriteStream(filename, { flags: 'a' });
    console.log(`👂 Started recording ${filename}`);

    pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
            console.warn(`❌ Error recording file ${filename} - ${err.message}`);
        } else {
            console.log(`✅ Recorded ${filename}`);
        }
    });
}