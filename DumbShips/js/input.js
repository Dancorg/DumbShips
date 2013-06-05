//KEYS
function handleKeyDown(e){
	if(!startButton){
		startButton = true;
		menuScreen();
		//startLevel();
	}
	if(!ingame)return;
	if(!endButton && endtimer == 0){
		endButton = true;
		menuScreen();
		/*startButton = false;
		startMenu();*/
	}
	switch(e.keyCode){
		case keyup:
			player2.up = true;return false;
		case keyw:
			player1.up = true;return false;
		case keyleft:
			player2.left = true;return false;
		case keya:
			player1.left = true;return false;
		case keyright:
			player2.right = true;return false;
		case keyd:
			player1.right = true;return false;
		case keydown:
			player2.down = true;return false;
		case keys:
			player1.down = true;return false;
		case keyspace:
			player1.attack = true;return false;
		case keyintro:
			player2.attack = true;return false;
	}
	
}

function handleKeyUp(e){
	if(!ingame)return;
	switch(e.keyCode){
		case keyup:
			player2.up = false;return false;
		case keyw:
			player1.up = false;return false;
		case keyleft:
			player2.left = false;return false;
		case keya:
			player1.left = false;return false;
		case keyright:
			player2.right = false;return false;
		case keyd:
			player1.right = false;return false;
		case keydown:
			player2.down = false;return false;
		case keys:
			player1.down = false;return false;
		case keyspace:
			player1.attack = false;return false;
		case keyintro:
			player2.attack = false;return false;
	}
}


// TOUCH
function handleTouchStart(e){
	e.preventDefault();
	var canvasx = canvas.offsetLeft;
	var canvasY = canvas.offsetTop;
	var	touches = e.changedTouches;
	for(i in touches){
		var touch = touches[i];
		if(!startButton){
		startButton = true;
			startLevel();
		}
		if(!endButton && endtimer ==0){
			endButton = true;
			startLevel();
			/*startButton = false;
			startMenu();*/
		}
		if(touch.pageX  <cw/2)left = true;
		if((touch.pageX  >=cw/2-50 && touch.pageX  <=cw/2+50) || touch.pageY<ch/2){
			jump = true;
			player1.canjump = false;
		}
		if(touch.pageX  >cw/2)right = true;

	}
}

function handleTouchEnd(e){
	e.preventDefault();
	var canvasx = canvas.offsetLeft;
	var canvasY = canvas.offsetTop;
	var	touches = e.changedTouches;
	for(i in touches){
		var touch = touches[i];
		if(touch.pageX  <cw/2)left = false;
		if((touch.pageX  >=cw/2-50 && touch.pageX  <=cw/2+50) || touch.pageY<ch/2){
			jump = false;
			player1.jumping=0;
		}
		if(touch.pageX  >cw/2)right = false;
	}
}

//COPY OF KEYBOARD EVENTS, UPDATE IF KEYBOARD EVENTS CHANGE
function handleMouseDown(e){
	if(!ingame)return;
	var mX = e.clientX - canvas.offsetLeft;
	var mY = e.clientY - canvas.offsetTop;
	if(player2){
		player2.attack = true;
		player2.angle = Math.atan2(mY-player2.y,mX-player2.x);
	}
	/*if(e.clientX  <200+canvasx)left = true;
	if((e.clientX  >=200+canvasx && e.clientX  <=440+canvasx) || e.clientY<300+canvasY){
		jump = true;
		player1.canjump = false;
	}
	if(e.clientX  >440+canvasx)right = true;*/
}

function handleMouseMove(e){
	var mX = e.clientX - canvas.offsetLeft;
	var mY = e.clientY - canvas.offsetTop;
	if(player2)
	player2.angle = Math.atan2(mY-player2.y,mX-player2.x);
}

function handleMouseUp(e){
	if(!ingame)return;
	player2.attack = false;
	/*if(e.clientX  <200+canvasx)left = false;
	if((e.clientX  >=200+canvasx && e.clientX  <=440+canvasx) || e.clientY<300+canvasY){
		jump = false;
		player1.jumping=0;
	}
	if(e.clientX  >440+canvasx)right = false;*/

}