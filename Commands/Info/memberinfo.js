const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

const { profileImage } = require('discord-arts');
const { connect } = require("mongoose");
const User = require("../../Models/Premium");
require('dotenv').config();

function formatDate(date) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  return new Intl.DateTimeFormat('hu-HU', options).format(date);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Megmutatja egy adott felhasználó információit.")
    .setDMPermission(false)
    .addUserOption((option) => option
      .setName("member")
      .setDescription("Felhasználó.")
      .setRequired(true)
    ),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();
    const memberOption = interaction.options.getMember("member");
    const user = interaction.options.getMember("member");
    const member = memberOption || interaction.member;

    if (member.user.bot) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription("Ebben a pillanatban a bot nem támogatott.")
        ],
        ephemeral: true
      });
    }

    try {
      const fetchedMembers = await interaction.guild.members.fetch();

      const profileBuffer = await profileImage(member.id);
      const imageAttachment = new AttachmentBuilder(profileBuffer, { name: 'profile.png' });









      const joinPosition = Array.from(fetchedMembers
        .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
        .keys())
        .indexOf(member.id) + 1;

      const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role)
        .slice(0, 3);

      const userBadges = member.user.flags.toArray();

      const joinTime = parseInt(member.joinedTimestamp / 1000);
      const createdTime = parseInt(member.user.createdTimestamp / 1000);
      const erroremoji = process.env.errorEmoji;
      const ixEmoji = process.env.ixEmoji;

      const Booster = member.premiumSince ? "<:discordboost:1136752072369377410>" : `${ixEmoji} Nincs`;

      const avatarButton = new ButtonBuilder()
        .setLabel('Avatar')
        .setStyle(5)
        .setURL(member.displayAvatarURL({ size: 2048, format: 'png' }));

      const bannerButton = new ButtonBuilder()
        .setLabel('Banner')
        .setStyle(5)
        .setURL((await member.user.fetch()).bannerURL() || `${process.env.nincsbanner}`);


      const row = new ActionRowBuilder()
        .addComponents(avatarButton, bannerButton);


        let rolemap = member.roles.cache.sort((a, b) => b.position - a.position).map(r => r).join(" ");
        if (rolemap.length > 1024) rolemap = "`A felhasználónak túl sok rangja van ahhoz, hogy mindet megjelenítse!`";
        if (!rolemap) rolemap = "`A felhasználónak nincs semmilyen rangja!`";

        const StatusesMap = {
          "": "None",
          "online": "🟢 Elérhető",
          "idle": "🌙 Tétlen",
          "dnd": "🔴 Elfoglalt",
          "streaming": "🟣 Streaming",
          "offline": "⚪ Nem elérhető"
        };
    
        const StatusText = member.presence
          ? StatusesMap[member.presence.status]
          : `${erroremoji} HIBA`;

      let status2 = {
        true: 'Igen',
        false: 'Nem'
      };


      const dbUser = await User.findOne({ discordId: user.id });

            if (dbUser) {
                const premiumStatus = dbUser.premium.isEnabled
                    ? `Aktív | ${formatDate(dbUser.premium.expirationDate)}`
                    : "Nem aktív.";
                const premiumdowntime = dbUser.premium.isEnabled
                    ? `${formatDate(dbUser.premium.expirationDate)}`
                    : "---";


      const Embed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.tag} | Információi`, iconURL: member.displayAvatarURL() })
        .setColor(0x82272a)
        .setThumbnail(member.displayAvatarURL())
        .setDescription(`A <t:${joinTime}:D>, ${member.user.username} csatlakozott **${addSuffix(joinPosition)}** tagként ehhez a szerverhez.`)
        .setImage("attachment://profile.png")
        .addFields([
          { name: '\`🙂\`' + ' Név', value: "`" + `${member.user.username}` + "`", inline: true },
          { name: '\`🛸\`' + ' Profil', value: `<@${member.id}>`, inline: true },
          { name: '\`✍️\`' + ' Becenév', value: "`" + `${member.nickname || "Nincs becenév"}` + "`", inline: true },
          { name: '\`🆔\`' + "Felhasználó ID", value: "`" + `${member.id}` + "`", inline: false },
          //{ name: '\`🤖\`' + ' Bot', value: "`" + `${status2[member.bot]}` + "`", inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: '\`⚪\`' + ' Státusz', value: `${StatusText}`, inline: true },
          { name: '\`🎧\`' + ' Hangcsatorna', value: `${member.voice.channel || "`Nincs csatlakozzva hangcsatornába`"}`, inline: true },
          { name: '\`🏅\`' + "Jelvények", value: `${addBadges(userBadges).join("")}`, inline: true },
          { name: '\`🚀\`' + "Szerver gyorsítás", value: `${Booster}`, inline: true },
          { name: '\`⏰\`' + "Fiók készítési ideje", value: `<t:${createdTime}:R>`, inline: true },
          { name: '\`⌛\`' + "Szerverhez csatlakozási ideje", value: `<t:${joinTime}:R>`, inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: `\`⭐\` **Premium Státusz**`, value: premiumStatus, inline: true },
          { name: `\`⏰\` **Lejárat dátuma**`, value: premiumdowntime, inline: true },
          { name: '\`✨\`' + "Top 3 rang", value: `${topRoles.join("").replace(`<@${interaction.guildId}>`)}`, inline: false },
          { name: '\`⭐\`' + ' Rangok', value: rolemap, inline: true },
          //{ name: '\`📜\`' + ' Jogok', value: "```" + `${member.permissions.toArray()}` + "```", inline: false },
        ]);

      interaction.editReply({ embeds: [Embed], components: [row], files: [imageAttachment] });
      }else {
        // Create a new user entry in the database
        const newUser = new User({
            discordId: user.id,
            username: user.user.username,
            premium: {
                isEnabled: false,
                expirationDate: null,
            },
        });

        await newUser.save();
        const newpremiumuser = "Nem aktív.";

        const newuserembed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.tag} | Információi`, iconURL: member.displayAvatarURL() })
        .setColor(0x82272a)
        .setThumbnail(member.displayAvatarURL())
        .setDescription(`A <t:${joinTime}:D>, ${member.user.username} csatlakozott **${addSuffix(joinPosition)}** tagként ehhez a szerverhez.`)
        .setImage("attachment://profile.png")
        .addFields([
          { name: '\`🙂\`' + ' Név', value: "`" + `${member.user.username}` + "`", inline: true },
          { name: '\`🛸\`' + ' Profil', value: `<@${member.id}>`, inline: true },
          { name: '\`✍️\`' + ' Becenév', value: "`" + `${member.nickname || "Nincs becenév"}` + "`", inline: true },
          { name: '\`🆔\`' + "Felhasználó ID", value: "`" + `${member.id}` + "`", inline: false },
          //{ name: '\`🤖\`' + ' Bot', value: "`" + `${status2[member.bot]}` + "`", inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: '\`⚪\`' + ' Státusz', value: `${StatusText}`, inline: true },
          { name: '\`🎧\`' + ' Hangcsatorna', value: `${member.voice.channel || "`Nincs csatlakozzva hangcsatornába`"}`, inline: true },
          { name: '\`🏅\`' + "Jelvények", value: `${addBadges(userBadges).join("")}`, inline: true },
          { name: '\`🚀\`' + "Szerver gyorsítás", value: `${Booster}`, inline: true },
          { name: '\`⏰\`' + "Fiók készítési ideje", value: `<t:${createdTime}:R>`, inline: true },
          { name: '\`⌛\`' + "Szerverhez csatlakozási ideje", value: `<t:${joinTime}:R>`, inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: `\`⭐\` **Premium Státusz**`, value: newpremiumuser, inline: false },
          { name: `\`⏰\` **Lejárat dátuma**`, value: `---`, inline: false },
          { name: '\`✨\`' + "Top 3 rang", value: `${topRoles.join("").replace(`<@${interaction.guildId}>`)}`, inline: false },
          { name: '\`⭐\`' + ' Rangok', value: rolemap, inline: true },
          { name: '\`📜\`' + ' Jogok', value: "```" + `${member.permissions.toArray()}` + "```", inline: false },
        ]);

        await interaction.editReply({
            embeds: [newuserembed],
            components: [row],
            files: [imageAttachment]
        });
    }
    } catch (error) {
      interaction.editReply({ content: "Hiba" });
      throw error;
    }
  }
  }
  


