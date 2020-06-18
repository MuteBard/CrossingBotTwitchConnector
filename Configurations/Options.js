let secret = require('./Secret');
//TODO:FIX THIS
let users = ["#MuteBard"]

exports.settings_A = {
  options : {
    debug : false,
    clientId : secret.security.TWITCH_CLIENT_ID
  },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: "crossingbot_",
    password: secret.security.TWITCH_OAUTH 
  },
  channels: users
};

  
exports.settings_B = {
  headers: {
      "Client-ID": secret.security.TWITCH_CLIENT_ID,
      "Accept" : "application/vnd.twitchtv.v5+json",
      "Authorization" : secret.security.ACCESS_TOKEN
  },
}