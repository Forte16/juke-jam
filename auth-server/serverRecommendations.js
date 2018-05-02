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

var recMap = new Map(); //key: codes; values: strings of song ids

var ipMap = new Map();//key: code + "?" + ip address; value: number of requests from that ip in that section

var limitMap = new Map();




io.on('connection', socket => {
  console.log('New client connected')

  socket.on('newSong', (id, code) => {

    let clientIp = socket.request.connection.remoteAddress;
    let ipMapKey = code + '?' + clientIp;

    if (typeof ipMap.get(ipMapKey) === 'undefined') {
      ipMap.set(ipMapKey, 1)
    } else {
      let n = ipMap.get(ipMapKey)+1;
      console.log(n)
      ipMap.set(ipMapKey, n);
    }

    let numOfReq = ipMap.get(ipMapKey);

    console.log("numOfReq = " + numOfReq);
    console.log("limitMap.get(code) = " + limitMap.get(code));


    if (numOfReq <= limitMap.get(code) || limitMap.get(code) === 0) {
      
      if (typeof recMap.get(code) === 'undefined') {
        // set the code to map to an array holding just the code
        recMap.set(code, [id]);
      } else {
        let array = recMap.get(code);
        if (!array.includes(id)) {
          array.push(id);
          recMap.set(code, array);
        }
      }

    }



  })

  socket.on('addSong', (code, limit) => {


    limitMap.set(code, limit)

    socket.emit('recommended', {list: recMap.get(code)});




  })

  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
