const Cropper_Wrapper = document.querySelector(".Cropper_Wrapper")
let  Cropper_Wrapper_Rect= Cropper_Wrapper.getBoundingClientRect();
let crXbigining = Cropper_Wrapper_Rect.left;
let crYbigining = Cropper_Wrapper_Rect.top;

const el = document.querySelector('.item');
el.style.left = `${((Cropper_Wrapper.clientWidth - el.clientWidth) /2) + crXbigining}px`;
el.style.top = `${((Cropper_Wrapper.clientHeight - el.clientHeight) /2) + crYbigining}px`;
let rect = el.getBoundingClientRect();

let Cropping_IMG = document.querySelector('.Cropping_IMG');
let leImg = Cropping_IMG.getBoundingClientRect();
Cropping_IMG.style.width = `${Cropper_Wrapper_Rect.width}px`;
Cropping_IMG.style.top = `${(Cropper_Wrapper_Rect.height - leImg.height)/2}px`;

const InputImg = document.getElementsByClassName('inputImg')[0]
const naW = InputImg.naturalWidth;
const naH = InputImg.naturalHeight;

let GetCanvas = document.getElementById('canvas');
GetCanvas.width = `${el.clientWidth}`;
GetCanvas.height = `${el.clientHeight}`;

let isResizing = false;
let scale = 1;
let scaleDireaction = 0;

// ``````````````````````````````````````````````````````````````````````````````````````````````

