// const  io  = require("socket.io")
// const users=[];

const mongoose=require("mongoose");
const Document=require("./Document");
var options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  };

  mongoose.connect("mongodb://localhost/google_docs_clone",{
      useNewUrlParser:true

  });

  
const io=require("socket.io")(3001,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    },
})
console.log("holl");
const DefaultValue="";

io.on("connection",  socket=>{
    // users[socket.id];
    console.log("connect","hjkhj");
    socket.on("getdocument",async documentid=>{
        const document=await findorcreate(documentid);
        console.log(documentid);
        const data="";
        socket.join(documentid);
        socket.emit("load-document",document.data);
        socket.on("send-changes",delta=>{
            console.log("i am delta");
            socket.broadcast.to(documentid).emit("recieve-changes",delta);
        })

        socket.on("save-changes",async data=>{
          
           await Document.findByIdAndUpdate(documentid,{data});
        })

    })
    
})

async function findorcreate(id){
    if(id==null)return;
     
    const document=   await Document.findById(id);
    if(document==null)
    return await Document.create({_id:id,data:DefaultValue});
    else
    return document;

}