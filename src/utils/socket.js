const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: [
                "https://devsphere-ui.onrender.com",
                "http://localhost:5173"
            ],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {

    })
}
module.exports = initializeSocket;