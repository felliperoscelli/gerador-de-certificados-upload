const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const JSZip = require("jszip");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração para servir arquivos estáticos
app.use(express.static("public"));
app.use(bodyParser.json({ limit: "10mb" }));

// Rota para gerar o ZIP
app.post("/generate-zip", async (req, res) => {
  const { certificates } = req.body;
  const zip = new JSZip();

  certificates.forEach((cert, index) => {
    zip.file(`certificate_${index + 1}.svg`, cert);
  });

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  const zipPath = path.join(__dirname, "certificates", "certificates.zip");

  fs.writeFileSync(zipPath, zipBuffer);

  res.download(zipPath, "certificates.zip", (err) => {
    if (err) {
      console.error("Erro ao enviar o ZIP:", err);
    }
    fs.unlinkSync(zipPath); // Remove o arquivo após download
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
