// app.js
/*----------------------
 Author : Saifur Rehman 
-----------------------*/

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');


const { encrypt, decrypt } = require('./encryption');

// Load environment variables
//require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handle favicon.ico request
app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Check and set ENCRYPTION_KEY
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'abcdefghijabcdefghijabcdefghijab';

app.post('/encrypt', (req, res) => {
    try {
        const textToEncrypt = req.body.textToEncrypt;
        if(!textToEncrypt){
            throw new ('Missing textToEncrypt in the request body');
        }
        const encryptedText = encrypt(textToEncrypt);
        res.send({ encryptedText });
        
        // Broadcast encrypted result to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'encrypt', result: encryptedText }));
            }
        });
    }
    catch(error){
        console.error('Error in  /encrypt route:', error)
        res.status(500).send({ error: 'Internal Server Error' });
    } 
});

app.post('/decrypt', (req, res) => {
  const textToDecrypt = req.body.textToDecrypt;
  const decryptedText = decrypt(textToDecrypt);
  res.send({ decryptedText });

  // Broadcast decrypted result to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'decrypt', result: decryptedText }));
    }
  });
});

// WebSocket handling
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});