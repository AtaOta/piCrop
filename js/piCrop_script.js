const CropWarp = document.querySelector(".Cropper_Wrapper")
const el = document.querySelector('.item');
const InpImg = document.getElementsByClassName('inputImg')[0]
const resizers = document.querySelectorAll(".resizer");
const naW = InpImg.naturalWidth;
const naH = InpImg.naturalHeight;

let ICo = document.querySelector('.Cropping_IMG');
let GetCanvas = document.getElementById('canvas');
let resizer = document.querySelector('.resizer');

let  bounds, rect ,leImg ,crX1 , crY1, curRes, resW, canvasWide, cansvasHigh;
let isResizing = false, initialSize = 150, scale, pointX = 0, pointY = 0, start = {x: 0, y:0};

const piCrop = () =>{
    bounds = CropWarp.getBoundingClientRect();
    rect = el.getBoundingClientRect();
    leImg = InpImg.getBoundingClientRect();
    resW = resizer.getBoundingClientRect().width;

    crX1 = bounds.left;
    crY1 = bounds.top;

    el.style.left = `${((CropWarp.clientWidth - el.clientWidth) /2) + crX1}px`;
    el.style.top = `${((CropWarp.clientHeight - el.clientHeight) /2) + crY1}px`;
    el.style.width = `${initialSize}px`;
    el.style.height = `${initialSize}px`;
    
    ICo.style.width = `${CropWarp.clientWidth}px`;
    ICo.style.top = `${(CropWarp.clientHeight - ICo.clientHeight)/2}px`;
    scale = 1
}
piCrop();

const CanVasDimension = () => {
    canvasWide = rect.width //* (naW/leImg.width)
    cansvasHigh = rect.height //* (naH/leImg.height)
    GetCanvas.width = `${canvasWide}`;
    GetCanvas.height = `${cansvasHigh}`;
}
CanVasDimension();

/* ___________________________________[ DRAW IMAGE INSIDE CANVAS ]___________________________________ */
const DrawingImage = () =>{
    leImg = InpImg.getBoundingClientRect();
    rect = el.getBoundingClientRect();

    let DrawFormLeft = (rect.left - leImg.left)
    let DrawFormTop = (rect.top - leImg.top)
    
    let formLeft = DrawFormLeft*(naW/leImg.width);
    let fromTop = DrawFormTop*(naH/leImg.height);

    let imagePreDrawWidth = (rect.width)*(naW/leImg.width);
    let imagePreDrawHeight = (rect.height)*(naW/leImg.width);

    // DRAWING AN IMAGE INSIDE THE CANVAS
    const image = new Image(),
    canvas = GetCanvas,
    ctx = canvas.getContext('2d');
    image.src = InpImg.src
    
    image.addEventListener('load', () => {
        ctx.drawImage(image,
            formLeft, fromTop,   // Start at 70/20 pixels from the left and the top of the image (crop),
            imagePreDrawWidth, imagePreDrawHeight,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
            0, 0,   // Place the result at 0, 0 in the canvas,
            canvasWide, cansvasHigh // With as width / height: 100 * 100 (scale)
        );
    });
}
DrawingImage();
/* ____________________________________________[ ### ]____________________________________________ */


/* ___________________________________[ WINDOW SIZE DETECTION ]___________________________________ */
window.addEventListener('resize', ()=>{
    piCrop();
    CanVasDimension();
    DrawingImage();
})
/* ____________________________________________[ ### ]____________________________________________ */


/* ___________________________[ CROPPER CONTAINER MOVEMENT CONTROLLER ]___________________________ */
const ccmf = (newX, newY) =>{
    /* BOUNDING CROPPEER RECTENGLE POSITION */
    let x = Math.min(
        Math.max(bounds.left, (rect.left - newX)), bounds.right - rect.width
      );   
    let y = Math.min(
        Math.max(bounds.top, (rect.top - newY)), bounds.bottom - rect.height
      );
    if (rect.left <= leImg.left){
        x = Math.min(
            Math.max(leImg.left, (leImg.left - newX)), bounds.right - rect.width
          );
    }
    else if (rect.right >= (leImg.left + leImg.width)){
        x = Math.min(
            Math.max(bounds.left, (rect.left - newX)), ((leImg.left + leImg.width) - rect.width)
          );
    }
    if (rect.top <= leImg.top){
        y = Math.min(
            Math.max(leImg.top, (leImg.top - newY)), bounds.bottom - rect.height
          );
    }
    else if (rect.bottom >= (leImg.top + leImg.height)){
        y = Math.min(
            Math.max(bounds.top, (rect.top - newY)), ((leImg.top + leImg.height) - rect.height)
          );
    }
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    // CALL FUNCTION FOR DRAWING IMAGE
    DrawingImage()
}

