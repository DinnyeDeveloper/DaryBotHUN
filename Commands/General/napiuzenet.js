const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { User } = require("../../Models/DailyMessages");
require('dotenv').config();

let prettyMilliseconds; // Deklaráljuk a prettyMilliseconds változót

import('pretty-ms').then(module => {
    prettyMilliseconds = module.default; // Állítsuk be a prettyMilliseconds-t a modul default exportjából
}).catch(err => {
    console.error(err);
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("napi-uzenet")
        .setDescription("Kaphatsz egy napi üzenetet."),
    async execute(interaction, client) {
        const user = interaction.member.user
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
        const embed = new EmbedBuilder({ color: 0xffae00 })

        if (userData.cooldowns.daily > Date.now()) return interaction.reply({
            embeds: [
                embed.setDescription(`⌛ Ön már lekérte a napi üzenetét, várjon **\`${prettyMilliseconds(userData.cooldowns.daily - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`)
            ],
            ephemeral: true
        })

        userData.cooldowns.daily = new Date().setHours(24, 0, 0, 0)
        userData.save()

        const uzenetek = [
            "Ma tedd félre a gondokat, és szerezz egy mosolyt! 😊",
            "Kezd el a napod egy kis zenével, a világ rád vár! 🎶",
            "Álmodozz kicsit, mielőtt aludnál! ✨",
            "Szánj időt ma egy jó könyvre vagy filmre! 📖🎬",
            "Táncolj, mintha senki sem figyelne! 💃",
            "Küldj egy kedves üzenetet egy barátodnak! 📱💬",
            "Ma az a nap, amikor megmutathatod a legjobb oldaladat! 😎",
            "Mutasd meg azoknak, akik fontosak neked, hogy szereted őket! ❤️",
            "Egy kis kaland mindig jól jön! 🌍",
            "Ne felejts el mosolyogni, még ha nehéz is! 😁",
            "Legyen ma az a nap, amikor kimutatod az érzéseidet! 💖",
            "Szeresd magadat, mert te vagy az igazi csillag! 🌟",
            "Nézd meg a naplementét, és gyűjts energiát holnapra! 🌇",
            "Csinálj valami újat, változatosság az élet! 🔄",
            "Ma találkozhatsz valakivel különlegessel! 👀",
            "Az élet rövid, élvezd minden pillanatát! ⌛",
            "Légy kreatív, hozz létre valamit saját kezűleg! 🎨",
            "Szánj időt a saját boldogságodra! 😌",
            "Mutasd meg a világnak, milyen egyedi vagy! 🌈",
            "Hozz létre egy kis szerelemmel teli pillanatot! 💑",
            "Ma egy kis napfényt csempéssz a szívünkbe! ☀️",
            "Ne feledd, mindig van valaki, aki gondol rád! 🤗",
            "Hagyj egy kis időt az álmaidnak! 💤",
            "Szeress úgy, mintha sosem fájna! 💔",
            "Tegyél meg valami apró jót ma! 🌸",
            "Ne aggódj a holnap miatt, élvezd a májusát! 🌷",
            "Egy kis izgalom mindig jót tesz! 🚀",
            "Tölts időt azokkal, akik boldoggá tesznek! 🤩",
            "Ma a kihívások azért vannak, hogy leküzdjük őket! 💪",
            "Változtasd meg a napodat egy kis pozitív gondolkodással! 🌞",
            "Ma este csillagokat nézhetsz az égen! ✨",
            "Érezd a zenét, és hagyd, hogy elragadjon! 🎵",
            "Ma keresd meg a boldogságot a kis dolgokban! 😊",
            "Vigyázz a szívedre, és bontsd le a falakat! 💖",
            "Szerelmes pillanatok ma este? 👫",
            "Egy kis sétával szellőztess ki! 🚶‍♀️",
            "Egy kis romantika sosem árt! 💘",
            "Küldj egy szívhez szóló üzenetet valakinek! 💕",
            "Ma az a nap, amikor magadra figyelsz! 🌺",
            "Egy kis kacagás mindent jobbá tesz! 😄",
            "Ma a szerelem körülötted lebeg! 💞",
            "Táncolj, mintha senki sem figyelne! 💫",
            "Egy kis kihívás sosem árt! 🎯",
            "Tudtad, hogy a mosoly ragályos? 😃",
            "Egy kis romantika mindig jól jön! 💑",
            "Sosem tudhatod, mikor találkozol a szerelemmel! 💖",
            "Ma egy kis édesség mindent megold! 🍬",
            "Szeress úgy, mintha sosem fájna! 💗",
            "Ma az a nap, amikor elmondod, mit érzel! 💬",
            "Tarts egy kis időt magadnak is! 🌼",
            "A napod egy kis romantikával indul! 💏",
            "Egy kis boldogság a napodba! 😊",
            "Ma talán egy kis szerelmi történet lesz a te életedben! 💕",
            "Ne feledd, mindig van valaki, aki melletted áll! 🤝",
            "Ma az a nap, amikor egy kis kockázatot vállalsz! 🎲",
            "A napodat egy kis pozitív energia teszi különlegessé! ⚡",
            "Ma egy kis romantika a levegőben! 💓",
            "Ne hagyd ki a lehetőséget, hogy kifejezd az érzéseidet! 💌",
            "Egy kis szerelem mindig jót tesz! 💘",
            "Tegyél meg valami olyat, ami boldoggá tesz! 😄",
            "Ma az a nap, amikor kinyílik a szíved! 💖",
            "Éld meg a pillanatot, mint egy igazi tinédzser! 🤘",
            "Ma talán egy kis romantikára vágysz! 💑",
            "Egy kis izgalommal indul a napod! 🚀",
            "Ma este egy kis szerelem a levegőben! 💕",
            "Egy kis boldogság mindent feldob! 😁",
            "Ma reggel ébredj úgy, mintha minden lehetséges lenne! 🌈",
            "Egy kis szerelmi történet a napodba! 💗",
            "Ne feledd, mindig van valami jó a rosszban! 👍",
            "Ma az a nap, amikor megmutatod az érzelmeidet! 💖",
            "Táncolj egy kicsit, és szórakozz jól! 💃",
            "Ma talán egy kis romantikára vágysz! 💞",
            "Egy kis boldogság a kupak alatt! 😊",
            "Ne feledj el mosolyogni, mert szép vagy! 😄",
            "Ma egy kis izgalommal indul a napod! 🎢",
            "Egy kis romantika mindig jót tesz! 💑",
            "Ma az a nap, amikor kiszabadulsz a hétköznapokból! 🌟",
            "Tudtad, hogy a nevetés egészséges? 😂",
            "Egy kis szerelem a napodba! 💖",
            "Ma talán egy kis romantikára vágysz! 💏",
            "Egy kis boldogság a napodba! 😊",
            "Ne hagyd ki a lehetőséget, hogy boldog legyél! 🌺",
            "Ma az a nap, amikor érezni fogod a szerelmet! 💕",
            "Egy kis szerelem a levegőben! 💘",
            "Ma reggel mosolyogj a tükörbe, és mondd el, hogy szereted magad! 😊",
            "Egy kis izgalommal indul a napod! 🚀",
            "Ma talán egy kis romantikára vágysz! 💖",
            "Egy kis boldogság a napodba! 😄",
            "Táncolj egy kicsit, és élvezd a pillanatot! 💃",
            "Ma az a nap, amikor egy kis szeretetet adhatsz másoknak is! 💗",
            "Egy kis szerelem a levegőben! 💓",
            "Ne feledj el mosolyogni, mert szép vagy! 😊",
            "Ma egy kis romantika a levegőben! 💕",
            "Egy kis boldogság a kupak alatt! 😄",
            "Ma az a nap, amikor érezni fogod a szívverésed! ❤️",
            "Táncolj egy kicsit, és szórakozz jól! 💃",
            "Egy kis szerelem a napodba! 💖",
            "Ma talán egy kis romantikára vágysz! 💏",
            "Egy kis boldogság a kupak alatt! 😊",
            "Ma az a nap, amikor elkapod a boldogságot! 🌈"
        ]

        const randomuzenetek = uzenetek[Math.floor(Math.random() * uzenetek.length)];
        console.log(randomuzenetek)
        /*return interaction.reply({
            embeds: [ embed.setDescription(`${randomuzenetek}`) ]
        })*/


        return interaction.reply({
            embeds: [embed.setDescription(`${randomuzenetek}`)]
        })

    }
}