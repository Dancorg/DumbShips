var stage;
var canvas;
var ships;
var missiles;
var cw;
var ch;
var quad;

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
	if(cwidth < 800 || cheight < 400){
		switchFullscreen();
		var minim = Math.min(cwidth,cheight*(2/1));
		var w = cwidth*(minim/cwidth);
		var h = cheight*(minim/((2/1)*cheight));
		$("#canvas").css({'width':w});
		$("#canvas").css({'height':h});
	}
	else{
		$("#canvas").css({'width':'800px'});
		$("#canvas").css({'height':'400px'});
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

function missile(x,y,vo,owner, angle){
	var shape = new Shape();
	shape.x = x;
	shape.y = y;
	shape.r = 5;
	shape.hp = 1;
	shape.side = owner.side;
	shape.speed = vo;
	shape.rotation = angle;
	shape.target = closest(x,y,ships,shape.side);
	shape.counter = [240];
	shape.color = owner.side==1?"0,150,255":"200,0,0";
	shape.graphics.setStrokeStyle(2,"round").beginStroke('rgba('+shape.color+',0.95)').moveTo(0,0).lineTo(0+5,0);
	shape.cache(-4,-4,13,8);
	shape.update = function(i){
		this.counter[0]--;
		this.rotation+=Math.random()*10-5;
		var rad = this.rotation*(Math.PI/180);
		var xComp = Math.cos(rad);
		var yComp = Math.sin(rad);
		if(this.target){
			var turn = whichSide(this.x,this.y,this.x+xComp,this.y+yComp,this.target.x,this.target.y);
			this.rotation += 2*turn;
		}
		this.x = (this.x + this.speed*xComp + 800)%800;
		this.y = (this.y + this.speed*yComp + 400)%400;
		var obs = quad.retrieve(this);
		for(var j in obs){
			var ob = obs[j];
			if(this.side != ob.side && collisionCircle(this.x,this.y,this.r,ob.x,ob.y,ob.r)){
				this.hp--;
				ob.hp--;
				console.log(ob.hp);
			}
		}
		if(this.counter[0] == 0 || this.hp <= 0)this.death(i);		
		
	}
	shape.death = function(i){
		stage.removeChild(this);
		missiles.splice(i,1);
	}
	missiles.push(shape);
	stage.addChild(shape);
	return shape;
}

function nave(x,y,side,control){
	var shape = new Shape();
	shape.x = x;
	shape.y = y;
	shape.r = 5;
	shape.hp = 5;
	shape.counter = [10,0];
	shape.controllable = control;
	shape.side = side;
	shape.color = side==1?"0,100,250":"150,0,0";
	shape.graphics.setStrokeStyle(2,"round").beginStroke('rgba('+shape.color+',0.9)').drawPolyStar(0,0,5,3,0,0);
	shape.cache(-10,-10,20,20);
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
			//inputTest();
			//console.log(this.slow);
		}
		else{
			this.left = this.right = this.acel = this.slow = false;
			var target = closest(this.x, this.y, ships, this.side );
			if(target){
				var turn = whichSide(this.x,this.y,this.x+Math.cos(this.rotation*(Math.PI/180)),this.y+Math.sin(this.rotation*(Math.PI/180)),target.x,target.y);
				if(turn == -1) this.left = true;
				if(turn == 1) this.right = true;
				//this.attack = true;
				if(pointDistanceSquared(this.x,this.y,target.x,target.y)>5000){
					this.acel = 0.01;
					this.slow = 0;
				}
				else{
					this.acel = 0;
					if(this.speed > 0.5)this.slow = 0.05;
				}
			}
		}
		this.speed += this.acel*2 - this.slow ;
		this.speed *= 1 - 0.01*Math.abs(this.right - this.left);
		this.rotation += (this.right - this.left) * (5/(1+this.speed));
		
		var rad = this.rotation*(Math.PI/180);
		//console.log(cw);
		this.x = (this.x + this.speed*Math.cos(rad) + 800)%800;
		this.y = (this.y + this.speed*Math.sin(rad) + 400)%400;
		
		if(this.attack && this.counter[0] == 0){
			this.counter[0] = 60;
			missile(this.x, this.y,this.speed+3,this,this.rotation);
			if(this.counter[1]==0){
				this.counter[1] = 240;
				for(var j=-60; j<=60; j+=30){
					missile(this.x, this.y,this.speed+2,this,this.rotation+j);
				}
			}
			else{
				if(this.counter[1]<240)this.counter[1]+=10;
			}
		}
		if(this.counter[0]>0)this.counter[0]--;
		if(this.counter[1]>0)this.counter[1]--;
		if(this.hp <= 0)this.death(i);		
	};
	shape.death = function(i){
		stage.removeChild(this);
		ships.splice(i,1);
	}
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
	missiles = [];
	quad = Quadtree(0,[0,0,800,400]);
	nave(10,10,1,true);
	nave(250,50,2,true);
}

