document.addEventListener("DOMContentLoaded", () => {
    const modelImage = document.getElementById("modelImage");
    const fontSelector = document.getElementById("fontSelector");
    const fontSizeSelector = document.getElementById("fontSizeSelector");
    const imagePreviewCanvas = document.getElementById("imagePreviewCanvas");
    const ctx = imagePreviewCanvas.getContext("2d");

    let modelImageSrc = "";
    let selectedFont = fontSelector.value;
    let selectedFontSize = parseInt(fontSizeSelector.value, 10);

    // Atualizar a prévia da fonte no canvas
    function updateFontPreview() {
        if (!modelImageSrc) return; // Não redesenhar se não houver imagem
        const img = new Image();
        img.onload = () => {
            // Redimensiona o canvas
            imagePreviewCanvas.width = 800;
            imagePreviewCanvas.height = 600;

            // Desenha a imagem do certificado
            ctx.clearRect(0, 0, imagePreviewCanvas.width, imagePreviewCanvas.height);
            ctx.drawImage(img, 0, 0, imagePreviewCanvas.width, imagePreviewCanvas.height);

            // Adiciona a prévia do nome
            ctx.font = `${selectedFontSize}px ${selectedFont}`;
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("Exemplo do Nome", imagePreviewCanvas.width / 2, imagePreviewCanvas.height / 2);
        };
        img.src = modelImageSrc;
    }

    // Listener para mudança de fonte
    fontSelector.addEventListener("change", () => {
        selectedFont = fontSelector.value;
        updateFontPreview();
    });

    // Listener para mudança de tamanho
    fontSizeSelector.addEventListener("input", () => {
        selectedFontSize = parseInt(fontSizeSelector.value, 10);
        updateFontPreview();
    });

    // Prévia da imagem do certificado
    modelImage.addEventListener("change", () => {
        const file = modelImage.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                modelImageSrc = e.target.result;
              
                updateFontPreview();
            };
            reader.readAsDataURL(file);
        }
    });
    // Evitar recarregamento do formulário
    certificateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!modelImageSrc) {
            alert("Por favor, selecione uma imagem para o certificado.");
            return;
        }

        const names = namesList.value.trim().split("\n").filter((name) => name);
        if (names.length === 0) {
            alert("Por favor, insira pelo menos um nome.");
            return;
        }

        certificatesContainer.innerHTML = ""; // Limpar anteriores

        names.forEach((name) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();

            img.onload = () => {
                canvas.width = 800;
                canvas.height = 600;

                // Desenhar o modelo do certificado
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Adicionar o nome
                ctx.font = `${selectedFontSize}px ${selectedFont}`;
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.fillText(name, canvas.width / 2, canvas.height / 2);

                // Adicionar ao contêiner
                const certificateImg = document.createElement("img");
                certificateImg.src = canvas.toDataURL("image/png");
                certificateImg.alt = `Certificado - ${name}`;
                certificateImg.style.width = "100%";
                certificateImg.style.maxWidth = "800px";
                certificateImg.style.margin = "10px 0";

                certificatesContainer.appendChild(certificateImg);
            };

            img.src = modelImageSrc;
        });
    });

    // Baixar todos os certificados em ZIP
    downloadZip.addEventListener("click", () => {
        const images = Array.from(certificatesContainer.querySelectorAll("img"));
        if (images.length === 0) {
            alert("Nenhum certificado para baixar. Por favor, gere os certificados primeiro.");
            return;
        }

        const zip = new JSZip();

        images.forEach((img, index) => {
            const data = img.src.split(",")[1]; // Apenas a parte base64
            zip.file(`certificado_${index + 1}.png`, data, { base64: true });
        });

        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, "certificados.zip");
        });
    });

    // Inicializar prévia da fonte
    updateFontPreview();
});
