var a;
document.getElementById('a1').onchange= function() {
	
	//window.localStorage.removeItem("image-base64");
  $("body").append('<div class="table" id="overlay" ><div class="tableRow"><div class="tabl Cell box"><canvas id="panel" width="380" height="380"></canvas><p><input type="button" id="cropBttn" value="Crop"></p></div><div class="tableCell box"><img src="" id="croppedImage"></div></div><input id="done" name="Done" value="Done" type="button"/></div>');
 	document.getElementById("overlay").style.display = "block";


var imgInput = document.getElementById( "a1" ),
/** @type {Node} */
imgContainer = document.getElementById( "dis" );

updateUi = function() {
// imgContainer.src = window.localStorage.getItem( "image-base64" );
console.log(window.localStorage.getItem( "image-base64" ));
a=window.localStorage.getItem( "image-base64" );
};

//if ( this.files.length ) {
    var reader = new FileReader();
    reader.onload = function( e ){
	window.localStorage.removeItem("image-base64");
    window.localStorage.setItem( "image-base64", e.target.result );
	console.log('image is set\n');
    updateUi();
   };
  // var a=window.localStorage.getItem( "image-base64" );
   // reader.readAsDataURL( this.files[ 0 ] );
	 
		
  // }
   
   var imageCropper = {

            ctx: null,

            image: null,

            click: false,

            downPointX: 0,

            downPointY: 0,

            lastPointX: 0,

            lastPointY: 0,

            hoverBoxSize: 5,

            cropedFile: null,

            resize: false,

            canvasBackgroundColor: "#FFFFFF",

            init: function() {
                this.ctx = document.getElementById("panel").getContext("2d");
                var imageUploader = document.getElementById('imageLoader');
                this.initCanvas();
                document.getElementById("cropBttn").onclick = this.cropImage.bind(this);
            },

            initCanvas: function(image) {
                this.image = new Image();
                 this.image.setAttribute('crossOrigin', 'anonymous'); //optional,  it is needed only if your image is not avalible on same domain.
                this.image.src = a;//"http://icodingclub.github.io/imagecropper/steve-jobs.jpg";
                this.image.onload = function() {
                    this.ctx.canvas.width = this.image.width;
                    this.ctx.canvas.height = this.image.height;
                    this.reDrawCanvas();
                    this.initEventsOnCanvas();
                }.bind(this);
            },

            /**
             * Initlize mousedown and mouseup event, third brother of this type of event, onmousemove, will be set little letter.
             *
             */
            initEventsOnCanvas: function() {
                this.ctx.canvas.onmousedown = this.onMouseDown.bind(this);
                this.ctx.canvas.onmouseup = this.onMouseUp.bind(this);
            },

            /**
             * This event is bit tricky!
             * Normal task of this method is to pin point the starting point, from where we will  strat making the selectin box.
             * However, it work diffrently if user is hover over the resize boxes
             *
             */
            onMouseDown: function(e) {
                var loc = this.windowToCanvas(e.clientX, e.clientY);
                e.preventDefault();
                this.click = true;
                if (!this.resize) {
                    this.ctx.canvas.onmousemove = this.onMouseMove.bind(this);
                    this.downPointX = loc.x;
                    this.downPointY = loc.y;
                    this.lastPointX = loc.x;
                    this.lastPointY = loc.y;
                }
            },

            /**
             * register normal movement, with click but no re-size.
             */
            onMouseMove: function(e) {
                e.preventDefault();
                if (this.click) {
                    var loc = this.windowToCanvas(e.clientX, e.clientY);
                    this.lastPointX = loc.x;
                    this.lastPointY = loc.y;
                    this.reDrawCanvas();
                }
            },

            onMouseUp: function(e) {
                e.preventDefault();
                this.ctx.canvas.onmousemove = this.onImageResize.bind(this);
                this.click = false;
            },

            reDrawCanvas: function() {
                this.clearCanvas();
                this.drawImage();
                this.drawSelRect();
                this.drawResizerBox();
            },

            clearCanvas: function() {
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                this.ctx.fillStyle = this.canvasBackgroundColor;
                this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            },

            /**
             * Draw image on canvas.
             */
            drawImage: function() {
                this.ctx.drawImage(this.image, 0, 0);
            },

            /**
             * Draw selection box on canvas
             */
            drawSelRect: function() {
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY));
            },

            /**
             * This method take care of resizeing the selection box.
             * It does so by looking on (click == true and hover on resize box == true)
             * if both are true, it adjust the resize.
             *
             * @param  {[type]} e [description]
             * @return {[type]}   [description]
             */
            onImageResize: function(e) {
                var centerPointX = (this.lastPointX + this.downPointX) / 2;
                var centerPointY = (this.lastPointY + this.downPointY) / 2;
                var loc = this.windowToCanvas(e.clientX, e.clientY);
                this.ctx.fillStyle = '#FF0000';
                this.ctx.lineWidth = 1;
                if (this.isResizeBoxHover(loc, centerPointX, this.downPointY)) {
                    if (this.click) {
                        this.downPointY = loc.y;
                        this.reDrawCanvas();
                    }
                } else if (this.isResizeBoxHover(loc, this.lastPointX, centerPointY)) {
                    if (this.click) {
                        this.lastPointX = loc.x;
                        this.reDrawCanvas();
                    }
                } else if (this.isResizeBoxHover(loc, centerPointX, this.lastPointY)) {
                    if (this.click) {
                        this.lastPointY = loc.y;
                        this.reDrawCanvas();
                    }
                } else if (this.isResizeBoxHover(loc, this.downPointX, centerPointY)) {
                    if (this.click) {
                        this.downPointX = loc.x;
                        this.reDrawCanvas();
                    }
                } else {
                    this.resize = false;
                    this.reDrawCanvas();
                }
            },

            /**
             * Detect the mousehover on given axis
             */
            isResizeBoxHover: function(loc, xPoint, yPoint) {
                var hoverMargin = 3;
                if (loc.x > (xPoint - this.hoverBoxSize - hoverMargin) && loc.x < (xPoint + this.hoverBoxSize + hoverMargin) && loc.y > (yPoint - this.hoverBoxSize - hoverMargin) && loc.y < (yPoint + 5 + hoverMargin)) {
                    this.ctx.fillRect(xPoint - this.hoverBoxSize, yPoint - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
                    this.resize = true;
                    return true;
                }
                return false;
            },

            /**
             * Draw 4 resize box of 10 x 10
             * @return {[type]} [description]
             */
            drawResizerBox: function() {
                var centerPointX = (this.lastPointX + this.downPointX) / 2;
                var centerPointY = (this.lastPointY + this.downPointY) / 2;
                this.ctx.fillStyle = '#000000';
                this.ctx.lineWidth = 1;
                this.ctx.fillRect(centerPointX - this.hoverBoxSize, this.downPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
                this.ctx.fillRect(this.lastPointX - this.hoverBoxSize, centerPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
                this.ctx.fillRect(centerPointX - this.hoverBoxSize, this.lastPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
                this.ctx.fillRect(this.downPointX - this.hoverBoxSize, centerPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
            },

            /**
             * Translate to HTML coardinates to Canvas coardinates.
             */
            windowToCanvas: function(x, y) {
                var canvas = this.ctx.canvas,
                    bbox = canvas.getBoundingClientRect();
                return {
                    x: x - bbox.left * (canvas.width / bbox.width),
                    y: y - bbox.top * (canvas.height / bbox.height)
                };
            },

            /**
             * Get the canavs, remove cutout, create image elemnet on UI.
             * @return {[type]}
             */
            cropImage: function() {
                var tempCtx = document.createElement('canvas').getContext('2d');
                tempCtx.canvas.width = this.image.width;
                tempCtx.canvas.height = this.image.height;
                console.log(this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY));
                tempCtx.drawImage(this.image, this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY), 0, 0, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY));
                var imageData = tempCtx.canvas.toDataURL();
                document.getElementById('croppedImage').src = imageData;
            }
			
	   
        //validation code to see State field is mandatory.  
    
			
        }

        imageCropper.init();
		document.getElementById("done").onclick = function fun() {
       document.getElementById('a1').innerHTML =document.getElementById('croppedImage').src;
	   document.getElementById("overlay").style.display = "none";
		}


};

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}