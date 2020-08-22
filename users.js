const Users = []
const RoomId = {}

const userJoin = (id, name, room) => {

    const user = {id, name, room}

    if(!RoomId[room]){
        RoomId[room] = 1
        Users.push(user)
    }
    else if(RoomId[room] < 2){
        RoomId[room] += 1;
        Users.push(user);
    }
    else
        return null

    return user
}

const currentUser = (id) => {return Users.find(user => user.id === id)}

const totalConnectionsInRoom = (room) => {return RoomId[room]}

const usersInRoom = (room) => {
    let users = []
    Users.forEach(user => {
        if(user.room === room)
            users.push(user.name)
    })
    return users
}

const removeUser = (id) => {
    let ind = Users.findIndex(user => user.id === id)
    if(ind != -1){
        RoomId[Users[ind].room] -= 1
        return Users.splice(ind, 1)[0];
    }
}

module.exports = {userJoin, currentUser, totalConnectionsInRoom, usersInRoom, removeUser}