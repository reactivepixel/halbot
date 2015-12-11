//  Author:
//    Ben Forshey
// Updated by Chapman


module.exports = function() { // export the function as a module
  var cleverBot = require('cleverbot.io');
  if(!process.env.NODE_ENV && process.env.NODE_ENV != 'production') require('dotenv').load();

  persona = new cleverBot(process.env.CLEVERBOT_API_USER, process.env.CLEVERBOT_API_KEY);

  // give the session a name
  persona.setNick('WDD-Hubot');

  // create new instance
  persona.create(function(err, session) {
    // handle an error with session name info
    if (err) {
      console.error('Error in Session ' + session);
      throw err;
    }
  });

  function _cleverAdapter(channel,text) {
    persona.ask(text, function(err, response) {
      if (err) { // handle and error by throwing an exception
        throw err;
      }
      return channel.send(response); // send cleverbot's response
    });
  }

  return {
    ask: _cleverAdapter
  }
}();
