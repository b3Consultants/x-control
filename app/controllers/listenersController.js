const request = require('request');
const useragent = require('express-useragent');

module.exports = function(app) {

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
        const radio_listeners_info = {
          'listeners': listeners.length,
          'mobile': mobile,
          'desktop': desktop,
          'others': others
        };
        res.status(200).json(radio_listeners_info);
      }
    });
  });
}
