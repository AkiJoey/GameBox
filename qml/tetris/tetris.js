var best = 0;
var score = 0;

var tileItems = [];	//组件对象表
var tetromino, overlap = [];	//tetromino存放俄罗斯方块位置, overlap队列用于旋转时去重
var top, left, right, buttom;	//四个方向的投影坐标, 用于触碰判定
var dis, type, state, color;	//dis存放旋转时位移量

var key = true;	//用于游戏结束后禁止键盘事件
var win;

var tileComponent = Qt.createComponent("tile.qml");

function start() {
	init();
	timer.stop();
}

//游戏初始化
function init() {
	score = 0, win = false;
	scoreBoard.itemAt(0).scoreText = Script.score.toString();
	addScoreText.parent = scoreBoard.itemAt(0);
	key = true;
	if (tileItems.length > 0)
		for (var i = 0;i < 64;i++)
			try {
				tileItems[i].destroy();
			}
			catch(e) {
				// console.log('Destroy tile' + i);
			}
	tileItems = [];
	createTetromino();
}

//创建俄罗斯方块(4格)(共7种)
function createTetromino() {
	initTetromino();
	switch (type) {
		case 0:
			for (var i = 2;i < 6;i++) {
				tileItems[i] = createCell(i);
				tetromino.push(i);
			}
			break;
		case 1:
			for (var i = 3;i < 5;i++) {
				tileItems[i] = createCell(i);
				tetromino.push(i);
			}
			for (var i = 11;i < 13;i++) {
				tileItems[i] = createCell(i);
				tetromino.push(i);
			}
			break;
		case 2:
			tileItems[3] = createCell(3);
			tetromino.push(3);
			for (var i = 11;i < 14;i++) {
				tileItems[i] = createCell(i);
				tetromino.push(i);
			}
			break;
		case 3:
			tileItems[4] = createCell(4);
			tetromino.push(4);
			for (var i = 11;i < 14;i++) {
				tileItems[i] = createCell(i);
				tetromino.push(i);
			}
			break;
		case 4:
			tileItems[4] = createCell(4);
			tetromino.push(4);
			for (var i = 10;i < 13;i++) {
				tileItems[i] = createCell(i);
				tetromino.push(i);
			}
			break;
		case 5:
			for (var i = 2;i < 4;i++) {
				tileItems[i] = createCell(i);
				tetromino.push(i);
			}
			for (var i = 11;i < 13;i++) {
				tileItems[i] = createCell(i);
				tetromino.push(i);
			}
			break;
		case 6:
			for (var i = 4;i < 6;i++) {
				tileItems[i] = createCell(i);
				tetromino.push(i);
			}
			for (var i = 11;i < 13;i++) {
				tileItems[i] = createCell(i);
				tetromino.push(i);
			}
			break;
	}
}

//创建单个方格(qml组件对象tile)
function createCell(index) {
    var tile = tileComponent.createObject(
        tileGrid,
        {
            "x": cells.itemAt(index).x,
            "y": cells.itemAt(index).y,
            "color": color,
        }
	);
    return tile;
}

