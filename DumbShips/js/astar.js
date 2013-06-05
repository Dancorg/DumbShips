
function Neighbors(node){
	var ret = [];
	var npos = node.pos;
	var x = npos[0];
	var y = npos[1];
	
	if(grid[x-1] && grid[x-1][y]) {
		ret.push(grid[x-1][y]);
	}
	if(grid[x+1] && grid[x+1][y]) {
		ret.push(grid[x+1][y]);
	}
	if(grid[x][y-1] && grid[x][y-1]) {
		ret.push(grid[x][y-1]);
	}
	if(grid[x][y+1] && grid[x][y+1]) {
		ret.push(grid[x][y+1]);
	}
	/*if(0 < x-1 && x-1 <30) {
		ret.push(grid[x-1][y]);
	}
	
	if(0 < x+1 && x+1 <30) {
		ret.push(grid[x+1][y]);
	}
	
	if(0 < y-1 && y-1 <40) {
		ret.push(grid[x][y-1]);
	}
	if(0 < y+1 && y+1  <40) {
		ret.push(grid[x][y+1]);
	}*/

	return ret;
}

function ResetNode(){
	for(var i=0; i<40; i++){
		for(var j=0; j<30; j++){
			var node = grid[j][i];
			node.f = node.g = node.h = 0;
			node.parent = false;
		}
	}
}

function Heuristic(pos, end){
	return Math.abs(end[0] - pos[0]) + Math.abs(end[1] - pos[1]);
}

function Node(val,pos,f,g,h,parent){
	var node = new Object();
	node.val = val;
	node.pos = pos;
	node.f = f;
	node.g = g;
	node.h = h;
	node.parent = parent;
	return node;
}

function debuggy(x,y){
	var shape = new Shape();
	shape.graphics.beginFill("#8888AA").rect(0,0,4,4);
	shape.x = x; shape.y = y;
	stage.addChild(shape);
}

function returnPath(start, end){
	start = grid[Math.floor(start[1]/20)][Math.floor(start[0]/20)];
	end = grid[Math.floor(end[1]/20)][Math.floor(end[0]/20)];
	var path = [];
	var openList = [];
	var closedList = [];
	openList.push(start);

	while(openList.length > 0){
		var lowInd = 0;
		for(var i=0; i<openList.length; i++){
			if(openList[i].f < openList[lowInd].f)lowInd=i;
		}
		var currentNode = openList[lowInd];
		
		if(currentNode.pos == end.pos){
			var curr = currentNode;
			var ret = [];
			while(curr.parent){
				ret.push(curr);
				curr = curr.parent;
			}
			ret.reverse();
			ResetNode();

			return ret;
		}
		var idx = openList.indexOf(currentNode);
		openList.splice(idx,1);
		closedList.push(currentNode);
		var neighbors = Neighbors(currentNode);
		
		for(var i=0; i<neighbors.length; i++){
			var neighbor = neighbors[i];
			if($.inArray(neighbor,closedList)!=-1 || neighbor.val==1){
				continue;
			}

			var gScore = currentNode.g + 1;
			var gScoreIsBest = false;
			
			if($.inArray(neighbor,openList)==-1){
				gScoreIsBest = true;
				neighbor.h = Heuristic(neighbor.pos, end.pos);
				openList.push(neighbor);
			}else if(gScore < neighbor.g){
				gScoreIsBest = true;
			}
			
			if(gScoreIsBest){
				neighbor.parent = currentNode;
				neighbor.g = gScore;
				neighbor.f = neighbor.g + neighbor.h;
			}
		}
	}
	/*for(i in closedList){
				debuggy(closedList[i].pos[1]*20+10,closedList[i].pos[0]*20+10);
			}*/
	alert("no path");
	ResetNode();
	return [];
}