// TOUCH EVENT FOR CROPPER CONTAINER
el.addEventListener('touchstart', touchstart);
function touchstart(e){
    e.preventDefault();
    let touch = e.touches[0];

    window.addEventListener('touchmove', touchmove);
    window.addEventListener('touchend', touchend)

    let prevX = touch.clientX;
    let prevY = touch.clientY;

    function touchmove(e){
        let touch = e.touches[0];
        if (!isResizing){
            let newX = prevX - touch.clientX;
            let newY = prevY - touch.clientY;

            ccmf(newX, newY);
            
            prevX = touch.clientX;
            prevY = touch.clientY;
        }
    }
    function touchend(){
        window.removeEventListener("touchmove", touchmove);
        window.removeEventListener("touchend", touchend);
        window.removeEventListener("touchstart", touchstart);
    }
}

// MOUSE EVENT FOR CROPPER CONTAINER
el.addEventListener('mousedown', mousedown);
function mousedown(e){
    e.preventDefault();
    el.style.transition = `none`;
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    let prevX = e.clientX;
    let prevY = e.clientY;

    function mousemove(e){
        e.preventDefault();
        let touch = e
        if (!isResizing){
            let newX = prevX - touch.clientX;
            let newY = prevY - touch.clientY;

            ccmf(newX, newY);
            
            prevX = touch.clientX;
            prevY = touch.clientY;
        }
    }
    function mouseup(){
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
    }
}
/* ____________________________________________[ ### ]____________________________________________ */


