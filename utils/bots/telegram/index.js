process.env.NTBA_FIX_319 = 1;

const {token, chatId} = require('../../../config/telegram.json')
const {makeMessage} = require('./makeMessage')

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token, {polling: true});

var weather = require('openweather-apis');

weather.setLang('en');

const axios = require('axios');

const os = require('os');

var exec = require('child_process').exec;
var options = {
	timeout:1000,
	killSignal: 'SIGKILL'
};

function start() {

  //bot.on('message', async (msg) => {
    //const chatId = msg.chat.id;
    
    //console.log(chatId);
    //let originMsg = msg.text;

    //let message = await makeMessage(originMsg)
   //bot.sendMessage(chatId, message);
  //});

  bot.on('message', async (msg) => {

	console.log(msg);
	const chatId = msg.chat.id;
	
	if(msg.hasOwnProperty('location')) {
		console.log(msg.location.latitude);
		console.log(msg.location.longitude);

		bot.sendMessage(chatId, msg.location.latitude + '|' + msg.location.longitude);
	}  

	});	

  bot.onText(/\/w-now (.+)/, async (msg, match) => {
	
	console.log(msg);
	const chatId = msg.chat.id;
	console.log(chatId);
	console.log(match);
	var resp = match[1];

	var locations = resp.split('|');
	weather.setCoordinate(locations[0], locations[1]);
	weather.setAPPID('openweathermap인증서');
	
	weather.getAllWeather( async (err, JSONObj) => {
		console.log(JSONObj);
		resp = '';

		for(i = 0; i < JSONObj.weather.length; i++) {
			var originMsg = JSONObj.weather[i].description;
			var message = await makeMessage(originMsg);
			resp = resp + ', ' + message;
		}

		resp = '날씨: ' + resp.substring(1) + '\n';
		resp = resp + '현재기온: ' + JSONObj.main.temp + '\n';
		resp = resp + '기압: ' + JSONObj.main.pressure + '\n';
		resp = resp + '습도: ' + JSONObj.main.humidity + '\n';
		resp = resp + '최저기온: ' + JSONObj.main.temp_min + '\n';
		resp = resp + '최고기온: ' + JSONObj.main.temp_max + '\n'; 

		bot.sendMessage(chatId, resp);
	});
  });

bot.onText(/\/w-days (.+)/, async (msg, match) => {
	
	const chatId = msg.chat.id;
	var resp = match[1];

	var locations = resp.split('|');
	
	var lat = locations[0];
	var lon = locations[1];
	const apiKey = 'openweathermap인증서';
	const url = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

	console.log(url);
	axios.get(url).then( async response => {
			console.log(response);
			
			resp = "";

			for (var i = 0; i < response.data.list.length; i++) {
			var originMsg = response.data.list[i].weather[0].description;
			var message = await makeMessage(originMsg)
			resp = resp + message + ' ' + response.data.list[i].dt_txt + '\n';
			}

			console.log(resp);

			bot.sendMessage(chatId, resp);
	}).catch(error => {
		console.log(error);
	});

});

bot.onText(/\/os/, async (msg) => {
	
	console.log(msg);
	const chatId = msg.chat.id;
	console.log(chatId);
	
	var resp = '';
	
	console.log(os.cpus());

	//resp = resp + 'cpu: ' + os.cpus() + '\n';
 	resp = resp + '총메모리: ' + os.totalmem() + '\n';
	resp = resp + '여유메모리: ' + os.freemem() + '\n';

	console.log(resp);

	bot.sendMessage(chatId, resp);
  });

bot.onText(/\/c (.+)/, async (msg, match) => {
	
	console.log(msg);
	const chatId = msg.chat.id;
	console.log(chatId);
	var command = match[1];	
	var resp = '';
	
	exec(command, options, function(err, stdout, stderr) {
		if(err){
			console.log('error: ', err.code);
			return;
		}
		
		console.log(typeof stdout);
		console.log(stdout);
		
				resp = JSON.stringify(stdout);
		bot.sendMessage(chatId, resp);
	});

  });

bot.onText(/\/t*/, async (msg, match) => {
	
	console.log(msg);
	const chatId = msg.chat.id;
	console.log(chatId);
	var text = msg.text.split('/t');

	console.log(text);

	var originMsg = text[1];
	var message = await makeMessage(originMsg);
	console.log(message);
	bot.sendMessage(chatId, message);

  });


}

var schedule = require('node-schedule');
var scheduler = schedule.scheduleJob('*/20 * * * *', async () => {
	        const chatId = 50990855;
        	console.log(chatId);
        	//위치정보 latitude|longitude
        	var resp = '37.473719|126.932006';

        	var locations = resp.split('|');
       		weather.setCoordinate(locations[0], locations[1]);
        	weather.setAPPID('openweathermap인증서');

		weather.getAllWeather( async (err, JSONObj) => {
			console.log(JSONObj);
			resp = '';

			for(i = 0; i < JSONObj.weather.length; i++) {
				var originMsg = JSONObj.weather[i].description;
				var message = await makeMessage(originMsg);
				resp = resp + ', ' + message;
			}	

			resp = '날씨: ' + resp.substring(1) + '\n';
			resp = resp + '현재기온: ' + JSONObj.main.temp + '\n';
			resp = resp + '기압: ' + JSONObj.main.pressure + '\n';
			resp = resp + '습도: ' + JSONObj.main.humidity + '\n';
			resp = resp + '최저기온: ' + JSONObj.main.temp_min + '\n';
			resp = resp + '최고기온: ' + JSONObj.main.temp_max + '\n'; 

			bot.sendMessage(chatId, resp);
		});

	
});

var schedulerDay = schedule.scheduleJob('30 7 * * *', async function(){
	        const chatId = 50990855;
        	console.log(chatId);
        	//위치정보 latitude|longitude
        	var resp = '37.473719|126.932006';

        	var locations = resp.split('|');

		var lat = locations[0];
		var lon = locations[1];
		const apiKey = 'openweathermap인증서';
		const url = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

		console.log(url);
		axios.get(url).then( async response => {
			console.log(response);
			
			resp = "";

			for (var i = 0; i < response.data.list.length; i++) {
				var originMsg = response.data.list[i].weather[0].description;
			var message = await makeMessage(originMsg)
			resp = resp + message + ' ' + response.data.list[i].dt_txt + '\n';
			}

				console.log(resp);

				bot.sendMessage(chatId, resp);
			}).catch(error => {
				console.log(error);
			});


});

var schedulerRootCheck = schedule.scheduleJob('*/30 * * * *', function(){
	        const chatId = 50990855;
        	console.log(chatId);
        	
		exec('df -h \/dev\/mapper\/centos-root', options, function(err, stdout, stderr) {
		if(err){
			console.log('error: ', err.code);
			return;
		}
		
		console.log(typeof stdout);
		console.log(stdout);
		var strSplitN = stdout.split('\n');
		console.log(strSplitN[1]);

		var strSplit = strSplitN[1].split(' ');
		console.log(strSplit[10]);	
		
		var strSplitP = strSplit[10].split('%');
		console.log(strSplitP[0]);

		if(strSplitP[0]*1 > 90) {
			resp = 'root 저장소 사용율: ' + strSplit[10];
			bot.sendMessage(chatId, resp);

		}
	
	});


});



async function sendMessage({chatId, msg}){
    let message = await makeMessage(msg)
    console.log(chatId);
    console.log(message);
    bot.sendMessage(chatId, message);
}

module.exports = {
    start:start,
    sendMessage:sendMessage
}
