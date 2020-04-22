let paste = false;

function upload() {
	document.getElementById("upload-button").addEventListener("change", displayUploadedImage, false);
	document.getElementById('upload-button').click();
}

function displayUploadedImage(file) {
	let selectedFile;

	if(!paste)
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
		fix_dpi(canvas);
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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

function createText2() {
	let canvas = document.getElementById("user-image-overlay");
	fix_dpi(canvas);

	var ctx = canvas.getContext("2d");
	ctx.textAlign = 'center';

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let img = document.getElementById("user-image");
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	let fontsize = Math.floor((canvas.width + canvas.height) / 18);
	ctx.font = fontsize + "px Impact, Anton, sans-serif";
	ctx.fillStyle = 'white';
	ctx.lineWidth = 2;


	// let toptext = document.getElementById("top-text").value;
	// let bottomtext = document.getElementById("bottom-text").value;
	let toptext = getWrapped(ctx, document.getElementById("top-text").value, canvas.width);
	let bottomtext = getWrapped(ctx, document.getElementById("bottom-text").value, canvas.width);

	let lines = toptext.split('\n');

	for (var i = 0; i<lines.length; i++)
	{
		ctx.fillText(lines[i], canvas.width/2, fontsize + (i * fontsize));
		ctx.strokeText(lines[i], canvas.width/2, fontsize + (i * fontsize));
	}

	lines = bottomtext.split('\n');

	for (var i = 0; i<lines.length; i++)
	{
		ctx.fillText(lines[lines.length - 1 - i], canvas.width/2, canvas.height - fontsize/3 - (i * fontsize));
		ctx.strokeText(lines[lines.length - 1 - i], canvas.width/2, canvas.height - fontsize/3 - (i * fontsize));
	}
}

window.addEventListener("paste", async function(e) {
	for(let i = 0; i < e.clipboardData.items.length; ++i)
	{
		if(e.clipboardData.items[i].type.indexOf("image") === 0)
		{
			e.preventDefault();
			e.stopPropagation();

			paste = true;
			let file = e.clipboardData.items[i].getAsFile();
			displayUploadedImage(file);
			break;
		}
	}
});

//todo; \n doesn't reset width, account for that
function getWrapped(ctx, text, maxWidth) {
	var words = text.split(" ");
	var lines = [];
	var currentLine = words[0];

	for (var i = 1; i < words.length; i++) {
		var word = words[i];
		var width = ctx.measureText(currentLine + " " + word).width;
		if (width < maxWidth) {
			currentLine += " " + word;
	        } else {
			lines.push(currentLine);
			currentLine = word;
		}
	}
	lines.push(currentLine);

	let wrapped = "";
	for(var i = 0; i < lines.length; i++)
	{
		if(i > 0) wrapped += "\n";
		wrapped += lines[i];
	}

	return wrapped;
}