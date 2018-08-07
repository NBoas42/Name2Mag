/*
* Created By Nathaniel Boas
*
* This app receives an actor's,director's, or series' name
* and returns a list of the best magnet links to all movies associated
* to the input received.
* */


//Init main server modules
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const request = require('request');



//Init Torrent Search API
const TS_API = require('torrent-search-api');
const TS = new TS_API();
TS.enableProvider('ThePirateBay');

//Init Person Filmography Search Api (Google Knowledge graph API)
let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
let api_key = 'AIzaSyB1UPIrA7mrbRuENcFeoZy0_-QtS4RgHgs';

let params = {
    'query': 'Taylor Swift',
    'limit': 50,
    'indent': true,
    'key' : api_key,
};




//set socket port to 3000
http.listen(3000,  () => {
    console.log('listening on *:3000');
});

//Handle HTML File request
app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html');
});


//Handle socket connection
io.on('connection',  (socket) => {


    //Search Handler
    socket.on('search', (req, res) => {


         //Input Entities Search Handler
         request.get(service_url, params, (err,resp,body) =>
         {
             console.log(err);
             console.log(body);
         });



        //Torrent Search Handler
         TS.search(req , 'Video', '100').then( torrents => {
         socket.emit('results', torrents);
         });



        //MagnetLink Parser

    });
});

