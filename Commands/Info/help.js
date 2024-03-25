const {
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
} = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Kilistázza az összes parancsot.")
        .addStringOption(option => 
            option.setName('parancs')
                .setDescription('A parancs neve, amiről szeretnél több információt.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const {
            ComponentType,
            EmbedBuilder,
            SlashCommandBuilder,
            ActionRowBuilder,
            SelectMenuBuilder,
        } = require('discord.js');
        require('dotenv').config();

        const emojis = {
            economy: `💸`,
            fun: `🤣`,
            info: '📄',
            moderation: '🚨',
            general: '💚',
            tools: '🧱',
            partnerek: '✌',
            report: '🛑',
            services: `⭐`,
            owner: '👑',
            zene: `🎶`,
            premium: `✨`,
            ticket: `🎫`
        };

        const directories = [...new Set(interaction.client.commands.map((cmd) => cmd.folder)),];

        const formatString = (str) =>
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands.filter((cmd) => cmd.folder === dir).map((cmd) => {
                return {
                    name: cmd.data.name,
                    description: `• ${cmd.data.description}` || `• Nincs leírás`,
                    category: cmd.category || null,
                };
            });

            return {
                directories: formatString(dir),
                commands: getCommands,
            };
        });
        const client = interaction.client;
        const guilds = client.guilds.cache;

        if (guilds.size === 0) {
            await interaction.reply('A bot nincs jelen semelyik szerveren.');
            return;
        }

        let totalMembers = 0;

        guilds.forEach((guild) => {
            totalMembers += guild.memberCount;
        });
        const totalCommands = interaction.client.commands.size; // Az összes parancs száma

        const serverCount = guilds.size;
        const botinv = process.env.botinvlink
        const supportinv = process.env.supportinv
        const Dennyel = process.env.devid
        const Andris = process.env.devid2
        const categoryNames = categories.map((cat) => {
            const emoji = emojis[cat.directories.toLowerCase()] || ' '; // Megkeresi az emojit vagy üres stringet
            return `\`${emoji}\` • ${cat.directories}`;
        });
        const categoriak = categoryNames.join(' \n');

        const totalServerText = `
        >>> \`🛸\` • Szerverek \`${serverCount}\` 
        \`😎\` • Emberek \`${totalMembers}\` 
        **\`{/}\`** • Parancsok \`${totalCommands}\` 
        \`💻\` • Fejlesztők <@${Dennyel}> <@${Andris}> 
        [[Bot meghívás]](${botinv})
        [[Support Szerver]](${supportinv})`;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `Segítségkérő Panel`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(
                `👋 Üdvözöllek <@${interaction.user.id}>, a <@${client.user.id}> BOT, segítség kérő felületén.\n
            \`\`\`Itt tudunk neked abban segíteni, hogy milyen parancsok vannak, és mit csinálnak. Az új rendszernek hála. Le tudtuk a felhasználásokat egyszerűsíteni.\`\`\``)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '**\`/\`** Parancs Kategóriák', value: `>>> ${categoriak}`, inline: true },
                { name: '\`🤖\` Státusz', value: totalServerText, inline: true },
            )
            .setImage("https://media.discordapp.net/attachments/1076933550210813954/1201978522873110618/darybanner.png?ex=65cbc8bb&is=65b953bb&hm=2f89f277be82564446f019e1f2378046ec9174d573743bba4a1567048e4ede9c&=&format=webp&quality=lossless&width=1020&height=150")
            .setColor(0x3362ba);

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setCustomId('help-menu')
                    .setPlaceholder(`👻 Válassz egy kategóriát`)
                    .setDisabled(state)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: cmd.directories,
                                value: cmd.directories.toLowerCase(),
                                description: `◽ Parancsok listája a(z) ${cmd.directories} kategoriából.`,
                                emoji: emojis[cmd.directories.toLowerCase()] || null,
                            };
                        })
                    )
            ),
        ];

        const selectedCommand = interaction.options.getString('parancs');

        if (selectedCommand) {
            // Ha a felhasználó megadott egy parancsot, ellenőrizzük, hogy létezik-e
            const selectedCmd = interaction.client.commands.find(cmd => cmd.data.name === selectedCommand);

            if (selectedCmd) {
                // Ha a parancs létezik, készítünk egy embedet az információival
                const selectedCmdEmbed = new EmbedBuilder()
                    .setTitle(`🔎 ${formatString(selectedCmd.data.name)} parancs`)
                    .setDescription(`• __${selectedCmd.data.description}__`)
                    .setThumbnail(client.user.displayAvatarURL())
                    .setImage("https://media.discordapp.net/attachments/1076933550210813954/1201978522873110618/darybanner.png?ex=65cbc8bb&is=65b953bb&hm=2f89f277be82564446f019e1f2378046ec9174d573743bba4a1567048e4ede9c&=&format=webp&quality=lossless&width=1020&height=150")
                    .setColor(0x3362ba);

                await interaction.reply({ embeds: [selectedCmdEmbed] });
            } else {
                // Ha a parancs nem található, küldjünk hibaüzenetet
                await interaction.reply(`Hibás parancs: \`${selectedCommand}\`. A parancs nem található.`);
            }
        } else {
            const initialMessage = await interaction.reply({
                embeds: [embed],
                components: components(false),
            });

            const filter = (interaction) =>
                interaction.user.id === interaction.member.id;

            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                componentType: ComponentType.SelectMenu,
            });

            collector.on('collect', (interaction) => {
                const [directory] = interaction.values;
                const category = categories.find(
                    (x) => x.directories.toLowerCase() === directory
                );
            
                if (category) {
                    const categoryEmbed = new EmbedBuilder()
                        .setTitle(`🔎 ${formatString(directory)} parancsok`)
                        .setDescription(`• Ezeket a parancsokat nézed • __${directory}__`)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setImage("https://media.discordapp.net/attachments/1076933550210813954/1201978522873110618/darybanner.png?ex=65cbc8bb&is=65b953bb&hm=2f89f277be82564446f019e1f2378046ec9174d573743bba4a1567048e4ede9c&=&format=webp&quality=lossless&width=1020&height=150")
                        .setColor(0x3362ba)
                        .addFields(
                            category.commands.map((cmd) => {
                                const premiumInfo = cmd.category ? `${cmd.category}` : ''; // Display category if available
                                return {
                                    name: `${process.env.perjel}\`${cmd.name}\`\n${premiumInfo}`,
                                    value: `${cmd.description}`,
                                    inline: true,
                                };
                            })
                        );
                
                    // Ellenőrzés, hogy az interaction objektum tartalmazza-e az update metódust
                    if ('update' in interaction) {
                        interaction.update({ embeds: [categoryEmbed] });
                    }
                } else {
                    // Ha a kategória nem található, akkor kezeld le ezt a helyzetet
                    console.error('Hibás kategória', directory);
                    interaction.reply('Hibás kategória.');
                }
            });
            
            collector.on("end", () => {
                initialMessage.edit({ components: components(true) });
            });
        }
    },
};
