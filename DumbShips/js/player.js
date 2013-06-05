function Player(name, side, x, y, color, stage,hp,damage,energy){
	var shape = new Shape();
	var s = 10;
	shape.controlled = false;
	shape.side = side;
	shape.isAlive = true;
	shape.color = 'rgba('+color+',1)';
	shape.graphics.beginFill(shape.color).rect(0,0,s,s).beginFill('rgba('+color+',0.1)').rect(-3,-3,s+6,s+6);
	shape.s = s;
	shape.w = s;
	shape.h = s;
	shape.x = x;
	shape.y = y;
	shape.melee = false;
	shape.other = null; // stores the other player it is colliding with
	shape.maxspeed = 2;
	shape.hp = hp;
	shape.maxhp = hp;
	shape.left = 0;
	shape.right = 0;
	shape.up = 0;
	shape.down = 0;
	shape.energy = 0;
	shape.firerate = 5;
	shape.maxenergy = energy;
	shape.damage = damage;
	shape.attack = false;
	shape.angle = 0;
	shape.cache(-3,-3,s+6,s+6);
	shape.snapToPixel = true;
	shape.vspeed = 0;
	shape.hspeed = 0;
	shape.speedfactor = 1;
	shape.acelfactor = 1;
	shape.target = null;
	shape.formx = Math.round(Math.random()*60);
	shape.formy = Math.round(Math.random()*60);
	shape.counters = [0,0,0];
	shape.update = playerUpdate;
	shape.ai = aiSUpdate;
	shape.defaultai = aiSUpdate;
	shape.death = playerDeath;
	shape.assumeControl = assumeControl;
	shape.abandonControl = abandonControl;
	shape.switchSides = switchSides;
	shape.halo = new Shape();
	shape.halo.graphics.setStrokeStyle(1, "round").beginStroke(shape.color).drawCircle(0,0,s-1);
	shape.halo.x = shape.x;
	shape.halo.y = shape.y;
	shape.halo.regX = -s/2;
	shape.halo.regY = -s/2;
	stage.addChild(shape.halo);
	stage.addChild(shape);
	return shape;
}

var playerDeath = function(j){
	this.isAlive = false;
		//endtimer = 30;	
		if(this.controlled){
			if(this.side == 1)setNewPlayer(1);
			else setNewPlayer(2);
		}
		stage.removeChild(this);
		stage.removeChild(this.halo);
		for(var i=0;i<10;i++){
			Particle(this.x+i,this.y+Math.random()*10,6,Math.random()*20-10,Math.random()*20-10,'rgba(180,40,40,1)',stage, false, 40);
		}
		players.splice(j,1);
		if(this.side == 1)c1--;
		else c2--;
}

