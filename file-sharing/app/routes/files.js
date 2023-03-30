const express = require('express');
const multer = require('multer');
const path = require('path');
let mongoose = require('mongoose');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
let fs = require('fs');

//Dateistruktur definiert (in String)
const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: String, 
});

const File = mongoose.model('File', fileSchema);

//Dateien werden hochgeladen
router.post('/uploadFile', upload.array('file', 5), async (req, res) => {
  try {
    const files = req.files;
    const fileIds = [];
    for (let i = 0; i < files.length; i++) {
      const { originalname, mimetype, path: filePath } = files[i];
      const filename = (originalname);
      const file = new File({
        filename,
        contentType: mimetype,
        data: filePath, 
      });
      await file.save();
      fileIds.push(file._id);
    }
    res.json({ fileIds });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//Dateien werden gesucht für den Download
router.get('/downloadFile/:fileId', async (req, res) => {
  const { fileId } = req.params;

  try {
    let files;
    if (fileId) {
      const file = await File.findById(fileId);
      if (!file) {
        return res.status(404).send('Datei wurde nicht gefunden');
      }
      files = [file];
    } else {
      files = await File.find();
    }
    if (files.length === 0) {
      return res.status(404).send('Datei wurde nicht gefunden');
    }
    if (files.length === 1) {
      const file = files[0];
      res.set('Content-Type', file.contentType);
      res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
      const fileStream = fs.createReadStream(file.data);
      fileStream.pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//Datei löschen anhand der FileId
router.delete('/deleteFile/:fileId', async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await File.findOne({ _id: fileId });
    if (!file) {
      return res.sendStatus(404);
    }
    // Datei löschen von der Datenbank
    await file.deleteOne();
    res.send({ message: 'Datei wurde gelöscht' });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//Dateien werden abgerufen für die Anzeige
router.get('/getfiles', async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
module.exports = router;
