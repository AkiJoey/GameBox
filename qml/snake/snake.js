var best = 0;
var score = 0;

var tileItems = [];	//组件对象表(食物节点存放于tileItems[0])
var food, head, tail;	//食物, 蛇头, 蛇尾位置
var direction;	//蛇头方向
var availableCells;	//存放为空位置, 用于随机生成食物

var key = true;	//用于限制键盘事件
var win;

var gridSize = 16;

var tileComponent = Qt.createComponent("tile.qml");

function start() {
	init();
	timer.start();
}

//游戏初始化
function init() {
	score = 0, win = false;
	scoreBoard.itemAt(0).scoreText = Script.score.toString();
	addScoreText.parent = scoreBoard.itemAt(0);
	head = 71, tail = 68;
	direction = '';
	if (tileItems.length > 0)
		for (var i = 0;i < tileItems.length;i++)
			tileItems[i].destroy();
	tileItems = [];
	availableCells = [];
	for (var i = 0;i < gridSize * gridSize;i++)
		availableCells.push(i);
	for (var i = head;i >= tail;i--)
		tileItems.push(createBody(i));
	tileItems.unshift(createFood());
}

//创建蛇身(同时维护availableCells数组)
function createBody(index) {
	availableCells.splice(availableCells.indexOf(index), 1);
    var tile = tileComponent.createObject(
        tileGrid,
        {
            "x": cells.itemAt(index).x,
            "y": cells.itemAt(index).y,
            "color": tileItems.length == 0 ? "#C44348" : "#8187c2",
        }
	);
    return tile;
}

//创建食物(同时维护availableCells数组)
function createFood() {
	food = availableCells[Math.floor(Math.random() * availableCells.length)];
	availableCells.splice(availableCells.indexOf(food), 1);
	var tile = tileComponent.createObject(
        tileGrid,
        {
            "x": cells.itemAt(food).x,
            "y": cells.itemAt(food).y,
            "color": "#F2C627",
        }
    );
    return tile;
}

//蛇移动(按键 / 定时器触发)
//蛇头向direction方向移动一格(同时更新蛇头位置)
//蛇身依次从后往前移动一格
function move() {
	if (direction == '') {
		key = true;
		return;
	}
	if (direction == 'up') {
		if (cells.itemAt(head).y == 0) {
			end();
			return;
		}
		tileItems[1].y = cells.itemAt(head - gridSize).y;
		for (var i = 2;i < tileItems.length;i++) {
			tileItems[i].x = tileItems[i - 1].x;
			tileItems[i].y = tileItems[i - 1].y;
		}
		head -= gridSize;
	}
	else if (direction == 'down') {
		if (cells.itemAt(head).y == 454.6875) {
			end();
			return;
		}
		tileItems[1].y = cells.itemAt(head + gridSize).y;
		for (var i = 2;i < tileItems.length;i++) {
			tileItems[i].x = tileItems[i - 1].x;
			tileItems[i].y = tileItems[i - 1].y;
		}
		head += gridSize;
	}
	else if (direction == 'left') {
		if (cells.itemAt(head).x == 0) {
			end();
			return;
		}
		tileItems[1].x = cells.itemAt(head - 1).x;
		for (var i = 2;i < tileItems.length;i++) {
			tileItems[i].x = tileItems[i - 1].x;
			tileItems[i].y = tileItems[i - 1].y;
		}
		head--;
	}
	else {
		if (cells.itemAt(head).x == 454.6875) {
			end();
			return;
		}
		tileItems[1].x = cells.itemAt(head + 1).x;
		for (var i = 2;i < tileItems.length;i++) {
			tileItems[i].x = tileItems[i - 1].x;
			tileItems[i].y = tileItems[i - 1].y;
		}
		head++;
	}
	if (head != food)
		availableCells.splice(availableCells.indexOf(head), 1);
	availableCells.push(tail);
	eatFood();
	eatBody();
	updateTail();
	key = true;
}

//更新尾节点位置
function updateTail() {
	for (var i = 0;i < gridSize;i++)
		if (tileItems[tileItems.length - 2].y == cells.itemAt(i * gridSize).y)
			for (var j = 0;j < gridSize;j++)
				if (tileItems[tileItems.length - 2].x == cells.itemAt(i * gridSize + j).x) {
					tail = i * gridSize + j;
					break;
				}
}

//吃食物判定
function eatFood() {
	if (head == food) {
		tileItems.push(createBody(tail));
		tileItems[0].destroyFlag = true;
		tileItems[0].opacity = 0;
		tileItems[0].z = -1;
		tileItems[0] = createFood();
		updateScore();
	}
}

//吃蛇身判断
function eatBody() {
	for (var i = 4;i < tileItems.length;i++)
		if (cells.itemAt(head).x == tileItems[i - 1].x && cells.itemAt(head).y == tileItems[i - 1].y)
			end();
}

//游戏结束
function end() {
	deadDialog.open();
	timer.stop();
}

//更新得分
function updateScore() {
	score += 100;
	addScoreText.text = '+ 100';
	addScoreAnim.running = true;
	if (score > best) {
		best = score;
	}
	scoreBoard.itemAt(0).scoreText = Script.score.toString();
	scoreBoard.itemAt(1).scoreText = Script.best.toString();
	if (!win && score >= 1000)
		victory();
}

function victory() {
	timer.stop();
	winDialog.open();
	win = true;
}

//蛇头旋转(键盘事件)
function turnKey(event) {
	if (key) {
		key = false;
		switch (event.key) {
			case Qt.Key_Up:
				if (direction != 'down') {
					direction = 'up';
					// move();
				}
				event.accepted = true;
				break;
			case Qt.Key_Down:
				if (direction != 'up') {
					direction = 'down';
					// move();
				}
				event.accepted = true;
				break;
			case Qt.Key_Left:
				if (direction != 'right' && direction != '') {
					direction = 'left';
					// move();
				}
				event.accepted = true;
				break;
			case Qt.Key_Right:
				if (direction != 'left') {
					direction = 'right';
					// move();
				}
				event.accepted = true;
				break;
		}
	}
}