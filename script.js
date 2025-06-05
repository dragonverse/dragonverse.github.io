const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let coloring = "black";
let brushsize = 1;
let prevDotx = 0;
let prevDoty = 0;
let hasPrevDot = false;
let pickingColor = false;
let prevX = 0;
let prevY = 0;
let prevbrush = 0;

function drawRectangle2(x, y, width, height) {
    // Set the fill color
    ctx.fillStyle = "white";
      
    // Draw the rectangle
    ctx.fillRect(x, y, width, height);
}

drawRectangle2(0, 0, 1660, 800);

function drawOutline(x,y, size, color) {
    let pixelX = Math.floor(x / 10)*10;
    let pixelY = Math.floor(y / 10)*10;
    let brushpixel = 2 * size + -1;
    let shift = size * 10 - 10;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(pixelX-shift + 0.5, pixelY-shift + 0.5, brushpixel*10 - 1, brushpixel*10 - 1);
}

function drawPixel(x,y, size, color = "black") {
    let pixelX = Math.floor(x / 10)*10;
    let pixelY = Math.floor(y / 10)*10;
    let brushpixel = 2 * size + -1;
    let shift = size * 10 - 10;
    ctx.fillStyle = color; // Set fill color
    ctx.fillRect(pixelX-shift, pixelY-shift, brushpixel*10, brushpixel*10); // x, y, width, height
}

// Draw a circle
function drawCircle(x, y, radius = 8, color = "black") {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

// Convert mouse position to canvas coordinates
function getMousePos(theCanvas, evt) {
    const rect = theCanvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function drawLine(x1, y1, x2, y2, width, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.stroke();

}
// Start drawing
canvas.addEventListener("mousedown", (evt) => {
    if (pickingColor == false) {
        isDrawing = true;
        const { x, y } = getMousePos(canvas, evt);
        // drawCircle(x, y, brushsize, coloring);
        drawPixel(x, y, brushsize, coloring);
        console.log(coloring);
    }
});

// Draw while dragging
canvas.addEventListener("mousemove", (evt) => {
    if (isDrawing && !pickingColor) {
        const { x, y } = getMousePos(canvas, evt);
        drawPixel(x, y, brushsize, coloring)
        // drawCircle(x, y, brushsize, coloring);
        // if (hasPrevDot) {
        //     drawLine(prevDgetMousePosotx, prevDoty, x, y, brushsize*2, coloring);
        // }
        // prevDotx = x;
        // prevDoty = y;
        // hasPrevDot = true;
    }

    //////////////////
    let imageDataX = Math.floor(prevX / 10)*10 + 1;
    let imageDataY = Math.floor(prevY / 10)*10 + 1;
    const imageData = ctx.getImageData(imageDataX, imageDataY, 1, 1);
    const data = imageData.data;
    const red = data[0];
    const green = data[1];
    const blue = data[2];
    const alpha = data[3];
    console.log(`RGBA: ${red}, ${green}, ${blue}, ${alpha}`);
    const color = "rgba("+red.toString()+", "+green.toString()+", "+blue.toString() + ", "+(alpha/255).toString()+")";
    console.log(`${color}`);
    
    //   drawOutline(prevX, prevY, prevbrush, color); 
    //////////////////
    for (let x = prevX-(brushsize-1)*10; x <= prevX+(brushsize -1)*10; x+= 10){
        for (let y = prevY-(brushsize-1)*10; y <= prevY+(brushsize -1)*10; y+=10){
            imageDataX = Math.floor(x / 10)*10 + 1;
            imageDataY = Math.floor(y / 10)*10 + 1;
            const imageData = ctx.getImageData(imageDataX, imageDataY, 1, 1);
            const data = imageData.data;
            const red = data[0];
            const green = data[1];
            const blue = data[2];
            const alpha = data[3];
            const color = "rgba("+red.toString()+", "+green.toString()+", "+blue.toString() + ", "+(alpha/255).toString()+")";
            drawOutline(x, y, 1, color); 
        }
    }
    //////////////////


    const { x, y } = getMousePos(canvas, evt);
    drawOutline(x, y, brushsize, "black");
        prevbrush = brushsize;
    prevX = x;
    prevY = y;
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    hasPrevDot = false;
});

// Stop drawing if mouse leaves canvas
canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
});

