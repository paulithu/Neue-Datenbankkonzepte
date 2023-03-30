const filesRouter = require('./app/routes/files');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
let config = require('config');
let fs = require('fs');
var morgan = require('morgan');
const apisMiddleware = require('./app/middlewares/apisMiddleware'); // Middleware wird hier importiert
var apisContent = fs.readFileSync(config.apisFileName); // APIs in der /config/settings/allApis.json definiert
var jsonApis = JSON.parse(apisContent);

const app = express();

// Verbindung zur Datenbank
let options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.set('strictQuery', false);
mongoose
  .connect('mongodb://mongo:27017/fileUpload', options)
  .then(() => {
    console.log('Verbindung zur MongoDB wurde hergestellt');
  })
  .catch((err) => {
    console.log(` Es wurde keine Datenbankverbindung hergestellt ${err}`);
  });

// Verwendung der Imports
app.use(express.json());
app.use(morgan('combined'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json({ strict: false }));

//Anzeige für die index.html
app.get('/', (req, res) => {
  res.send('index.html');
});

//Middleware wird aufgerufen
app.use(function (req, res, next) {
  apisMiddleware(req, res, next, jsonApis);
});

//Alle Routen mit /api wird an "filesRouter" weitergeleitet
app.use('/api', filesRouter);

//Server läuft auf PORT
app.listen(config.PORT, () =>
  console.log(`Der Server startet auf : ${config.PORT}`)
);
