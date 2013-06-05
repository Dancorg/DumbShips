function Quadtree(level, position){ // level -> int, position -> [x,y,w,h]
	var quad = new Object();
	quad.MaxObj = 3;
	quad.MaxLev = 5;
	quad.level = level;
	quad.objects = [];
	quad.position = position; //
	quad.nodes = [];
	
	quad.clear = function(){
		this.objects = [];
		
		for(var i in this.nodes){
			if(this.nodes[i] != null){
				this.nodes[i].clear();
				this.nodes[i] = null;
			}
		}
	}
	
	quad.split = function(){
		var halfw = this.position[2]/2;
		var halfh = this.position[3]/2;
		this.nodes[0] = Quadtree(this.level+1, [this.position[0] + halfw,this.position[1],halfw,halfh]);
		this.nodes[1] = Quadtree(this.level+1, [this.position[0],this.position[1],halfw,halfh]);
		this.nodes[2] = Quadtree(this.level+1, [this.position[0],this.position[1] + halfh,halfw,halfh]);
		this.nodes[3] = Quadtree(this.level+1, [this.position[0] + halfh,this.position[1] + halfh,halfw,halfh]);
	}
	
	quad.getIndex = function(obj){
		var index = -1;
		var cW = this.position[0] + this.position[2]/2;
		var cH = this.position[1] + this.position[3]/2;
		var topQuad = obj.y < cH && obj.y + obj.h < cH;
		var botQuad = obj.y > cH;
		
		if(obj.x < cW && obj.x + obj.w < cW){
			if(topQuad)index = 1;
			 else if(botQuad)index = 2;
		}
		else if(obj.x > cW){
			if(topQuad)index = 0;
			else if(botQuad)index = 3;
		}
		return index;
	}
	
	quad.insert = function(obj){
		if(this.nodes[0] != null){
			var index = this.getIndex(obj);
			
			if(index != -1){
				this.nodes[index].insert(obj);
				return;
			}
		}
		this.objects.push(obj);
		
		if(this.objects.length > this.MaxObj && this.level < this.MaxLev){
			if(this.nodes[0] == null){
				this.split();
			}
			
			var i = 0;
			while(i < this.objects.length){
				var index = this.getIndex(this.objects[i]);
				if(index != -1){
					this.nodes[index].insert(this.objects[i]);
					this.objects.splice(i,1)
				}
				else{
					i++;
				}
			}
		}
	}
	
	/*quad.retrieve = function(returnObj, obj){
		var index = this.getIndex(obj);
		if(index != -1 && this.nodes[0] != null){
			this.nodes[index].retrieve(returnObj, obj);
		}
		returnObj = returnObj.concat(this.objects);
		return returnObj;
	}*/
	
	quad.retrieve = function(obj){
		var ret = [];
		var index = this.getIndex(obj);
		if(index != -1 && this.nodes[0] != null){
			//console.log("look deeper");
			ret = ret.concat(this.nodes[index].retrieve(obj));
			//console.log(this.level,"deep",ret);
		}
		ret = ret.concat(this.objects);
		//console.log(this.level,"return",ret);
		return ret;
	}
	return quad;
}