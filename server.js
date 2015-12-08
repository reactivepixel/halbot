var Slack = require('slack-client');
var msg = require('./models/msg.js');
var cmd = require('./lib/parse-cmd.js');
var clever = require('./lib/clever.js');

require('dotenv').load();

// Configs
var autoMark = true;
var autoReconnect= true;
var slackToken = process.env.SLACK_TOKEN;

// Slack Connection
var slack = new Slack(slackToken, autoReconnect, autoMark);

// Event: Open Connection
slack.on('open', function() {
  return console.log("Connected to " + slack.team.name + " as @" + slack.self.name);
});

// Event: Message recieved in any room or DM the bot is present
slack.on('message', function(message) {


  if(!message.text) return false;

  var meta = cmd.parse(message.text);

  if(meta){
    if(meta.type === "@" && meta.target_id === slack.self.id){
      if(meta.commands[1] === 'recall') cmd.recall(meta, message, msg, slack);
    }
  }

  msg.add({ channel: message.channel, user: message.user, text: message.text, ts: message.ts }, function(){
    console.log(
        '#' + message.channel
      +' @' + message.user
      + ': '+ message.text);
    });
  }, function(err){
    console.log('err' + err);
  });


// Event: Error
slack.on('error', function(err) {
  return console.error("Error", err);
});


slack.login();
