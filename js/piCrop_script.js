const Cropper_Wrapper = document.querySelector(".Cropper_Wrapper")
const el = document.querySelector('.item');
let Image_Cover = document.querySelector('.Cropping_IMG');
const InputImg = document.getElementsByClassName('inputImg')[0]
let GetCanvas = document.getElementById('canvas');
const naW = InputImg.naturalWidth;
const naH = InputImg.naturalHeight;

let  bounds, rect ,leImg ,crXbigining , crYbigining;
let isResizing = false, initialSize = 150, scale, pointX = 0, pointY = 0, start = {x: 0, y:0}

const piCrop = () =>{
    bounds = Cropper_Wrapper.getBoundingClientRect();
    rect = el.getBoundingClientRect();
    leImg = InputImg.getBoundingClientRect();

    crXbigining = bounds.left;
    crYbigining = bounds.top;

    el.style.left = `${((Cropper_Wrapper.clientWidth - el.clientWidth) /2) + crXbigining}px`;
    el.style.top = `${((Cropper_Wrapper.clientHeight - el.clientHeight) /2) + crYbigining}px`;
    el.style.width = `${initialSize}px`;
    el.style.height = `${initialSize}px`;
    
    Image_Cover.style.width = `${Cropper_Wrapper.clientWidth}px`;
    Image_Cover.style.top = `${(Cropper_Wrapper.clientHeight - Image_Cover.clientHeight)/2}px`;

    GetCanvas.width = `${el.clientWidth}`;
    GetCanvas.height = `${el.clientHeight}`;
    scale = 1
}
piCrop();

/* ___________________________________[ DRAW IMAGE INSIDE CANVAS ]___________________________________ */
const DrawingImage = () =>{
    // DRAWING AN IMAGE INSIDE THE CANVAS
    leImg = InputImg.getBoundingClientRect();
    rect = el.getBoundingClientRect();

    let DrawFormLeft = (rect.left - leImg.left)
    let DrawFormTop = (rect.top - leImg.top)
    
    let formLeft = DrawFormLeft*(naW/leImg.width);
    let fromTop = DrawFormTop*(naH/leImg.height);

    let imagePreDrawWidth = (rect.width)*(naW/leImg.width);
    let imagePreDrawHeight = (rect.height)*(naW/leImg.width);

    const image = new Image(),
    canvas = GetCanvas,
    ctx = canvas.getContext('2d');
    image.src = InputImg.src
    
    image.addEventListener('load', () => {
        ctx.drawImage(image,
            formLeft, fromTop,   // Start at 70/20 pixels from the left and the top of the image (crop),
            imagePreDrawWidth, imagePreDrawHeight,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
            0, 0,     // Place the result at 0, 0 in the canvas,
            el.clientWidth, el.clientHeight); // With as width / height: 100 * 100 (scale)
    });
}
DrawingImage();
/* ____________________________________________[ ### ]____________________________________________ */


/* ___________________________________[ WINDOW SIZE DETECTION ]___________________________________ */
window.addEventListener('resize', ()=>{
    piCrop();
    DrawingImage();
})
/* ____________________________________________[ ### ]____________________________________________ */


/* ___________________________[ CROPPER CONTAINER MOVEMENT CONTROLLER ]___________________________ */
const cll_cropper_movement_function = (newX, newY) =>{
    const bounds = Cropper_Wrapper.getBoundingClientRect();
    rect = el.getBoundingClientRect();
    leImg = InputImg.getBoundingClientRect();

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
    else if (rect.right >= leImg.right){
        x = Math.min(
            Math.max(bounds.left, (rect.left - newX)), (leImg.right - rect.width)
          );
    }
    if (rect.top <= leImg.top){
        y = Math.min(
            Math.max(leImg.top, (leImg.top - newY)), bounds.bottom - rect.height
          );
    }
    else if (rect.bottom >= leImg.bottom){
        y = Math.min(
            Math.max(bounds.top, (rect.top - newY)), (leImg.bottom - rect.height)
          );
    }
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    // CALL FUNCTION FOR DRAWING IMAGE
    DrawingImage()
}

