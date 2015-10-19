/*Global variables*/
var played = [];
var turn = 1 ;
var gameFinished =1;
var debug = function(log){
	/*set to false to stop debug*/
	if (true) {
		console.log(log);
	};
};

function Player (name) {
	this.name = name ;
	this.moves = new Array() ;
};

p1 = new Player(prompt("Enter first player's name !"));
//p2 = new Player(prompt("Enter second player's name !"));

//p1 = new Player("Player1");
p2 = new Player("Not Found");
var ifNotPresent = function (cellID,currturn) {
	for (var i = 0; i < played.length ; i++) {
		if(played[i]===cellID){
			return false;
		}
	}
	played[played.length]=cellID;
	if (currturn) {p1.moves[p1.moves.length]=cellID; console.log("Player " + currturn + " got " + cellID);}
	else {p2.moves[p2.moves.length]=cellID; console.log("Player " + currturn + " got " + cellID);}
	return true;
};

var find = function(A,m1){
	var r = A.indexOf(m1) > -1;
	//debug(A + " -> " + m1 + " = "+ r);
    return (r);
};

var checkMoves = function(A, m1, m2, m3){
	if (!find(A,m1)) {return false};
	if (!find(A,m2)) {return false};
	if (!find(A,m3)) {return false};
	return true;
};

var checkSequences = function (P1) {
	/*check if any one of eight combination has been
	fullfilled*/
	if(checkMoves(P1.moves, "a1", "a2", "a3")){return true;}
	if(checkMoves(P1.moves, "b1", "b2", "b3")){return true;}
	if(checkMoves(P1.moves, "c1", "c2", "c3")){return true;}
	if(checkMoves(P1.moves, "a1", "b1", "c1")){return true;}
	if(checkMoves(P1.moves, "a2", "b2", "c2")){return true;}
	if(checkMoves(P1.moves, "a3", "b3", "c3")){return true;}
	if(checkMoves(P1.moves, "a1", "b2", "c3")){return true;}
	if(checkMoves(P1.moves, "a3", "b2", "c1")){return true;}
	return false;
}

var checkForWinner = function(){
	if (checkSequences(p1)) {$('#title').prepend(
		"<div id=\'title\'>"+p1.name+" won!</div>")
		gameFinished = 0}
	else if  (checkSequences(p2)) {$('#title').prepend(
		"<div id=\'title\'>"+p2.name+" won!</div>")
		gameFinished = 0}
	else if(played.length == 9){$('#title').prepend(
		"<div id=\'title\'> Game Draw </div>")
		gameFinished = 0};
};
if(p2.name==="Not Found")
{
		socket.emit('getnewgame');
}
jQuery(document).ready(function($) {
	$('.cell').click(function(){
		if (turn){
			if (ifNotPresent(this.id,1) && gameFinished) {
				$(this).append("<img src=\'cross.png\' id=\'symbol\'>");
				socket.emit('nextmove', this.id);
				turn = 0 ;
	   	 	checkForWinner();
			}
			//console.log(p2.name);
		}
	});
	$('.reset').click(function(){
		played = [];
		turn = 1 ;
		gameFinished =1;
		p1.moves = [];
		p2.moves = [];
		$('.cell').empty();
		socket.emit('gamereset');
		document.getElementById('title').innerHTML = "Tic Tac Toe !";
	});
		socket.on('gamereset',function(){
			played = [];
			turn = 1 ;
			gameFinished =1;
			p1.moves = [];
			p2.moves = [];
			$('.cell').empty();
			document.getElementById('title').innerHTML = "Tic Tac Toe !";
		});
		socket.on('nextmove', function(id){
				if (ifNotPresent(id,0) && gameFinished){
					$('#'+id).append("<img src=\'circle.png\' id=\'symbol\'>");
					turn=1;
				}
				checkForWinner();
		});
		socket.on('getnewgame',function(){
			socket.emit('newgame',p1.name);
			if(p2.name === "Not Found")
				socket.emit('getnewgame');
		});
});


socket.on('newgame', function(playername){
	p2.name=playername;
	$('.info').empty();
	$('.info').append("Your Name : " + p1.name);
	$('.info').append("<br>Opponent : " + p2.name);
});