//俄罗斯方块各属性初始化
function initTetromino() {
	tetromino = [], state = 0;
	top = [], left = [], right = [], buttom = [];
	type = Math.floor(Math.random() * 7);
	switch (type) {
		case 0:
			top.push(0), top.push(1), top.push(2), top.push(3);
			left.push(0);
			right.push(3);
			buttom.push(0), buttom.push(1), buttom.push(2), buttom.push(3);
			color = '#FF0000';	//'#66CCFF';
			dis = [
				-6, 1, 8, 15,
				17, 8, -1, -10,
				6, -1, -8, -15,
				-17, -8, 1, 10
			];
			break;
		case 1:
			top.push(2), top.push(3);
			left.push(0), left.push(2);
			right.push(1), right.push(3);
			buttom.push(2), buttom.push(3);
			color = '#FF7F00';	//'#99CC33';
			dis = [];
			break;
		case 2:
			top.push(0), top.push(2), top.push(3);
			left.push(0), left.push(1);
			right.push(3), right.push(0);	//
			buttom.push(1), buttom.push(2), buttom.push(3);
			color = '#FFFF00';	//'#FFFF99';
			dis = [
				2, -7, 0, 7,
				16, 9, 0, -9,
				-2, 7, 0, -7,
				-16, -9, 0, 9
			];
			break;
		case 3:
			top.push(0), top.push(1), top.push(3);
			left.push(1), left.push(0);	//
			right.push(3), right.push(0);	//
			buttom.push(1), buttom.push(2), buttom.push(3);
			color = '#00FF00';	//'#FF9933';
			dis = [
				9, -7, 0, 7,
				7, 9, 0, -9,
				-9, 7, 0, -7,
				-7, -9, 0, 9
			];
			break;
		case 4:
			top.push(0), top.push(1), top.push(2);
			left.push(1), left.push(0);	//
			right.push(0), right.push(3);
			buttom.push(1), buttom.push(2), buttom.push(3);
			color = '#00FFFF';	//'#FFCC66';
			dis = [
				16, -7, 0, 7,
				-2, 9, 0, -9,
				-16, 7, 0, -7,
				2, -9, 0, 9
			];
			break;
		case 5:
			top.push(0), top.push(1), top.push(3);
			left.push(0), left.push(2);	//
			right.push(3), right.push(1);	//
			buttom.push(2), buttom.push(3), buttom.push(0);	//
			color = '#0000FF';	//'#FFCCFF';
			dis = [
				2, 9, 0, 7,
				16, 7, 0, -9,
				-2, -9, 0, -7,
				-16, -7, 0, 9
			];
			break;
		case 6:
			top.push(0), top.push(1), top.push(2);
			left.push(2), left.push(0);	//
			right.push(1), right.push(3);	//
			buttom.push(2), buttom.push(3), buttom.push(1);	//
			color = '#8B00FF';	//'#FF9999';
			dis = [
				9, 16, -7, 0,
				7, -2, 9, 0,
				-9, -16, 7, 0,
				-7, 2, -9, 0
			];
			break;
	}
}

//清空判定
function clear() {
	for (var i = 0;i < 7;i++)
		for (var j = 24;j <= 56;j += 8)
			if (full(j)) {
				for (var k = j;k < j + 8;k++) {
					tileItems[k].destroy();
					tileItems[k] = null;
				}
				for (var k = j - 1;k >= 16;k--)
					if (exist(k))
						move(k, 8);
				updateScore();
			}
}

