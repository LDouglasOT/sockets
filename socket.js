let users = [];

const addUser = (userId, socketId) => {
  if (!users.some(user => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter(user => user?.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find(user => user.userId === userId);
};
const socketConnections = (io)=>{
    io.on("connection", (socket) => {
        socket.on("addUser", (userId) => {
        try{
          addUser(userId, socket?.id);
          console.log("New user joined");
          console.log(users);
          io.emit("getUsers", users);
        }catch(err){
          console.log(err.message)
        }});
        socket.on("sendMessage",data=>{
        try{
          const user = getUser(data?.id)
          console.log(data.response[0])
          console.log(user)
          io.to(user?.socketId).emit("getMessage",data.response) 
        }catch(err){
        console.log(err)
        }
        })
        socket.on("smssent",()=>{
          console.log("recieved")
        })
        socket.on("typing",(data)=>{
        try{
          const user = getUser(data.reciever)
          // { id: 23, reciever: 22 }

          if(user){
            io.to(user?.socketId).emit("typingIndicator",{"from":data?.id})
          }
        }catch(err){
          console.log(err)
        }
        })
      
        socket.on("stoptyping",(data)=>{
        try{
          const user = getUser(data.reciever)
          if(user !== null){
            io.to(user?.socketId).emit("stoptypingIndicator",{"from":data.id})
          }
        }catch(err){
          
        }
        })
      
      
        socket.on('disconnect', () => {
        try{
          removeUser(socket.id);
          console.log("User disconnected");
          console.log(users);
          io.emit("getUsers", users);
        }catch(err){
          
        }
        });
      })

}


module.exports = {
    socketConnections
}