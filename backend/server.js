const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./api/upload');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/upload', uploadRoutes);

const port = 3090;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});