var playerUpdate = function(j){
	this.ai();
	if(this.isAlive){
		if(maincounter%3==0 && this.controlled && (Math.abs(this.hspeed)+Math.abs(this.vspeed)>0.5)){
			Particle(this.x+5,this.y+5,5,0,0,this.color,stage, false, 50);}
		if(/*!this.attack &&*/ this.energy < this.maxenergy)this.energy++;
		
		var boxes = [];
		boxes = quadB.retrieve(this);
		for(i in boxes ){
			b = boxes[i];	
			preciseColllision(this, b);
		}
	
		this.y += this.vspeed;
		this.x += this.hspeed;
		if(this.x<0)this.x = 0; 
		if(this.x+this.s>gamewidth) this.x = gamewidth-this.s;
		if(this.y<0)this.y=0;
		if(this.y+this.s>gameheight)this.y = gameheight-this.s;
			
		if(this.halo){
			//this.halo.graphics.clear().setStrokeStyle(2, "round").beginStroke(shape.color).drawCircle(0,0,50);
			this.halo.alpha = this.hp/this.maxhp;
			this.halo.x = this.x;
			this.halo.y = this.y;
		}
		var diagonal = ((this.left || this.right)&&(this.down || this.up))?0.84:1;
		var totalmaxspeed = this.maxspeed*diagonal*this.speedfactor;
		this.acelfactor = 1; //reset factor
		this.speedfactor = 1; //reset factor
		var totalacel = 0.5*diagonal*this.acelfactor;
		
		if(this.left && this.hspeed>-totalmaxspeed)this.hspeed -= totalacel;
		if(this.right  && this.hspeed<totalmaxspeed)this.hspeed += totalacel;
		if(this.up && this.vspeed>-totalmaxspeed)this.vspeed -= totalacel;
		if(this.down  && this.vspeed<totalmaxspeed)this.vspeed += totalacel;
		if(this.hspeed>totalmaxspeed*diagonal)this.hspeed = totalmaxspeed*diagonal;
		if(this.hspeed<-totalmaxspeed*diagonal)this.hspeed = -totalmaxspeed*diagonal;
		if(this.vspeed>totalmaxspeed*diagonal)this.vspeed = totalmaxspeed*diagonal;
		if(this.vspeed<-totalmaxspeed*diagonal)this.vspeed = -totalmaxspeed*diagonal;
		if(!(this.left || this.right) ) this.hspeed/=1.2;
		if(!(this.up || this.down) ) this.vspeed/=1.2;

		this.other = null;
		var pass = true;;
		for(i in players ){
			b = players[i];
			if(this.side == 1){if(b == player1)pass=false;else pass=true};
			if(this.side == 2){if(b == player2)pass=false;else pass=true};
			if(b != this && pass)playerColllision(this, b);
		}
		if(!this.melee && this.attack && this.energy>=20 && maincounter%this.firerate==0){
			this.energy -= 20;
			var hspeed = Math.cos(this.angle)*20;
			var vspeed = Math.sin(this.angle)*20;
			Projectile(this,this.x+this.s/2,this.y+this.s/2,this.damage,hspeed,vspeed,radToDeg(this.angle),20,0.95,"rgba(250,250,0,1)",3,30,stage);
		}
		//if(this == player1)console.log(this.attack);
		if(this.melee){
			if(this.attack && this.energy >= 5){
				this.energy -= 5;
				this.acelfactor = 20;
				this.speedfactor = 3;
				if(this == player1)console.log(this.acelfactor, "melee attack");
			}
			if(this.other && this.other.side != this.side){
				//this.other.switchSides();
				this.other.hp -= this.damage;
			}
		}
		//else if(this.energy<=10)this.attack = false;
		if(this.hp<=0)this.death(j);
	}
}

var switchSides = function(){
	if(this.side == 1){
		this.side = 2;
		if(this.controlled){
			this.abandonControl();
			setNewPlayer(1);
		}
		c2++;
		c1--;
	}
	else if(this.side == 2){
		this.side = 1;
		if(this.controlled){
			this.abandonControl();
			setNewPlayer(2);
		}
		c1++;
		c2--;
	}
}


var aiSUpdate = function(){
	this.leader = this.side==1?player1:player2;
	if(this.target)
		var dis = pointDistanceSquared(this.x,this.y,this.target.x,this.target.y);
	if(this.target && dis<12500){
		this.left = this.right = this.up = this.down = false;
		if(this.y < this.target.y-this.s)this.up = true;
		if(this.y > this.target.y+this.s)this.down = true;
		if(this.x < this.target.x-this.s)this.left = true;
		if(this.x > this.target.x+this.s)this.right = true;
	}else{
		this.left = this.right = this.up = this.down = false;
		if(this.y < this.leader.y+this.formy-this.s)this.down = true;
		if(this.y > this.leader.y+this.formy+this.s)this.up = true;
		if(this.x < this.leader.x+this.formx-this.s)this.right = true;
		if(this.x > this.leader.x+this.formx+this.s)this.left = true;
	}
	if((!this.target && this.counters[0]%15 == 0)|| this.counters[0]%60 == 0){
		this.target = null;
		for(var t in players){
			var p = players[t];
			if(p.side != this.side && !collisionLine(this,p,boxes)){
				this.target = p;
			}
		}
	}
	if(this.target && !collisionLine(this,this.target,boxes) && dis<30000){
		this.angle = Math.atan2(this.target.y-this.y,this.target.x-this.x);
		this.attack = true;
	}
	else{
		this.attack = false;
	}
	
	if(this.counters[1] == 0){
		this.formx = Math.round(Math.random()*120)-60;
		this.formy = Math.round(Math.random()*120)-60;
	}
	this.counters[0]--;
	if(this.counters[0] < 0)this.counters[0] = 60;
	this.counters[1]--;
	if(this.counters[1] < 0)this.counters[1] = Math.round(Math.random()*120+120);
	this.counters[2]--;
	if(this.counters[2] < 0)this.counters[2] = 60;
}

function setNewPlayer(side){
	for(i in players){
		var p = players[i];
		if(p.side == side && !p.controlled){
			p.assumeControl();
			return true;
		}
	}
}