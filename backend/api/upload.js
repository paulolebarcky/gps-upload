// backend/api/upload.js
const express = require('express');
const multer = require('multer');
const chardet = require('chardet');
const iconv = require('iconv-lite');
const csvParser = require('../utils/csvParser');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('csv'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo CSV foi enviado.' });
  }

  try {
    const csvText = req.file.buffer.toString('utf8');
    const parsedData = csvParser.parseAndValidateCSV(csvText);
    return res.status(200).json({ data: parsedData });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
