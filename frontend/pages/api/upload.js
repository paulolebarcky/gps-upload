const multer = require('multer');
const { parseAndValidateCSV } = require('../../utils/csvParser');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    await runMiddleware(req, res, upload.single('csv'));
  } catch {
    return res.status(400).json({ error: 'Erro ao processar o arquivo enviado.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo CSV foi enviado.' });
  }

  try {
    const csvText = req.file.buffer.toString('utf8');
    const parsedData = parseAndValidateCSV(csvText);
    return res.status(200).json({ data: parsedData });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