//更新得分
function updateScore() {
	score += 500;
	addScoreText.text = '+ 500';
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

//判断当前行是否填满
function full(start) {
	for (var i = start;i < start + 8;i++)
		if (tileItems[i] == null || tileItems[i] == undefined)
			return false;
	return true;
}

//俄罗斯方块下落(按键 ↓ / 定时器触发)
function fall() {
	if (!touch('down'))
		moveTetromino('down');
	else {
		for (var i = 0;i < 4;i++)
			if (tetromino[i] < 16) {
				end();
				return;
			}
		createTetromino();
		clear();
	}
}

//游戏结束
function end() {
	key = false;
	deadDialog.open();
	timer.stop();
}

//俄罗斯方块移动
function moveTetromino(direction) {
	if (direction == 'down')
		for (var i = 3;i >= 0;i--) {
			move(tetromino[i], 8);
			tetromino[i] += 8;
		}
	if (direction == 'left')
		for (var i = 0;i < 4;i++) {
			move(tetromino[i], -1);
			tetromino[i]--;
		}
	if (direction == 'right')
		for (var i = 3;i >= 0;i--) {
			move(tetromino[i], 1);
			tetromino[i]++;
		}
}

//单个方块的移动
function move(index, dis) {
	if (dis == 0)
		return;
	if (exist(index + dis))
		overlap.push(index + dis);
	else {
		color = tileItems[index].color;
		tileItems[index + dis] = createCell(index + dis);
	}
	if (index == overlap[0])
		overlap.shift();
	else {
		tileItems[index].destroy();
		tileItems[index] = null;
	}
}

//俄罗斯方块旋转
function turn() {
	if (type == 0) {
		if (tileItems[tetromino[1]].x == 0 || tileItems[tetromino[1]].x == 428.75 || tileItems[tetromino[1]].y == 0 || tileItems[tetromino[1]].y == 428.75)
			return;
		if (state == 0 && tileItems[tetromino[1]].y == 367.5)
			return;
		if (state == 1 && tileItems[tetromino[1]].x == 61.25)
			return;
		if (state == 2 && tileItems[tetromino[1]].y == 61.25)
			return;
		if (state == 3 && tileItems[tetromino[1]].x == 367.5)
			return;
	}
	else if (type == 1) {
		return;
	}
	else if (type == 6) {
		if (tileItems[tetromino[3]].x == 0 || tileItems[tetromino[3]].x == 428.75 || tileItems[tetromino[3]].y == 0 || tileItems[tetromino[3]].y == 428.75)
			return;
	}
	else {
		if (tileItems[tetromino[2]].x == 0 || tileItems[tetromino[2]].x == 428.75 || tileItems[tetromino[2]].y == 0 || tileItems[tetromino[2]].y == 428.75)
			return;
	}
	for (var i = 0;i < 4;i++)
		if (exist(tetromino[i] + dis[state * 4 + i])) {
			var touch = true;
			for (var j = 0;j < 4;j++)
				if (tetromino[i] + dis[state * 4 + i] == tetromino[j])
					touch = false;
			if (touch)
				return;
		}
	//以上均为旋转时的触碰判定
	for (var i = 0;i < 4;i++) {
		move(tetromino[i], dis[state * 4 + i]);
		tetromino[i] += dis[state * 4 + i];
	}
	updateTetromino();
}

//旋转时更新投影坐标及状态
function updateTetromino() {
	var tmp = [].concat(top);
	top = [].concat(left);
	left = [].concat(buttom);
	buttom = [].concat(right);
	right = [].concat(tmp);
	if (state < 3)
		state++
	else
		state = 0;
}

//移动时的触碰判定
function touch(direction) {
	if (direction == 'up') {
		if (tileItems[tetromino[top[0]]].y == 0)
			return true;
		for (var i = 0;i < top.length;i++)
			if (exist(tetromino[top[i]] - 8))
				return true;
	}
	if (direction == 'down') {
		if (tileItems[tetromino[buttom[0]]].y == 428.75)
			return true;
		for (var i = 0;i < buttom.length;i++)
			if (exist(tetromino[buttom[i]] + 8))
				return true;
	}
	if (direction == 'left') {
		if (tileItems[tetromino[left[0]]].x == 0)
			return true;
		for (var i = 0;i < left.length;i++)
			if (exist(tetromino[left[i]] - 1))
				return true;
	}
	if (direction == 'right') {
		if (tileItems[tetromino[right[0]]].x == 428.75)
			return true;
		for (var i = 0;i < right.length;i++)
			if (exist(tetromino[right[i]] + 1))
				return true;
	}
	return false;
}

//判断该位置是否存在方块
function exist(index) {
	if (tileItems[index] != null && tileItems[index] != undefined)
		return true;
	return false;
}

//键盘事件
function changeKey(event) {
	if (!key)
		return;
	timer.start();
	switch (event.key) {
		case Qt.Key_Up:
			turn();
			event.accepted = true;
			break;
		case Qt.Key_Down:
			fall();
			event.accepted = true;
			break;
		case Qt.Key_Left:
			if (!touch('left'))
				moveTetromino('left');
			event.accepted = true;
			break;
		case Qt.Key_Right:
			if (!touch('right'))
				moveTetromino('right');
			event.accepted = true;
			break;
	}
}