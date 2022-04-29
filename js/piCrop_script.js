const Cropper_Wrapper = document.querySelector(".Cropper_Wrapper")
let Cropping_IMG = document.querySelector('.Cropping_IMG')
let  Cropper_Wrapper_Dimension= Cropper_Wrapper.getBoundingClientRect();
let crXbigining = Cropper_Wrapper_Dimension.left;
let crYbigining = Cropper_Wrapper_Dimension.top;

console.warn(Cropping_IMG.clientHeight)
console.warn(Cropping_IMG.clientWidth)

const el = document.querySelector('.item');
el.style.left = `${((Cropper_Wrapper.clientWidth - el.clientWidth) /2) + crXbigining}px`;
el.style.top = `${((Cropper_Wrapper.clientHeight - el.clientHeight) /2) + crYbigining}px`;

let isResizing = false;

// `````````````````````````````CROPPER CONTAINER MOVEMENT CONTROLLER```````````````````````````````
const cll_cropper_movement_function = (newX, newY) =>{
    
    let  Cropper_Wrapper_Dimension= Cropper_Wrapper.getBoundingClientRect();
    let crXstart = Cropper_Wrapper_Dimension.left;
    let crYstart = Cropper_Wrapper_Dimension.top;
    let crXend = Cropper_Wrapper_Dimension.left + Cropper_Wrapper.clientWidth;
    let crYend = Cropper_Wrapper_Dimension.top + Cropper_Wrapper.clientHeight;
    const rect = el.getBoundingClientRect();

    let RT = rect.top;
    let RL = rect.left;
    let ECW = el.clientWidth;
    let ECH = el.clientHeight;
    
    if (RL < (crXstart)){
        el.style.left = `${crXstart}px`;
        el.style.top = `${RT - newY}px`;
    }
    else if (RT < (crYstart)){
        el.style.left = `${RL - newX}px`;
        el.style.top = `${crYstart}px`;
    }
    else if ((RL + ECW) > (crXend)){
        el.style.left = `${crXend - ECW}px`;
        el.style.top = `${RT - newY}px`;
    }
    else if ((RT + ECH) > (crYend)){
        el.style.left = `${RL - newX}px`;
        el.style.top = `${crYend - ECH}px`;
    }
    else if ((RL >= 0) && (RL <= (crXend - ECW))){
        el.style.left = `${RL - newX}px`;
        el.style.top = `${RT - newY}px`;
    }
    else if ((RT >= 0) && (RT <= (crYend - ECH))){
        el.style.left = `${RL - newX}px`;
        el.style.top = `${RT - newY}px`;
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

// ``````````````````````````````````WINDOW SIZE DETECTION````````````````````````````````````````
window.addEventListener('resize', ()=>{
    const rect = el.getBoundingClientRect();
    el.style.width = `${100}px`;
    el.style.height = `${100}px`;

    let  Cropper_Wrapper_Dimension= Cropper_Wrapper.getBoundingClientRect();
    let crXstart = Cropper_Wrapper_Dimension.left;
    let crYstart = Cropper_Wrapper_Dimension.top;
    el.style.left = `${((Cropper_Wrapper.clientWidth - el.clientWidth) /2) + crXstart}px`;
    el.style.top = `${((Cropper_Wrapper.clientHeight - el.clientHeight) /2) + crYstart}px`;
})
// ``````````````````````````````END WINDOW RESIZE DETECTION```````````````````````````````````````

// `````````````````````````````````RESIZER ACTION CONTAINER```````````````````````````````````````
const resizers = document.querySelectorAll(".resizer");
let currentResizer;

const cll_resizer_function = (currentResizer, touch, rect, prevX, prevY, crXstart, crYstart, crXend, crYend)=>{

    if (currentResizer.classList.contains("se") 
    && (touch.clientX <= crXend) 
    && (touch.clientY <= crYend)){
        el.style.width = `${rect.width - (prevX - touch.clientX)}px`;
        el.style.height = `${rect.height - (prevY - touch.clientY)}px`;
    }
    else if (currentResizer.classList.contains("sw") 
    && (touch.clientX >= crXstart) 
    && (touch.clientY <= crYend)){
        el.style.width = `${rect.width + (prevX - touch.clientX)}px`;
        el.style.height = `${rect.height - (prevY - touch.clientY)}px`;
        el.style.left = `${rect.left - (prevX - touch.clientX)}px`;
    }
    else if (currentResizer.classList.contains("ne") 
    && (touch.clientX < crXend) 
    && (touch.clientY >= crYstart)){
        el.style.width = `${rect.width - (prevX - touch.clientX)}px`;
        el.style.height = `${rect.height + (prevY - touch.clientY)}px`;
        el.style.top = `${rect.top - (prevY - touch.clientY)}px`;
    }
    else if (currentResizer.classList.contains("nw")
    && (touch.clientX >= crXstart) 
    && (touch.clientY >= crYstart)){
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
            else if (rect.width>CWcw){
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