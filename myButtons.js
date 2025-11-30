const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const localizing = require("./server-language.js");


const deleteLabel = {
    "ko": "임베드 삭제",
    "en": "Delete Embed",
    "jp": "埋め込み削除",
};


const urlLabel = {
	"ko": "원본 트윗 보기",
	"en": "View Original Tweet",
	"jp": "元のツイートを見る",
};


module.exports = (message) => {
	const guildId = String(message.guild.id);
	const serverLanguage = localizing.getServerLanguage(guildId);
	
	const deleteButton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId('delete').setLabel(deleteLabel[serverLanguage]).setEmoji("<:trash_bin:1444690753170309351>");
	deleteButton.add
	const urlButton = new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(message.content).setLabel(urlLabel[serverLanguage]).setEmoji("<:twitter:1444690751639392317>");
	const row = new ActionRowBuilder().addComponents(deleteButton, urlButton);

	return row;
};