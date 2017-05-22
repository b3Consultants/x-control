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
        const avrgTime= JSON.parse(response.body).averagetime;
        const peaklisteners= JSON.parse(response.body).peaklisteners;

        ListenersInfo.findOne({}, {}, { sort: { 'timestamp' : -1 } },
        (err,record) => {
          if(err){
            res.status(500).send(err);
          }else{
            const response_json = {"song": song,"mobile": record.mobile,"desktop": record.desktop,"listeners":record.listener,"others":record.other,"averageTime": avrgTime,"peak":peaklisteners}
            res.status(200).json(response_json);
          }
        });
      }
    });
  });
  app.get('/likes', (req, res) => {
    request('http://ec2-52-90-229-1.compute-1.amazonaws.com:8080/api/likes/', function(error,response){
      if (error){
        res.status(500).send(error);
      } else {
        res.status(200).json(JSON.parse(response.body));
      }
    });
  });

  app.get('/likes/:song', (req, res)=> {
    const song = req.params.song;
    request('http://ec2-52-90-229-1.compute-1.amazonaws.com:8080/api/likes/' + song, function(error, response){
      if (error){
        res.status(500).send(error);
      } else {
        res.status(200).json(JSON.parse(response.body));
      }
    });
  });
  app.get('/realtime/ListenersHistory', (req,res) => {
    ListenersInfo.find({},{},  {sort:{
        timestamp: 1 //Sort by Date Added DESC
    }},(err,info)=> {
      if(err){
        res.status(500).send(err);
      }else{
        let dates=[];
        let mobile=[];
        let desktop=[];
        let others=[];

        for (var i = 0; i < info.length; i++) {
          dates.push( new Date(info[i].timestamp));
          mobile.push(info[i].mobile);
          desktop.push(info[i].desktop);
          others.push(info[i].other);
        }

        const response = {
          dates: dates,
          mobile: mobile,
          desktop: desktop,
          others: others
        }
        res.status(200).send(response);

      }

    })



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
