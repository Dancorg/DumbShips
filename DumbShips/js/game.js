
var canvas;
var stage;

var player1;
var player2;
var players;
var boxes;
var particles;
var coins;
var objectives;
var quadP;
var quadB;

var ai1,ai2;
var c1,c2;

var stats1;
var stats2;

var res1 = 0;
var res2 = 0;

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
var left = 0;
var right = 0;
var jump = 0;
var gui;
var ingame = false;
var startButton = false;
var endButton = true;
var diff;
var score1;
var score2;
var endtimer;
var maincounter;
var cw;  // canvas width
var ch;  // canvas height

var gamewidth = 800;
var gameheight = 600;

/*document.ontouchstart = handleTouchStart;
document.ontouchend = handleTouchEnd;
document.ontouchleave = handleTouchEnd;*/
document.onmousedown = handleMouseDown;
document.onmousemove = handleMouseMove;
document.onmouseup = handleMouseUp;
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function reset(){
	endButton = true;
	stage.removeAllChildren();
	boxes = [];
	players = [];
	particles = [];
	objectives = [];
	coins = [];
	score1 = 0;	
	score2 = 0;
	res1 = 0;
	res2 = 0;
	c1 = 0;
	c2 = 0;
	boxSpawn = 0;
	diff = 0;
	endtimer = -1;
	maincounter=0;
	stats1 = {"hp":100, "energy":100, "damage":25}; // jump speed, speed
	stats2 = {"hp":100, "energy":100, "damage":15}; // range, rate of fire, impulse, speed
}

