// import transformURL from "./transformURL.js";
const transformURL = require("./transformURL.js");
// import button from "./button.js";
const myButtons = require("./myButtons.js");
// import localizing from "./server-language.js";
const localizing = require("./server-language.js");
// 필요한 discord.js 클래스를 require합니다.
const { Client, Events, GatewayIntentBits, Partials, Collection } = require("discord.js");
require("dotenv").config();
const path = require('path');
const fs = require('fs');

// bot token을 환경변수 설정으로 받아옴
const token = process.env.BOT_TOKEN;

// 새 client 인스턴스를 생성합니다.
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// slash command를 사용하기 위한 베이스 설정
client.commands = new Collection();
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
});

// 클라이언트가 준비되면, 코드를 실행합니다. (딱 한번만)
client.once("ready", async () => {
    console.log("Ready!");
});

/**
 * slash command
 */
client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
    
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

/**
 * 메세지가 입력됐을 때 실행되는 메소드
 */
client.on(Events.MessageCreate, message => {
    try{
        if (message.author.bot) return;
    
        result = transformURL(message.content, message.guild.id);
        const channel = client.channels.cache.get(message.channelId);
    
        if (message.content !== result) {
            message.delete();

            // 메시지에 버튼 열을 추가하여 전송
            const myButtonsRow = myButtons(message);
            channel.send({ content: message.author.toString() + result,
                           components: [myButtonsRow],
                           flags: ["SuppressNotifications"] });
        }
    } catch(error) {
        console.log(error);
    }    
});

const messageDeleted = {
    "ko": "임베드가 삭제되었습니다.",
    "en": "Embed deleted successfully.",
    "jp": "埋め込みが削除されました。",
}

const messageDeleteError = {
    "ko": "임베드 삭제 중 오류가 발생했습니다.",
    "en": "There was an error trying to delete the embed.",
    "jp": "埋め込みの削除中にエラーが発生しました。",
}

const notYourMessage = {
    "ko": "작성자 본인만 메시지를 삭제할 수 있습니다.",
    "en": "Only the original author can delete this message.",
    "jp": "元の作成者のみがこのメッセージを削除できます。",
}

/**
 * 삭제 버튼이 클릭됐을 때 실행되는 메소드
 */
client.on("interactionCreate", async interaction => {
    // 인터랙션이 삭제 버튼으로 인한 것이 아닌 경우 무시
    if (!interaction.isButton() || !interaction.customId === "delete") return;
    
    const guildId = String(interaction.guild.id);
    const serverLanguage = localizing.getServerLanguage(guildId);
    
    // 인터랙션이 작성자 본인으로 인한 것이 아닌 경우 경고 후 무시
    // 삭제하려는 메시지는 항상 봇이 작성한 메시지이므로, 원래의 작성자는 메시지에 포함된 멘션으로 취득
    if (interaction.user != interaction.message.mentions.users.first()) {
        await interaction.reply({ content: notYourMessage[serverLanguage], ephemeral: true });
        return;
    }

    try {
        await interaction.message.delete();
        await interaction.reply({ content: messageDeleted[serverLanguage], ephemeral: true });
    } catch (error) {
        console.error('Error deleting message:', error);
        await interaction.reply({ content: messageDeleteError[serverLanguage], ephemeral: true });
    }
});


// 디스코드를 클라이언트의 토큰으로 로그인합니다.
client.login(token);
