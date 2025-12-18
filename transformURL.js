const localizing = require("./server-language.js");

const output = {
    "ko" : " 님이 공유한 [트윗](",
    "en" : " shared a [tweet](",
    "jp" : " さんが共有した[ツイート]("
}

const spoiledOutput = {
    "ko" : " 님이 공유한 ||[트윗](",
    "en" : " shared a ||[tweet](",
    "jp" : " さんが共有した||[ツイート]("
}

module.exports = (originalURL, guildId, isSpoiler) => {
    const serverLanguage = localizing.getServerLanguage(guildId);
    /** 임베드로 표시하기 위한 fxtwitter url */
    let transformedURL;

    // x.com 혹은 twitter.com 부분을 fxtwitter.com으로 변경
    transformedURL = originalURL.replace(/^https:\/\/(x\.com|twitter\.com)/, "https://fxtwitter.com") + `)`;

    // 스포 처리된 채팅이면 스포 처리 완료 후 반환, 아니라면 그대로 반환
    if (isSpoiler) {
        return spoiledOutput[serverLanguage] + transformedURL + `||`;
    } else {
        // 조건에 해당하지 않으면 그대로 반환
        return output[serverLanguage] + transformedURL;
    }
}