const DrawingImage = () =>{
    // DRAWING AN IMAGE INSIDE THE CANVAS
    leImg = Cropping_IMG.getBoundingClientRect();
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


// `````````````````````````ZOOM THE IMAGE`````````````````````````````````
function zoom(event) {
    event.preventDefault();
    Cropper_Wrapper_Rect= Cropper_Wrapper.getBoundingClientRect();
    Cropping_IMG = document.querySelector('.Cropping_IMG');
    leImg = Cropping_IMG.getBoundingClientRect();

    scale += event.deltaY * -0.001;
    scaleDireaction = event.deltaY * -0.01;

    // Restrict scale
    scale = Math.min(Math.max(1, scale.toFixed(1)), 1.5);

    // Apply scale transform
    if(scale==1){
        Cropping_IMG.style.width = `${Cropper_Wrapper_Rect.width}px`;
        Cropping_IMG.style.transition = `all 0.5s ease`;
    }
    else if(!(scale<=1) && (scale<=1.5) && (scaleDireaction<0)){
        Cropping_IMG.style.width = `${leImg.width  - ((naW/2) / (scale+0.1))}px`;
        Cropping_IMG.style.transition = `all 0.5s ease`;
    }
    else if(!(scale<=1) && (scale<1.5) && (scaleDireaction>0)){
        Cropping_IMG.style.width = `${leImg.width + (naW/2 * scale)}px`;
        Cropping_IMG.style.transition = `all 0.5s ease`;
    }
    
    DrawingImage();
}
Cropping_IMG.onwheel = zoom;
// `````````````````````````END ZOOM THE IMAGE`````````````````````````````````

// ``````````````````````````````````WINDOW SIZE DETECTION````````````````````````````````````````
window.addEventListener('resize', ()=>{
    el.style.width = `${100}px`;
    el.style.height = `${100}px`;

    Cropper_Wrapper_Rect= Cropper_Wrapper.getBoundingClientRect();
    let crXstart = Cropper_Wrapper_Rect.left;
    let crYstart = Cropper_Wrapper_Rect.top;
    el.style.left = `${((Cropper_Wrapper.clientWidth - el.clientWidth) /2) + crXstart}px`;
    el.style.top = `${((Cropper_Wrapper.clientHeight - el.clientHeight) /2) + crYstart}px`;

    Cropping_IMG.style.width = `${Cropper_Wrapper.clientWidth}px`;
    Cropping_IMG.style.top = `${(Cropper_Wrapper.clientHeight - Cropping_IMG.clientHeight)/2}px`;
    leImg = Cropping_IMG.getBoundingClientRect();
    GetCanvas.width = `${el.clientWidth}`;
    GetCanvas.height = `${el.clientHeight}`;
    scale = 1;
    scaleDireaction = 0;
    DrawingImage();
})
// ``````````````````````````````END WINDOW RESIZE DETECTION```````````````````````````````````````

// `````````````````````````````CROPPER CONTAINER MOVEMENT CONTROLLER```````````````````````````````
const cll_cropper_movement_function = (newX, newY) =>{
    Cropper_Wrapper_Rect= Cropper_Wrapper.getBoundingClientRect();
    rect = el.getBoundingClientRect();
    leImg = Cropping_IMG.getBoundingClientRect();

    let crXstart = Cropper_Wrapper_Rect.left;
    let crYstart = Cropper_Wrapper_Rect.top;
    let crXend = Cropper_Wrapper_Rect.left + Cropper_Wrapper_Rect.width;
    let crYend = Cropper_Wrapper_Rect.top + Cropper_Wrapper_Rect.height;

    let RT = rect.top;
    let RL = rect.left;
    let ECW = rect.width;
    let ECH = rect.height;
    
    el.style.left = `${RL - newX}px`;
    el.style.top = `${RT - newY}px`;

    // CALL FUNCTION FOR DRAWING IMAGE
    DrawingImage()
    
    if (RL < (crXstart)){
        el.style.left = `${crXstart}px`;
        return
    }
    else if (RT < (crYstart)){
        el.style.top = `${crYstart}px`;
        return
    }
    else if ((RL + ECW) > (crXend)){
        el.style.left = `${crXend - ECW}px`;
        return
    }
    else if ((RT + ECH) > (crYend)){
        el.style.top = `${crYend - ECH}px`;
        return
    }
    else if(RL < (leImg.left)){
        el.style.left = `${leImg.left}px`;
        return
    }
    else if(RT < (leImg.top)){
        el.style.top = `${leImg.top}px`;
        return
    }
    else if((RL + ECW) > (leImg.left + leImg.width)){
        el.style.left = `${leImg.left + leImg.width - ECW}px`;
        return
    }
    else if((RT + ECH) > (leImg.top + leImg.height)-5){
        el.style.top = `${leImg.top + leImg.height - ECH -5}px`;
        return
    }
    
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
// ```````````````````````````END TOUCH FUNCTION FOR CROPPER CONTAINER````````````````````````````

// `````````````````````````````````RESIZER ACTION CONTAINER```````````````````````````````````````
const resizers = document.querySelectorAll(".resizer");
let currentResizer;

const cll_resizer_function = (currentResizer, touch, rect, prevX, prevY, crXstart, crYstart, crXend, crYend)=>{
    leImg = Cropping_IMG.getBoundingClientRect();
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
// ``````````````````````````````END CROPPER RESIZE ACTION CONTAINER`````````````````````````````````


// ```````````````````````````````POSITIONING IMAGE LOGICAL CUNCTION`````````````````````````````````
const PostionImage = (newX, newY)=>{
    Cropper_Wrapper_Rect= Cropper_Wrapper.getBoundingClientRect();
    let leImg = Cropping_IMG.getBoundingClientRect();
    let cropperRect = el.getBoundingClientRect();
    Cropping_IMG.style.transition = `none`;
    // let leWrapper = Cropper_Wrapper_Dimension;

    let CH = cropperRect.height;
    let CW = cropperRect.width;
    let CT = cropperRect.top;
    let CL = cropperRect.left;
    let CIH = leImg.height;
    let CIW = leImg.width;
    let CIT = leImg.top;
    let CIL = leImg.left;
    let CWRT = Cropper_Wrapper_Rect.top;
    let CWRL = Cropper_Wrapper_Rect.left;

    let imgMinBottom = ((CT + CH) - (CIH + CWRT));
    let imgBottm = (CIT + CIH)
    let cropperBottm = CT + CH

    let imgMinRight = ((CL + CW) - (CIW + CWRL));
    let imgRight = (CIL + CIW)
    let cropperRight = CL + CW

    Cropping_IMG.style.left = `${CIL - newX - CWRL}px`;
    Cropping_IMG.style.top = `${CIT - newY - CWRT}px`;

    // CALL FUNCTION FOR DRAWING IMAGE
    DrawingImage()
    
    if (CIL > CL){
        Cropping_IMG.style.left = `${CL - CWRL}px`;
        return
    }
    else if (CIT > CT){
        Cropping_IMG.style.top = `${CT - CWRT}px`;
        return
    }
    else if (imgBottm < cropperBottm +5){
        Cropping_IMG.style.top = `${imgMinBottom +5}px`;
        return
    }
    else if (imgRight < cropperRight){
        Cropping_IMG.style.left = `${imgMinRight}px`;
        return
    }
}
// IMAGE POSITIONING START ON MOUSE DOWN:
Cropping_IMG.addEventListener('mousedown', IMGmousedown);

function IMGmousedown(e){
    let prevX = e.clientX;
    let prevY = e.clientY;

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    function mousemove(e){
        let newX = prevX - e.clientX;
        let newY = prevY - e.clientY;

        PostionImage(newX, newY);
        
        prevX = e.clientX;
        prevY = e.clientY;
    }

    function mouseup(){
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
    }
}
// IMAGE POSITIONING START ON > TOUCH START:
Cropping_IMG.addEventListener('touchstart', IMGtouchstart);
function IMGtouchstart(e){
    let touch = e.touches[0];
    let prevX = touch.clientX;
    let prevY = touch.clientY;

    window.addEventListener('touchmove', touchmove);
    window.addEventListener('touchend', touchend);

    function touchmove(e){
        let touch = e.touches[0];
        let newX = prevX - touch.clientX;
        let newY = prevY - touch.clientY;

        PostionImage(newX, newY);
        
        prevX = touch.clientX;
        prevY = touch.clientY;
    }

    function touchend(){
        window.removeEventListener('touchmove', touchmove);
        window.removeEventListener('touchend', touchend);
    }
}


