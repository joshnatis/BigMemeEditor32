let uploaded = false;

function upload() {
	document.getElementById("upload-button").addEventListener("change", displayUploadedImage, false);
	document.getElementById('upload-button').click();
}

function displayUploadedImage(file="")
{
	let selectedFile;

	if(file == "")
		selectedFile = document.getElementById('upload-button').files[0];
	else
		selectedFile = file;

	let img = document.getElementById("user-image");
    img.src = URL.createObjectURL(selectedFile);
    img.style.display = "block";

	document.getElementById("upload-image-placeholder").style.display = "none";
	
	let img_holder = document.getElementById("image-holder");
	img_holder.style.display = "block";

	let canvas = document.getElementById("user-image-overlay");

	img.onload = function() {
		canvas.style.left = img.getBoundingClientRect().left + "px";
		canvas.style.height = img.clientHeight + "px";
		canvas.style.width = img.clientWidth + "px";
		uploaded = true;
	};

	document.getElementById("top-text").addEventListener('input', function (evt) {
		createText2();
	});

	document.getElementById("bottom-text").addEventListener('input', function (evt) {
		createText2();
	});
}

function fix_dpi(canvas) {
	let dpi = window.devicePixelRatio;
	//get CSS height
	//the + prefix casts it to an integer
	//the slice method gets rid of "px"
	let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
	//get CSS width
	let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
	//scale the canvas
	canvas.setAttribute('height', style_height * dpi);
	canvas.setAttribute('width', style_width * dpi);

	return canvas;
}

// function createText(text, isTop)
// {
// 	let canvas = document.getElementById("user-image-overlay");

// 	let ypos;
// 	if(isTop) ypos = 30;
// 	else ypos = canvas.height - 30;

// 	alert(ypos);

// 	var ctx = canvas.getContext("2d");
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	let toptext = document.getElementById("top-text").value;
// 	let bottomtext = document.getElementById("bottom-text").value;

// 	ctx.font = "30px Impact";
// 	ctx.fillStyle = 'white';
// 	ctx.fillText(text, 0, ypos);
// 	ctx.lineWidth = 2;
// 	ctx.strokeText(text, 0, ypos);
// }

function createText2()
{
	let canvas = document.getElementById("user-image-overlay");
	fix_dpi(canvas);

	var ctx = canvas.getContext("2d");
	ctx.textAlign = 'center';

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let img = document.getElementById("user-image");
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	ctx.font = "50px Impact";
	ctx.fillStyle = 'white';
	ctx.lineWidth = 2;


	let toptext = document.getElementById("top-text").value;
	let bottomtext = document.getElementById("bottom-text").value;

	var lineheight = 50;
	var lines = toptext.split('\n');

	for (var i = 0; i<lines.length; i++)
	{
		ctx.fillText(lines[i], canvas.width/2, 50 + (i * lineheight));
		ctx.strokeText(lines[i], canvas.width/2, 50 + (i * lineheight));
	}

	lines = bottomtext.split('\n');

	for (var i = 0; i<lines.length; i++)
	{
		ctx.fillText(lines[lines.length - 1 - i], canvas.width/2, canvas.height - 5 - (i * lineheight));
		ctx.strokeText(lines[lines.length - 1 - i], canvas.width/2, canvas.height - 5 - (i * lineheight));
	}
}

window.addEventListener("paste", async function(e) {
	e.preventDefault();
	e.stopPropagation();
	if(e.clipboardData.items[0].type.indexOf("image") === 0)
	{
		let file = e.clipboardData.items[0].getAsFile();
		displayUploadedImage(file);
	}
});