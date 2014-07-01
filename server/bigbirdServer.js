var http = require('http');
var fs = require('fs');
var child_process = require('child_process');

var busy = false;

http.createServer(function (req, res) {

	console.log('request received');

	if (busy) {

		res.writeHead(502, 'Overloaded: image capture already in progress');
		res.end();

		return;
	}

	busy = true;

	var capture = child_process.spawn('./capture');
	
	capture.on('error', function(err) {

		console.log('error spawning capture program: ' + err);

		res.writeHead(501, 'error spawning capture program: ' + err);
		res.end();

		busy = false;
	});

	capture.on('exit', function (code) {

		busy = false;

		if (code != 0) {

			console.log('error capturing image file: ' + code);

			res.writeHead(501, 'error capturing image file: ' + code);
			res.end();

			return;
		}

		fs.readFile('capture.png', function (err, frame) {

			if (err) {

				console.log('error reading image file: ' + err);
				
				res.writeHead(501, 'error reading image file: ' + err);
				res.end();

				return;
			}

			res.writeHead(200, {'content-type':'image/png'});
  			res.end(frame);

  			console.log('sent');

			fs.unlink('capture.png');
		});
		
	});

}).listen(8085);