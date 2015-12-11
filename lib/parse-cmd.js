module.exports = function(){
  function _parse(str){
    var startPos = str.indexOf('<');
    if (startPos === -1) return false;
    var endPos = str.indexOf('>', startPos);

    var target = {
      target_id: str.substring(startPos+2,endPos),
      type: str.charAt(startPos+1),
      position: startPos
    }

    if(target.position === 0) {
      target.commands = str.split(' ');
    } else {
      return false;
    }

    return target;
  }

  function _recall(meta, message, msg, slack){
    var limit = meta.commands[2] || 2;
    var recall = msg.recall({channel:message.channel, limit: limit}, function(docs){


      slack.openDM(message.user, function(data){
        if(data.ok){
          var dmChannel = slack.getChannelGroupOrDMByID(data.channel.id);
          //dmChannel.send('Who, me? <@U026Q3F9P>');
          if(docs.length === 0) {
            dmChannel.send('I\'m afraid I can\'t do that. I have no history for that channel.');
          }
          var combinedMsg = '<#' + docs[0].channel + '>\'s last ' + docs.length + ' messages.\n\n';
          for(var i=0; i<docs.length; i++){

            var doc = docs[i];
            //combinedMsg += doc.ts + '<#' + doc.channel +'> <@' + doc.user + '>: '+ doc.text + '\n';
            combinedMsg += '<@' + doc.user + '>: '+ doc.text + '\n';
          }
          dmChannel.send(combinedMsg);
        }
      });
    }, function(err){
      console.log('err' + err);
    });
  }

  return {
    parse: _parse,
    recall: _recall
  }
}();
