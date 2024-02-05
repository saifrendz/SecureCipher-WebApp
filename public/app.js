// public/app.js
/*----------------------
 Author : Saifur Rehman 
-----------------------*/

const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'encrypt') {
    document.getElementById('encryptionResult').innerText = `Encrypted Text: ${data.result}`;
  } else if (data.type === 'decrypt') {
    document.getElementById('decryptionResult').innerText = `Decrypted Text: ${data.result}`;
  }
};

async function encryptText() {
  const textToEncrypt = document.getElementById('textToEncrypt').value;
  const response = await fetch('/encrypt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `textToEncrypt=${textToEncrypt}`,
  });
  const data = await response.json();
  document.getElementById('encryptionResult').innerText = `Encrypted Text: ${data.encryptedText}`;
}

async function decryptText() {
  const textToDecrypt = document.getElementById('textToDecrypt').value;
  const response = await fetch('/decrypt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `textToDecrypt=${textToDecrypt}`,
  });
  const data = await response.json();
  document.getElementById('decryptionResult').innerText = `Decrypted Text: ${data.decryptedText}`;
}