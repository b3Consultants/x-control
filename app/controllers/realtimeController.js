const request = require('request');
const useragent = require('express-useragent');
const ListenersInfo = require('../models/listenersInfo');
const Like = require('../models/like');

module.exports = function(app) {

  // Get RealTime information
  app.get('/realtime/radioInfo', (req, res) => {
    request('http://52.67.181.102:8000/stats?sid=1&json=1', function(error, response) {
      if (error) {
        res.status(500).send(error);
      } else {
        const song = response.body.songtitle;
        
      }
    });
  });


  // Get Radio Info
  app.get('/listeners/getRadioInfo', (req, res) => {
    request('http://52.67.181.102:8000/stats?sid=1&json=1', function(error, response) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).json(response.body);
      }
    });
  });

  app.get('/listeners/getListenersInfo2', (req, res) => {
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
            res.status(500).send(err);
          } else {
            res.status(200).send("Enhorabuena!");
          }
        });
      }
    });
  });
}
