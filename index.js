require('dotenv').config();
const { Client, IntentsBitField, Partials, Collection, escapeMarkdown, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ]
});

const {DisTube} = require('distube');
const {SpotifyPlugin} = require('@distube/spotify')

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: false,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
});



module.exports = client;


const {loadEvents} = require(`./Handlers/eventHandler`);
const {loadCommands} = require(`./Handlers/commandHandler`);

client.commands = new Collection();
client.config = require('./config');
    
client.login(process.env.TOKEN).then(() => {
    loadEvents(client);
    loadCommands(client);
});



