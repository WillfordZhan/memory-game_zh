/*
 * 创建一个包含所有卡片的数组
 */

var Game = function(icons,deckElem){
    this.icons = icons;
    this.deckElem = deckElem;
};

// Initializing the Game 
Game.prototype.init = function(){
    var self = this;
    var time = 0;
    var moves = 0;
    var opens = [];
    shuffle(this.icons); 
    self.icons.map(function(icon){
        var card = new Card(icon);
        this.deckElem.appendChild(card.elem);
        card.elem.addEventListener('click',function(){
            card.open();
            // Judge if 2 cards match
            if (opens.length % 2 == 0) {
                if (opens[opens.length - 1] != icon) {
                    console.log(opens[opens.length - 1])
                    card.close();
                    // TODO: checkout the close animation
                }
                else{
                    opens.pop();
                    opens.pop();
                }
            }
        });
    });
};


Game.prototype.showResult = function(){
    // Show result after game is over
};

Game.prototype.restart = function(){
    // Restart the Game
};

Game.prototype.getScore = function(){
    // Generate score according to time and moves
};



var Card = function(icon){
    this.icon = icon;
    this.elem = this.generateElem();
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
    this.elem.className = "card open show";
};

Card.prototype.close = function(){
    this.elem.className = "card";
};


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

var icons = ['diamond','paper-plane-o','anchor','bolt','cube','leaf','bicycle','bomb'];
var deckElem = document.getElementsByClassName('deck')[0];
var game = new Game(icons,deckElem);
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
