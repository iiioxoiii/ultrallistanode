const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const server = http.createServer((req, res) => {
  if (req.url === '/index.html' || req.url === '/') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error intern al servidor');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.url === '/index') {
    axios.get('https://raw.githubusercontent.com/iiioxoiii/ultrallista/master/db.json')
      .then(response => {
        const jsonData = response.data;

        const currentDate = new Date();
        jsonData.concerts = jsonData.concerts.filter(concert => new Date(concert.dateTime) >= currentDate);
        jsonData.concerts.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jsonData));
      })
      .catch(error => {
        console.error('Hi ha hagut un error en obtenir les dades:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error en obtenir les dades dels concerts');
      });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Pàgina no trobada');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor en línia a http://localhost:${port}`);
});
