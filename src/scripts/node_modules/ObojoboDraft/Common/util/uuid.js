export default function() {
	//https://gist.github.com/jed/982883
	var getId = function(a) { if (a) { return (a^((Math.random()*16)>>(a/4))).toString(16); } else { return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,getId); } };
	return getId();
};