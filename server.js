var Slack = require('slack-client');
var msg = require('./models/msg.js');
var cmd = require('./lib/parse-cmd.js');
var clever = require('./lib/clever.js');

if(!process.env.NODE_ENV && process.env.NODE_ENV != 'production') require('dotenv').load();

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

  // TODO refine edgecases for non new msg events like edits
  if(!message.text) return false;

  var meta = cmd.parse(message.text);

  if(meta){
    if(meta.type === "@" && meta.target_id === slack.self.id){
      var targetChannel = slack.getChannelGroupOrDMByID(message.channel);
      switch (meta.commands[1]) {
        case 'recall':
          cmd.recall(meta, message, msg, slack);
          targetChannel.send('<@' + message.user + '>: Recalling previous messages for you, check your DMs.');
          break;
        default:
          clever.ask(targetChannel, message.text);
      }
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
