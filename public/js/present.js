$(document).ready(function() {
	var socket = io.connect(), width = 1, height = 1, isDrawing = false;

	$("body").on('mousedown touchstart', function() {
		return false;
	});

	$("#draw").on('touchend', function() {
		$("#draw").toggleClass("active");
		isDrawing = !isDrawing;
		socket.emit('relay-draw', isDrawing);
	});

	socket.on('present-connect', function(data) {
		var ratio = data.height / data.width;

		$('h1').hide();
		$('#scroller').css('height', (94 * ratio) + '%').show().unbind();

		height = $('#scroller').height()
		width = $('#scroller').width()

		$('#scroller').on('dragstart', function(e) {
			socket.emit('relay-dragstart', {
				x: (e.touches[0].x) / width,
				y: (e.touches[0].y) / height
			});
		}).on('drag', function(e) {
			socket.emit('relay-drag', {
				direction: e.direction,
				distanceX: (e.distanceX / width),
				distanceY: (e.distanceY / height)
			});
		}).on('dragend', function(e) {
			socket.emit('relay-dragend', {
				direction: e.direction,
				distance: e.distance
			});
		}).on('transformstart', function(e) {
			socket.emit('relay-transformstart', {
				scale: e.scale,
				rotation: e.rotation
			});
		}).on('transform', function(e) {
			socket.emit('relay-transform', {
				scale: e.scale,
				rotation: e.rotation
			});
		}).on('transformend', function(e) {
			socket.emit('relay-transformend', {
				scale: e.scale,
				rotation: e.rotation
			});
		}).on('hold', function(e) {
			socket.emit('relay-hold');
		}).on('tap', function(e) {
			socket.emit('relay-tap');
		});
	});
});
