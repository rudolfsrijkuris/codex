
const Discord = require("discord.js");
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

let prompt ='Bob is a chatbot that reluctantly answers questions.\n\
You: What have you been up to?\n\
Bob: Watching old movies.\n\
You: Did you watch anything interesting?\n';

client.on("messageCreate", function(message) {
    if (message.author.bot) return;
    prompt += `You: ${message.content}\n`;
    (async () => {
        const gptResponse = await openai.complete({
            engine: 'text-davinci-002',
            prompt: prompt,
            maxTokens: 60,
            temperature: 0.0,
            top_p: 1.0,
            presencePenalty: 0,
            frequencyPenalty: 0.5,
            bestOf: 1,
            n: 1,
            stream: false,
            stop: ['\n', '\n\n']
        });

        const { choices } = gptResponse.data

        const firstChoice = choices[0]

        // console.log('First choice', firstChoice)

        if (choices.length === 0 || firstChoice.text === '') {
            return message.reply(`Didn't get you, try again`)
        }
        // if (gptResponse.data.choices[0].text === "") {
        //     message.reply("I have no idea :/")
        // } else {
        //     message.reply(`${gptResponse.data.choices[0].text.substring(5)}`); // neaiztikt
        //     prompt += `${gptResponse.data.choices[0].text}\n`; // neaiztikt
        // }
        message.reply(`${firstChoice.text.substring(4)}`); // neaiztikt
        prompt += `${firstChoice.text}\n`; // neaiztikt

    })();                       

});  

function isEmpty(str) {
    return (!str || str.length === 0 );
}

client.login(process.env.TOKEN);
