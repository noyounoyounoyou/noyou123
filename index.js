const { Client, Intents, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
module.exports = client;
module.exports = client
const fs = require("fs");
const { prefix, token, mongo_url } = require("./config.json");
const { DiscordTogether } = require("discord-together");
client.discordTogether = new DiscordTogether(client);
const mongoose = require("mongoose");
const Levels = require("discord-xp");
Levels.setURL(mongo_url);
module.exports = client;
module.exports = client;

mongoose
  .connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("데이터베이스 연결 완료"));

client.once("ready", () => {
  console.log("봇이 준비되었습니다");
});

client.on("messageCreate", (message) => {
  if (message.content == "핑") {
    message.reply("퐁");
  }
});
client.commands = new Collection();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.slashcommands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "오류가 발생했습니다",
      ephemeral: true,
    });
  }
});

//슬래쉬 커맨드 핸들
client.slashcommands = new Collection();
let commands = [];
const commandsFile1 = fs
  .readdirSync("./slashcommands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandsFile1) {
  const command = require(`./slashcommands/${file}`);
  client.slashcommands.set(command.name, command);
  commands.push({
    name: command.name,
    description: command.description,
    optionds: command.optionds,
  });
}

//레디
client.once("ready", async () => {
  client.guilds.cache.forEach((gd) => {
    gd.commands.set(commands);
  });
  console.log((client.user.username = "로그인 완료"));
});

//에러 무시
process.on("unhandledRejection",err=>{
    if(err == "DiscordAPIError: Missing Access") return console.log("봇에게 슬래쉬 커맨드를 서버에 푸쉬 할 권한이 없어서 서버에 슬래쉬 커맨드를 푸쉬하지 못했습니다.")
    console.error(err)
})

//메세지 커맨드핸들
const commandsFile = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandsFile) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift();
  const command = client.commands.get(commandName);
  if (!command) return;
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
  }
});

client.on("messageCreate", (message) => {
  if (message.content == `${prefix}유튜브`) {
    const channel = message.member.voice.channel;
    if (!channel) return message.reply("음성채널에 접속해주세요!");
    client.discordTogether
      .createTogetherCode(channel.id, "youtube")
      .then((invite) => {
        return message.channel.send(invite.code);
      });
  }
});

client.on("voiceStateUpdate", async (newState, oldState) => {
  const channel = newState.guild.channels.cache.find(
    (c) => c.name === "자유음성채널생성"
  );
  if (newState.member.voice.channel) {
    if (!channel) return;
    if (newState.member.voice.channel.id !== channel.id) return;
    newState.guild.channels
      .create(`${newState.member.user.username}의 음성방`, {
        type: "GUILD_VOICE",
        parent: oldState.channel.parent,
      })
      .then((ch) => {
        if (!ch) return;
        newState.member.voice.setChannel(ch);
        const interval = setInterval(() => {
          if (ch.deleted == true) {
            clearInterval(interval);
            return;
          }
          if (ch.members.size == 0) {
            ch.delete();
            console.log("채널 삭제됨");
            return;
          }
        }, 5000);
      });
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== "GUILD_TEXT") return;
  const randomXp = Math.floor(Math.random() * 9) + 1;
  await Levels.appendXp(message.author.id, message.guild.id, randomXp);
});

client.on('messageCreate', async message => {
      if (message.content.startsWith(prefix)) {
		const Schema = require("./models/배워")
		const args = message.content.slice(prefix.length).trim().split(/ +/)
		const argsjoin = args.join(" ")
		const ff = await Schema.findOne({ 단어: argsjoin })
		if (ff) {
			let user = client.users.cache.get(ff.userid)
			if  ( !user) user = "Unknown#0000"
			message.channel.send(`\`\`\`${ff.뜻}\`\`\`\n**${user.tag || user}님이 알려주셧어요 !**`)
    }
  }
})  

const style = 'R'
const starttime = `<t:${Math.floor(client.readyAt / 1000)}` + (style ? `:${style}` : '') + '>'
client.on('messageCreate', message => {
    if(message.content == "!업타임"){
        const starttime = `<t:${Math.floor(client.readyAt / 1000)}` + (style ? `:${style}` : '') + '>'
        message.reply(`봇이 온라인 이였던 시간을 알려드릴게요!!\n업타임 : ${starttime}`)
    }
})

client.login("OTY2NjQwMDc1NjQ1NTM4MzM1.YmEruQ.edb2WtkGFAMxI5x2NTGKwFut9_k");
