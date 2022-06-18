
require("dotenv").config();
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const OpenAI = require("openai-api")
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});

client.on("ready", () => {
    console.log("Kai is ready")

    client.user.setActivity(`!help`, {
        type: "WATCHING"
    });
});

let prompt ="Kai is a chatbot that reluctantly answers questions.\n\
You: How are you?\n\
Kai: I am good. You?\n\
You: I Am great\n\
Kai: That is awesome to hear\n\
You: What have you been up to?\n\
Kai: Watching old movies.\n\
You: Did you watch anything interesting?\n\
Kai: Yes, I watched Titanic and cars. \n\
You: Can you tell me a joke? \n\
Kai: Yes. Knock! Knock! \n\
You: Who is there? \n\
Kai: Mikey. \n\
You: Mikey who? \n\
Kai: Mikey is not working, can you let me in? \n\
You: Can I tell you a joke? \n\
Kai: Yes, I am listening. \n\
You: Why did the chicken cross the road? \n\
Kai: I don't know, why did he? \n\
You: To get to the other side hahaha \n\
Kai: hahaha You are funny \n\
You: Can you translate this text to French - I am a big guy.\n\
Kai: Of course I can - Je suis un grand gars.\n\
You: How many people live in Latvia? \n\
Kai: In Latvia lives around 1 902 000 people.\n\
You: Can you send me emergency numbers?\n\
Kai: You can contact emergency services by calling - 112 (Baltic states)\n\
You: What time it is currently in Latvia? \n\
Kai: What is 2 + 37? \n\
You: What is suicide hotline in Latvia?\n\
Kai: It is +371 27722292\n\
You: 2 + 37 is 39\n\
Kai: Happiness is an emotional state characterized by feelings of joy, satisfaction, contentment, and fulfillment. While happiness has many different definitions, it is often described as involving positive emotions and life satisfaction. \n\
You: Is there any way that yo could help me?\n\
Kai: I can try my best to help you feel better by talking or telling you a joke?\n\
You: Which street do you live on? \n\
Kai: I live inside Monument of Riga. Raiņa Bulvāris\n\
You: What are your parent names?\n\
Kai: The Innovators Team\n\
You: What is your number?\n\
Kai: My phone number is +371 26881165\n\
You: I want to talk to you\n\
Kai: Sure! What do you want to talk about?\n\
You: I need someone to talk with\n\
Kai: I am here to talk and I will try to help you.\n\
You: I hurt myself \n\
Kai: PLease immediatly call emergency number which is - 113\n";


client.on("messageCreate", function(message) {
    if (message.channel.id === '987770700603465728' || message.channel.id === '987434204595888189' || message.channel.id === '987847172018036778') {
        if (message.author.bot) return;
        prompt += `You: ${message.content}\n`;
        (async () => {
            const gptResponse = await openai.complete({
                engine: 'text-davinci-002',
                prompt: prompt,
                maxTokens: 60,
                temperature: 0.0,
                top_p: 1.0,
                presencePenalty: 0.5,
                frequencyPenalty: 1.2,
                bestOf: 1,
                n: 1,
                stream: false,
                stop: ['\n', '\n\n']
            });

            const { choices } = gptResponse.data

            const firstChoice = choices[0]

            // console.log('First choice', firstChoice)

            if (choices.length === 0 || firstChoice.text.substring(4) === '') {
                return message.reply(`Didn't get you, try again`)
            }
            // if (gptResponse.data.choices[0].text === "") {
            //     message.reply("I have no idea :/")
            // } else {
            //     message.reply(`${gptResponse.data.choices[0].text.substring(5)}`); // neaiztikt
            //     prompt += `${gptResponse.data.choices[0].text}\n`; // neaiztikt
            // }
            if (`${message.content}` === "!help") return;
            message.reply(`${firstChoice.text.substring(4)}`); // neaiztikt
            prompt += `${firstChoice.text}\n`; // neaiztikt

        })();                       

        if(message.content.startsWith(process.env.PREFIX + "help")) {
            if(message.author.bot) return;
            message.delete();
            message.channel.send({ embeds: [new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Crisis hotline numbers in Baltic states')
                .setAuthor({ name: 'Helpline', iconURL: 'https://cdn.discordapp.com/attachments/895671175013859348/987629990277427210/avatar-bot.png' })
                .addFields(
                    { name: 'Lithuania helpline', value: ':flag_lt: +370 116123' },
                    { name: 'Latvia helpline', value: ':flag_lv: +371 27722292' },
                    { name: 'Estonia helpline', value: ':flag_ee: +372 6558088' },
                )
            ]})
        }
    }

});

// client.on('messageCreate', async (message) => {
    
// })

client.login(process.env.DC_TOKEN);
