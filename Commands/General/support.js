const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

const { profileImage } = require('discord-arts');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Support szerver megtekintése.")
    .setDMPermission(false),
  async execute(interaction, client) {
    const member = interaction.member;
    const lilybot_invite_emoji = process.env.lilybot_invite_emoji;
    const darybot_invitelink = process.env.darybot_invitelink;

    if (member.user.bot) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription("Ebben a pillanatban a bot nem támogatott.")
        ],
        ephemeral: true
      });
    }

    try {
      const BANNER = process.env.banner


      const avatarButton = new ButtonBuilder()
        .setLabel('⭐ Support Szerver')
        .setStyle(5)
        .setURL(process.env.supportinv);

      const bannerButton = new ButtonBuilder()
        .setLabel('🌐 Weboldal')
        .setStyle(5)
        .setDisabled(true)
        .setURL(process.env.supportinv);

        const lilyinviteButton = new ButtonBuilder()
        .setLabel('LilyBot meghívása')
        .setEmoji(lilybot_invite_emoji)
        .setStyle(5)
        .setDisabled(false)
        .setURL(darybot_invitelink);


      const row = new ActionRowBuilder()
        .addComponents(avatarButton, lilyinviteButton, bannerButton);


      const Embed = new EmbedBuilder()
        .setColor(0x82272a)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`
        **Üdvözöllek __${member.user.username}__, a support felületen.**
        Amennyiben valami hibát észlesz, vagy gond akad valahol a LilyBot használata közben.
        Esetleg valami fontos dolgot szeretnél elintézni?
        Vagy csak csatlakozzni szeretnél a **LilyBot** Közösséghez?
        Akkor a lent található gombokkal ezt meg tudod tenni.
        Csatlakozz közösségünkhöz, és légy részese valami újnak.
        `)
        .setImage(`${BANNER}`)
        //.addFields([
          //{ name: '\`🙂\`' + ' Név', value: "`" + `${member.user.username}` + "`", inline: true },
          //{ name: '\`🛸\`' + ' Profil', value: `<@${member.id}>`, inline: true },
        //]);

      interaction.reply({ embeds: [Embed], components: [row]});

    } catch (error) {
      interaction.reply({ content: "Hiba" });
      throw error;
    }
  }
};