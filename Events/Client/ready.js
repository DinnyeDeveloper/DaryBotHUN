require("dotenv").config();
const fs = require("fs");
const {
  client,
  EmbedBuilder,
  ActivityType,
  StringSelectMenuBuilder,
  WebhookClient,
} = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "ready",
  once: true,
  async execute(client, interaction) {
    await mongoose.connect(process.env.mongodb || "", {
      /*keepAlive: true,*/
    });









    
    









    

    //Ez a rész kell hogy egy adott discord szerver adatait nézze. ⬇
    const guild = client.guilds.cache.get(process.env.STATUS_SERVER_ID);
    if (!guild) {
        console.error("Guild not found.");
        return;
    }
    const boostCount = guild.premiumSubscriptionCount;
    const members = guild.memberCount;
    //Ez a rész kell hogy egy adott discord szerver adatait nézze. ⬆





    const guilds = client.guilds.cache;
    if (guilds.size === 0) {
      await interaction.reply("A bot nincs jelen semelyik szerveren.");
      return;
    }
    let totalMembers = 0;
    guilds.forEach((guild) => {
      totalMembers += guild.memberCount;
    });
    const totalCommands = client.commands.size; // Az összes parancs száma

    const serverCount = guilds.size;


    // Csatornák konfigurációi
    const channelConfigs = [
      {
        id: process.env.SERVERS_CHANNEL_ID, message: `🛸 • Szerverek: ${serverCount}`,
        interval: 600000,
      },
      {
        id: process.env.MEMBERS_CHANNEL_ID, message: `😎 • Emberek: ${totalMembers}`,
        interval: 600000,
      }, //10 perc
      {
        id: process.env.COMMANDS_CHANNEL_ID, message: `🌐 • Parancsok: ${totalCommands}`,
        interval: 600000,
      },
      {
        id: process.env.SERVERMEMBERS_CHANNEL_ID, message: `⭐ • Tagok: ${members}`,
        interval: 600000,
      },
      {
        id: process.env.SERVERBOOST_CHANNEL_ID, message: `✨ • Boost: ${boostCount}`,
        interval: 600000,
      },



      //{ id: "1217550261422133390", message: `Boosts `, interval: 600000 },
    ];

    // Függvény a csatornák frissítéséhez
    function updateChannel(channelId, message) {
      const channel = client.channels.cache.get(channelId);

      if (!channel) {
        console.error(
          `❌ A megadott csatorna nem található az ID alapján: ${channelId}`
        );
        return;
      }

      channel
        .setName(message)
        .then((updatedChannel) =>
          console.log(
            `✅ A csatorna neve sikeresen frissítve lett (${updatedChannel.name})`
          )
        )
        .catch((error) =>
          console.error(
            `❌ Hiba történt a csatorna név frissítése közben (${channelId}): ${error}`
          )
        );
    }

    // Mindkét csatorna frissítése induláskor és időközönként
    channelConfigs.forEach((config) => {
      const { id, message, interval } = config;

      updateChannel(id, message); // Induláskor

      setInterval(() => {
        updateChannel(id, message); // Időközönként
      }, interval);
    });



    /**Premium rendszer */
    const PremiumUser = require("../../Models/Premium"); // A PremiumUser modell helyének megfelelően módosítsd
    const PremiumGuild = require("../../Models/PremiumGuild"); // A PremiumGuild modell helyének megfelelően módosítsd

    // Időzítő beállítása: ellenőrzi a lejárt prémiumokat minden órában
    setInterval(async () => {
      await removeExpiredPremiumUsers();
      await removeExpiredPremiumGuilds();
    }, 1800000); // 30 perc

    // Függvény a lejárt felhasználók eltávolításához
    async function removeExpiredPremiumUsers() {
      const expiredUsers = await PremiumUser.find({
        "premium.isEnabled": true,
        "premium.expirationDate": { $lte: new Date() },
      });

      for (const user of expiredUsers) {
        user.premium.isEnabled = false;
        user.premium.expirationDate = null;
        await user.save();
        console.log("[-] (F) Lejárt Premium");
      }
    }

    // Függvény a lejárt szerverek eltávolításához
    async function removeExpiredPremiumGuilds() {
      const expiredGuilds = await PremiumGuild.find({
        "premium.isEnabled": true,
        "premium.expirationDate": { $lte: new Date() },
      });

      for (const guild of expiredGuilds) {
        guild.premium.isEnabled = false;
        guild.premium.expirationDate = null;
        await guild.save();
        console.log("[-] (SZ) Lejárt Premium");
      }
    }

    // Dátumformázás
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours() + 2).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timestamp = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;

    // Fájl neve az aktuális dátum és idővel
    const logFilename = `log/${timestamp}-log.txt`;

    // Fájl hozzáfűzési mód
    const logStream = fs.createWriteStream(logFilename, { flags: "a" });

    const originalConsoleLog = console.log;
    console.log = function (message) {
      const logMessage = `[${new Date().toLocaleString()}] ${message}`;
      logStream.write(logMessage + "\n");
      originalConsoleLog.apply(console, arguments);
    };

    /*const activities = [
            `🤖 ${client.user.username} a nevem.`,
            `💻 Engem Deniel és Andris fejleszt.`,
            `🧸 Csatlakozz még ma közösségünkhöz.`
        ];*/

    /*setInterval(() => {
            const status = activities[Math.floor(Math.random() * activities.length)];
            client.user.setPresence({ activities: [{ name: `${status}` }]});
        }, 5000);*/

    /*client.user.setActivity({
            type: ActivityType.Custom,
            name: 'customstatus',
            state: '🧸 újra itt veletek.'
        });*/

    const status = await client.user.setPresence({
      status: "idle",
      activities: [
        {
          type: ActivityType.Custom,
          name: "customstatus",
          state: process.env.PRESENCE,
        },
      ],
    });

    if (mongoose.connect) {
      console.log("\nMongoDB sikeres csatlakozás. ✅");
    }
    console.log(`🟢︲${client.user.username} újra online.`);
    console.log(`🤖︲NAME: ${client.user.tag}`);
    console.log(`🆔︲ID: ${client.user.id}`);
    console.log(`💻︲DEV: ` + process.env.DEV);
    console.log(`💠︲STATUS: ${process.env.PRESENCE}`);

    const channelId = "1180048018679021568"; // Cseréld le a csatorna azonosítójára

    const channel = client.channels.cache.get(channelId);

    if (channel) {
      const readyEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Bot Started`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTitle(`**${client.user.username} elindult. \`ONLINE\`**`)
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(0xffae00)
        .setTimestamp();
      await channel.send({ embeds: [readyEmbed] });











      client.on("messageCreate", (message) => {
        
        // Ellenőrizze, hogy az üzenet egy specifikus csatornából származik-e
        const excludedChannelId = "1217087036096381039"; // Azonosító azon csatorna számára, ahonnan nem szeretnénk üzenetet küldeni

        if (message.channel.id === excludedChannelId) {
          return; // Ne folytassa a kód végrehajtását, ha az üzenet az azonosítóval megegyezik
        }

        let messageText = `🏠- ${message.channel.id} ${message.guild.name} 👤- ${message.author.tag} 📨-> ${message.content}`;

        // Alapértelmezett üres imageUrl inicializálása
        let imageUrl = "";

        // Ellenőrizzük, hogy az üzenet tartalmaz-e képet
        if (message.attachments.size > 0) {
          const attachment = message.attachments.first();
          if (attachment) {
            imageUrl = attachment.url;
            messageText += `\n📷 Kép: ${imageUrl}`;
          }
        }

        const targetGuildId = "1167548939168391278"; // Cseréld le a cél szerver azonosítóját

        if (message.guild.id === targetGuildId) {
            console.log(messageText);
            return; // Ne folytassa a kód végrehajtását, ha az üzenet nem a cél szerverről származik
        }

        // Ellenőrizzük, hogy az üzenet egy beágyazott üzenet-e
        let embedInfo = "";
        if (message.embeds.length > 0) {
          embedInfo = `\n\`💟\` Ez egy Embed. \n\`🆔\` Üzenet ID: ${message.id} \n\`💬\` https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
        }

        console.log(messageText);
        const MessageChannel = "1217087036096381039"; // Cseréld le a csatorna azonosítójára

        const MessageChannelSend = client.channels.cache.get(MessageChannel);

        if (MessageChannelSend) {
          const MessageEmbed = new EmbedBuilder()
            .setAuthor({
              name: `💬 Message Log`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTitle(`**Log**`)
            .setFields(
              {
                name: `\`🏠\` **Szerver ID**`,
                value: `${message.channel.id}`,
                inline: true,
              },
              {
                name: `\`🏠\` **Szerver Név**`,
                value: `${message.guild.name}`,
                inline: true,
              },
              {
                name: `\`👤\` **Felhasználó**`,
                value: `${message.author.tag}`,
                inline: true,
              },
              {
                name: `\`💟\` **Embed**`,
                value: embedInfo || `\`❌\` Nincs EMBED`,
                inline: false,
              },
              {
                name: `\`📨\` **Üzenet**`,
                value: message.content
                  ? `\`\`\`${message.content}\`\`\``
                  : `\`❌\` Nincs üzenet`,
                inline: false,
              }
            )
            .setDescription(`\`${messageText}\``)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(0xffae00);

          // Ha van kép, adjuk hozzá az embedhez
          if (imageUrl) {
            MessageEmbed.setImage(imageUrl);
          }

          MessageChannelSend.send({ embeds: [MessageEmbed] }).catch(
            console.error
          );
        }
      });










      client.on("interactionCreate", async (commandInteraction) => {
        if (!commandInteraction.isCommand()) return; // Ellenőrizd, hogy valóban egy parancs-interakcióról van-e szó

        const { commandName, user } = commandInteraction;
        console.log(
          `-- ${commandInteraction.guild.name} - ${user.tag} -> /${commandName}`
        );
        const MessageChannel = "1217087036096381039"; // Cseréld le a csatorna azonosítójára

        const MessageChannelSend = client.channels.cache.get(MessageChannel);

        if (MessageChannelSend) {
          const CommandsMessageEmbed = new EmbedBuilder()
            .setAuthor({
              name: `💟 Command Log`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTitle(`**Log**`)
            .setFields(
              {
                name: `\`🏠\` **Szerver ID**`,
                value: `${commandInteraction.channel.id}`,
                inline: true,
              },
              {
                name: `\`🏠\` **Szerver Név**`,
                value: `${commandInteraction.guild.name}`,
                inline: true,
              },
              {
                name: `\`👤\` **Felhasználó**`,
                value: `${user.tag}`,
                inline: true,
              },
              {
                name: `\`📨\` **Parancs**`,
                value: `\`/${commandName}\``,
                inline: false,
              }
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(0xffae00);

          MessageChannelSend.send({ embeds: [CommandsMessageEmbed] }).catch(
            console.error
          );
        }
      });
    } else {
      console.error("❌︲A megadott csatorna nem található.");
    }

    client.on("messageCreate", async (message) => {
      // Ellenőrizzük, hogy az üzenet a megfelelő csatornából származik
      if (message.channel.name === "global-chat" && !message.author.bot) {
        // Először elküldjük az üzenetet az eredeti csatornába
        console.log(
          `-GChat- ${message.guild.name} - ${message.author.tag} -> ${message.content}`
        );

        // Majd továbbítjuk a "global-chat" csatornákra minden szerveren
        forwardMessageToGlobalChat(message);
      }
    });

    // Segédfüggvény az üzenet továbbításához minden "global-chat" csatornára
    async function forwardMessageToGlobalChat(message) {
      // Szerverek lekérése, ahol jelen van a bot
      const guilds = client.guilds.cache;

      guilds.forEach((guild) => {
        // Megkeressük a "global-chat" nevű csatornát a szerveren
        const channel = guild.channels.cache.find(
          (ch) => ch.name === "global-chat"
        );

        if (channel) {
          // Elküldjük az üzenetet a "global-chat" nevű csatornára
          // ...

          const embed = new EmbedBuilder()
            .setAuthor({
              name: `${message.author.tag}`,
              iconURL: message.author.displayAvatarURL(),
            })
            // Ellenőrizze, hogy van-e valós érték a message.content-ben
            .setDescription(message.content || "*Nincs üzenet.*")
            .setColor(0x82272a)
            .setTimestamp()
            .setFooter({
              text: `${message.guild.name}`,
              iconURL: client.user.displayAvatarURL(),
            });

          // Ha az üzenet tartalmaz egyetlen képet, adjuk hozzá az embedhez
          if (message.attachments.size === 1) {
            const attachment = message.attachments.first();
            embed.setImage(attachment.url);
          } else if (message.attachments.size > 1) {
            // Ha több kép van, akkor minden egyes kép linkje külön mezőként adjuk hozzá az embedhez
            const imageLinks = message.attachments.map(
              (attachment) => attachment.url
            );

            for (const [index, link] of imageLinks.entries()) {
              embed.addFields({
                name: `\`Kép ${index + 1}\``,
                value: `[Link](${link})`,
              });
            }
          }

          // ...

          channel.send({ embeds: [embed] }).catch(console.error);
        }
      });
    }
  },
};
