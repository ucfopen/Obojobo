// Simply calls `webpack -p`, but looks for the file since it can either be in node_modules or ../node_modules (if installed elsewhere)

var fs = require('fs');
var exec = require('child_process').exec;

fs.stat('./node_modules/webpack/bin/webpack.js', function(err, stat) {
	if(err == null)
	{
		exec('./node_modules/webpack/bin/webpack.js -p', function(err, stdout, stderr) {
			console.log(stdout);
		});
	}
	else
	{
		fs.stat('../node_modules_webpack/bin/webpack.js', function(err, stat) {
			if(err == null)
			{
				exec('../node_modules/webpack/bin/webpack.js -p', function(err, stdout, stderr) {
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