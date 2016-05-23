// Simply calls `webpack -p`, but looks for the file since it can either be in node_modules or ../ (if installed elsewhere)

var fs = require('fs');
var exec = require('child_process').exec;

exec('pwd', function(err, stdout, stderr) {
	console.log('PWD');
	console.log(stdout);
});

fs.stat('./node_modules/webpack/bin/webpack.js', function(err, stat) {
	if(err == null)
	{
		exec('./node_modules/webpack/bin/webpack.js -p', function(err, stdout, stderr) {
			console.log(stdout);
		});
	}
	else
	{
		fs.stat('../webpack/bin/webpack.js', function(err, stat) {
			if(err == null)
			{
				exec('../webpack/bin/webpack.js -p', function(err, stdout, stderr) {
					console.log(stdout);
				});
			}
			else
			{
				console.error('Failed to build!');
			}
		});
	}
});