// TOUCH FOUNCTION FOR CROPPER CONTAINER
el.addEventListener('touchstart', touchstart);
function touchstart(e){
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

            cll_cropper_movement_function(newX, newY);
            
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

el.addEventListener('mousedown', mousedown);
function mousedown(e){
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    let prevX = e.clientX;
    let prevY = e.clientY;

    function mousemove(e){
        let touch = e
        if (!isResizing){
            let newX = prevX - touch.clientX;
            let newY = prevY - touch.clientY;

            cll_cropper_movement_function(newX, newY);
            
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
const resizers = document.querySelectorAll(".resizer");
let currentResizer;

const cll_resizer_function = (currentResizer, touch, rect, prevX, prevY, crXstart, crYstart, crXend, crYend)=>{
    leImg = InputImg.getBoundingClientRect();
    rect = el.getBoundingClientRect();
    let leImgWidht = leImg.width;
    let leImgHeight = leImg.height;
    GetCanvas.width = `${rect.width}`;
    GetCanvas.height = `${rect.height}`;
    
    // CALL FUNCTION FOR DRAWING IMAGE
    DrawingImage()
    
    if (currentResizer.classList.contains("se") 
    && (touch.clientX <= crXend) 
    && (touch.clientY <= crYend)){
        if (touch.clientX >= (leImg.left+leImgWidht)){
            return
        }
        else if (touch.clientY >= (leImg.top+leImgHeight)){
            return
        }
        el.style.width = `${rect.width - (prevX - touch.clientX)}px`;
        el.style.height = `${rect.height - (prevY - touch.clientY)}px`;
    }
    else if (currentResizer.classList.contains("sw") 
    && (touch.clientX >= crXstart) 
    && (touch.clientY <= crYend)){
        if (touch.clientX <= (leImg.left)){
            return
        }
        else if (touch.clientY >= (leImg.top+leImgHeight)){
            return
        }
        el.style.width = `${rect.width + (prevX - touch.clientX)}px`;
        el.style.height = `${rect.height - (prevY - touch.clientY)}px`;
        el.style.left = `${rect.left - (prevX - touch.clientX)}px`;
    }
    else if (currentResizer.classList.contains("ne") 
    && (touch.clientX < crXend) 
    && (touch.clientY >= crYstart)){
        if (touch.clientX >= (leImg.left+leImgWidht)){
            return
        }
        else if (touch.clientY <= leImg.top){
            return
        }
        el.style.width = `${rect.width - (prevX - touch.clientX)}px`;
        el.style.height = `${rect.height + (prevY - touch.clientY)}px`;
        el.style.top = `${rect.top - (prevY - touch.clientY)}px`;
    }
    else if (currentResizer.classList.contains("nw")
    && (touch.clientX >= crXstart) 
    && (touch.clientY >= crYstart)){
        if (touch.clientX <= (leImg.left)){
            return
        }
        else if (touch.clientY <= leImg.top){
            return
        }
        el.style.width = `${rect.width + (prevX - touch.clientX)}px`;
        el.style.height = `${rect.height + (prevY - touch.clientY)}px`;
        el.style.top = `${rect.top - (prevY - touch.clientY)}px`;
        el.style.left = `${rect.left - (prevX - touch.clientX)}px`;
    }
}

for (let resizer of resizers){
    resizer.addEventListener('touchstart', touchstart);

    function touchstart(e){
        currentResizer = e.target;
        let touch = e.touches[0];

        let prevX = touch.clientX;
        let prevY = touch.clientY;
        window.addEventListener('touchmove', touchmove);
        window.addEventListener('touchend', touchend);

        let resizerWidth = resizer.clientWidth
        let resizerUseWidth = 3*resizerWidth

        let  Cropper_Wrapper_Dimension= Cropper_Wrapper.getBoundingClientRect();
        let crXstart = Cropper_Wrapper_Dimension.left;
        let crYstart = Cropper_Wrapper_Dimension.top;
        let CWcw = Cropper_Wrapper.clientWidth;
        let CWch = Cropper_Wrapper.clientHeight;
        let crXend = Cropper_Wrapper_Dimension.left + CWcw;
        let crYend = Cropper_Wrapper_Dimension.top + CWch;
    
        function touchmove(e){
            isResizing = true;
            let touch = e.touches[0];
            const rect = el.getBoundingClientRect();

            if ((rect.width<=CWcw) && (rect.height <= CWch) && (rect.width>=resizerUseWidth) && (rect.height>=resizerUseWidth)){
                cll_resizer_function(
                    currentResizer, touch, rect,
                    prevX, prevY,
                    crXstart, crYstart,
                    crXend, crYend
                );
                prevX = touch.clientX;
                prevY = touch.clientY;
            }
            else if (rect.width > CWcw){
                el.style.width = `${CWcw}px`;
            }
            else if (rect.height > CWch){
                el.style.height = `${CWch}px`;
            }
            else if (rect.width < resizerUseWidth){
                el.style.width = `${resizerUseWidth}px`;
            }
            else if (rect.height < resizerUseWidth){
                el.style.height = `${resizerUseWidth}px`;
            }
        }

        function touchend(){
            window.removeEventListener('touchmove', touchmove);
            window.removeEventListener('touchend', touchend);
            isResizing = false;
        }
    }

    resizer.addEventListener('mousedown', mousedown);
    function mousedown(e){
        currentResizer = e.target;

        let prevX = e.clientX;
        let prevY = e.clientY;
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);

        let resizerWidth = resizer.clientWidth
        let resizerUseWidth = 3*resizerWidth

        let  Cropper_Wrapper_Dimension= Cropper_Wrapper.getBoundingClientRect();
        let crXstart = Cropper_Wrapper_Dimension.left;
        let crYstart = Cropper_Wrapper_Dimension.top;
        let CWcw = Cropper_Wrapper.clientWidth;
        let CWch = Cropper_Wrapper.clientHeight;
        let crXend = Cropper_Wrapper_Dimension.left + CWcw;
        let crYend = Cropper_Wrapper_Dimension.top + CWch;
    
        function mousemove(e){
            isResizing = true;
            let touch = e;
            const rect = el.getBoundingClientRect();
            
            if ((rect.width<=CWcw) && (rect.height <= CWch) && (rect.width>=resizerUseWidth) && (rect.height>=resizerUseWidth)){
                cll_resizer_function(
                    currentResizer, touch, rect,
                    prevX, prevY,
                    crXstart, crYstart,
                    crXend, crYend
                );
                prevX = touch.clientX;
                prevY = touch.clientY;
            }
            else if (rect.width > CWcw){
                el.style.width = `${CWcw}px`;
            }
            else if (rect.height>CWch){
                el.style.height = `${CWch}px`;
            }
            else if (rect.width < resizerUseWidth){
                el.style.width = `${resizerUseWidth}px`;
            }
            else if (rect.height < resizerUseWidth){
                el.style.height = `${resizerUseWidth}px`;
            }
        }

        function mouseup(){
            window.removeEventListener('mousemove', mousemove);
            window.removeEventListener('mouseup', mouseup);
            isResizing = false;
        }
    }
}
/* ____________________________________________[ ### ]____________________________________________ */


/* ___________________________[ POSITIONING IMAGE ACCORDING TO CROPPER ]___________________________ */
const setImageTransForm = () => {
    leImg = InputImg.getBoundingClientRect();
    bounds = Cropper_Wrapper.getBoundingClientRect();
    rect = el.getBoundingClientRect();

    let img_start_Height = Math.ceil((naH/naW)*(bounds.width))
    let dx = Math.ceil((leImg.width - bounds.width)/2)
    let dy = Math.ceil((leImg.height - img_start_Height)/2)
    let dyDot = Math.ceil((bounds.height - img_start_Height)/2)
    
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
    Image_Cover.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    
    // CALL FUNCTION FOR DRAWING IMAGE
    DrawingImage()
}


// IMAGE POSITIONING START ON MOUSE DOWN:
Image_Cover.addEventListener('mousedown', IMGmousedown);

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
Image_Cover.addEventListener('touchstart', IMGtouchstart);
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
let Cropper_Wrappe_Holder = document.querySelector('.Cropper_Wrappe_Holder')
Cropper_Wrappe_Holder.onwheel = function(e){
    e.preventDefault();
    leImg = InputImg.getBoundingClientRect();
    rect = el.getBoundingClientRect();
    if (rect.height> leImg.height){
        piCrop();
    }

    let delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);

    (delta > 0) ? (scale += 0.1) : (scale -= 0.1);
    scale = Math.min(Math.max(1, scale), 2.5);

    setImageTransForm();
}

/* ____________________________________________[ ### ]____________________________________________ */