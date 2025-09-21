require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

const { sendInput, terminateProcess } = require('./exec/executeFile');
const userRoutes = require('./routes/userRoutes');
const problemsRoutes = require('./routes/problemsRoutes');
const compilerRoutes = require('./routes/compilerRoutes');

const allowedOrigin = process.env.ALLOWED_ORIGIN;

const io = socketIo(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
});

global.io = io;

const corsOptions = {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'username'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) =>{
    console.log(req.path, req.method)
    if (req.url === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('InfoBase0');
    }
    next();
})
app.use('/api/user', userRoutes);
app.use('/api/problems', problemsRoutes);
app.use('/api/compiler', compilerRoutes);

mongoose.connect(process.env.mongoDB)
.then(() => {
    console.log("MongoDB connected");
})
.catch((error) => {
    console.error("MongoDB connection failed:", error);
}); 

io.on('connection', (socket) => {
    console.log('Compiler connected:', socket.id);

    socket.on('send-input', (data) => {
        const {sessionId, input} = data;
        const succes = sendInput(sessionId, input);

        if(!succes){
            socket.emit('error', { error: 'No running process found for the given session ID.' });
        }
    })

    socket.on('terminate-process', (data) => {
        const {sessionId} = data;
        terminateProcess(sessionId);
    });

        socket.on('disconnect', () => {
        console.log('Compiler disconnected:', socket.id);
    });
});

server.listen(process.env.PORT || 4000, () => {
    console.log('Server listening on port', process.env.PORT || 4000);
});