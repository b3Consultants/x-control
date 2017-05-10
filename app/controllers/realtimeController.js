const request = require('request');
const useragent = require('express-useragent');
const ListenersInfo = require('../models/listenersInfo');
const Like = require('../models/like');

module.exports = function(app) {

  // Get RealTime information
  // TODO HACER UN ARCHIVO DE CONFIGURACION PARA RUTAS IP, SI TENEMOS QUE CAMBIAR LA RADIO ES MAS FACIL NIE
  app.get('/realtime/getRadioActualState', (req, res) => {
    request('http://52.67.181.102:8000/stats?sid=1&json=1', (error, response) => {
      if (error) {
        res.status(500).send(error);
      } else {
        const song = JSON.parse(response.body).songtitle;
        ListenersInfo.findOne({}, {}, { sort: { 'timestamp' : -1 } },
        (err,record) => {
          if(err){
            res.status(500).send(err);
          }else{
            const response_json = {"song": song,"mobile": record.mobile,"desktop": record.desktop,"listeners":record.listener,"others":record.other}
            res.status(200).json(response_json);
          }
        });
      }
    });
  });

  app.get('/realtime/getListenersInfo', (req,res) => {
    ListenersInfo.findOne({}, {}, { sort: { 'timestamp' : -1 } },
    (err,record) => {
      if(err){
        res.status(500).send(err);
      }else{
        res.status(200).send(record);
      }
    });
  });

  // Get Radio Info
  app.get('/realtime/getRadioInfo', (req, res) => {
    request('http://52.67.181.102:8000/stats?sid=1&json=1', function(error, response) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).json(response.body);
      }
    });
  });

}
