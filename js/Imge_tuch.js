const Cropper_Wrapper = document.querySelector(".Cropper_Wrapper");
const Cropping_IMG = document.querySelector('.Cropping_IMG');
let leWrapper = Cropper_Wrapper.getBoundingClientRect();

let CWheight = Cropper_Wrapper.clientHeight;
let CWwidth = Cropper_Wrapper.clientWidth;

Cropping_IMG.style.width = `${Cropper_Wrapper.clientWidth}px`;
let leImg = Cropping_IMG.getBoundingClientRect();

Cropping_IMG.addEventListener('mousedown', mousedown);

function mousedown(e){
    let prevX = e.clientX;
    let prevY = e.clientY;

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    function mousemove(e){
        let newX = prevX - e.clientX;
        let newY = prevY - e.clientY;
        let leImg = Cropping_IMG.getBoundingClientRect();
        Cropping_IMG.style.left = `${leImg.left - newX -leWrapper.left}px`;
        Cropping_IMG.style.top = `${leImg.top - newY -leWrapper.top}px`;

        prevX = e.clientX;
        prevY = e.clientY;
    }

    function mouseup(){
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
    }
}

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
        let leImg = Cropping_IMG.getBoundingClientRect();
        Cropping_IMG.style.left = `${leImg.left - newX - leWrapper.left}px`;
        Cropping_IMG.style.top = `${leImg.top - newY - leWrapper.top}px`;

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
    leWrapper = Cropper_Wrapper.getBoundingClientRect();
})