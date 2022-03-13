var suits = ["spades", "hearts", "clubs", "diams"];
var cardFace = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
var cards = [];
var players = [[],[]];
var firstRun = true;
var gameover = false;  //stop game if over

var timer;
var r = 0;  //this gives a global variable

//elements from the HTML
var fightButton = document.querySelector("#btnBattle");
var fightButton10 = document.querySelector("#btnBattle10");
var fightButton15 = document.querySelector("#btnBattle15");
var fightButton20 = document.querySelector("#btnBattle20");
var p1 = document.querySelector("#player1 .hand");
var p2 = document.querySelector("#player2 .hand");
var s1 = document.querySelector("#player1 .score");
var s2 = document.querySelector("#player2 .score");

fightButton.addEventListener('click', battle);
fightButton10.addEventListener('click', function(){
  rounds(10);
});
fightButton15.addEventListener('click', function(){
  rounds(15);
});
fightButton20.addEventListener('click', function(){
    rounds(20);
});

function rounds(a){
  //number of rounds sent to the global variable "r"
  r = a;
  //initiate battle function every 0.1 seconds for "a" times
  timer = setInterval(function(){
    battle()
  },300);
}

function battle() {
  if(timer){
    r--;
    outputMessage("Rounds left " + r);
    if(r < 1){
      window.clearInterval(timer);
    }
  }
  if(firstRun){
    firstRun = false;
    //build full deck of 52 cards
    buildCards();
    //shuffle the deck of cards
    shuffleArray(cards);
    giveCards(cards);
  }
  attack();
}

function attack() {
  if(!gameover){
    var card1 = players[0].shift();
    var card2 = players[1].shift();
    var pot = [card1, card2];

    p1.innerHTML = showCard(card1,0);
    //the 0 in (card1, 0)  is to position the cards to move them later
    p2.innerHTML = showCard(card2,0);
    checkWinner(card1, card2, pot);
    //update scores
    //the score is reflective of how many cards are in each deck
    s1.innerHTML = players[0].length;
    s2.innerHTML = players[1].length;
  } else{
      outputMessage("Game Over");
  }
}

function outputMessage(message) {
  document.getElementById("message").innerHTML = message;
}

function checkWinner(card1, card2, pot){
  //first check if either deck <= 4 which is game over:
  if ((players[0].length <= 4) || (players[1].length <= 4)){
    //if not enough cards, that player loses, exit
    gameover = true;
    return;
  }

  if(card1.cardValue > card2.cardValue){
    outputMessage("Player 1 wins");
    players[0] = players[0].concat(pot);
  }
  else if(card1.cardValue < card2.cardValue){
    outputMessage("Player 2 wins");
    players[1] = players[1].concat(pot);
  }else {  //if there is a Tie!
    outputMessage("Tie! BattleMode: Both players add 3 cards to pot");
    //start next Battle
    battlemode(pot);
  }
}

function battlemode(pot){
  var card1, card2;
  var pos = (pot.length/2);
  if ((players[0].length < 4) || (players[1].length < 4)){
    return;
  }else {
    for (i = 0; i < 4; i++) {
      card1 = players[0].shift();
      pot = pot.concat(card1);
      p1.innerHTML += showCard(card1,(pos+i));
    }
    for (i = 0; i < 4; i++) {
      card2 = players[1].shift();
      pot = pot.concat(card2);
      p2.innerHTML += showCard(card2,(pos+i));
    }
    checkWinner(card1, card2, pot);
  }
}

//the image of the cards:
function showCard(c,p){
  var move = p * 40;
  var bCard = '<div class="icard '+c.suit+' " style="left: '+move+'px">';
  bCard += '<div class="cardtop suit">' + c.num + '<br></div>';
  bCard += '<div class="cardmid suit"></div>';
  bCard += '<div class="cardbottom suit">' + c.num + '<br></div></div>';
  
  return bCard;
}

//at start of game build a full deck of 52 cards:
function buildCards(){
  //resets the cards deck to an empty array again
  cards = [];
  for(s in suits){
    var suitNew = suits[s][0].toUpperCase()  //this makes the first letter uppercase
    for(n in cardFace){
      //build empty card object
      var card = {
        suit:suits[s],
        icon: suitNew,
        num:cardFace[n],
        cardValue:parseInt(n) + 2
      }
      //loop through each suit & each card num,then push that card in the card object
      cards.push(card);
    }
  }
}

function giveCards(array){
  for (i = 0; i < array.length; i++){
    //gives card to 1st person or 2nd person
    if(i % 2 === 0){
      players[0].push(array[i]);
    }else{
      players[1].push(array[i]);
    }
  }
}

//shuffle the deck of 52 cards
function shuffleArray(array){
  for(var x = array.length -1; x > 0; x--){
    var ii = Math.floor(Math.random()*(x+1));
    var temp = array[x];
    array[x] = array[ii];
    array[ii] = temp;
  }
  return array;
}