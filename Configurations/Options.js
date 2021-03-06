require('dotenv').config();
let users = ["#MuteBard"]
exports.settings_A = {
  options : {
    debug : false,
    clientId : process.env.TWITCH_CLIENT_ID
  },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: "crossingbot_",
    password: process.env.TWITCH_OAUTH
  },
  channels: users
};

  
exports.settings_B = {
  headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID,
      "Accept" : "application/vnd.twitchtv.v5+json",
      "Authorization" : process.env.ACCESS_TOKEN
  },
}
