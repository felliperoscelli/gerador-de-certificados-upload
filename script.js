let selectedFont = "Times New Roman"
let selectedFontSize = 80

// preview da imagem
function displayImagePreview(input){

const file = input.files[0]

if(file){

const reader = new FileReader()

reader.onload = function(event){

document.getElementById("imagePreview").src = event.target.result

}

reader.readAsDataURL(file)

}

}

document.getElementById("modelImage")
.addEventListener("change",function(){

displayImagePreview(this)

})

// ajuste automático da fonte
function fitText(ctx,text,maxWidth,fontSize,font){

ctx.font = fontSize+"px "+font

while(ctx.measureText(text).width > maxWidth){

fontSize--

ctx.font = fontSize+"px "+font

}

return fontSize

}

// cria canvas
async function createCertificateCanvas(modelImage,name){

const img = new Image()

img.src = URL.createObjectURL(modelImage)

await img.decode()

const canvas = document.createElement("canvas")

canvas.width = img.width
canvas.height = img.height

const ctx = canvas.getContext("2d")

ctx.drawImage(img,0,0)

const maxWidth = canvas.width * 0.70

let fontSize = fitText(
ctx,
name,
maxWidth,
selectedFontSize,
selectedFont
)

ctx.font = fontSize+"px "+selectedFont
ctx.fillStyle = "black"
ctx.textAlign = "center"

ctx.fillText(
name,
canvas.width/2,
canvas.height/2
)

return canvas

}

// gerar certificados na tela
async function generateCertificates(){

const modelImage = document.getElementById("modelImage").files[0]

const namesList =
document.getElementById("namesList")
.value
.split("\n")
.map(n=>n.trim())
.filter(n=>n)

if(!modelImage || namesList.length===0){

alert("Selecione imagem e nomes")

return

}

const container =
document.getElementById("certificatesContainer")

container.innerHTML=""

for(const name of namesList){

const canvas =
await createCertificateCanvas(
modelImage,
name
)

const img =
document.createElement("img")

img.src =
canvas.toDataURL("image/png")

img.style.width="100%"

img.dataset.name=name

container.appendChild(img)

}

}

document
.getElementById("certificateForm")
.addEventListener("submit",function(e){

e.preventDefault()

generateCertificates()

})

// gerar PDF
async function generatePDF(name){

const modelImage =
document.getElementById("modelImage").files[0]

const canvas =
await createCertificateCanvas(
modelImage,
name
)

const imgData =
canvas.toDataURL("image/png")

const {jsPDF} = window.jspdf

const pdf =
new jsPDF({

orientation:"landscape",
unit:"px",
format:[canvas.width,canvas.height]

})

pdf.addImage(
imgData,
"PNG",
0,
0,
canvas.width,
canvas.height
)

return pdf

}

// baixar PDF individual
document
.getElementById("downloadSinglePDF")
.addEventListener("click",async()=>{

const name = prompt(
"Digite o nome exato do participante:"
)

if(!name) return

const pdf = await generatePDF(name)

pdf.save(name+".pdf")

})

// baixar todos em zip
document
.getElementById("downloadAllPDFs")
.addEventListener("click",async()=>{

const modelImage =
document.getElementById("modelImage").files[0]

const namesList =
document.getElementById("namesList")
.value
.split("\n")
.map(n=>n.trim())
.filter(n=>n)

if(!modelImage || namesList.length===0){

alert("Adicione nomes primeiro")

return

}

const zip = new JSZip()

for(const name of namesList){

const pdf = await generatePDF(name)

const blob = pdf.output("blob")

zip.file(name+".pdf",blob)

}

const content =
await zip.generateAsync({type:"blob"})

const link =
document.createElement("a")

link.href =
URL.createObjectURL(content)

link.download =
"certificados.zip"

link.click()

})

// controles de fonte
function updateFontPreview(){

const preview =
document.getElementById("fontPreview")

preview.style.fontFamily =
selectedFont

preview.style.fontSize =
selectedFontSize+"px"

}

document
.getElementById("fontSelector")
.addEventListener("change",function(){

selectedFont=this.value

updateFontPreview()

})

document
.getElementById("fontSizeSelector")
.addEventListener("change",function(){

selectedFontSize=
parseInt(this.value)

updateFontPreview()

})

document
.addEventListener("DOMContentLoaded",updateFontPreview)
