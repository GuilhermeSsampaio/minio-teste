const express = require('express');
const multer = require('multer');
const Minio = require('minio');

const app = express();

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'Uwd9jXuCTY45KaZhJ9u6',
  secretKey: 'HkJ5Z8DntRExyNl9pfqIG17lg6gfNQYfZBrj0bp9',
});

// Configurar o middleware Multer para fazer upload de imagens
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/upload.html'); // Rendeiza o formulário de upload
});

// Rota para processar o upload da imagem
app.post('/upload', upload.single('image'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('Nenhuma imagem selecionada.');
  }

  const metaData = {
    'Content-Type': file.mimetype,
  };

  minioClient.putObject('images', file.originalname, file.buffer, metaData, (err, etag) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Erro ao fazer o upload da imagem.');
    }
    res.send('Imagem enviada com sucesso!');
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
