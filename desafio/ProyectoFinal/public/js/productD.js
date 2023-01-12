let container = document.getElementById('img-container');

// If the width and height of the image are not known or to adjust the image to the container of it
let options = {
    width: 450,
    height: 450,
    //zoomWidth: 450,
    offset: {vertical: 0, horizontal: 10},
    fillContainer: true,
    scale: .68
};

gallery = (img) => {
    options.img = img.src;
    window.imageZoom.kill();
    window.imageZoom= new ImageZoom(container, options);
} 

window.imageZoom = new ImageZoom(container, options)