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

module.exports = (inputURL, guildId) => {
    let spoiled = 0;
    const serverLanguage = localizing.getServerLanguage(guildId);
    let result = inputURL;

    /** 
     * 스포처리된 메세지인지 확인
     * 스포 처리된 메세지라면 스포용 문자 '||' 제거
     */
    if(result.startsWith("||") && result.endsWith("||")) {
        result = result.substr(2).slice(0, -2);
        spoiled = 1;
    }

    // 입력된 URL이 "https://x.com" 또는 "https://twitter.com"으로 시작하고, 'status'가 들어간 경우 진입
    const matching = result.match(/^https:\/\/(x\.com|twitter\.com)\/.+\/status\/\d+/)
    if (matching) {
        result = matching[0].replace(/^https:\/\/(x\.com|twitter\.com)/, "https://fxtwitter.com") + `)`;
    } else {
        //만약 트위터의 url이 아닌 경우 원본 메세지 반환 
        return inputURL;
    }

    // 스포 처리된 채팅이면 스포 처리 완료 후 반환, 아니라면 그대로 반환
    if (spoiled) {
        return spoiledOutput[serverLanguage] + result + `||`;
    } else {
        // 조건에 해당하지 않으면 그대로 반환
        return output[serverLanguage] + result;
    }
}