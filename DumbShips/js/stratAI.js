var aistratZUpdate = function(){
	/*var c1 = c2 = 0;
	for(var i in players){
		if(players[i].side == 1)c1++; else c2++;
	}*/
	if(this.target)
		var dis = pointDistanceSquared(this.x,this.y,this.target.x,this.target.y);
	if(this.target && dis<22500){
		this.left = this.right = this.up = this.down = false;
		if(this.y < this.target.y-this.s)this.down = true;
		if(this.y > this.target.y+this.s)this.up = true;
		if(this.x < this.target.x-this.s)this.right = true;
		if(this.x > this.target.x+this.s)this.left = true;
	}else{
		var obj = chooseObj(this);
		this.left = this.right = this.up = this.down = false;
		if(this.y < obj.y-this.s)this.down = true;
		if(this.y > obj.y+this.s)this.up = true;
		if(this.x < obj.x-this.s)this.right = true;
		if(this.x > obj.x+this.s)this.left = true;
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
	if((this.target && dis<40000 && c1>c2) || this.target && dis<20000){
		this.attack = true;
	}
	else this.attack = false;
	
	if(this.counters[1] == 0){
		this.formx = Math.round(Math.random()*120)-60;
		this.formy = Math.round(Math.random()*120)-60;
	}
	this.counters[0]--;
	if(this.counters[0] < 0)this.counters[0] = 60;
	this.counters[1]--;
	if(this.counters[1] < 0)this.counters[1] = Math.round(Math.random()*120+30);
	this.counters[2]--;
	if(this.counters[2] < 0)this.counters[2] = 60;
	
	function chooseObj(t){
		var obj = {"x":0, "y":0}
		
		if(c1>c2*1.5 || (c1>c2 && score1>10+score2*1.2) || (c1>c2*0.6 && score1>10+score2*2)){
			obj.x = player2.x;
			obj.y = player2.y;
			//console.log("attack player");
		}
		else if(c1<=c2){
			var ref = pointDistanceSquared(t.x,t.y,objectives[0].x,objectives[0].y)<pointDistanceSquared(t.x,t.y,objectives[1].x,objectives[1].y)?objectives[0]:objectives[1];
			obj.x = ref.x;
			obj.y = ref.y;
			//console.log("get reinforcements");
		}
		else if(score1<=score2){
			obj.x = objectives[2].x;
			obj.y = objectives[2].y;
			//console.log("upgrade");
		}
		else{
			obj.x = Math.random()*gamewidth;
			obj.y = Math.random()*gameheight;
			//console.log("random");
		}
		return obj;
	}
}

var aistratSUpdate = function(){
	/*var c1 = c2 = 0;
	for(var i in players){
		if(players[i].side == 1)c1++; else c2++;
	}*/
	if(this.target)
		var dis = pointDistanceSquared(this.x,this.y,this.target.x,this.target.y);
	if(this.target && dis<12500){
		this.left = this.right = this.up = this.down = false;
		if(this.y < this.target.y-this.s)this.up = true;
		if(this.y > this.target.y+this.s)this.down = true;
		if(this.x < this.target.x-this.s)this.left = true;
		if(this.x > this.target.x+this.s)this.right = true;
	}else{
		var obj = chooseObj(this);
		this.left = this.right = this.up = this.down = false;
		if(this.y < obj.y-this.s)this.down = true;
		if(this.y > obj.y+this.s)this.up = true;
		if(this.x < obj.x-this.s)this.right = true;
		if(this.x > obj.x+this.s)this.left = true;
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
	if(this.counters[1] < 0)this.counters[1] = Math.round(Math.random()*120+30);
	this.counters[2]--;
	if(this.counters[2] < 0)this.counters[2] = 60;
	
	function chooseObj(t){
		var obj = {"x":0, "y":0}
		
		if(c2>c1*1.5 || (c2>c1 && score2>10+score1*1.2) || (c2>c1*0.6 && score2>10+score1*2)){
			obj.x = player1.x;
			obj.y = player1.y;
			//console.log("attack player");
		}
		else if(c2<=c1){
			var ref = pointDistanceSquared(t.x,t.y,objectives[0].x,objectives[0].y)<pointDistanceSquared(t.x,t.y,objectives[1].x,objectives[1].y)?objectives[0]:objectives[1];
			obj.x = ref.x;
			obj.y = ref.y;
			//console.log("get reinforcements");
		}
		else if(score2<=score1+20){
			obj.x = objectives[2].x;
			obj.y = objectives[2].y;
			//console.log("upgrade");
		}
		else{
			obj.x = Math.random()*gamewidth;
			obj.y = Math.random()*gameheight;
			//console.log("random");
		}
		return obj;
	}
}