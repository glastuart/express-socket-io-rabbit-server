// TODO: move these to seperate files once working
// setup express
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello Socket Server!');
});

// app.listen(port, () => {
//     console.log(`ExpressJS listening on: http://localhost:${port}`);
// });

// setup http server
const server = require('http').createServer(app);

// setup socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('a user connected!');
});

// start the http express server
server.listen(port, () => {
    console.log(`Express is running on port ${port} at: http://localhost:${port}`);
});

// setup rabbitmq consumer
var amqp = require('amqplib/callback_api');
amqp.connect('amqp://192.168.0.102', (error0, connection) => {
    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        var exchange = 'wp3-project-template';
        
        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, (error2, q) => {
            if (error2) {
                throw error2;
            }

            console.log(' [*] Waiting for Weather Data...');

            // NOTE: you can pass in multiple queue binds
            channel.bindQueue(q.queue, exchange, '*.weathers');
            channel.consume(q.queue, (message) => {
                console.log(` [*] Recieved: ${message.content.toString()}`);
                io.emit('weather', JSON.parse(message.content.toString()));
            }, {
                noAck: true
            });
        });
    });
});