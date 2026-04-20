import multer from 'multer';
import Papa from 'papaparse';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('csv')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao fazer upload do arquivo.' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo CSV foi enviado.' });
      }

      const csvFile = req.file.buffer.toString('utf8');

      Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const data = results.data;

          if (data.length === 0) {
            return res.status(400).json({ error: 'O arquivo CSV está vazio.' });
          }

          const hasLatitudeLongitude = data.every(item => {
            return typeof item.latitude === 'number' && typeof item.longitude === 'number';
          });

          if (!hasLatitudeLongitude) {
            return res.status(400).json({ error: 'O arquivo CSV deve conter colunas \'latitude\' e \'longitude\' com valores numéricos válidos.' });
          }

          res.status(200).json({ data: data });
        },
        error: (error) => {
          console.error('Erro ao fazer o parsing do CSV:', error);
          return res.status(500).json({ error: 'Erro interno do servidor ao processar o arquivo CSV.' });
        }
      });
    });
  } else {
    res.status(405).json({ error: 'Método não permitido.' });
  }
}
