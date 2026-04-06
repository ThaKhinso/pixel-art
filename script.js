let boardSizeSlider = document.getElementById("boardSize");
const boardContainer = document.getElementById("board-container");
var BOARD_SIZE = boardSizeSlider.value;
const colorPicker = document.getElementById("color-picker");
let currentColor = colorPicker.value;




colorPicker.addEventListener('change',(event)=>{
    console.log(event.target.value)
    currentColor = event.target.value;
    handleColorPickerChange(event.target.value);

})
function handleColorPickerChange(colorValue) {
    colorPicker.parentElement.style.backgroundColor = colorValue;
}

let draw = false;

window.addEventListener("mousedown",()=>{
    draw = true;
})
window.addEventListener("mouseup",()=>{
    draw = false;
})
function changeBackground(target,color=currentColor){
    target.style.backgroundColor = color;
}
createBoard(BOARD_SIZE)
boardSizeSlider.addEventListener("change",(event)=>{
    BOARD_SIZE = event.target.value;
    createBoard(BOARD_SIZE)
})
//I HAVE NO IDEA HOW THIS WORK
function rgbToHex(rgb) {
    if(!rgb) return "#ffffff";
    const ary = rgb.split(",");
    const r = Array.from(ary[0]).slice(4).join("");
    const g = ary[1];
    const b = Array.from(ary[2]).slice(0,-1).join("").trim()
    return "#" + (((1 << 24) + (Number(r) << 16) + (Number(g) << 8) + Number(b))).toString(16).slice(1);
  }
//How can i make so that the squares will adjust their size based on number. i want the grid to be fixed size
function createBoard(size){
    const x = Math.ceil(size ** 0.5)
    const grid = document.querySelector("#grid") || document.createElement("grid").setAttribute("id","grid");
    grid.innerHTML ="";
    //this is a bit weird.  setting widht and height of the element manually like this is not cool imo
    grid.className = `grid w-[600px] h-[600px]`;
    grid.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${x}, 1fr)`;

    for(let i=0;i<x*x;i++){
        const gridItem = document.createElement("div");
        gridItem.className = `border-1`
        gridItem.style.userSelect = "none"
        //events to handle the drawing
            //right click handling
        gridItem.addEventListener("contextmenu",(event)=>{
            event.preventDefault();
            const hexColor = rgbToHex(event.target.style.backgroundColor);
            colorPicker.setAttribute("value",hexColor)
            currentColor = hexColor;       
            handleColorPickerChange(hexColor)
        })
        gridItem.addEventListener("mouseover",(event)=>{
            if(!draw) return;
            changeBackground(event.target,currentColor)
        })
        gridItem.addEventListener("mousedown",(event)=>{
            if(event.buttons == 2) return;//no event for right click
            changeBackground(event.target,currentColor)
            // event.target.style.backgroundColor = getCurrentColor();
        })
        grid.appendChild(gridItem);
    } 
    boardContainer.appendChild(grid)
}

function clearBoard(){
    createBoard(BOARD_SIZE);
}

function exportImage() {
    const gridItems = document.querySelectorAll("#grid > div");
    const x = Math.sqrt(gridItems.length); // Get the number of pixels per side
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const exportSize = 512;
    const pixelSize = exportSize/x;

    canvas.width = exportSize;
    canvas.height = exportSize;

    gridItems.forEach((item, index) => {
        const row = Math.floor(index / x);
        const col = index % x;
        
        // Use the background color of the div, default to white if empty
        // ctx.fillStyle = item.style.backgroundColor || "#ffffff";
        
        // Draw the "pixel" on the canvas
        // ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);

        if (item.style.backgroundColor && item.style.backgroundColor !== "") {
            ctx.fillStyle = item.style.backgroundColor;
            ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
        }
    });

    const link = document.createElement("a");
    link.download = "my-pixel-art.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}