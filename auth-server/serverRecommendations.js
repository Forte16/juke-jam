const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

// our localhost port
const port = 5555

const app = express()

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)


/*
  CODE FOR STORING RECOMMENDATIONS
*/

var myMap = new Map();






io.on('connection', socket => {
  console.log('New client connected')

  socket.on('newSong', (id, code) => {


    if (typeof myMap.get(code) === 'undefined') {
      // set the code to map to an array holding just the code
      myMap.set(code, [id]);
    } else {
      let array = myMap.get(code);
      if (!array.includes(id)) {
        array.push(id);
        myMap.set(code, array);
      }
    }

    console.log(myMap.get(code));


  })

  socket.on('addSong', (code) => {


    console.log("Yeeeerrrrrr", code);


  })

  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
