var numbers = [
        {
            number      : "A",
            signs       : ['middle_center'] 
        },
        {
            number      : "2",
            signs       : ["top_center","bottom_center"]
        },
        {
            number      : "3",
            signs       : ["top_center","middle_center","bottom_center"]
        },
        {
            number      : "4",
            signs       : ["top_left","top_right","bottom_left","bottom_right"]
        },
        {
            number      : "5",
            signs       : ["top_left","top_right","middle_center","bottom_left","bottom_right"]
        },
        {
            number      : "6",
            signs       : ["top_left","top_right","middle_left","middle_right","bottom_left","bottom_right"]
        },
        {
            number      : "7",
            signs       : ["top_left","top_right","middle_left","middle_top","middle_right","bottom_left","bottom_right"]
        },
        {
            number      : "8",
            signs       : ["top_left","top_right","middle_left","middle_top","middle_right","middle_bottom","bottom_left","bottom_right"]
        },
        {
            number      : "9",
            signs       : ["top_left","top_right","middle_top_left","middle_center","middle_top_right","bottom_left","bottom_right","middle_bottom_left","middle_bottom_right"]
        },
        {
            number      : "10",
            signs       : ["top_left","top_right","middle_top_left","middle_top_center","middle_top_right","bottom_left","bottom_right","middle_bottom_center","middle_bottom_left","middle_bottom_right"]
        }
];

var types = [
    {
        name : "club",
        sign : "♣"
    },
    {
        name : "diamond",
        sign : "♦"
    },
    {
        name : "spade",
        sign : "♠"
    },
    {
        name : "heart",
        sign : "♥"
    }
];

var dealerCards = [];
var userCards = [];
var compCards = [];
var users = [];
var computer;
var player;

//CARD
var Card = function(id, number, type, signs){
	this.id = id;
	this.number = number;
	this.type = type;
	this.signs = signs;
	this.DOMElement = undefined;
	this.render();
}

Card.prototype.render = function(){
	var self = this;

	var cardTemplate = document.getElementById('card');
	var cardElem = cardTemplate.cloneNode(true);
	document.getElementsByClassName('cards')[0].appendChild(cardElem);

	with(cardElem){
		removeAttribute('id')
		setAttribute("class", "card animated flipped " + this.type.name)
		setAttribute("data-id", this.id)
		getElementsByClassName('top-number')[0].innerHTML = this.number
		getElementsByClassName('bottom-number')[0].innerHTML = this.number
		getElementsByClassName('top-type-sign')[0].innerHTML = this.type.sign
		getElementsByClassName('bottom-type-sign')[0].innerHTML = this.type.sign
	}

	for(s in this.signs){
		var span = document.createElement("SPAN");
		span.setAttribute('class', 'suit ' + self.signs[s]);
		cardElem.getElementsByClassName('signs')[0].appendChild(span);
		span.innerHTML = self.type.sign
	}

	cardElem.classList.add('fadeInDown');
	this.DOMElement = cardElem;
}

Card.prototype.addToUser = function( user ){
	var index = dealerCards.indexOf(this);
	if (index > -1) {
	    dealerCards.splice(index, 1);
	}

	user.cards.push(this);

	user.DOMElement.querySelector('.user-cards').appendChild(this.DOMElement);
	this.DOMElement.setAttribute('style',"");

	Game.rotateCards();

	this.DOMElement.classList.add('fadeInDown');
	user.DOMElement.querySelector('.sum').innerHTML = user.cardsSum();
}

Card.prototype.value = function () {
	var values = [];
    if (this.number === "J" || this.number === "Q" || this.number === "K") {
    	values.push(10);
    } else if (this.number === "A") {
    	values.push(1);
    	values.push(11);
    } else {
    	values.push(parseInt(this.number, 10));
    }
    return values;
};

//User
var User = User || {};

User = function(userName, DOMElement){
	this.userName = userName;
	this.DOMElement = DOMElement;
	this.score = 0;
	this.cards = [];
}

