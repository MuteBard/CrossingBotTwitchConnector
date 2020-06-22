const env = require('dotenv').config().parsed;
// let secret = require('./Secret');
let users = ["#MuteBard"]

exports.settings_A = {
  options : {
    debug : false,
    clientId : env.TWITCH_CLIENT_ID
  },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: "crossingbot_",
    password: env.TWITCH_OAUTH
  },
  channels: users
};

  
exports.settings_B = {
  headers: {
      "Client-ID": env.TWITCH_CLIENT_ID,
      "Accept" : "application/vnd.twitchtv.v5+json",
      "Authorization" : env.ACCESS_TOKEN
  },
}