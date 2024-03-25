const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
require('dotenv').config();
const BANNER = process.env.banner

module.exports = {
    data: new SlashCommandBuilder()
    .setName("modpanel")
    .setDescription("Egy felhasználó moderálása ezzel a panellel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
        .setName("target")
        .setDescription("az intézkedések célpontja")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("az intézkedés oka")
        .setRequired(true)
    ),

    async execute (interaction, client) {
        const {guild, options} = interaction;
        const target = options.getMember("target");
        const reason = options.getString("reason") || "Nincs indok megadva.";
        const username = target
        const user = interaction.user.id

        if (target === interaction.user) {
            return await interaction.reply({
                content: "Nem tudod magad moderálni!",
                ephemeral: true
            })
        }

        //timeout row
        const tRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("1")
            .setLabel("5 Perc TO")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("2")
            .setLabel("10 Perc TO")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("3")
            .setLabel("1 Óra TO")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("4")
            .setLabel("1 Nap TO")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("5")
            .setLabel("1 Hét TO")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
        )

        //mod row
        const Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("ban")
            .setLabel("Ban")
            .setEmoji("🔨")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("kick")
            .setLabel("Kick")
            .setEmoji("🔨")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("untimeout")
            .setEmoji("✅")
            .setLabel("TO Feloldás")
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setTitle("Moderációs panel")
        .setColor('Blue')
        .setImage(`${BANNER}`)
        .setDescription(`Itt tudod moderálni őt, <@${target.id}>!`)
        .addFields(
            {name: "Név", value: `${username}`, inline: true},
            {name: "Felhasználó ID", value: `${target.id}`, inline: true},
            {name: "Felhasználó", value: `<@${target.id}>`, inline: true},
            {name: "Avatar URL", value: `[Avatar](${await target.displayAvatarURL()})`, inline: true},
            {name: "Indok", value: `${reason}`, inline: false}
        )
        .setThumbnail(await target.displayAvatarURL())
        .setTimestamp()

        const msg = await interaction.reply({
            embeds: [embed],
            components: [Row, tRow],
            ephemeral: true
        });

        const collector = msg.createMessageComponentCollector();

        const embed3 = new EmbedBuilder()
        .setColor('Blue')
        .setImage(`${BANNER}`)
        .setTimestamp()
        .setFooter({ text: `Moderator: ${interaction.user.username}`})

        collector.on('collect', async i => {
            if (i.customId === "ban") {
                if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                    return await i.reply({
                        content: "Nem lehet **kitiltani** a tagot!",
                        ephemeral: true
                    })
                }

                await interaction.guild.members.ban(target, {reason});

                embed3.setTitle("Ban").setDescription(`Ki lettél tiltva a ${i.guild.name}-ból! || **Az ok:** ${reason}`).setColor('Blue').setImage(`${BANNER}`)

                await target.send({ embeds: [embed3] }).catch(err => {
                    return i.reply({ content: "Hiba történt a felhasználó dm küldésében!", ephemeral: true});
                });;

                await i.reply({ content: `<@${target.id}> kitiltották!`, ephemeral: true});
            }

            if (i.customId === "untimeout") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Nincs engedélyed arra, hogy **TO**-t adj.", ephemeral: true})
                await target.timeout(null);

                embed.setTitle("Untimeout").setDescription(`Feloldották a TO-d itt ${i.guild.name}! || **Az ok:** ${reason}`).setColor('Blue').setImage(`${BANNER}`);

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Hiba történt a felhasználó dm küldésében!", ephemeral: true});
                });;

                await i.reply({ content: `<@${target.id}> TO feloldva.`, ephemeral: true});
            }

            if (i.customId === "kick") {
                if (!i.member.permissions.has(PermissionFlagsBits.KickMembers)) return await i.reply({ content: "Nincs engedélyed arra, hogy **KICK**-et adj.", ephemeral: true});

                await interaction.guild.members.kick(target, {reason});

                embed.setTitle("Kick").setDescription(`Ki lettél rúgva innen ${i.guild.name}! || **Az ok:** ${reason}`).setColor('Blue').setImage(`${BANNER}`)

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Hiba történt a felhasználó dm küldésében!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> Kirúgva.`, ephemeral: true});
            }

            if (i.customId === "1") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Nincs engedélyed arra, hogy **TO**-t adj.", ephemeral: true});

                await target.timeout(300000, reason).catch(err => {
                    return i.reply({ content: "Hiba történt ennek a tagnak a kiválasztásában!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`TO-t kaptál **5 percre** || **Az ok:** ${reason}`).setColor('Blue').setImage(`${BANNER}`);

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Hiba történt a felhasználó dm küldésében!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> TO-t kapott **5 Percre**`, ephemeral: true});
            }

            if (i.customId === "2") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Nincs engedélyed arra, hogy **TO**-t adj.", ephemeral: true});

                await target.timeout(600000, reason).catch(err => {
                    return i.reply({ content: "Hiba történt ennek a tagnak a kiválasztásában!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`TO-t kaptál **10 percre** || **Az ok:** ${reason}`).setColor('Blue');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Hiba történt a felhasználó dm küldésében!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> TO-t kapott **10 Percre**`, ephemeral: true});
            }

            if (i.customId === "3") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Nincs engedélyed arra, hogy **TO**-t adj.", ephemeral: true});

                await target.timeout(3600000, reason).catch(err => {
                    return i.reply({ content: "Hiba történt ennek a tagnak a kiválasztásában!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`TO-t kaptál *1 Órára** || **Az ok:** ${reason}`).setColor('Blue').setImage(`${BANNER}`);

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Hiba történt a felhasználó dm küldésében!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> TO-t kapott **1 Órára**`, ephemeral: true});
            }

            if (i.customId === "4") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Nincs engedélyed arra, hogy **TO**-t adj.", ephemeral: true});

                await target.timeout(86400000, reason).catch(err => {
                    return i.reply({ content: "Hiba történt ennek a tagnak a kiválasztásában!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`TO-t kaptál **1 Napra** || **Az ok:** ${reason}`).setColor('Blue').setImage(`${BANNER}`)

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Hiba történt a felhasználó dm küldésében!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> TO-t kapott **1 Napra**`, ephemeral: true});
            }

            if (i.customId === "5") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Nincs engedélyed arra, hogy **TO**-t adj.", ephemeral: true});

                await target.timeout(604800000, reason).catch(err => {
                    return i.reply({ content: "Hiba történt ennek a tagnak a kiválasztásában!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`TO-t kaptál **1 hétre** || **Az ok:** ${reason}`).setColor('Blue').setImage(`${BANNER}`)

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Hiba történt a felhasználó dm küldésében!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> TO-t kapott **1 Hétre**`, ephemeral: true});
            }

            
        })
    }
}