function tick(){
	quad.clear();
	for (var i in ships){
		quad.insert(ships[i]);
	}
	for (var i in missiles){
		quad.insert(missiles[i]);
	}
	for(var i = ships.length-1;i >= 0;i--){
		ships[i].update(i);
	}
	for(var i = missiles.length-1;i >= 0;i--){
		missiles[i].update(i);
	}
	stage.update();

}

function pointDistanceSquared(x1,y1,x2,y2){
	return ((x1-x2)*(x1-x2)) + ((y1-y2)*(y1-y2));
}

function collisionCircle(x1,y1,r1,x2,y2,r2){
	return pointDistanceSquared(x1,y1,x2,y2) <= (r1+r2)*(r1+r2);
}

function whichSide(x1,y1,x2,y2,x3,y3){
	var side = (((x2-x1)*(y3-y1))-((y2-y1)*(x3-x1))) > 0? 1: -1;	
	return side;
}

function closest(x,y,list,side){
	var minDist = 100000000000000;
	var curr = null;
	for (var i in list){
		var o = list[i];
		var dist = pointDistanceSquared(x,y,o.x,o.y);
		if(o.side != side && dist<minDist){
			curr = o;
			minDist = dist;
		}
	}
	return curr;
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


function inputTest(){
	var tx = ch/4 - 170;
	var ty = ch/4 + 50;
	console.log(ch/4);
	if(tx < ch/2 && ty < ch/2){
		var hor = ch/4 - ty;
		left1 = right1 = 0;
		if(hor < 0)left1 = hor/(ch/4); else right1 = -hor/(ch/4);
		var ver = ch/4 - tx;
		acel1 = slow1 = 0;
		if(ver < 0)slow1 = ver/(200*ch/4); else acel1 = -ver/(100*ch/4);
	}
}

function handleTouchStart(e){
	e.preventDefault();
	/*var canvasx = canvas.offsetLeft;
	var canvasY = canvas.offsetTop;*/
	var pad1x = ch/4;
	var pad1y = ch/4;
	var pad2x = cw - ch/4;
	var pad2y = ch/4;
	
	var	touches = e.changedTouches;
	for(var i in touches){
		var touch = touches[i];
		if(touch.pageX < ch/2 && touch.pageY < ch/2){
			var hor = pad1x - touch.pageY;
			left1 = right1 = 0;
			if(hor < 0)left1 = hor/(pad1x); else right1 = -hor/(pad1x);
			var ver = pad1x - touch.pageX;
			acel1 = slow1 = 0;
			if(ver < 0)slow1 = ver/(200*pad1x); else acel1 = -ver/(100*pad1x);
		}
		if(touch.pageX < ch/2 && touch.pageY > ch/2){
			attack1 = true;
		}
		
		if(touch.pageX > cw - ch/2 && touch.pageY < ch/2){
			var hor = ch/4 - touch.pageY;
			left2 = right2 = 0;
			if(hor < 0)left2 = -hor/(ch/4); else right2 = hor/(ch/4);
			var ver = pad2x - touch.pageX;
			acel2 = slow2 = 0;
			if(ver < 0)slow2 = -ver/(200*ch/4); else acel2 = ver/(100*ch/4);
		}
		if(touch.pageX > cw - ch/2 && touch.pageY > ch/2){
			attack2 = true;
		}
		if(touch.pageX  >cw/2)console.log("placeholder2");;
	}
}

function handleTouchEnd(e){
	e.preventDefault();
	/*var canvasx = canvas.offsetLeft;
	var canvasY = canvas.offsetTop;*/
	var	touches = e.changedTouches;
	for(var i in touches){
		var touch = touches[i];
		if(touch.pageX < ch/2 && touch.pageY < ch/2){
			left1 = right1 = 0;
			acel1 = slow1 = 0;
		}
		if(touch.pageX < ch/2 && touch.pageY > ch/2){
			attack1 = false;
		}
		if(touch.pageX > cw - ch/2 && touch.pageY < ch/2){
			left2 = right2 = 0;
			acel2 = slow2 = 0;
		}
		if(touch.pageX > cw - ch/2 && touch.pageY > ch/2){
			attack2 = false;
		}
	}
}