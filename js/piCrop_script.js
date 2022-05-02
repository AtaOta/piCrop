const Cropper_Wrapper = document.querySelector(".Cropper_Wrapper")
let  Cropper_Wrapper_Dimension= Cropper_Wrapper.getBoundingClientRect();
let crXbigining = Cropper_Wrapper_Dimension.left;
let crYbigining = Cropper_Wrapper_Dimension.top;

const el = document.querySelector('.item');
el.style.left = `${((Cropper_Wrapper.clientWidth - el.clientWidth) /2) + crXbigining}px`;
el.style.top = `${((Cropper_Wrapper.clientHeight - el.clientHeight) /2) + crYbigining}px`;
let rect = el.getBoundingClientRect();

let Cropping_IMG = document.querySelector('.Cropping_IMG');
Cropping_IMG.style.width = `${Cropper_Wrapper.clientWidth}px`;
Cropping_IMG.style.top = `${(Cropper_Wrapper.clientHeight - Cropping_IMG.clientHeight)/2}px`;
let leImg = Cropping_IMG.getBoundingClientRect();


let InputImg = document.getElementsByClassName('inputImg')[0]
let DrawFormLeft = (rect.left - leImg.left)
let DrawFormTop = (rect.top - leImg.top)

let GetCanvas = document.getElementById('canvas');
GetCanvas.width = `${el.clientWidth}`;
GetCanvas.height = `${el.clientHeight}`;

let isResizing = false;

// ``````````````````````````````````````````````````````````````````````````````````````````````

const DrawingImage = (DrawFormLeft, DrawFormTop) =>{
    // DRAWING AN IMAGE INSIDE THE CANVAS
    InputImg = document.getElementsByClassName('inputImg')[0]
    const naW = InputImg.naturalWidth;
    const naH = InputImg.naturalHeight;
    
    let formLeft = DrawFormLeft*(naW/Cropping_IMG.clientWidth);
    let fromTop = DrawFormTop*(naH/Cropping_IMG.clientHeight);

    let imagePreDrawWidth = el.clientWidth*(naW/Cropping_IMG.clientWidth);
    let imagePreDrawHeight = el.clientHeight*(naW/Cropping_IMG.clientWidth);

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
DrawingImage(DrawFormLeft, DrawFormTop)

// ``````````````````````````````````WINDOW SIZE DETECTION````````````````````````````````````````
window.addEventListener('resize', ()=>{
    const rect = el.getBoundingClientRect();
    el.style.width = `${100}px`;
    el.style.height = `${100}px`;

    Cropper_Wrapper_Dimension= Cropper_Wrapper.getBoundingClientRect();
    let crXstart = Cropper_Wrapper_Dimension.left;
    let crYstart = Cropper_Wrapper_Dimension.top;
    el.style.left = `${((Cropper_Wrapper.clientWidth - el.clientWidth) /2) + crXstart}px`;
    el.style.top = `${((Cropper_Wrapper.clientHeight - el.clientHeight) /2) + crYstart}px`;

    Cropping_IMG.style.width = `${Cropper_Wrapper.clientWidth}px`;
    Cropping_IMG.style.top = `${(Cropper_Wrapper.clientHeight - Cropping_IMG.clientHeight)/2}px`;
    leImg = Cropping_IMG.getBoundingClientRect();
})
// ``````````````````````````````END WINDOW RESIZE DETECTION```````````````````````````````````````

// `````````````````````````````CROPPER CONTAINER MOVEMENT CONTROLLER```````````````````````````````
const cll_cropper_movement_function = (newX, newY) =>{
    
    let  Cropper_Wrapper_Dimension= Cropper_Wrapper.getBoundingClientRect();
    let crXstart = Cropper_Wrapper_Dimension.left;
    let crYstart = Cropper_Wrapper_Dimension.top;
    let crXend = Cropper_Wrapper_Dimension.left + Cropper_Wrapper.clientWidth;
    let crYend = Cropper_Wrapper_Dimension.top + Cropper_Wrapper.clientHeight;
    rect = el.getBoundingClientRect();
    leImg = Cropping_IMG.getBoundingClientRect();

    let RT = rect.top;
    let RL = rect.left;
    let ECW = el.clientWidth;
    let ECH = el.clientHeight;
    
    el.style.left = `${RL - newX}px`;
    el.style.top = `${RT - newY}px`;

    // CALL FUNCTION FOR DRAWING IMAGE
    DrawFormLeft = (rect.left - leImg.left)
    DrawFormTop = (rect.top - leImg.top)
    DrawingImage(DrawFormLeft, DrawFormTop)
    
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
    else if((RL + ECW) > (leImg.left + Cropping_IMG.clientWidth)){
        el.style.left = `${leImg.left + Cropping_IMG.clientWidth - el.clientWidth}px`;
        return
    }
    else if((RT + ECH) > (leImg.top + Cropping_IMG.clientHeight)-5){
        el.style.top = `${leImg.top + Cropping_IMG.clientHeight - el.clientHeight-5}px`;
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
    let leImgWidht = Cropping_IMG.clientWidth;
    let leImgHeight = Cropping_IMG.clientHeight;
    GetCanvas.width = `${el.clientWidth}`;
    GetCanvas.height = `${el.clientHeight}`;
    
    // CALL FUNCTION FOR DRAWING IMAGE
    DrawFormLeft = (rect.left - leImg.left)
    DrawFormTop = (rect.top - leImg.top)
    DrawingImage(DrawFormLeft, DrawFormTop)
    
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


// POSITIONING IMAGE LOGICAL CUNCTION
const PostionImage = (newX, newY)=>{
    let leImg = Cropping_IMG.getBoundingClientRect();
    let cropperRect = el.getBoundingClientRect();
    // let leWrapper = Cropper_Wrapper_Dimension;

    let CrClnHight = el.clientHeight;
    let CrClnWidth = el.clientWidth;
    let CrImgClnHight = Cropping_IMG.clientHeight;
    let CrImgClnWidth = Cropping_IMG.clientWidth;

    let imgMinBottom = ((cropperRect.top + CrClnHight) - (CrImgClnHight + Cropper_Wrapper_Dimension.top));
    let imgBottm = (leImg.top + CrImgClnHight)
    let cropperBottm = cropperRect.top + CrClnHight

    let imgMinRight = ((cropperRect.left + CrClnWidth) - (CrImgClnWidth + Cropper_Wrapper_Dimension.left));
    let imgRight = (leImg.left + CrImgClnWidth)
    let cropperRight = cropperRect.left + CrClnWidth

    Cropping_IMG.style.left = `${leImg.left - newX - Cropper_Wrapper_Dimension.left}px`;
    Cropping_IMG.style.top = `${leImg.top - newY - Cropper_Wrapper_Dimension.top}px`;

    // CALL FUNCTION FOR DRAWING IMAGE
    DrawFormLeft = (rect.left - leImg.left)
    DrawFormTop = (rect.top - leImg.top)
    DrawingImage(DrawFormLeft, DrawFormTop)
    
    if (leImg.left > cropperRect.left){
        Cropping_IMG.style.left = `${cropperRect.left - Cropper_Wrapper_Dimension.left}px`;
        return
    }
    else if (leImg.top > cropperRect.top){
        Cropping_IMG.style.top = `${cropperRect.top - Cropper_Wrapper_Dimension.top}px`;
        return
    }
    else if (imgBottm < cropperBottm){
        Cropping_IMG.style.top = `${imgMinBottom}px`;
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
