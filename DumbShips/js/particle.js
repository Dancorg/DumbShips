function Particle(x,y,s,vspeed,hspeed,color,stage, collider, timer){
	var shape = new Shape();//
	shape.graphics.beginFill(color).rect(0,0,s,s);
	shape.x = x-s/2;
	shape.y = y-s/2;
	shape.vspeed = vspeed;
	shape.hspeed = hspeed;
	shape.collider = collider;
	shape.timer = timer;
	shape.factor = timer;
	shape.snapToPixel = true;
	shape.cache(0,0,s,s);
	shape.glow = new Shape();
	if(!collider){
		shape.glow.graphics.beginFill(color).rect(-s/2,-s/2,s*2,s*2);
		shape.glow.alpha=0.25;
		shape.glow.snapToPixel = true;
		shape.glow.cache(-s/2,-s/2,s*2,s*2);
		shape.glow.x = x;55
		shape.glow.y = y;
		stage.addChild(shape.glow);
	}
	shape.update = function(i){	
		this.x += this.hspeed;
		this.y += this.vspeed;
		this.hspeed *= 0.9;
		this.vspeed *= 0.9;
		this.alpha -= 1/this.factor;
		this.timer--;
		this.glow.x = this.x;
		this.glow.y = this.y;
		this.glow.alpha -= 1/480;
		this.glow.alpha+=Math.random()*0.1-0.05;
		if(this.timer <=0 ){
			particles.splice(i,1);
			stage.removeChild(this.glow);
			stage.removeChild(this);
		}
	}
	stage.addChild(shape);
	particles.push(shape);
}

function BulletDeath(i,type){
	stage.removeChild(this);
	if(type == "explosive"){
		for(var j=0;j<5;j++){
			Particle(this.x+this.hspeed/2+Math.random()*5,this.y+this.vspeed/2+Math.random()*5,4,Math.random()*20-10,Math.random()*20-10,this.color,stage, false, 10);
		}
	}
	particles.splice(i,1);
	//particles[i] = null;
	
}

function Coin(x,y,stage){
	shape = new Shape();
	shape.s = 10;
	shape.graphics.beginFill('rgba(230,190,40,1)').rect(0,0,shape.s,shape.s).beginFill('rgba(250,230,30,0.15)').rect(-3,-3,shape.s+6,shape.s+6);
	shape.x = x;
	shape.y = y;
	shape.snapToPixel = true;
	shape.cache(-3,-3,shape.s+6,shape.s+6);
	stage.addChild(shape);
	coins.push(shape);
}

function Projectile(owner,x,y,damage,hspeed,vspeed,angle,time,drop,color,size1,size2,stage){
	shape = new Shape();
	//shape.graphics.setStrokeStyle(size1,"butt").beginStroke(color).moveTo(0,0).lineTo(size2,0);
	shape.graphics.setStrokeStyle(size1,"butt").beginLinearGradientStroke(['rgba(0,0,0,0)',color],[0,0.4],0,0,size2,0).moveTo(0,0).lineTo(size2,0);
	shape.x = x;
	shape.y = y;
	shape.h = 1; // only for quadtree compatibility
	shape.w = 1; // only for quadtree compatibility
	shape.size = size2;
	shape.color = color;
	shape.rotation = angle;
	shape.drop = drop;
	shape.time = time;
	shape.cache(-size2*1,-size1*1,size2*2,size1*2);
	shape.snapToPixel = true;
	shape.damage = damage;
	shape.hspeed = hspeed;
	shape.vspeed = vspeed;
	shape.impulse = .125;
	shape.owner = owner;
	shape.side = owner.side;
	stage.addChild(shape);
	shape.death = BulletDeath;
	shape.update = function(i){
		this.time--;
		if(this.time <= 0){
			this.death(i,"quiet");
			return true;
		}
		var players = [];
		players = quadP.retrieve(this);
		for(j in players){
			var p = players[j];
			if(p.side != this.side && collisionLinePoints(this.x,this.y,this.x+this.hspeed,this.y+this.vspeed,p,"cross")){
				p.hspeed+=this.hspeed*this.impulse;
				p.vspeed+=this.vspeed*this.impulse;
				p.hp-=this.damage;
				this.death(i,"explosive");
				return true;
			}
		}
		var boxes = [];
		boxes = quadB.retrieve(this);
		for(j in boxes){
			var box = boxes[j];
			if(collisionLinePoints(this.x,this.y,this.x+this.hspeed,this.y+this.vspeed,box,"box")){
				this.death(i,"explosive");
				box.hp-=this.damage*10;
				return true;
			}
		}
		this.hspeed*=this.drop;
		this.vspeed*=this.drop;
		this.x += this.hspeed;
		this.y += this.vspeed;
	};
	particles.push(shape);
}