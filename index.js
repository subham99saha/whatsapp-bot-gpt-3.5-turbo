const qrcode = require('qrcode-terminal');
const axios = require('axios');
require('dotenv').config()

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    let data = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "user",
          "content": message.body
        }
      ],
      "temperature": 0.7
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.openai.com/v1/chat/completions',
      headers: { 
        'Authorization': 'Bearer ' + process.env.API_KEY, 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios.request(config)
    .then((response) => {
      console.log(response.data);
      if (response.data.hasOwnProperty('choices')) {
        if (response.data.choices.length != 0) {   
            message.reply(response.data.choices[0].message.content)
        } else {
            message.reply('Sorry, I could not find a proper reply to that! Try asking something else :)')
        }
      } else {
        message.reply('Sorry, I could not process that! Try asking something else :)')
      }
    })
    .catch((error) => {
      console.log(error);
      message.reply('Sorry, I could not process that!')
    });
});

client.initialize();