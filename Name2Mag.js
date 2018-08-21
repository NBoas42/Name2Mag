
/*
 * Created By Nathaniel Boas
 *
 * This app receives an actor's,director's, or series' name
 * and returns a list of the best magnet links to all movies associated
 * to the input received. The Program makes use of the themoviedb API to
 * get the list of known work of a given artist. With that list of works
 * the torrent indexer (torrent-search-api) will search each work in the list
 * and return the best magnet link for each work.
 * */


//Init main server modules
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const request = require('request');
const fs = require('fs');



//Init Torrent Search API
const TS_API = require('torrent-search-api');
const TS = new TS_API();
TS.enableProvider('ThePirateBay');


//Init tsv File reader to get IMD DATA BASE info for search
let movieDB = dbParer('cleanedIMDB_DB.txt');



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

    console.log("Connection Established!");


    //Search Handler
    socket.on('search', searchParam => {
        console.log(searchParam)

        //find the name of anyone
        for(let personData of movieDB)
        {
            console.log(personData[0] + " " + personData[1]);

            if(personData[0] + " " + personData[1] === searchParam)
            {

                console.log(personData[3]);
            }

        }

        /*
        //Torrent Search Handler
        TS.search(req , 'Video', '100').then( torrents => {
            socket.emit('results', torrents);
        });
        */



        //MagnetLink Parser

    });
});



function dbParer(file){
    try {

        let tsv = fs.readFileSync(file, 'utf8');

        let lines = tsv.split("\n");


        return lines;

    } catch(e) {
        console.log('Error:', e.stack);
    }
}