User.prototype.cardsSum = function () {
    var cardsSum = 0;
    var aces = [];
    
    for (var i = 0; i < this.cards.length; i++) {
        var value = this.cards[i].value() // value array ex.[10]
        if (value.length === 2) {
            aces.push(value);
        } else{
        	cardsSum += value[0];
        }
    }
    
    for (var j = 0; j < aces.length; j++) {
        if (cardsSum + aces[j][1] <= 21) {
            cardsSum += aces[j][1];
        } else {
            cardsSum += aces[j][0];
        }
    }
    return cardsSum;  
};

User.prototype.win = function(){
	//this.DOMElement.classList.add('tada');
}

User.prototype.lose = function(){
	var self = this;
	setTimeout(function(){
		self.DOMElement.classList.add('hinge');
	}, 200);
}

//Game
var Game = Game || {};

Game.createUser = function(userName, DOMElement){
	var user = new User(userName, DOMElement);
	users.push(user);
	return user;
}

Game.createCards = function(){
	var cards = [];
	var count = 1;
	for ( n in numbers ){
		for ( t in types ){
			var card = new Card (
				count, 
				numbers[n].number, 
				types[t], 
				numbers[n].signs
			);
			dealerCards.push(card);
			count += 1;
		}
	}
	Game.rotateCards();
}

Game.rotateCards = function(){
	var degree = 90 / dealerCards.length;
	for (i in dealerCards) {
		dealerCards[i].DOMElement.classList.remove('fadeInDown');
		var rotateDegree = (i * degree) - 45;
		dealerCards[i].DOMElement.style.transform = 'rotate(' + rotateDegree + 'deg)';
		dealerCards[i].DOMElement.style.transformOrigin = 'bottom center';
	}
}

Game.deal = function(){

	var card;
	for (var i in users){
		for ( c = 0; c < 2; c++ ){
			card = dealerCards[Math.floor(Math.random()*dealerCards.length)];
			card.addToUser(users[i]);
			if(users[i].userName === "Player" || (users[i].userName === "Computer" && c === 0)){
				card.DOMElement.classList.remove("flipped");
			}
		}
	}

}

Game.endGame = function(){
	for (var i in computer.cards){
		computer.cards[i].DOMElement.classList.remove('flipped');
	}
	computer.DOMElement.querySelector('.sum').classList.remove('hide');
	while(computer.cardsSum() < 17){
		card = dealerCards[Math.floor(Math.random()*dealerCards.length)];
		card.addToUser(computer);
		card.DOMElement.classList.remove('flipped');
	}

	if(computer.cardsSum() <= 21 && player.cardsSum() <= 21){
		if(computer.cardsSum() > player.cardsSum()){
			computer.win();
			player.lose();
			return;
		}else if(computer.cardsSum() === player.cardsSum()){
			computer.lose();
			player.lose();
			return;
		}else{
			player.win();
			computer.lose();
			return;
		}
	}else if(player.cardsSum() > 21 && computer.cardsSum() > 21){
		player.lose();
		computer.lose();
		return;
	}else{
		if(computer.cardsSum() > 21 && player.cardsSum() <= 21){
			player.win();	
			computer.lose();
			return;
		}else if(player.cardsSum() > 21 && computer.cardsSum() <= 21){
			computer.win();	
			player.lose();
			return;
		}
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
    Game.createCards();
    computer = Game.createUser('Computer', document.querySelector('.user.computer'));
    player = Game.createUser('Player', document.querySelector('.user.player'));

    document.getElementById('deal').addEventListener('click', function(){
    	Game.deal();
    });

    document.getElementById('stop').addEventListener('click', function(){
    	Game.endGame();
    });

    document.getElementById('hit').addEventListener('click', function(){
    	card = dealerCards[Math.floor(Math.random()*dealerCards.length)];
    	card.addToUser(player);
    	card.DOMElement.classList.remove('flipped');

    	if(player.cardsSum() > 21){
    		Game.endGame();
    	}

    });
});