/* _________________________________[ RESIZER CROPPER CONTAINER ]_________________________________  */
const CropperResizer = (currentResizer, touch, newX, newY)=>{

    let elWidth = rect.width, elHeight = rect.height;
    let clientEXO = Math.ceil(touch.clientX), clientYOO = Math.ceil(touch.clientY);
    let rectMaxRight = Math.ceil(bounds.right);
    let rectMinLeft = Math.ceil(bounds.left);
    let rectMinTop = Math.ceil(bounds.top);
    let rectMaxBottom = Math.ceil(bounds.bottom);

    if(isResizing == false){
        return;
    }

    if(rectMaxRight >= leImg.right){
        rectMaxRight = Math.ceil(leImg.right);
    }
    if(rectMinLeft <= leImg.left){
        rectMinLeft = Math.ceil(leImg.left);
    }
    if(rectMinTop <= leImg.top){
        rectMinTop = Math.ceil(leImg.top);
    }
    if(rectMaxBottom >= leImg.bottom){
        rectMaxBottom = Math.ceil(leImg.bottom);
    }

    let cR = rectMaxRight-rect.left, cRmx = Math.max(resW, cR), cRmn = Math.min(resW, cR);
    let cB = rectMaxBottom-rect.top, cBmx = Math.max(resW, cB), cBmn = Math.min(resW, cB);
    let cL = rect.right-rectMinLeft, cLmx = Math.max(resW, cL), cLmn = Math.min(resW, cL);
    let cT = rect.bottom-rectMinTop, cTmx = Math.max(resW, cT), cTmn = Math.min(resW, cT);

    if(currentResizer.classList.contains("e")){
        elWidth = rect.width - newX;
        if (clientEXO >= rectMaxRight){
            elWidth = cRmx;
        }
        else if(clientEXO <= (rect.left+resW)){
            elWidth = cRmn;
        }
    }
    else if (currentResizer.classList.contains("se")){
        elWidth = rect.width - newX;
        elHeight = rect.height - newY;
        if (clientEXO >= rectMaxRight){
            elWidth = cRmx;
        }
        else if(clientEXO <= (rect.left+resW)){
            elWidth = cRmn;
        }
        if (clientYOO >= rectMaxBottom){
            elHeight = cBmx;
        }
        else if(clientYOO <= (rect.top+resW)){
            elHeight = cBmn;
        }
    }
    else if (currentResizer.classList.contains("s")){
        elHeight = rect.height - newY;
        if (clientYOO >= rectMaxBottom){
            elHeight = cBmx;
        }
        else if(clientYOO <= (rect.top+resW)){
            elHeight = cBmn;
        }
    }
    else if (currentResizer.classList.contains("sw")){
        elWidth = rect.width + newX;
        elHeight = rect.height - newY;
        if (clientEXO <= rectMinLeft){
            elWidth = cLmx;
        }
        else if(clientEXO >= (rect.right-resW)){
            elWidth = cLmn;
        }
        if (clientYOO >= rectMaxBottom){
            elHeight = cBmx;
        }
        else if(clientYOO <= (rect.top+resW)){
            elHeight = cBmn;
        }
        el.style.left = `${rect.right - elWidth}px`;
    }
    else if (currentResizer.classList.contains("w")){
        elWidth = rect.width + newX;
        if (clientEXO <= rectMinLeft){
            elWidth = cLmx;
        }
        else if(clientEXO >= (rect.right-resW)){
            elWidth = cLmn;
        }
        el.style.left = `${rect.right - elWidth}px`;
    }
    else if (currentResizer.classList.contains("ne")){
        elWidth = rect.width - newX;
        elHeight = rect.height + newY;
        if (clientEXO >= rectMaxRight){
            elWidth = cRmx;
        }
        else if(clientEXO <= (rect.left+resW)){
            elWidth = cRmn;
        }
        if (clientYOO <= rectMinTop){
            elHeight = cTmx;
        }
        else if(clientYOO >= (rect.bottom - resW)){
            elHeight = cTmn;
        }
        el.style.top = `${rect.bottom - elHeight}px`;
    }
    else if (currentResizer.classList.contains("n")){
        elHeight = rect.height + newY;
        if (clientYOO <= rectMinTop){
            elHeight = cTmx;
        }
        else if(clientYOO >= (rect.bottom - resW)){
            elHeight = cTmn;
        }
        el.style.top = `${rect.bottom - elHeight}px`;
    }
    else if (currentResizer.classList.contains("nw")){
        elWidth = rect.width + newX;
        elHeight = rect.height + newY;
        if (clientEXO <= rectMinLeft){
            elWidth = cLmx;
        }
        else if(clientEXO >= (rect.right-resW)){
            elWidth = cLmn;
        }
        if (clientYOO <= rectMinTop){
            elHeight = cTmx;
        }
        else if(clientYOO >= (rect.bottom - resW)){
            elHeight = cTmn;
        }
        el.style.top = `${rect.bottom - elHeight}px`;
        el.style.left = `${rect.right - elWidth}px`;
    }
    
    el.style.width = `${elWidth}px`;
    el.style.height = `${elHeight}px`;
    
    // CALL FUNCTION FOR DRAWING IMAGE
    CanVasDimension();
    DrawingImage();
}

for (let resizer of resizers){
    resizer.addEventListener('touchstart', touchstart);

    function touchstart(e){
        e.preventDefault();
        curRes = e.target;
        let touch = e.touches[0];

        let prevX = touch.clientX;
        let prevY = touch.clientY;
        window.addEventListener('touchmove', touchmove);
        window.addEventListener('touchend', touchend);
    
        function touchmove(e){
            e.preventDefault();
            isResizing = true;
            let touch = e.touches[0];
            let newX = (prevX - touch.clientX);
            let newY = (prevY - touch.clientY);

            CropperResizer(
                curRes, touch,
                newX, newY,
            );
            prevX = touch.clientX;
            prevY = touch.clientY;
        }

        function touchend(){
            isResizing = false;
            window.removeEventListener('touchmove', touchmove);
            window.removeEventListener('touchend', touchend);
        }
    }

    resizer.addEventListener('mousedown', mousedown);
    function mousedown(e){
        e.preventDefault();
        el.style.transition = `none`;
        curRes = e.target;

        let prevX = e.clientX;
        let prevY = e.clientY;
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);

        function mousemove(e){
            e.preventDefault();
            isResizing = true;
            let touch = e;
            let newX = (prevX - touch.clientX);
            let newY = (prevY - touch.clientY);
            CropperResizer(
                curRes, touch,
                newX, newY,
            );
            prevX = touch.clientX;
            prevY = touch.clientY;
        }

        function mouseup(){
            isResizing = false;
            window.removeEventListener('mousemove', mousemove);
            window.removeEventListener('mouseup', mouseup);
        }
    }
}
/* ____________________________________________[ ### ]____________________________________________ */

