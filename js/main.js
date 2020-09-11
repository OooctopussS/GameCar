const score = document.querySelector('.scoreblock'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gamearea'),
      car = document.createElement('div'),
      startMenu = document.querySelector('.startblock'),
      MAX_ENEMY = 8,
      audio = document.createElement('audio'),
      endScore = document.querySelector('.endscore'),
      HEIGHT_ELEM = 100;


audio.src = 'audio.mp3';
audio.style.cssText = `display:none;`;
car.classList.add('car');

gameArea.style.height = (Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM) * HEIGHT_ELEM);

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

const settings = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3,
    level: 0
};

let level = settings.level;

function GetQuantityElements(heightElement) {
    return (gameArea.offsetHeight / heightElement) + 1;
}

function startGame() {
  //audio.play(); МУЗЫКА (если добавлять, сделать фикс громкости)! (audi.volume = ***)
  startMenu.classList.add("hide");
  gameArea.classList.remove("hide");
  document.body.style.background = 'gray';
  score.classList.remove('hide');
  endScore.classList.add("hide");
  gameArea.innerHTML ='';

    for (let i = 0; i < GetQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement("div");
    line.classList.add("line");
        line.style.top = i * HEIGHT_ELEM + "px";
        line.style.height = (HEIGHT_ELEM / 2) + 'px';
        line.y = i * HEIGHT_ELEM;
    gameArea.append(line);
  }

    for (let i = 0; i < GetQuantityElements(HEIGHT_ELEM * settings.traffic); i++) {
    const enemy = document.createElement("div");
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
    enemy.classList.add("enemy");
    const periodEnemy = -HEIGHT_ELEM * settings.traffic * (i + 1);
    enemy.y = periodEnemy < 100 ? -100 * settings.traffic * (i + 1) : periodEnemy;
    enemy.style.top = enemy.y + "px";
    enemy.style.background = `transparent url(/img/enemy${randomEnemy}.png) center / cover no-repeat`;
    gameArea.append(enemy);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + "px";
  }

  settings.score = 0;
  settings.start = true;
  gameArea.append(car);
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.top = "auto";
  car.style.bottom = "10px";
  settings.x = car.offsetLeft;
  settings.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {

    settings.level = Math.floor(settings.score / 1000);
    if(settings.level !== level){
        level = settings.level;
        settings.speed +=1;
    }

    if(settings.start){
        settings.score += settings.speed;
        score.textContent = settings.score;
        moveRoad();
        moveEnemy();
        if(keys.ArrowLeft && settings.x > 0){
            settings.x -= settings.speed;
        }

        if(keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)){
            settings.x += settings.speed;
        }

        if (keys.ArrowUp && settings.y > 0) {
            settings.y -= settings.speed;
        }

        if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) {
            settings.y += settings.speed;
        }

        car.style.left = settings.x + 'px';
        car.style.top = settings.y + 'px';
        requestAnimationFrame(playGame);
    }
}

function startRun(event) {
      if(keys.hasOwnProperty(event.key)){
         event.preventDefault();
         keys[event.key] = true;
      }
}

function stopRun(event) {
    if (keys.hasOwnProperty(event.key)) {
      event.preventDefault();
      keys[event.key] = false;
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += settings.speed;
        line.style.top = line.y + 'px';

        if (line.y >= gameArea.offsetHeight){
            line.y = -HEIGHT_ELEM;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function (item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if(carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left && carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top){
            settings.start = false;
            settings.speed = 3;
            if (localStorage['bestScore'] < settings.score) {
                localStorage['bestScore'] = settings.score;
            }
            startMenu.classList.remove('hide');
            gameArea.classList.add('hide');
            score.classList.add("hide");
            endScore.classList.remove('hide');
            endScore.innerHTML = 'Your Score:' + ' ' + settings.score + '<br> Best Score:' + ' ' + localStorage['bestScore'];
        }
        item.y += settings.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= gameArea.offsetHeight) {
            item.y = -HEIGHT_ELEM * settings.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px';
         } 
    });
}