const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socketio = require('socket.io');
const io = socketio(server)
const {userJoin, usersInRoom, removeUser} = require('./users')

const PORT = process.env.PORT || 3000;

app.use(express.static('public'))

io.on('connection', socket => {

    socket.on('userConnection', ({username, gameid}) => {

        const user = userJoin(socket.id, username, gameid)

        if(user){
            socket.join(user.room)
            io.to(user.room).emit('conn', usersInRoom(user.room))
            io.to(user.room).emit('message', {name: user.name, connection: true})

            socket.on('turn', player => {
                io.to(user.room).emit('turn', player)
            })

            socket.on('start', name => {
                io.to(user.room).emit('start', name)
            })

            socket.on('replay', anotherGame => {
                socket.broadcast.to(user.room).emit('replay', anotherGame)
            })

            socket.on('response', () => {
                io.to(user.room).emit('response')
            })
        } else {
            socket.emit('err', `GameId ${gameid} is currently Busy, try with Another GameId`)
        }
    })

    


    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('conn', usersInRoom(user.room))
            socket.broadcast.to(user.room).emit('message', {name: user.name, connection: false})
        }
    })
})





server.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))