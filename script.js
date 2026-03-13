let selectedFont="'Great Vibes', cursive" let selectedFontSize=80

// ===== INIT ===== document.addEventListener("DOMContentLoaded",()=>{

const modelImageInput=document.getElementById("modelImage") const fontSelector=document.getElementById("fontSelector") const fontSizeSelector=document.getElementById("fontSizeSelector") const zipButton=document.getElementById("downloadAllPDFs") const form=document.getElementById("certificateForm")

modelImageInput.addEventListener("change",()=>displayImagePreview(modelImageInput)) fontSelector.addEventListener("change",changeFont) fontSizeSelector.addEventListener("change",changeFontSize) form.addEventListener("submit",submitGenerate) zipButton.addEventListener("click",downloadAllPDFs)

updateFontPreview()

})

// ===== IMAGE PREVIEW ===== function displayImagePreview(input){

const file=input.files[0] if(!file) return

const reader=new FileReader()

reader.onload=e=>{

const img=document.getElementById("imagePreview") img.src=e.target.result

}

reader.readAsDataURL(file)

}

// ===== FONT CONTROLS ===== function changeFont(e){

const value=e.target.value

if(value==="Great Vibes") selectedFont="'Great Vibes', cursive" if(value==="Parisienne") selectedFont="'Parisienne', cursive" if(value==="Sacramento") selectedFont="'Sacramento', cursive"

updateFontPreview()

}

function changeFontSize(e){

selectedFontSize=parseInt(e.target.value) updateFontPreview()

}

function updateFontPreview(){

const preview=document.getElementById("fontPreview")

preview.style.fontFamily=selectedFont preview.style.fontSize=selectedFontSize+"px"

}

// ===== AUTO FIT TEXT ===== function fitText(ctx,text,maxWidth,fontSize,font){

ctx.font=fontSize+"px "+font

while(ctx.measureText(text).width>maxWidth && fontSize>10){

fontSize-- ctx.font=fontSize+"px "+font

}

return fontSize

}

// ===== CREATE CERTIFICATE ===== async function createCertificateCanvas(modelImage,name){

const img=new Image() img.src=URL.createObjectURL(modelImage) await img.decode()

const canvas=document.createElement("canvas") canvas.width=img.width canvas.height=img.height

const ctx=canvas.getContext("2d")

ctx.drawImage(img,0,0)

const maxWidth=canvas.width*0.7

let fontSize=fitText( ctx, name, maxWidth, selectedFontSize, selectedFont )

ctx.font=fontSize+"px "+selectedFont ctx.fillStyle="black" ctx.textAlign="center"

ctx.fillText( name, canvas.width/2, canvas.height/2 )

return canvas

}

// ===== GENERATE PREVIEW ===== async function submitGenerate(e){

e.preventDefault()

const modelImage=document.getElementById("modelImage").files[0]

const namesList=document .getElementById("namesList") .value .split("\n") .map(n=>n.trim()) .filter(n=>n)

if(!modelImage||namesList.length===0){

alert("Selecione a imagem e insira os nomes.") return

}

const container=document.getElementById("certificatesContainer") container.innerHTML=""

for(const name of namesList){

const canvas=await createCertificateCanvas(modelImage,name)

const img=document.createElement("img") img.src=canvas.toDataURL("image/png") img.style.width="100%"

container.appendChild(img)

}

}

// ===== PDF GENERATION ===== async function generatePDF(name){

const modelImage=document.getElementById("modelImage").files[0]

const canvas=await createCertificateCanvas(modelImage,name)

const imgData=canvas.toDataURL("image/png")

const {jsPDF}=window.jspdf

const pdf=new jsPDF({ orientation:"landscape", unit:"px", format:[canvas.width,canvas.height] })

pdf.addImage( imgData, "PNG", 0, 0, canvas.width, canvas.height )

return pdf

}

// ===== ZIP DOWNLOAD ===== async function downloadAllPDFs(){

const modelImage=document.getElementById("modelImage").files[0]

const namesList=document .getElementById("namesList") .value .split("\n") .map(n=>n.trim()) .filter(n=>n)

if(!modelImage||namesList.length===0){

alert("Adicione nomes e imagem primeiro.") return

}

const zip=new JSZip()

for(const name of namesList){

const pdf=await generatePDF(name) const blob=pdf.output("blob")

zip.file(name+".pdf",blob)

}

const content=await zip.generateAsync({type:"blob"})

const link=document.createElement("a") link.href=URL.createObjectURL(content) link.download="certificados.zip"

link.click()

  }
