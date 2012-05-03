var guessesLeft = 10;
//var highScores = new Array([9, "HarryJamesPotter"], [3, "ZedCthulhu"], [2, "NearlyDied"]);
var number = 0;
var highScores = [];


 

function getHighScores ()
{
  highScores = [];
  $.getJSON("http://localhost:3000/scores.json", function(data) {
    $.each(data, function(obj) {
    highScores.push( new Array( data[obj]['score'], data[obj]['name']));
    });
    populateHighScores( highScores );
  });
}

$(function() {
  getHighScores();
  updateScore(guessesLeft);
  generateRandomNumber();
});

function generateRandomNumber() {
  number = 1;
	//number = Math.floor( Math.random()*100 + 1 );
}



function populateHighScores( scores ) {
  scores.sort(sortfunc);
  $('div#highScores').empty();
  for ( var i = 0; i < scores.length; ++i ) {
    $('div#highScores').append("<p>" + scores[i][0] + " " + scores[i][1] + "</p>");
  }
}

function sortfunc(a, b)
{
  return b[0] - a[0];
}

function updateScore( score ) {
  $('h2#score span#guessesLeft').empty();
  $('h2#score span#guessesLeft').append(score);
}

function giveMessage( the_message ) {
  $('h2#score span#message').empty();
  $('h2#score span#message').append(the_message);
}

function guessNumber() {
  the_guess = $('form#guessTheNumber input#guess').val();
  if ( the_guess == number )
  {
    alert("You win with a score of " + guessesLeft);
    giveMessage("You survived...this time...\n");

    var playerName = prompt("What is your name, weary wanderer?", "Schnoodles McDoo");
    if( playerName != null && playerName != "" )
    {
      //highScores.push([guessesLeft, playerName]);

      sendScore( guessesLeft, playerName );
      getHighScores();
    }
    giveMessage("You survived...this time...<br/><a href=\"http:\/\/localhost:3000\">Play again, wanderer?</a>\n");
    return;
  } else if ( the_guess > number ) {
    giveMessage("Too High");
  } else if ( the_guess < number ) {
    giveMessage("Too Low");
  }

	--guessesLeft;

  if ( guessesLeft <= 0 ) {
    updateScore(0);
    giveMessage("You looz.<br/><a href=\"http:\/\/localhost:3000\">Play again, wanderer?</a>\n");
  }
  else
  {
    updateScore( guessesLeft );
  }
	
}

function sendScore ( playerScore, playerName ) {
  var obj = new Object();
  obj.name = playerName;
  obj.score = playerScore;

  var json = JSON.stringify(obj);
  alert(json);

  $.ajax({
    url: "/scores.json",
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(obj)
  });
}