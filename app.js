//207.102.105.88:4141
// Import the Express module
var express = require('express');

// Create a new instance of Express
var app = express();

// Create a Node.js based http server on port 4141
var server = require('http').createServer(app).listen(process.env.PORT || 4141);

//Get html and css from public
app.use(express.static(__dirname + '/public'));

console.log("Server started.");
var numClients = {};


var io = require('socket.io')(server);
io.sockets.on('connection', function(socket){
    //On connection
    socket.playername ="";
    socket.gameid="";
    socket.playercolor=""; //Random color function below
    socket.emit('showtitle');
    console.log('New connection!');


    // Create room or join room 
    socket.on('hostCreateNewGame',function(data){
        console.log('hostCreateNewGame' + '\n  Playername ' + data.playerName + ' joined game: ' + data.gameID );
        
        // A reference to the player's Socket.IO socket object (set values playername and gameid)
        this.playername = data.playerName;
        this.gameid = data.gameID;
        this.playercolor = data.playerColor

        this.join(data.gameID);
        // console.log(socket.adapter.rooms) //list room .json data

        if (numClients[data.gameID] == undefined) {
            numClients[data.gameID] = 1;
        } else {
            numClients[data.gameID]++;
        }

        //Send a join room msg & update numClients
        io.to(data.gameID).emit('addToChat', "*** " + data.playerName + " has joined ***", this.playercolor);
        io.to(data.gameID).emit('updatechatinfo', numClients[data.gameID], data.gameID);
    });


    // Send message back to the game room 
    socket.on('sendMsgToServer',function(msg){
        console.log('Game id: ' + this.gameid + ' ' + this.playername + ": " + msg);
        io.to(this.gameid).emit('addToChat', this.playername + ": " + msg, this.playercolor);
    });


    // Send alert msg when player leaves the chat
    socket.on('disconnect',function(){         
        io.to(this.gameid).emit('addToChat', this.playername + " has left the chat", this.playercolor);
        numClients[this.gameid]--;
        //Update numClients
        io.to(this.gameid).emit('updatechatinfo', numClients[this.gameid], this.gameid);
    });
        
});