document.addEventListener("keydown", (evt) => {
    console.log("setting color");
    console.log(evt);
    if (evt.key == 'ArrowUp') {
        brushsize = brushsize+1;
        evt.preventDefault();
        // drawBrush(350/2, 350/2, brushsize, coloring);
    }
    if (evt.key == 'ArrowDown') {
        brushsize = brushsize-1;
        evt.preventDefault();
        if (brushsize == 0) {
            brushsize = 1;
        }
    }

    //if (evt.key == 'c') {
        //console.log("colorwheel");
        //drawcolorwheel();
    //}            
        
        // drawBrush(350/2, 350/2, brushsize, coloring);
    

    if (evt.key == 'p') {
        applyPixelatedEffect(0.05);
    } 
});    


    // let pixelX = Math.floor(x / 10)*10;
    // let pixelY = Math.floor(y / 10)*10;
    // let brushpixel = 2 * brushsize + -1;
    // let shift = brushsize * 10 - 10;
    // ctx.fillStyle = color; // Set fill color
    // ctx.fillRect(pixelX-shift, pixelY-shift, brushpixel*10, brushpixel*10); // x, y, width, height  


function applyPixelatedEffect(scale = 0.05) {
    const width = canvas.width;
    const height = canvas.height;
  
    // Create an offscreen canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = width * scale;
    offscreen.height = height * scale;
    const offCtx = offscreen.getContext('2d');
  
    // Draw the image scaled down
    offCtx.drawImage(canvas, 0, 0, offscreen.width, offscreen.height);
  
    // Disable smoothing on the main canvas
    ctx.imageSmoothingEnabled = false;
  
    // Draw the small version back, scaled up
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(offscreen, 0, 0, offscreen.width, offscreen.height, 0, 0, width, height);
  }
  
  // Call this after your image is drawn on canvas
 // applyPixelatedEffect(0.05); // 0.05 = 5% resolution -> very pixelated

 function onSave() { 
    console.log('SAVE');
    canvas.toBlob((blob) => {
      const timestamp = Date.now().toString();
      const a = document.createElement('a');
      document.body.append(a);
      a.download = `export-${timestamp}.png`;
      a.href = URL.createObjectURL(blob);
      a.click();
      a.remove();
    });
  }
  
    document.querySelector('#save').addEventListener('click', onSave);

  const colorcanvas = document.getElementById("colorwheel");
  const colorctx = colorcanvas.getContext("2d");

  colorcanvas.addEventListener("mousedown", (evt) => {
    const { x, y } = getMousePos(colorcanvas, evt);
    coloring = "hsl(" + x.toString() + ", 100%" + "," + (y/2).toString() + "%"+")";
    drawRectangle(0, 0, 200, 200);
});

function drawcolorwheel() {
    for (let x = 0; x < 200; x++) {
       for (let y = 0; y < 200; y++) {
            //let distance = Math.sqrt((x-100)**2 + (y-100)**2)
            // if (distance > 100) {
                //continue;
            //}
            let color = "hsl(" + x.toString() + ", 100%" + "," + (y/2).toString() + "%"+")";
            colorctx.fillStyle = color; // Set fill color
            colorctx.fillRect(x, y, 1, 1); // x, y, width, height 
        }   
    }
}
drawcolorwheel();
    

const coloringcanvas = document.getElementById("color");
const coloringctx = coloringcanvas.getContext("2d");

function drawRectangle(x, y, width, height) {
    // Set the fill color
    coloringctx.fillStyle = coloring;
      
    // Draw the rectangle
    coloringctx.fillRect(x, y, width, height);
}
      
drawRectangle(0, 0, 200, 200);


const pickerbutton = document.getElementById("pickerbutton");
console.log(pickerbutton)

pickerbutton.addEventListener("mousedown", (evt) => {
    pickingColor = true;
});

canvas.addEventListener("mousedown", (evt) => {
    if (pickingColor == true) {
        const { x, y } = getMousePos(canvas, evt);
        const imageData = ctx.getImageData(x, y, 1, 1);
        const data = imageData.data;
        const red = data[0];
        const green = data[1];
        const blue = data[2];
        const alpha = data[3];
        console.log(`RGBA: ${red}, ${green}, ${blue}, ${alpha}`);
        coloring = "rgb("+red.toString()+", "+green.toString()+", "+blue.toString()+")";
        drawRectangle(0, 0, 200, 200);
        pickingColor = false;
    }
});





// const brushcanvas = document.getElementById("brushcanvas");
// const brushctx = brushcanvas.getContext("2d");

// function drawBrush(x, y, radius = 8, color = "black") {
//     ctx.clearRect(0, 0, 350, 350);
//     ctx.beginPath();
//     ctx.arc(x, y, radius, 0, Math.PI * 2);
//     ctx.fillStyle = color;
//     ctx.fill();
// }

// drawBrush(350/2, 350/2, brushsize, coloring);

// const colorcanvas = document.getElementById("colorcanvas");
// const colorctx = colorcanvas.getContext("2d");

//  function drawColor(color = "black") {
//      ctx.fillStyle = color; // Set fill color
//      ctx.fillRect(0, 0, 350, 350); // x, y, width, height
//  }
//  drawColor(coloring);
