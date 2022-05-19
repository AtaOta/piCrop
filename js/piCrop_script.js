const CropWarp = document.querySelector(".Cropper_Wrapper")
const el = document.querySelector('.item');
const InputImage = document.getElementsByClassName('inputImg')[0]
const resizers = document.querySelectorAll(".resizer");
const resizer = document.querySelector('.resizer');
const naW = InputImage.naturalWidth;
const naH = InputImage.naturalHeight;

let ImageCover = document.querySelector('.Cropping_IMG');
let GetCanvas = document.getElementById('canvas');

let  bounds, rect ,leImg, resizerWidth, canvasWide, cansvasHigh;
let rectStart = {x: 0, y:0}, rectX = 0, rectY = 0, minRectX, maxRectX, minRectY, maxRectY;
let isResizing = false, initialSize = 150, scale, pointX = 0, pointY = 0, start = {x: 0, y:0};
let ResizerOuterXright = 0, ResizerOuterYbottom = 0, ResizerOuterXleft = 0, ResizerOuterYtop = 0;

const piCrop = () =>{
    bounds = CropWarp.getBoundingClientRect();
    rect = el.getBoundingClientRect();
    leImg = InputImage.getBoundingClientRect();
    resizerWidth = resizer.getBoundingClientRect().width;

    el.style.left = `${(CropWarp.clientWidth - el.clientWidth) /2}px`;
    el.style.top = `${(CropWarp.clientHeight - el.clientHeight) /2}px`;
    el.style.width = `${initialSize}px`;
    el.style.height = `${initialSize}px`;
    
    ImageCover.style.width = `${CropWarp.clientWidth}px`;
    ImageCover.style.top = `${(CropWarp.clientHeight - ImageCover.clientHeight)/2}px`;
    rectStart = {x: 0, y:0}
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
    leImg = InputImage.getBoundingClientRect();
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
    image.src = InputImage.src
    
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
const Cropper_Container_Movement = () =>{
    /* BOUNDING CROPPEER RECTENGLE HORAIZONTALLY */
    let mxLeft = (leImg.left >= bounds.left) ? leImg.left : bounds.left;
    let dxImgLeft = (leImg.left >= bounds.left) ? (leImg.left-bounds.left) : 0;
    let dxImgRight = (leImg.right <= bounds.right) ? (bounds.right - leImg.right) : 0;
    minRectX = (-(bounds.right - (bounds.width + initialSize)/2 - mxLeft - 4));
    maxRectX = (bounds.width + minRectX - rect.width -dxImgLeft -dxImgRight);
    rectX = Math.min(
        Math.max(rectX, minRectX), maxRectX
    );
    
    /* BOUNDING CROPPER RECTANGLE VERTICALLY */
    let mxTop = (leImg.top >= bounds.top) ? leImg.top : bounds.top;
    let dyImgTop = (leImg.top >= bounds.top) ? (leImg.top-bounds.top) : 0;
    let dyImgBottom = (leImg.bottom <= bounds.bottom) ? (bounds.bottom - leImg.bottom) : 0;
    minRectY = (-(bounds.bottom - (bounds.height + initialSize)/2 - mxTop - 4));
    maxRectY = (bounds.height + minRectY - rect.height -dyImgTop -dyImgBottom);
    rectY = Math.min(
        Math.max(rectY, minRectY), maxRectY
    );

    /* TRANSLATE RECTANGLE POSITON */
    el.style.transform = `translate(${rectX}px, ${rectY}px)`;

    /* CALL FUNCTION FOR DRAWING IMAGE */
    CanVasDimension();
    DrawingImage()
}
const transformRec = () =>{
    el.style.transform = `translate(${rectX}px, ${rectY}px)`;
}
// TOUCH EVENT FOR CROPPER CONTAINER
el.addEventListener('touchstart', touchstart);
function touchstart(e){
    e.preventDefault();
    let touch = e.touches[0];
    rectStart = {x: (touch.clientX - rectX), y: (touch.clientY - rectY)};
    window.addEventListener('touchmove', touchmove);
    window.addEventListener('touchend', touchend)

    function touchmove(e){
        let touch = e.touches[0];
        if (!isResizing){
            rectX = (touch.clientX - rectStart.x);
            rectY = (touch.clientY - rectStart.y);
            Cropper_Container_Movement();
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
    rectStart = {x: (e.clientX - rectX), y: (e.clientY - rectY)};
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    function mousemove(e){
        e.preventDefault();
        let touch = e
        if (!isResizing){
            rectX = (touch.clientX - rectStart.x);
            rectY = (touch.clientY - rectStart.y);
            Cropper_Container_Movement();
        }
    }
    function mouseup(){
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
    }
}
/* ____________________________________________[ ### ]____________________________________________ */


/* _________________________________[ RESIZER CROPPER CONTAINER ]_________________________________  */
const CropperResizer = (currentResizer, touch, prevX, prevY)=>{
    let elWidth = rect.width, elHeight = rect.height;
    let rectMaxRight = (bounds.right >= leImg.right) ? (leImg.right) : (bounds.right);
    let rectMinLeft = (bounds.left <= leImg.left) ? (leImg.left) : (bounds.left);
    let rectMinTop = (bounds.top <= leImg.top) ? (leImg.top) : (bounds.top);
    let rectMaxBottom = (bounds.bottom >= leImg.bottom) ? (leImg.bottom) : (bounds.bottom);
    let rectMargin = 1;
    let newX = (prevX - touch.clientX);
    let newY = (prevY - touch.clientY);

    ResizerOuterXright = (rect.right >= rectMaxRight) ? (ResizerOuterXright += newX) : 0;
    ResizerOuterYbottom = (Math.ceil(rect.bottom) >= Math.ceil(rectMaxBottom)) ? (ResizerOuterYbottom += newY) : 0;
    ResizerOuterXleft = (rect.left <= rectMinLeft) ? (ResizerOuterXleft += newX + rectMargin) : 0;
    ResizerOuterYtop = (Math.ceil(rect.top) <= Math.ceil(rectMinTop)) ? (ResizerOuterYtop += newY + rectMargin) : 0;

    // BOUNDING MAX-WIDHT OF RECTANGLE ACCORDING TO RIGHT-SIDE MOVEMENT
    let elmRightWidth = (rect.width - newX - ResizerOuterXright);
    elmRightWidth = Math.min(
        Math.max(elmRightWidth, resizerWidth), (rectMaxRight - rect.left)
    )

    // BOUNDING MAX-HEIGHT OF RECTANGLE ACCORDING TO BOTTOM-SIDE MOVEMENT
    let elmBottmHeight = rect.height - newY - ResizerOuterYbottom;
    elmBottmHeight = Math.min(
        Math.max(elmBottmHeight, resizerWidth), (rectMaxBottom - rect.top)
    )

    // BOUNDING MAX-WIDHT OF RECTANGLE ACCORDING TO LEFT-SIDE MOVEMENT
    let elmLeftWidth = rect.width + newX + ResizerOuterXleft;
    elmLeftWidth = Math.min(
        Math.max(elmLeftWidth, resizerWidth), (rect.right - rectMinLeft)
    )

    // BOUNDING MAX-HEIGHT OF RECTANGLE ACCORDING TO TOP-SIDE MOVEMENT
    let elmTopHeight = rect.height + newY + ResizerOuterYtop;
    elmTopHeight = Math.min(
        Math.max(elmTopHeight, resizerWidth), (rect.bottom - rectMinTop)
    )

    if(currentResizer.classList.contains("e")){
        el.style.width = `${elmRightWidth}px`;
    }
    else if (currentResizer.classList.contains("se")){
        el.style.width = `${elmRightWidth}px`;
        el.style.height = `${elmBottmHeight}px`;
    }
    else if (currentResizer.classList.contains("s")){
        el.style.height = `${elmBottmHeight}px`;
    }
    else if (currentResizer.classList.contains("sw")){
        rectX = (touch.clientX - rectStart.x)
        el.style.width = `${elmLeftWidth}px`;
        el.style.height = `${elmBottmHeight}px`;
    }
    else if (currentResizer.classList.contains("w")){
        rectX = (touch.clientX - rectStart.x)
        el.style.width = `${elmLeftWidth}px`;
    }
    else if (currentResizer.classList.contains("nw")){
        rectX = (touch.clientX - rectStart.x);
        rectY = (touch.clientY - rectStart.y);
        el.style.width = `${elmLeftWidth}px`;
        el.style.height = `${elmTopHeight}px`;
    }
    else if (currentResizer.classList.contains("n")){
        rectY = (touch.clientY - rectStart.y)
        el.style.height = `${elmTopHeight}px`;
    }
    else if (currentResizer.classList.contains("ne")){
        rectY = (touch.clientY - rectStart.y)
        el.style.width = `${elmRightWidth}px`;
        el.style.height = `${elmTopHeight}px`;
    }
}

for (let resizer of resizers){
    resizer.addEventListener('touchstart', touchstart);

    function touchstart(e){
        e.preventDefault();
        ResizerOuterXright = 0, ResizerOuterYbottom = 0,
        ResizerOuterXleft=0, ResizerOuterYtop = 0;
        let currentResizer = e.target;
        let touch = e.touches[0];

        let prevX = touch.clientX;
        let prevY = touch.clientY;
        window.addEventListener('touchmove', touchmove);
        window.addEventListener('touchend', touchend);
    
        function touchmove(e){
            isResizing = true;
            let touch = e.touches[0];

            CropperResizer(
                currentResizer, touch,
                prevX, prevY
            );
            prevX = touch.clientX;
            prevY = touch.clientY;
            Cropper_Container_Movement();
        }

        function touchend(){
            isResizing = false;
            window.removeEventListener('touchmove', touchmove);
            window.removeEventListener('touchend', touchend);
        }
    }

    resizer.addEventListener('mousedown', mousedown);
    function mousedown(e){
        ResizerOuterXright = 0, ResizerOuterYbottom = 0,
        ResizerOuterXleft=0, ResizerOuterYtop = 0;
        e.preventDefault();
        let currentResizer = e.target;

        let prevX = e.clientX;
        let prevY = e.clientY;
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);

        function mousemove(e){
            e.preventDefault();
            isResizing = true;
            let touch = e;

            CropperResizer(
                currentResizer, touch,
                prevX, prevY
            );
            prevX = touch.clientX;
            prevY = touch.clientY;
            Cropper_Container_Movement();
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

    let img_start_Height = (naH/naW)*(bounds.width)
    let dx = (leImg.width - bounds.width)/2
    let dy = (leImg.height - img_start_Height)/2
    let dyDot = (bounds.height - img_start_Height)/2
    
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
    if (pointY >= (rect.top - bounds.top - dyDot + dy)){
        pointY = Math.min(
            Math.max(pointY, leImg.top), (rect.top - bounds.top - dyDot + dy)
        );
    }
    else if (pointY <= (rect.bottom - bounds.bottom + dyDot - dy)){
        pointY = Math.min(
            Math.max(pointY, leImg.bottom), (rect.bottom - bounds.bottom + dyDot - dy)
        );
    }

    // SCALING IMAGE ON MOUSE SCRLL AND TRANSFROM ON TOUCH MOVE/MOUSE MOVE
    ImageCover.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    
    // CALL FUNCTION FOR DRAWING IMAGE
    DrawingImage()
}


// IMAGE POSITIONING START ON MOUSE DOWN:
ImageCover.addEventListener('mousedown', IMGmousedown);

function IMGmousedown(e){
    e.preventDefault();
    start = {x: (e.clientX - pointX), y: (e.clientY - pointY)};
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    function mousemove(e){
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
ImageCover.addEventListener('touchstart', IMGtouchstart);
function IMGtouchstart(e){
    e.preventDefault();
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
    scale = Math.min(Math.max(1, scale), 3);

    setImageTransForm();
    // if (rect.height > leImg.height){
    //     el.style.height = `${leImg.height}px`;
    //     el.style.top = `${leImg.top}px`;
    //     CanVasDimension();
    // }
}
/* ____________________________________________[ ### ]____________________________________________ */