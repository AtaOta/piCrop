const Cropper_Wrapper = document.querySelector(".Cropper_Wrapper");
const Cropper =  document.querySelector('.item');
const Cropping_IMG = document.querySelector('.Cropping_IMG');
let leWrapper = Cropper_Wrapper.getBoundingClientRect();

let CWheight = Cropper_Wrapper.clientHeight;
let CWwidth = Cropper_Wrapper.clientWidth;

Cropping_IMG.style.width = `${Cropper_Wrapper.clientWidth}px`;
Cropping_IMG.style.top = `${(Cropper_Wrapper.clientHeight - Cropping_IMG.clientHeight)/2}px`;
let leImg = Cropping_IMG.getBoundingClientRect();

// POSITIONING IMAGE LOGICAL CUNCTION
const PostionImage = (newX, newY)=>{
    let leImg = Cropping_IMG.getBoundingClientRect();
    let cropperRect = Cropper.getBoundingClientRect();

    let CrClnHight = Cropper.clientHeight;
    let CrClnWidth = Cropper.clientWidth;
    let CrImgClnHight = Cropping_IMG.clientHeight;
    let CrImgClnWidth = Cropping_IMG.clientWidth;

    let imgMinBottom = ((cropperRect.top + CrClnHight) - (CrImgClnHight + leWrapper.top));
    let imgBottm = (leImg.top + CrImgClnHight)
    let cropperBottm = cropperRect.top + CrClnHight

    let imgMinRight = ((cropperRect.left + CrClnWidth) - (CrImgClnWidth + leWrapper.left));
    let imgRight = (leImg.left + CrImgClnWidth)
    let cropperRight = cropperRect.left + CrClnWidth

    Cropping_IMG.style.left = `${leImg.left - newX - leWrapper.left}px`;
    Cropping_IMG.style.top = `${leImg.top - newY - leWrapper.top}px`;
    if (leImg.left>cropperRect.left){
        Cropping_IMG.style.left = `${cropperRect.left - leWrapper.left}px`;
    }
    else if (leImg.top>cropperRect.top){
        Cropping_IMG.style.top = `${cropperRect.top - leWrapper.top}px`;
    }
    else if (imgBottm<cropperBottm){
        Cropping_IMG.style.top = `${imgMinBottom}px`;
    }
    else if (imgRight<cropperRight){
        Cropping_IMG.style.left = `${imgMinRight}px`;
    }
}

// IMAGE POSITIONING START ON MOUSE DOWN:
Cropping_IMG.addEventListener('mousedown', mousedown);

function mousedown(e){
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
Cropping_IMG.addEventListener('touchstart', touchstart);
function touchstart(e){
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

window.addEventListener('resize', ()=>{
    Cropping_IMG.style.width = `${Cropper_Wrapper.clientWidth}px`;
    Cropping_IMG.style.top = `${(Cropper_Wrapper.clientHeight - Cropping_IMG.clientHeight)/2}px`;
    leWrapper = Cropper_Wrapper.getBoundingClientRect();
})