function addSuffix(number) {
  if (number % 100 >= 11 && number % 100 <= 13)
    return number + "th";

  switch (number % 10) {
    case 1: return number + "st";
    case 2: return number + "nd";
    case 3: return number + "rd";
  }
  return number + "th";
}

function addBadges(badgeNames) {
  if (!badgeNames.length) return ["X"];
  const badgeMap = {
    "ActiveDeveloper": "<:activedeveloper:1185633430491381871>",
    "BugHunterLevel1": "<:discordbughunter1:1185633422891298877>",
    "BugHunterLevel2": "<:discordbughunter2:1185633595000373308>",
    "PremiumEarlySupporter": "<:discordearlysupporter:1185633597638578186>",
    "Partner": "<:discordpartner:1185633676990615724>",
    "Staff": "<:discordstaff:1185633678437650482>",
    "HypeSquadOnlineHouse1": "<:hypesquadbravery:1185633674637615204>", // bravery
    "HypeSquadOnlineHouse2": "<:hypesquadbrilliance:1185633709718769685>", // brilliance
    "HypeSquadOnlineHouse3": "<:hypesquadbalance:1185633680023093339>", // balance
    "Hypesquad": "<:hypesquadevents:1185633711027404871>",
    "CertifiedModerator": "<:olddiscordmod:1185633707479027872>",
    "VerifiedDeveloper": "<:discordbotdev:1185633434849259520>",
  };

  return badgeNames.map(badgeName => badgeMap[badgeName] || '❔');
}
