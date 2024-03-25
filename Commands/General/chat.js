//https://discord.com/invite/2dJ4dZc55U
// join for more endpoints and updates

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Beszélgess a GPT-3-al.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Üzenet')
                .setRequired(true)
        ),
    async execute(interaction) {
      
        await interaction.deferReply();

        
        const message = interaction.options.getString('message');

        
        const apiUrl = `https://api.artix.cloud/api/v1/AI/Chatgpt?q=${encodeURIComponent(message)}`;

        try {
            
            const response = await axios.get(apiUrl);

            
            if (response.status === 200) {
                const chatData = response.data.chat; 

                
                const embed = {
                    color: 0x0099ff,
                    title: 'Chat GPT-3',
                    description: chatData,
                };

                await interaction.followUp({ embeds: [embed] });
            } else {
                await interaction.followUp('Hiba történt a csevegési adatok lekérése közben.');
            }
        } catch (error) {
            console.error(error);
            await interaction.followUp('Hiba történt a kérése feldolgozása során.');
        }
    },
};