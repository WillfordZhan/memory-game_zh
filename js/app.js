/*
 * 创建一个包含所有卡片的数组
 */

var GamePanel = function(panel){
    this.starElem = panel.getElementsByClassName("stars")[0];
    this.stars = [];
    // TODO: refactoring
    this.moveElem = panel.getElementsByClassName("moves")[0];
    this.restart = panel.getElementsByClassName("restart")[0];
};

GamePanel.prototype.init = function(moves){
    // the stars module
    var stars = this.stars;
    for (let i = 0; i < 3; i++) {
        stars[i] = document.createElement('li');
        var starI = document.createElement('i');
        stars[i].className = "fa fa-star";
        stars[i].appendChild(starI);
        this.starElem.appendChild(stars[i]);
    }
    // the moves module
    this.moveElem.innerHTML = '0';

    // the restart module
    restartInit(this.restart);
};

GamePanel.prototype.updateScore = function(moves){
    // TODO: find the empty star class
    this.moveElem.innerHTML = moves;
    if (moves <= 16) {

    }
    else if (moves <= 25) {
        this.stars[2].className = "fa fa-star empty";
        this.starElem.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            this.starElem.appendChild(this.stars[i]);
        }
    }
    else{
        this.stars[1].className = "fa fa-star empty";
        this.stars[2].className = "fa fa-star empty";

        this.starElem.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            this.starElem.appendChild(this.stars[i]);
        }
    }
};

var Game = function(icons,deckElem,gamePanel){
    this.icons = icons;
    this.deckElem = deckElem;
    this.panel = gamePanel;
};

// Initializing the Game 
Game.prototype.init = function(){
    this.panel.init();
    var self = this;
    var moves = 0;
    var opens = [];
    shuffle(self.icons); 
    self.icons.map(function(icon){
        var card = new Card(icon);
        self.deckElem.appendChild(card.elem);
        card.elem.addEventListener('click',function(){
            if (card.isOpen == false) {
                card.open();
                opens.push(card);
                // Judge if 2 cards match
                // TODO: set the delay on opening the 2nd card
                if (opens.length % 2 == 0) {
                    if (card.isMatch != true) {
                        moves++;
                        var unMatchedCard = opens[opens.length - 2];
                        if (unMatchedCard.icon != icon) {
                            card.unmatch();
                            unMatchedCard.unmatch();
                            setTimeout(() => {
                                unMatchedCard.close();
                                card.close();
                                opens.pop();
                                opens.pop();
                            }, 1000);
                            
                            // TODO: checkout the close animation
                        }
                        else {
                            unMatchedCard.match();
                            card.match();
                        }
                    }
                }
                self.panel.updateScore(moves);
                if (opens.length == icons.length) {
                    // TODO: set result animation
                    self.showResult(moves);
                }
            }
            
        });
    });
};

// Show result after game is over
Game.prototype.showResult = function(moves){
    var gameBody = this.deckElem.parentNode;
    var star;
    if (moves <= 16) {
        star = 3;
    } else if (moves <= 25) {
        star = 2;
    } else {
        star = 1;
    }
    var rankString = "You used " + moves + " moves and gained a "+ star +"-star, Woooo !!!"
    gameBody.className = "container empty";
    swal("Congradulations! You won!",rankString, "success", {
        button: "Play again!",
      }).then((result) => {
          history.go(0);
      });
};

Game.prototype.restart = function(){
    // Restart the Game
    history.go(0);
};



var Card = function(icon){
    this.icon = icon;
    this.elem = this.generateElem();
    this.isOpen = false;
};

// Generate the HTMML element of the card 
Card.prototype.generateElem = function(){
    var liElem = document.createElement('li');
    liElem.className = 'card';
    var iElem = document.createElement('i');
    iElem.className = 'fa fa-' + this.icon;
    liElem.appendChild(iElem);
    return liElem;
};

Card.prototype.open = function(){
    this.elem.className = "card open show flipInY animated";
    this.isOpen = true;
};

Card.prototype.close = function(){
    this.elem.className = "card closeOver animated";
}

Card.prototype.unmatch = function(){
    this.isOpen = false;
    this.elem.className = "card open show wobble animated";
    // TODO: 怎样设置延时？？？
};

Card.prototype.match = function(){
    this.elem.className = "card match tada animated";
};


/**
 * @description - the function to register restart feature
 * @param {*object} element - the button which needs to register restart feature  
 */
function restartInit(element) {
    
    element.addEventListener('click',function() {
        swal({
            title: "Restart?",
            text: "The current progress will be discarded, are you sure to restart?",
            buttons: true,
            dangerMode: true,
          })
          .then((isConfirm) => {
            if (isConfirm == true) {
                history.go(0);
            }
          });
    });
}

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

var icons = ['diamond','paper-plane-o','anchor','bolt','cube','leaf','bicycle','bomb','diamond','paper-plane-o','anchor','bolt','cube','leaf','bicycle','bomb'];
var deckElem = document.getElementsByClassName('deck')[0];
var panel = document.getElementsByClassName('score-panel')[0];
// TOASK: how to find the dom by class without returning a array
var gamePanel = new GamePanel(panel);
var game = new Game(icons,deckElem,gamePanel);
game.init();

/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “opens” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "opens" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */
