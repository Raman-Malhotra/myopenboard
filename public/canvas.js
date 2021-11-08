

let canvas=document.querySelector("canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let pencilColor=document.querySelectorAll(".pencil-color");
let pencilWidthElem=document.querySelector(".pencil-width");
let eraserWidthElem=document.querySelector(".eraser-width");
let download=document.querySelector(".download");
let penColor="red";
let eraserColor="white";
let penWidth=pencilWidthElem.value;
let eraserWidth=eraserWidthElem.value;
let undoRedoTracker=[];
let track=0;
let undo=document.querySelector(".undo");
let redo=document.querySelector(".redo");


let mouseDown=false;

let tool=canvas.getContext("2d");


tool.strokeStyle=penColor;
tool.lineWidth=penWidth;



canvas.addEventListener("mousedown",(e)=>{
   
    let data={
        x:e.clientX,
        y: e.clientY
    }
    socket.emit("beginPath",data);
    
})
canvas.addEventListener("mousemove",(e)=>{
    if(mouseDown){
        let data={
            x:e.clientX,
            y:e.clientY,
            color:eraserFlag?"white": penColor,
            width:eraserFlag?eraserWidth: penWidth
        }
        socket.emit("drawStroke",data);
   }
})
canvas.addEventListener("mouseup",(e)=>{
    mouseDown=false;
    let url=canvas.toDataURL();
    undoRedoTracker.push(url);
    track=undoRedoTracker.length-1;
})


undo.addEventListener("click",(e)=>{
    if(track>0)
    {
        track--;
    }
    let trackObj={
        trackValue:track,
        undoRedoTracker
    }
    socket.emit("undoredoStroke",trackObj);


})
redo.addEventListener("click",(e)=>{
    if(track<undoRedoTracker.length-1)
    {
        track++;
    }
    let trackObj={
        trackValue:track,
        undoRedoTracker
    }
    socket.emit("undoredoStroke",trackObj);
    
})

function undoRedoCanvas(trackObj)
{
    track=trackObj.trackValue;
    undoRedoTracker=trackObj.undoRedoTracker;

    let url=undoRedoTracker[track];
    let img=new Image();
    img.src=url;
    img.onload=(e)=>{
        tool.drawImage(img,0,0,canvas.width,canvas.height)
    }
}
pencilColor.forEach(element => {
    element.addEventListener("click",()=>{
        let color=element.classList[0];
        penColor=color;
        tool.strokeStyle=penColor
    })
});


pencilWidthElem.addEventListener("change",(e)=>{
    penWidth=pencilWidthElem.value;
    tool.lineWidth=penWidth
})
eraserWidthElem.addEventListener("change",(e)=>{
    eraserWidth=eraserWidthElem.value;
    tool.lineWidth=eraserWidth;
})
eraser.addEventListener("click",(e)=>{
    if(eraserFlag)
    {
        tool.strokeStyle="white";
        tool.lineWidth=eraserWidth;
    }
    else{
        tool.strokeStyle=penColor;
        tool.lineWidth=penWidth;
    }
})
download.addEventListener("click",(e)=>{
    let url=canvas.toDataURL();
    let a=document.createElement("a");
    a.href=url;
    a.download="board.jpg";
    a.click();
})
socket.on("beginPath",(data)=>{
    mouseDown=true;
    tool.beginPath();
    tool.moveTo(data.x,data.y);

})
socket.on("drawStroke",(data)=>{
  tool.strokeStyle=data.color;
  tool.lineWidth=data.width;
    tool.lineTo(data.x,data.y);
    tool.stroke();
})
socket.on("undoredoStroke",(data)=>{
   undoRedoCanvas(data)
 })