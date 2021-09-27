$(document).ready(function () {
  var gameOn = false;
  var btnClickable = false;
  var strictMode = false;
  var sequence = [];
  var sequenceIndex = 0;
  var scoreToWin = 20;
  var counterTimer,
    btnSpeedTimer,
    btnLightTimer,
    sequenceStartTimer,
    btnSpeedTimer;

  var btnSound = [
    "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3",
  ];

  var btnDefault = ["#d32f2f", "#388e3c", "#e3c22f", "#1976d2"];
  var btnPressed = ["#e06d6d", "#73af76", "#fde371", "#5e9fdf"];
  var strictDim = "#6e6e6e";
  var strictLit = "#f6b633";

  $(".start-button").mousedown(function () {
    $(this).css("border-bottom", "3px solid black");
  });

  $(".start-button").mouseup(function () {
    $(this).css("border-bottom", "6px solid black");
    if (gameOn) {
      resetGame();
      addStep();
      counterTimer = setTimeout(displayCount, 1800);
      sequenceStartTimer = setTimeout(playSequence, 1800);
    }
  });

  $(".strict-button").mousedown(function () {
    $(this).css("border-bottom", "3px solid black");
  });

  $(".strict-button").click(function () {
    $(this).css("border-bottom", "6px solid black");
    if (gameOn) {
      if (strictMode) {
        $(".strict-light").css("background-color", strictDim);
        strictMode = false;
      } else {
        $(".strict-light").css("background-color", strictLit);
        strictMode = true;
      }
    }
  });

  $(".off-switch, .on-switch").click(function () {
    gameSwitch();
  });

  $(".btn").mousedown(function () {
    if (btnClickable) {
      var myClasses = this.classList;
      var btnNum = myClasses[1].slice(-1) - 1;
      $(this).css("background-color", btnPressed[btnNum]);
      playSound(btnSound[btnNum]);
    }
  });

  $(".btn").mouseup(function () {
    if (btnClickable) {
      var myClasses = this.classList;
      var btnNum = myClasses[1].slice(-1) - 1;
      $(this).css("background-color", btnDefault[btnNum]);
      checkButtonPush(btnNum);
    }
  });

  function checkButtonPush(btnNum) {
    if (btnNum == sequence[sequenceIndex]) {
      if (sequenceIndex >= sequence.length - 1) {
        disableButtons();
        if (sequence.length >= scoreToWin) {
          flashCounter("* *");
        } else {
          addStep();
          displayCount();
          sequenceStartTimer = setTimeout(playSequence, 1800);
        }
      } else {
        sequenceIndex++;
      }
    } else {
      disableButtons();
      flashCounter("! !");
      if (strictMode) {
        sequenceStartTimer = setTimeout(resetGame, 1800);
        sequenceStartTimer = setTimeout(addStep, 2000);
        counterTimer = setTimeout(displayCount, 3600);
        sequenceStartTimer = setTimeout(playSequence, 3600);
      } else {
        sequenceIndex = 0;
        counterTimer = setTimeout(displayCount, 1800);
        sequenceStartTimer = setTimeout(playSequence, 1800);
      }
    }
  }

  function displayCount() {
    var counterText;
    if (sequence.length < 10) {
      counterText = "0" + sequence.length;
    } else {
      counterText = sequence.length;
    }
    $(".count-display").text(counterText);
  }

  function playSequence() {
    var speed = 400 + 600 / sequence.length;
    nextButton(0, speed);
    sequenceIndex = 0;
  }

  function nextButton(sequenceIndex, speed) {
    var btnNum = sequence[sequenceIndex];
    if (sequenceIndex >= sequence.length) {
      enableButtons();
      return;
    } else {
      playSound(btnSound[btnNum]);
      $(".btn-" + (btnNum + 1)).css("background-color", btnPressed[btnNum]);
      btnLightTimer = setTimeout(function () {
        $(".btn-" + (btnNum + 1)).css("background-color", btnDefault[btnNum]);
      }, 400);
      sequenceIndex++;
      if (sequenceIndex >= sequence.length) {
        enableButtons();
        return;
      } else {
        btnSpeedTimer = setTimeout(nextButton, speed, sequenceIndex, speed);
      }
    }
  }

  function addStep() {
    var nextStep = Math.floor(Math.random() * 4);
    sequence.push(nextStep);
  }

  function resetGame() {
    disableButtons();
    defaultButtonLights();
    clearTimeout(btnSpeedTimer);
    clearTimeout(btnLightTimer);
    sequence = [];
    sequenceIndex = 0;
    flashCounter("--");
  }

  function gameSwitch() {
    if (gameOn) {
      gameOn = false;
      strictMode = false;
      $(".off-switch").css({
        backgroundColor: "red",
        borderBottom: "5px solid black",
      });
      $(".on-switch").css({
        backgroundColor: "black",
        borderBottom: "3px solid black",
      });
      clearTimers();
      disableButtons();
      defaultButtonLights();
      $(".count-display").text("");
      $(".strict-light").css("background-color", strictDim);
    } else {
      gameOn = true;
      $(".off-switch").css({
        backgroundColor: "black",
        borderBottom: "3px solid black",
      });
      $(".on-switch").css({
        backgroundColor: "red",
        borderBottom: "5px solid black",
      });
      $(".count-display").text("--");
    }
  }

  function playSound(url) {
    var a = new Audio(url);
    a.play();
  }

  function flashCounter(msg) {
    $(".count-display").text("");

    counterTimer = setTimeout(function () {
      $(".count-display").text(msg);
    }, 300);
    counterTimer = setTimeout(function () {
      $(".count-display").text("");
    }, 600);
    counterTimer = setTimeout(function () {
      $(".count-display").text(msg);
    }, 900);
  }

  function enableButtons() {
    btnClickable = true;
    $(".btn").css("cursor", "pointer");
  }

  function disableButtons() {
    btnClickable = false;
    $(".btn").css("cursor", "default");
  }

  function defaultButtonLights() {
    $(".btn-1").css("background-color", btnDefault[0]);
    $(".btn-2").css("background-color", btnDefault[1]);
    $(".btn-3").css("background-color", btnDefault[2]);
    $(".btn-4").css("background-color", btnDefault[3]);
  }

  function clearTimers() {
    clearTimeout(counterTimer);
    clearTimeout(btnSpeedTimer);
    clearTimeout(btnLightTimer);
    clearTimeout(sequenceStartTimer);
  }
});
