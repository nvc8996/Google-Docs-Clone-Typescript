import { createServer } from "http";
import { connect } from "mongoose";
import { Server, Socket } from "socket.io";
import DocumentModel from "./Document";

const DefaultValue = { "ops" : [ { "insert" : "" } ] };

connect("mongodb://localhost:27017/Google-Docs-Clone")
    .then(() => {
        console.log('DB connected!');
    })
    .catch(() => {
        console.log('Error DB connecting!');
    });

async function findOrCreateDocument(id: string) {
    // if (id == null) return

    const document = await DocumentModel.findOne({id: id});
    if (document) return document;
    const newDocument = await DocumentModel.create({
        id: id,
        data: DefaultValue
    });

    return newDocument;
}

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket: Socket) => {
    console.log("connected!");

    socket.on('get-document', async documentId => {
        const document = findOrCreateDocument(documentId);
        socket.join(documentId);

        socket.emit('load-document', (await document).data);

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });

        socket.on('save-document', async data => {
            await DocumentModel.findOneAndUpdate(
                { id: documentId }, 
                {$set:{
                        data: data
                    }
                }
            )
        })
    })
    
})


httpServer.listen(3001);