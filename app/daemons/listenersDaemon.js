const request = require('request');
const useragent = require('express-useragent');
const ListenersInfo = require('../models/listenersInfo');


function listenersDaemon() {
  const request_options = {
    url: 'http://52.67.181.102:8000/admin.cgi?mode=viewjson&page=3&sid=1',
    auth: {
      user: 'admin',
      pass: 'd798fd798f'
    }
  };
  request.get(request_options, function(error, response) {
    if (error) {
      res.status(500).send(error);
    } else {
      var mobile = 0;
      var desktop = 0;
      var others = 0;
      const listeners = JSON.parse(response.body);
      for (var i = 0; i < listeners.length; i++) {
        ua = useragent.parse(listeners[i].useragent);
        if (ua.isMobile || ua.isTablet) {
          mobile++;
        } else if (ua.isDesktop) {
          desktop++;
        } else {
          others++;
        }
      }
      ListenersInfo.create({
        'timestamp': new Date(),
        'mobile': mobile,
        'desktop': desktop,
        'other': others,
        'listener': listeners.length
      }, (err, like) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Enhorabuena! La informacion de los usuarios ha sido registrada con exito!");
        }
      });
    }
  });
}

setInterval(function () {
  listenersDaemon();
}, 10000);
