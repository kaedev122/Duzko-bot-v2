const { Client, Intents, MessageAttachment, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES] });

client.commands = new Collection();
client.aliases = new Collection();
client.categories = new Collection();
client.voiceManager = new Collection();

['command', 'event'].forEach(handler => require(`./handlers/${handler}`)(client));

client.login(process.env.TOKEN);