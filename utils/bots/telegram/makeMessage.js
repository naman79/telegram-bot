process.env.NTBA_FIX_319 = 1;

const {fromKoToEn, fromEnToKo} = require('../../../utils/translate')
const {isIncludeKrtext} = require('./strCheck')

async function makeMessage(originMsg){
    let translateEnMsg, translateKoMsg, message;

    if (isIncludeKrtext(originMsg)){ // ko -> en
        translateEnMsg = await fromKoToEn(originMsg);
//        message = `원문(original): ${originMsg}\n영문(English): ${translateEnMsg}`
		
	  message = translateEnMsg;	
    } else {  // en -> ko
        translateKoMsg = await fromEnToKo(originMsg);
//        message = `원문(original): ${originMsg} \n한글(Korea): ${translateKoMsg}`
    
	  message = translateKoMsg;
	}

    return message;
//	return originMsg;
}

module.exports = {
    makeMessage: makeMessage,
}
