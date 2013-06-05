var stage;
var canvas;
var ships;
var cw;
var ch;

var keyup = 38;
var keyleft = 37;
var keyright = 39;
var keydown = 40;
var keyintro = 13;
var keyw = 87;
var keya = 65;
var keyd = 68;
var keys = 83;
var keyspace = 32;

var acel1 = 0;
var acel2 = 0;
var slow1 = 0;
var slow2 = 0;
var left1 = 0;
var left2 = 0;
var right1 = 0;
var right2 = 0;
var attack1 = 0;
var attack2 = 0;

document.ontouchstart = handleTouchStart;
document.ontouchend = handleTouchEnd;
/*document.ontouchleave = handleTouchEnd;
document.onmousedown = handleMouseDown;
document.onmouseup = handleMouseUp;*/
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function resizeCanvas(){
	var cwidth = $('#screen').width();
	var cheight = $('#screen').height();
	if(cwidth < 640 || cheight < 480){
		switchFullscreen();
		var minim = Math.min(cwidth,cheight*(4/3));
		var w = cwidth*(minim/cwidth);
		var h = cheight*(minim/((4/3)*cheight));
		$("#canvas").css({'width':w});
		$("#canvas").css({'height':h});
	}
	else{
		$("#canvas").css({'width':'640px'});
		$("#canvas").css({'height':'480px'});
	}
	cw = cwidth;
	ch = cheight;

}

function switchFullscreen(){
	body = document.getElementById("body");
	if (body.requestFullScreen) {  
	  body.requestFullScreen();  
	} else if (body.mozRequestFullScreen) {  
	  body.mozRequestFullScreen();  
	} else if (body.webkitRequestFullScreen) {  
	  body.webkitRequestFullScreen();  
	} 
}

function nave(x,y,side,control){
	var shape = new Shape();
	shape.x = x;
	shape.y = y;
	shape.controllable = control;
	shape.side = side;
	shape.color = side==1?"0,100,250":"150,0,0";
	shape.graphics.beginFill('rgba('+shape.color+',0.9)').drawPolyStar(0,0,10,3,0,0);
	//shape.cache(-3,-3,10+6,10+6);
	shape.dir = side==1?0:180;
	shape.rotation = shape.dir;
	shape.speed = 1;
	shape.update = function(i){
		if(this.controllable){
			if(side == 1){
				this.left = left1; this.right = right1; this.acel = acel1; this.slow = slow1; this.attack = attack1;
			}
			if(side == 2){
				this.left = left2; this.right = right2; this.acel = acel2; this.slow = slow2; this.attack = attack2;
			}
			console.log(this.slow);
			this.speed += this.acel - this.slow ;
			this.speed *= 1 - 0.01*Math.abs(this.right - this.left);
			this.rotation += (this.right - this.left) * (5/(1+this.speed));
		}
		this.x += this.speed*Math.cos(this.rotation*(Math.PI/180));
		this.y += this.speed*Math.sin(this.rotation*(Math.PI/180));
	};
	stage.addChild(shape);
	ships.push(shape);
	return shape;
}

function init(){	
	$(window).resize(function(){resizeCanvas();});
	setTimeout(resizeCanvas,1);
	
	canvas = document.getElementById('canvas');
	stage = new Stage(canvas);
	stage.snapToPixelEnabled = true;
	stage.mouseEventsEnabled = true;
	canvas.addEventListener("touchstart",handleTouchStart,false);
	canvas.addEventListener("touchend",handleTouchEnd,false);
	Ticker.setFPS(60);
	Ticker.addListener(window);
	startMenu();
}

function startMenu(){
	startLevel();
}

function startLevel(){
	ships = [];
	nave(10,10,1,true);
	nave(250,50,2,true);
}

function tick(){
	for(var i in ships){
		ships[i].update(i);
	}
	stage.update();

}

function handleKeyDown(e){
	switch(e.keyCode){
		case keyup:
			acel1 = 0.01;return;
		case keyw:
			acel2 = 0.01;return;
		case keyleft:
			left1 = 1;return;
		case keya:
			left2 = 1;return;
		case keyright:
			right1 = 1;return;
		case keyd:
			right2 = 1;return;
		case keydown:
			slow1 = 0.01;return;
		case keys:
			slow2 = 0.01;return;
		case keyintro:
			attack1 = 1;return;
		case keyspace:
			attack2 = 1;return;
	}
}

function handleKeyUp(e){
	switch(e.keyCode){
		case keyup:
			acel1 = 0;return;
		case keyw:
			acel2 = 0;return;
		case keyleft:
			left1 = 0;return;
		case keya:
			left2 = 0;return;
		case keyright:
			right1 = 0;return;
		case keyd:
			right2 = 0;return;
		case keydown:
			slow1 = 0;return;
		case keys:
			slow2 = 0;return;
		case keyintro:
			attack1 = 0;return;
		case keyspace:
			attack2 = 0;return;
	}
}

function handleTouchStart(e){
	e.preventDefault();
	var canvasx = canvas.offsetLeft;
	var canvasY = canvas.offsetTop;
	var	touches = e.changedTouches;
	for(var i in touches){
		var touch = touches[i];
		if(touch.pageX  <cw/2)left = true;
		if((touch.pageX  >=cw/2-50 && touch.pageX  <=cw/2+50) || touch.pageY<ch/2){
			console.log("placeholder1");
		}
		if(touch.pageX  >cw/2)console.log("placeholder2");;

	}
}

function handleTouchEnd(e){
	e.preventDefault();
	var canvasx = canvas.offsetLeft;
	var canvasY = canvas.offsetTop;
	var	touches = e.changedTouches;
	for(var i in touches){
		var touch = touches[i];
		if(touch.pageX  <cw/2)left = false;
		if((touch.pageX  >=cw/2-50 && touch.pageX  <=cw/2+50) || touch.pageY<ch/2){
			console.log("placeholder3");
		}
		if(touch.pageX  >cw/2)console.log("placeholder4");;
	}
}