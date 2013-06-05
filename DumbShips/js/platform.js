function Box(x, y, w, h, stage, hspeed, vspeed){
	var color;
	color = 'rgba(60,80,220,0.75)';
	var shape = new Shape();
	shape.graphics.beginFill(color).rect(0,0,w,h).beginFill(color).rect(3,3,w-6,h-6);
	shape.color = color;
	shape.alive = true;
	shape.x = x;
	shape.y = y;
	shape.h = h;
	shape.w = w;
	shape.hp = h*w;
	shape.hspeed = hspeed;
	shape.vspeed = vspeed;
	shape.cache(0,0,w,h);
	shape.snapToPixel = true;
	shape.death = function(index){
		stage.removeChild(this);
		boxes.splice(index,1);
		for(var i=0;i<10;i++){
			Particle(this.x+i,this.y+Math.random()*10,6,Math.random()*20-10,Math.random()*20-10,this.color,stage, false, 40);
		}
	}
	shape.update = function(index){
		if(!this.alive){
			this.death(index);
		}
		this.x += this.hspeed;
		this.y += this.vspeed;
		this.hspeed*=.95;
		this.vspeed*=.95;
		if(this.hp<=0)this.divide();
		//if(Math.abs(hspeed)<=0.1 && Math.abs(vspeed)<=0.1)this.update = function(){return true;}
	};
	shape.divide = function(){
		var divx = this.w/10;
		var divy = this.h/10;
		console.log(divx,divy);
		if(this.h > 10 || this.w > 10){
			for(var i=0;i<divx;i++){
				for(var j=0;j<divy;j++){
					var newBox = Box(this.x+i*10,this.y+j*10,10,10,stage,Math.random()*(i-(divx-1)/2),Math.random()*(j-(divy-1)/2));
				}
			}
		}
		this.alive = false;
	};
	stage.addChild(shape);
	boxes.push(shape);
}

function Base(x,y,r){
	var shape = new Shape();
	shape.color1 = 'rgba(180,250,60,1)';
	shape.color2 = 'rgba(10,190,100,0.3)';
	shape.color3 = 'rgba(10,190,180,0.1)';
	shape.graphics.beginRadialGradientFill([shape.color3,shape.color2],[0,1],0,0,r/5,0,0,r).drawCircle(0,0,r).setStrokeStyle(5, "round").beginStroke(shape.color1).drawCircle(0,0,r);
	shape.x = x;
	shape.y = y;
	shape.s = r;
	shape.timers = [0, 0];
	shape.resources = 3000;
	stage.addChild(shape);
	shape.relocate = function(){
		this.x = Math.random()*gamewidth;
		this.y = Math.random()*gameheight;
		this.resources = 3000;
	}
	shape.update = function(){
		this.timers[0] --;
		this.alpha = this.resources/3000;
		if(this.resources>0 && this.timers[0] == 0){

			var dp = [];
			dp[0] = pointDistanceSquared(this.x, this.y, player1.x, player1.y);
			dp[1] = pointDistanceSquared(this.x, this.y, player2.x, player2.y);
			if(c1>0 && dp[0] <= this.s*this.s){
				var val = 10*Math.round(Math.sqrt(this.s*this.s - dp[0]))/c1;
				//console.log(val);
				res1 += val;
				this.resources -= val;
			}
			
			if(c2>0 && dp[1] <= this.s*this.s){
				var val = 10*Math.round(Math.sqrt(this.s*this.s - dp[1]))/c2;
				//console.log(val);
				res2 += val;
				this.resources -= val;
			}
		
			/*for(i in players){
				var p = players[i];
				var d = pointDistanceSquared(this.x, this.y, p.x, p.y);
				if(d<=this.s*this.s){
					var val = Math.round(Math.sqrt(this.s*this.s - d));
					if(p.side == 1){
						res1 += val;
						this.resources -= val;
					}
					if(p.side == 2){
						res2 += val;
						this.resources -= val;
					}
				}
			}*/
		}
		if(this.resources <= 0)this.relocate();
		if(this.timers[0] <= 0) this.timers[0] = 20;
	};
	return shape;
}

function Objective(x,y,r){
	var shape = new Shape();
	shape.color1 = 'rgba(250,120,40,1)';
	shape.color2 = 'rgba(250,20,100,0.3)';
	shape.color3 = 'rgba(220,90,180,0.1)';
	shape.graphics.beginRadialGradientFill([shape.color3,shape.color2],[0,1],0,0,r/5,0,0,r).drawCircle(0,0,r).setStrokeStyle(5, "round").beginStroke(shape.color1).drawCircle(0,0,r);
	shape.x = x;
	shape.y = y;
	shape.s = r;
	shape.timers = [0, 0];
	shape.score = 50;
	stage.addChild(shape);
	shape.relocate = function(){
		this.x = gamewidth/4+Math.random()*gamewidth/2;
		this.y = Math.random()*gameheight;
		this.score = 50;
	}
	shape.update = function(){
		this.timers[0] --;
		this.alpha = this.score/50;
		if(this.score>0 && this.timers[0] == 0){
			for(i in players){
				var p = players[i];
				var d = pointDistanceSquared(this.x, this.y, p.x, p.y);
				if(d<=this.s*this.s){
					if(p.side == 1){
						score1++;
						this.score--;
						stats1.hp+=0.5;
						stats1.energy+=0.3;
						stats1.damage+=0.2;
						updateStats();
					}
					if(p.side == 2){
						score2++;
						this.score--;
						stats2.hp+=0.5;
						stats2.energy+=0.3;
						stats2.damage+=0.2;
						updateStats();
					}
				}
			}
		}
		if(this.score <= 0)this.relocate();
		if(this.timers[0] <= 0) this.timers[0] = 60;
	};
	return shape;
}