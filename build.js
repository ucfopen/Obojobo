// Simply calls `webpack`, but looks for the file since it can either be in node_modules or ../ (if installed as a module)

var fs = require('fs');
var exec = require('child_process').exec;

fs.stat('./node_modules/webpack/bin/webpack.js', function(err, stat) {
	if(err == null)
	{
		exec('./node_modules/webpack/bin/webpack.js', function(err, stdout, stderr) {
			console.log(stdout);
		});
	}
	else
	{
		fs.stat('../webpack/bin/webpack.js', function(err, stat) {
			if(err == null)
			{
				exec('../webpack/bin/webpack.js', function(err, stdout, stderr) {
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