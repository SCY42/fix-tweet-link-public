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

module.exports = (inputMessage, guildId) => {
    let spoiled = inputMessage.startsWith("||") && inputMessage.endsWith("||");
    const serverLanguage = localizing.getServerLanguage(guildId);
    /** 유효한 트위터 url인지를 검사하는 정규 표현식 */
    const validTwitterURL = /^https:\/\/(x\.com|twitter\.com)\/.+\/status\/\d+/
    /** 링크 버튼에 첨부하기 위한 매칭된 원본 url */
    let originalURL = inputMessage.match(validTwitterURL)       // 배열 or null
    /** 임베드로 표시하기 위한 fxtwitter url */
    let transformedURL;

    if (originalURL) {      // not null (매칭됨)
        // x.com 혹은 twitter.com 부분을 fxtwitter.com으로 변경
        transformedURL = originalURL[0].replace(/^https:\/\/(x\.com|twitter\.com)/, "https://fxtwitter.com") + `)`;
    } else {
        // 만약 트위터의 url이 아닌 경우 원본 메세지 반환 
        return inputMessage;
    }

    // 스포 처리된 채팅이면 스포 처리 완료 후 반환, 아니라면 그대로 반환
    if (spoiled) {
        return [spoiledOutput[serverLanguage] + transformedURL + `||`, originalURL[0]];
    } else {
        // 조건에 해당하지 않으면 그대로 반환
        return [output[serverLanguage] + transformedURL, originalURL[0]];
    }
}