var EasyPromise = require('./EasyPromise.js').EasyPromise;


function async1(){
	var p = new EasyPromise();
	setTimeout(function(){
		p.resolve(1);
	},2000);
	return p;
};

async1().then(function(data){
	console.log(data == 1);
});