function resizeCanvas(){
	var cwidth = $('#body').width();
	var cheight = $('#body').height();
	if(cwidth < gamewidth || cheight < gameheight){
		switchFullscreen();
		var minim = Math.min(cwidth,cheight*(4/3));
		var w = cwidth*(minim/cwidth);
		var h = cheight*(minim/((4/3)*cheight));
		$("#canvas").css({'width':w});
		$("#canvas").css({'height':h});
	}
	else{
		$("#canvas").css({'width':'800px'});
		$("#canvas").css({'height':'600px'});
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
	reset();
	ingame = false;
	Ticker.setPaused(true);
	var background = new Shape();
	background.graphics.beginRadialGradientFill(["#248","#080822"],[0.01,0.99],gamewidth/2,gameheight/2,50,gamewidth/2,gameheight/2,600).rect(0,0,gamewidth,gameheight);	background.cache(0,0,gamewidth,gameheight);
	stage.addChild(background);
	var startBox = new Shape();
	startBox.graphics.beginFill('rgba(10,10,10,0.5)').rect(0,15,gamewidth,86).beginFill('rgba(220,180,50,1)').rect(0,-8,gamewidth,86).beginFill('rgba(150,20,20,0.9)').rect(0,0,gamewidth,70);
	startBox.x=0;
	startBox.y=150;
	stage.addChild(startBox);
	var startText = new Text("Z-DJUTER", "45px impact", "#EEF");
	startText.textAlign = "center";
	startText.x = gamewidth/2;
	startText.y = 155;
	stage.addChild(startText);
	var startText2 = new Text("press any key to start", "10px Arial", "#EEF");
	startText2.textAlign = "center";
	startText2.x = gamewidth/2;
	startText2.y = 400;
	stage.addChild(startText2);
	stage.update();	
}

function menuScreen(){
	reset();
	ingame = false;
	stage.removeAllChildren();
	stage.update();
	ai1 = ai2 = false;
	var background = new Shape();
	background.graphics.beginRadialGradientFill(["#248","#080822"],[0.01,0.99],gamewidth/2,gameheight/2,50,gamewidth/2,gameheight/2,600).rect(0,0,gamewidth,gameheight);
	background.cache(0,0,gamewidth,gameheight);
	stage.addChild(background);
	
	var side1ai = new Text("PLAYER 1: HUMAN", "17px impact", "#AFF");
	side1ai.x = 10;
	side1ai.y = 60;
	
	var button1 = new Shape();
	button1.graphics.beginFill("rgba(10,10,10,0.25)").rect(10,60,150,45).beginFill("rgba(10,150,250,0.75)").rect(0,50,150,45);
	button1.addEventListener("click",function(e){
		if(ai1 == false){
			ai1=true;
			side1ai.text = "PLAYER 1: AI";
		}
		else {
			ai1 = false;
			side1ai.text = "PLAYER 1: HUMAN";
		}
		stage.update();
	});
	
	var side2ai = new Text("PLAYER 2: HUMAN", "17px impact", "#AFF");
	side2ai.x = 10;
	side2ai.y = 160;
	
	var button2 = new Shape();
	button2.graphics.beginFill("rgba(10,10,10,0.25)").rect(10,160,150,45).beginFill("rgba(10,150,250,0.75)").rect(0,150,150,45);
	button2.addEventListener("click",function(e){
		if(ai2 == false){
			ai2=true;
			side2ai.text = "PLAYER 2: AI";
		}
		else {
			ai2 = false;
			side2ai.text = "PLAYER 2: HUMAN";
		}
		stage.update();
	});
	
	var startText = new Text("PLAAAAAAAAAY", "21px impact", "#AFF");
	startText.x = 10;
	startText.y = 265;
	
	var startbutton = new Shape();
	startbutton.graphics.beginFill("rgba(10,10,10,0.25)").rect(10,260,150,65).beginFill("rgba(10,150,250,0.75)").rect(0,250,150,65);
	startbutton.addEventListener("click",function(e){
		startLevel();
	});
	stage.addChild(button1,button2,side1ai,side2ai,startbutton,startText);
	stage.update();
}

function startLevel(){
	reset();
	ingame = true;
	Ticker.setPaused(false);
	var background = new Shape();
	background.graphics.beginRadialGradientFill(["#080822","#248"],[0.1,0.9],gamewidth/2,gameheight/2,50,gamewidth/2,gameheight/2,600).rect(0,0,gamewidth,gameheight);
	background.cache(0,0,gamewidth,gameheight);
	stage.addChild(background);
	objectives = [Base(Math.random()*gamewidth/2, Math.random()*gameheight, 30),Base(Math.random()*gamewidth/2+gamewidth/2, Math.random()*gameheight, 30),Objective(gamewidth/4+Math.random()*gamewidth/2, Math.random()*gameheight, 70)];
	ene = Enemy(100,gameheight/2,stage, 1,stats1.hp,stats1.damage,stats1.energy);
	ene1 = Enemy(ene.x+50,ene.y,stage, 1,stats1.hp,stats1.damage,stats1.energy);
	ene2 = Enemy(ene.x-50,ene.y,stage, 1,stats1.hp,stats1.damage,stats1.energy);
	ene3 = Enemy(ene.x,ene.y+50,stage, 1,stats1.hp,stats1.damage,stats1.energy);
	ene4 = Enemy(ene.x,ene.y-50,stage, 1,stats1.hp,stats1.damage,stats1.energy);
	pl = new Player("Player 2",2, gamewidth-100, gameheight/2,"250,180,40", stage,stats2.hp,stats2.damage,stats2.energy);
	pl2 = new Player("Player 2",2, pl.x+50, pl.y,"250,180,40", stage,stats2.hp,stats2.damage,stats2.energy);
	pl3 = new Player("Player 2",2, pl.x-50, pl.y,"250,180,40", stage,stats2.hp,stats2.damage,stats2.energy);
	pl4 = new Player("Player 2",2, pl.x, pl.y+50,"250,180,40", stage,stats2.hp,stats2.damage,stats2.energy);
	pl5 = new Player("Player 2",2, pl.x, pl.y-50,"250,180,40", stage,stats2.hp,stats2.damage,stats2.energy);
	ene.assumeControl();
	pl.assumeControl();
	c1 = c2 = 5;
	players = [pl,pl2,pl3,pl4,pl5,ene,ene1,ene2,ene3,ene4];
	
	
	platformFirstSpawn();
	gui = new Container();
	quadP = Quadtree(0,[0,0,gamewidth,gameheight]);
	quadB = Quadtree(0,[0,0,gamewidth,gameheight]);
	
	scoreText1 = new Text("SCORE: ", "17px impact", "#AFF");
	scoreText1.x = 10;
	scoreText1.y = 5;
	scoreText2 = new Text("SCORE: ", "17px impact", "#AFF");
	scoreText2.x = gamewidth - 240;
	scoreText2.y = 5;
	
	reinfText1 = new Text("REINFORCE: ", "17px impact", "#AFF");
	reinfText1.x = 100;
	reinfText1.y = 5;
	reinfText2 = new Text("REINFORCE: ", "17px impact", "#AFF");
	reinfText2.x = gamewidth - 150;
	reinfText2.y = 5;
	
	energyText1 = new Text("ENERGY: ", "12px impact", "#AFF");
	energyText1.x = 10;
	energyText1.y = 25;
	energyText2 = new Text("ENERGY: ", "12px impact", "#AFF");
	energyText2.x = gamewidth - 240;
	energyText2.y = 25;
	
	hpText1 = new Text("HP: ", "12px impact", "#AFF");
	hpText1.x = 10;
	hpText1.y = 40;
	hpText2 = new Text("HP: ", "12px impact", "#AFF");
	hpText2.x = gamewidth - 240;
	hpText2.y = 40;
	
	hText1 = new Text("H: ", "12px impact", "#AFF");
	hText1.x = 90;
	hText1.y = 25;
	hText2 = new Text("H: ", "12px impact", "#AFF");
	hText2.x = gamewidth - 160;
	hText2.y = 25;
	
	eText1 = new Text("E: ", "12px impact", "#AFF");
	eText1.x = 90;
	eText1.y = 40;
	eText2 = new Text("E: ", "12px impact", "#AFF");
	eText2.x = gamewidth - 160;
	eText2.y = 40;
	
	dText1 = new Text("D: ", "12px impact", "#AFF");
	dText1.x = 130;
	dText1.y = 25;
	dText2 = new Text("D: ", "12px impact", "#AFF");
	dText2.x = gamewidth - 120;
	dText2.y = 25;
	
	scoreBack = new Shape();
	scoreBack.graphics.beginFill('rgba(50,180,250,0.35)').drawRoundRectComplex(0,0,250,60,0,0,20,0).drawRoundRectComplex(gamewidth-250,0,250,60,0,0,0,20)//.rect(0,0,150,30);
	gui.addChild(scoreBack, scoreText1, scoreText2, reinfText1, reinfText2, energyText1, energyText2,hpText1,hpText2,hText1,hText2,eText1,eText2,dText1,dText2);		
	stage.addChild(gui);
	//Box(gamewidth/2-20,80,60,15,stage,"up");

}

function tick(){
	maincounter++;
	if (endtimer > 0)endtimer--;
	diff += 0.0002;
	scoreText1.text = "SCORE1: " + score1;
	scoreText2.text = "SCORE2: " + score2;
	energyText1.text = "ENERGY: " + Math.round(player1.energy);
	energyText2.text = "ENERGY: " + Math.round(player2.energy);
	reinfText1.text = "REINFORCE: " + Math.round(res1/5)+"%";
	reinfText2.text = "REINFORCE: " + Math.round(res2/5)+"%";
	hpText1.text = "HP: " + Math.round(player1.hp);
	hpText2.text = "HP: " + Math.round(player2.hp);
	hpText1.color = player1.hp<60?player1.hp<30?"#F44":"#FAA":"#AFF"
	hpText2.color = player2.hp<60?player2.hp<30?"#F44":"#FAA":"#AFF"
	hText1.text = "H: " + Math.round(stats1.hp);
	hText2.text = "H: " + Math.round(stats2.hp);
	eText1.text = "E: " + Math.round(stats1.energy);
	eText2.text = "E: " + Math.round(stats2.energy);
	dText1.text = "D: " + Math.round(stats1.damage);
	dText2.text = "D: " + Math.round(stats2.damage);
	stage.setChildIndex(gui,0);
	
	quadP.clear();
	quadB.clear();
	for(var i in boxes){
		quadB.insert(boxes[i]);
	}
	for(var i in players){
		quadP.insert(players[i]);
	}
	
	//console.log(player2.vspeed, ((player2.left || player2.right)&&(player2.down || player2.up)));
	
	/*c1 = c2 = 0;
	for(var i in players){
		if(players[i].side == 1)c1++; else c2++;
	}*/
	
	for(var i = boxes.length-1;i >= 0;i--){
		boxes[i].update(i);
	}
	
	/*for(i in boxes){
		var box = boxes[i];
		box.y+=box.vspeed; //move the box

		if(box.y>gameheight+box.h){
			stage.removeChild(box);
			boxes.splice(i,1);//delete the box when out of screen
		}
		if(box.y<0-box.h){
			stage.removeChild(box);
			boxes.splice(i,1);//delete the box when out of screen
		}
	}*/
	
	for(var i = particles.length-1;i >= 0;i--){
		var part = particles[i];
		part.update(i);
	}
	
	for(i in coins){
		var c = coins[i];
		c.y++;
		if(player1.x < c.x+c.s && player1.x+player1.s > c.x && player1.y<c.y+c.s && player1.y+player1.s>c.y  ){
			score1 += 5;
			player1.energy += 10;
			coinExplosion(c.x,c.y);
			coins.splice(i,1);
			stage.removeChild(c);
		}
		if(player2.x < c.x+c.s && player2.x+player2.s > c.x && player2.y<c.y+c.s && player2.y+player2.s>c.y  ){
			score2 += 5;
			player2.energy += 10;
			coinExplosion(c.x,c.y);
			coins.splice(i,1);
			stage.removeChild(c);
		}
	}
	for(var i = players.length-1;i >= 0;i--){
		var p = players[i];
		p.update(i);
	}	
	if(res1 >= 500){
		res1-=500;
		c1++;
		players.push(Enemy(0,gameheight/2,stage, 1, stats1.hp,stats1.damage,stats1.energy));
		//players.push(Player("Player 1",1, 0, gameheight/2,"220,50,80", stage, stats1.hp,stats1.damage,stats1.energy));
	}
	if(res2 >= 500){
		res2-=500;
		c2++;
		players.push(Player("Player 2",2, gamewidth, gameheight/2,"250,180,40", stage, stats2.hp,stats2.damage,stats2.energy));
		//players.push(Enemy(gamewidth,gameheight/2,stage, 2, stats2.hp,stats2.damage,stats2.energy));
	}
	for(i in objectives){
		var o = objectives[i];
		o.update();
	}
	if(endButton && (c1==0 || c2==0))endRound();
	stage.update();
}

function updateStats(){
	for(var i in players){
		var p = players[i];
		var stats;
		if(p.side == 1){stats = stats1;}
		else {stats = stats2};
		p.maxhp = stats.hp;
		p.damage = stats.damage;
		p.energy = stats.energy;
		
	}
}


function platformFirstSpawn(){
	var x,y,w,h;
	for(var i=0; i<20; i++){
		h = Math.round(Math.round(Math.random()*8)*10+10);
		w = Math.round(Math.round(Math.random()*8)*10+10);
		x = Math.round(Math.round(Math.random()*gamewidth/10)*10-w);
		y = Math.round(Math.round((Math.random()*(gameheight-80-h))/10)*10+80);
		Box(x,y,w,h, stage, 0,0);
	}
}

function boxCollision(a,b,h,v){
	var ah = a.hspeed*h;
	var av = a.vspeed*v;
	var ax = a.x;
	var ay = a.y;
 	var div = Math.max(Math.abs(ah), Math.abs(av));
	if(div == 0)div = 1;
	for(var i=0; i<div; i++){
		px = a.x + i*ah/div;
		py = a.y + i*av/div;
		if(ax+i*ah/div < b.x+b.w && ax+a.w+i*ah/div > b.x && ay+i*av/div<b.y+b.h && ay+a.h+i*av/div>b.y ){
			return true;
		}
	}
	return false;
}

function boxCollision2(a,b,h,v){
	var ah = a.hspeed*h;
	var av = a.vspeed*v;
	var ax = a.x-a.hspeed*(1-1*h);
	var ay = a.y-a.vspeed*(1-1*v);
 	var div = Math.max(Math.abs(ah), Math.abs(av));
	if(div == 0)div = 1;
	for(var i=0; i<div; i++){
		px = a.x + i*ah/div;
		py = a.y + i*av/div;
		if(ax+i*ah/div < b.x+b.w && ax+a.w+i*ah/div > b.x && ay+i*av/div<b.y+b.h && ay+a.h+i*av/div>b.y ){
			return true;
		}
	}
	return false;
}

function playerColllision(playera, b){
	if(boxCollision(playera, b,1,1)){
		var hor = true;
		var ver = true;
		/*if(boxCollision2(playera, b,1,0)){
			hor = true;
		}
		if(boxCollision2(playera, b,0,1)){
			ver = true;
		}*/	
		if(hor){
			b.hspeed += playera.hspeed;
			//playera.x -= playera.hspeed;
			playera.hspeed += -playera.hspeed;
			//playera.x += playera.x<b.x?-((playera.x+playera.w)-b.x):((b.x+b.w)-playera.x);
			//b.x += b.x<playera.x?-((b.x+b.w)-playera.x):((playera.x+playera.w)-b.x);
		}
		if(ver){
			b.vspeed += playera.vspeed;
			//playera.y -= playera.vspeed;
			playera.vspeed += -playera.vspeed;
			//playera.y += playera.y<b.y?-((playera.y+playera.h)-b.y):((b.y+b.h)-playera.y);
			//b.y += b.y<playera.y?-((b.y+b.h)-playera.y):((playera.y+playera.h)-b.y);
		}
		playera.other = b;
		b.other = playera;
		return b;
	}	
}

function preciseColllision(player, b){
	if(boxCollision(player, b,1,1)){
		if(py<b.y){
			if(player.vspeed > 0)
				player.vspeed = 0
				//player.y-=0.1;
				player.y = b.y-player.s;
		}
		if(px+player.s*0.5<b.x){ 
			if(player.hspeed > 0)
				player.hspeed = 0;
				//player.x-=0.1;
				player.x = b.x-player.s;
		}
		if(px+player.s*0.5>b.x+b.w){
			if(player.hspeed < 0)
				player.hspeed = 0;
				//player.x+=0.1;
				player.x = b.x +b.w;
		}
		else if(py+player.s>b.y+b.h){
			if(player.vspeed < 0)
				player.vspeed = 0;
				//player.y+=0.1;
				player.y = b.y +b.h;
		}
	}
}

function degToRad(deg){
	return deg * (Math.PI/180);
}

function radToDeg(rad){
	return rad / (Math.PI/180);
}

function endRound(){
	endtimer = 60;
	var deathText = new Text("", "30px Impact", "#FFF");
	if(c1 == 0)deathText.text="PLAYER 2 WINS";
	if(c2 == 0)deathText.text="PLAYER 1 WINS";
	if(c1 == 0 && c2==0)deathText.text="DRAW";	
	deathText.textAlign = "center";
	deathText.x = gamewidth/2;
	deathText.y = 156;
	
	var deathBox = new Shape();
	deathBox.graphics.beginFill('rgba(200,50,50,0.1)').rect(0,-20,gamewidth,90).beginFill('rgba(10,10,10,0.8)').rect(0,-3,gamewidth,56).beginFill('rgba(200,50,50,0.7)').rect(0,0,gamewidth,50);
	deathBox.x = 0;
	deathBox.y = 150;
	gui.addChild(deathBox);
	gui.addChild(deathText);
	stage.update();
	endButton = false;
}

function coinExplosion(x,y){
	for(var i=0;i<10;i++){
		Particle(x+i,y+Math.random()*10,3,Math.random()*20-10,Math.random()*20-10,'rgba(200,170,30,1)',stage, false, 120);
	}
}

function boxExplosion(a,b){ //platform explosion
	for(var i=0;i<Math.ceil(a.w*0.1);i++){
		Particle(a.x+i*10,a.y+Math.random()*a.h,5,Math.random()*20-10,Math.random()*30-15,a.color,stage, true, 120);
	}
	for(var i=0;i<Math.ceil(b.w*0.1);i++){
		Particle(b.x+i*10,b.y+Math.random()*b.h,5,Math.random()*20-10,Math.random()*30-15,b.color,stage, true, 120);
	}
}

/*Array.prototype.remove = function(from, to) {
   var rest = this.slice((to || from) + 1 || this.length);
   this.length = from < 0 ? this.length + from : from;
   return this.push.apply(this, rest);
   };*/