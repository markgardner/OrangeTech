var socket = io.connect('http://localhost:3000'), perc, present, presentTransform, allowY, dir, isOverview = false, isDrawing = false, ctx = document.getElementById('canvas').getContext("2d");
var startPoint, currentPoint, width = $('.present').width(), height = $('.present').height();
var glCanvas = WebGLExample('webgl_canvas');
socket.emit('relay-present-connect', { width: width, height: height });

socket.on('drawstart', function() {
	ctx.clearRect(0, 0, 1000, 1000);
	ctx.strokeStyle = "#00ff00";
	ctx.lineWidth = 15;
	isDrawing = true;
});

socket.on('drawend', function() {
	ctx.clearRect(0, 0, 1000, 1000);
	isDrawing = false;
});

socket.on('dragstart', function (e) {
	present = $("section.present");
	allowY = present.parent().hasClass("stack");
	perc = 0;
	startPoint = currentPoint = {
		x: e.x * width,
		y: e.y * height
	};
});

socket.on('drag', function (pos) {
	if(isDrawing) {
		var point = {
			x: (pos.distanceX * width) + startPoint.x,
			y: (pos.distanceY * height) + startPoint.y
		}

		ctx.save();
		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.moveTo(currentPoint.x,currentPoint.y);
		ctx.lineTo(point.x,point.y);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

		currentPoint = point;
	} else {
		var deg, deg2
		dir = pos.direction;
		if(allowY && (dir === "up" || dir === "down")) {
			perc = pos.distanceY;
			deg = Math.round(perc * /*50*/25) * -1;
			deg2 = Math.round(perc * /*70*/35);

			if(!isOverview) {
				present.css('-webkit-transform', 'translate3d(0, ' + deg + '%, 0) rotateX(' + deg2 + 'deg) translate3d(0, ' + deg + '%, 0)');
				present.css('opacity', 1 - Math.abs(perc));
			}
		} else {
			perc = pos.distanceX;
			deg = Math.round(perc * /*100*/50) * -1;
			deg2 = Math.round(perc * /*90*/45) * -1;

			if(!isOverview) {
				present.css('-webkit-transform', 'translate3d(' + deg + '%, 0, 0) rotateY(' + deg2 + 'deg) translate3d(' + deg + '%, 0, 0)');
				present.css('opacity', 1 - Math.abs(perc));
			}
		}
	}
});

socket.on('dragend', function (pos) {
	if(!isOverview) {
		present.attr('style', 'display: block;');
	}

	if(Math.abs(perc) > .5) {
		if(dir === "up") {
			Reveal.navigateUp();
		} else if(dir === "down") {
			Reveal.navigateDown();
		} else if(dir === "right") {
			Reveal.navigateRight();
		} else {
			Reveal.navigateLeft();
		}
	}
});
socket.on('transformstart', function() {
	if(!isOverview) {
		if((present = $("section.present #tiger-container")).length) {
			presentTransform = function(pos) {
				window.tigerGroup.setAttribute('transform', 'translate(350, 200) rotate(' + pos.rotation + ', 150, 150) scale(' + pos.scale + ')');
			};
			present.attr('style', 'display: block;');
		} else if((present = $("section.present #webgl_canvas")).length) {
			presentTransform = glCanvas.transform;
		} else {
			presentTransform = null;
		}
	}
});
socket.on('transform', function(pos) {
	if(!isOverview && presentTransform) {
		presentTransform(pos);
	}
});
socket.on('transformend', function() {
	if(!isOverview) {
		presentTransform = null;
		present = null;
	}
});
socket.on('hold', function() {
	if(isDrawing) {
		return;
	}

	isOverview = true;
	Reveal.toggleOverview();
});
socket.on('tap', function() {
	if(isOverview) {
		Reveal.toggleOverview();
		isOverview = false;
	}
});