/* ___________________________[ POSITIONING IMAGE ACCORDING TO CROPPER ]___________________________ */
const setImageTransForm = () => {
    leImg = InpImg.getBoundingClientRect();
    bounds = CropWarp.getBoundingClientRect();
    rect = el.getBoundingClientRect();

    let img_start_Height = (naH/naW)*(bounds.width)
    let dx = (leImg.width - bounds.width)/2
    let dy = (leImg.height - img_start_Height)/2
    let dyDot = (bounds.height - img_start_Height)/2
    let microDx = (Math.ceil(bounds.top) - bounds.top)*scale
    
    if((pointX) >= (rect.left - bounds.left + dx)){
        pointX = Math.min(
            Math.max(pointX, leImg.left), (rect.left - bounds.left + dx)
        );
    }
    else if (pointX <= (rect.right - bounds.right - dx)){
        pointX = Math.min(
            Math.max(pointY, leImg.right), (rect.right - bounds.right - dx)
        );
    }
    if (pointY >= (rect.top - bounds.top - dyDot + dy + 2*microDx)){
        pointY = Math.min(
            Math.max(pointY, leImg.top), (rect.top - bounds.top - dyDot + dy + 2*microDx)
        );
    }
    else if (pointY <= (rect.bottom - bounds.bottom + dyDot - dy + 4*microDx)){
        pointY = Math.min(
            Math.max(pointY, leImg.bottom), (rect.bottom - bounds.bottom + dyDot - dy + 4*microDx)
        );
    }

    // SCALING IMAGE ON MOUSE SCRLL AND TRANSFROM ON TOUCH MOVE/MOUSE MOVE
    ICo.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    
    // CALL FUNCTION FOR DRAWING IMAGE
    DrawingImage()
}


// IMAGE POSITIONING START ON MOUSE DOWN:
ICo.addEventListener('mousedown', IMGmousedown);

function IMGmousedown(e){
    start = {x: (e.clientX - pointX), y: (e.clientY - pointY)};
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    function mousemove(e){
        e.preventDefault();
        pointX = (e.clientX - start.x);
        pointY = (e.clientY - start.y);
        setImageTransForm();
    }

    function mouseup(){
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
    }
}

// IMAGE POSITIONING START ON > TOUCH START:
ICo.addEventListener('touchstart', IMGtouchstart);
function IMGtouchstart(e){
    let touch = e.touches[0];
    start = {x: (touch.clientX - pointX), y: (touch.clientY - pointY)};

    window.addEventListener('touchmove', touchmove);
    window.addEventListener('touchend', touchend);

    function touchmove(e){
        let touch = e.touches[0];
        pointX = (touch.clientX - start.x);
        pointY = (touch.clientY - start.y);
        setImageTransForm();
    }

    function touchend(){
        window.removeEventListener('touchmove', touchmove);
        window.removeEventListener('touchend', touchend);
    }
}
// ZOOM IMAGE
let CWHolder = document.querySelector('.Cropper_Wrappe_Holder')
CWHolder.onwheel = function(e){
    e.preventDefault();

    let delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    (delta > 0) ? (scale += 0.1) : (scale -= 0.1);
    scale = Math.min(Math.max(1, scale), 5);

    setImageTransForm();
    if (rect.height > leImg.height){
        el.style.height = `${leImg.height}px`;
        el.style.top = `${leImg.top}px`;
        CanVasDimension();
    }
}
/* ____________________________________________[ ### ]____________________________________________ */