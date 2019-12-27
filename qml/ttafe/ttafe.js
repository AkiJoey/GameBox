var score = 0;
var bestScore = 0;

var gridSize = 4;

var tileItems = []; //组件对象表
var cellValues; //存放各位置的数值(幂), 用于方块合并
var availableCells;	//存放为空位置, 用于随机生成方块
var targetLevel = 11; //2 ^ 11 = 2048

var isWin;

var tileComponent = Qt.createComponent("tile.qml");

//将幂转为具体数值(字符串), 用于显示
function getValue(n) {
    return Math.pow(2, n).toString();
}

function start() {
    // Initialize variables
    score = 0;
    isWin = false;
    var i, j;

    cellValues = new Array(gridSize);
    for (i = 0;i < gridSize;i++) {
        cellValues[i] = new Array(gridSize);
        for (j = 0;j < gridSize;j++)
            cellValues[i][j] = 0;
    }

    for (i = 0;i < Math.pow(gridSize, 2);i++) {
        try {
            tileItems[i].destroy();
        }
        catch(e) {
            // console.log('Destroy tile' + i);
        }
        tileItems[i] = null;
    }

    updateAvailableCells();
    createNewTileItems(true);
    updateScore(0);
    addScoreText.parent = scoreBoard.itemAt(0);

    console.log("Started a new game");
}

//方块移动(键盘事件)
function moveKey(event) {
    var isMoved = false;
    var i, j;
    var v, v2, mrg, indices;
    var oldScore = score;
    switch (event.key) {
        case Qt.Key_Left:
            for (i = 0; i < gridSize; i++) {
                v = cellValues[i];
                mrg = mergeVector(v);
                v2 = mrg[0];
                indices = mrg[1];
                if (!arraysIdentical(v, v2)) {
                    isMoved = true;
                    moveMergeTilesLeftRight(i, v, v2, indices, true);
                    cellValues[i] = v2;
                }
            }
            event.accepted = true;
            break;
        case Qt.Key_Right:
            for (i = 0; i < gridSize; i++) {
                v = cellValues[i].slice();
                v.reverse();    //mergeVector()为从右向左合并, 因此要先反转, 下同
                mrg = mergeVector(v);
                v2 = mrg[0];
                indices = mrg[1];
                if (!arraysIdentical(v,v2)) {
                    isMoved = true;
                    v.reverse();
                    v2.reverse();
                    indices.reverse();
                    for (j = 0; j < indices.length; j++)
                        indices[j] = gridSize - 1 - indices[j];
                    moveMergeTilesLeftRight(i, v, v2, indices, false);
                    cellValues[i] = v2;
                }
            }
            event.accepted = true;
            break;
        case Qt.Key_Up:
            for (i = 0; i < gridSize; i++) {
                v = cellValues.map(function(row) {return row[i];});
                mrg = mergeVector(v);
                v2 = mrg[0];
                indices = mrg[1];
                if (! arraysIdentical(v,v2)) {
                    isMoved = true;
                    moveMergeTilesUpDown(i, v, v2, indices, true);
                    for (j = 0; j < gridSize; j++) {
                        cellValues[j][i] = v2[j];
                    }
                }
            }
            event.accepted = true;
            break;
        case Qt.Key_Down:
            for (i = 0; i < gridSize; i++) {
                v = cellValues.map(function(row) {return row[i];});
                v.reverse();
                mrg = mergeVector(v);
                v2 = mrg[0];
                indices = mrg[1];
                if (! arraysIdentical(v,v2)) {
                    isMoved = true;
                    v.reverse();
                    v2.reverse();
                    indices.reverse();
                    for (j = 0; j < gridSize; j++) {
                        indices[j] = gridSize - 1 - indices[j];
                        cellValues[j][i] = v2[j];
                    }
                    moveMergeTilesUpDown(i, v, v2, indices, false);
                }
            }
            event.accepted = true;
            break;
    }
    if (isMoved) {
        updateAvailableCells();
        createNewTileItems(false);
        if (oldScore !== score) {
            if (bestScore < score)
                bestScore = score;
            updateScore(oldScore);
            //判断是否 win
            if (!isWin && maxTileValue() >= targetLevel) {
                winDialog.open();
                isWin = true;
            }
        }
    }
    else if (isDead())
        deadDialog.open();
}

//将一维坐标转为二维坐标
function ind2sub(ind) {
    var sub = [0, 0];
    sub[0] = Math.floor(ind / gridSize);
    sub[1] = ind % gridSize;
    return sub;
}

//合并v0行数值(从右向左合并)
function mergeVector(v0) {
    var i, j;
    var vlen = v0.length;
    var indices = [];   //indices存放位移量
    //去除为0元素
    var v = []; //v为非空数值表
    for (i = 0;i < vlen;i++) {
        indices[i] = v.length;
        if (v0[i] > 0)
            v.push(v0[i]);
    }
    //数值合并
    var v2 = [];    //v2存放合并后的行
    for (i = 0;i < v.length;i++) {
        if (i === v.length - 1) //最后一个数值不用合并
            v2.push(v[i]);
        else
            if (v[i] === v[i + 1]) {
                //从右向左合并
                for (j = 0;j < vlen;j++)
                    if (indices[j] > v2.length)
                        indices[j]--;
                v2.push(v[i] + 1);
                score += Math.pow(2, v[i] + 1);
                i++;
            }
            else
                v2.push(v[i]);
    }
    //添加0元素填满v2行
    for (i = v2.length; i < vlen; i++)
        v2[i] = 0;

    return [v2, indices];
}

//判断数组是否相等
function arraysIdentical(a, b) {
    var i = a.length;
    if (i !== b.length)
        return false;
    while (i--)
        if (a[i] !== b[i])
            return false;
    return true;
}

//更新空位置表
function updateAvailableCells() {
    availableCells = [];
    for (var i = 0; i < gridSize; i++)
        for (var j = 0; j < gridSize; j++)
            if (cellValues[i][j] === 0)
                availableCells.push(i * gridSize + j);
}

//新建方块
function createNewTileItems(isStartup) {
    var i, sub, nTiles;
    if (isStartup)
        nTiles = 2;
    else
        nTiles = 1;
    // Popup a new number
    for (i = 0; i < nTiles; i++) {
        var oneOrTwo = Math.random() < 0.9 ? 1: 2;
        var randomCellId = availableCells[Math.floor(Math.random() * availableCells.length)];

        sub = ind2sub(randomCellId);
        cellValues[sub[0]][sub[1]] = oneOrTwo;

        tileItems[randomCellId] = createTileObject(randomCellId, oneOrTwo);

        // Mark this cell as unavailable
        var idx = availableCells.indexOf(randomCellId);
        availableCells.splice(idx, 1);
    }
}

//更新得分
function updateScore(oldScore) {
    if (score > oldScore) {
        addScoreText.text = "+" + (score-oldScore).toString();
        addScoreAnim.running = true;
    }
    scoreBoard.itemAt(0).scoreText = Script.score.toString();
    scoreBoard.itemAt(1).scoreText = Script.bestScore.toString();
}

//结束判定
function isDead() {
    var dead = true;
    for (var i = 0; i < gridSize; i++)
        for (var j = 0; j < gridSize; j++) {
            if (cellValues[i][j] === 0)
                dead = false;
            if (i > 0)
                if (cellValues[i-1][j] === cellValues[i][j])
                    dead = false;
            if (j > 0)
                if (cellValues[i][j-1] === cellValues[i][j])
                    dead = false;
        }
    return dead;
}

//返回方块样式
function computeTileStyle(n, tileText) {
    var fgColors = ["#776E62", "#F9F6F2"];
    var bgColors = ["#EEE4DA", "#EDE0C8", "#F2B179", "#F59563", "#F67C5F", "#F65E3B", "#EDCF72", "#EDCC61", "#EDC850", "#EDC53F", "#EDC22E", "#3C3A32"];
    var sty = {bgColor: Qt.rgba(238/255, 228/255, 218/255, 0.35),
               fgColor: fgColors[0],
               fontSize: 55 };
    if (n > 0) {
        if (n > 2)
            sty.fgColor = fgColors[1];
        if (n <= bgColors.length)
            sty.bgColor = bgColors[n-1];
        else
            sty.bgColor = bgColors[bgColors.length-1];
    }
    var tlen = tileText.length;
    if (tlen <= 2)
        sty.fontSize = 50;
    else if (tlen <= 4)
        sty.fontSize = 40;
    else if (tlen <= 6)
        sty.fontSize = 30;
    else
        sty.fontSize = 20;
    return sty;
}

//获取方块的最大数值, 用于判断是否到达2048
function maxTileValue() {
    var mv = 0;
    for (var i = 0; i < gridSize; i++)
        for (var j = 0; j < gridSize; j++) {
            var cv = cellValues[i][j];
            if ( mv < cv)
                mv = cv;
        }
    return mv;
}

//创建方块对象(qml组件对象)
function createTileObject(ind, n) {
    var tile;
    var tileText = getValue(n);
    var sty = computeTileStyle(n, tileText);
    tile = tileComponent.createObject(
        tileGrid,
        {
            "x": cells.itemAt(ind).x,
            "y": cells.itemAt(ind).y,
            "color": sty.bgColor,
            "tileColor": sty.fgColor,
            "tileFontSize": sty.fontSize,
            "tileText": tileText
        }
    );
    return tile;
}

//水平方向合并
function moveMergeTilesLeftRight(i, v, v2, indices, left) {
    var j0, j;
    for (j0 = 0;j0 < v.length;j0++) {
        if (left)
            j = j0;
        else
            j = v.length - 1 - j0;  //从右向左遍历
        if (v[j] > 0 && indices[j] !== j) {
            if (v2[indices[j]] > v[j] && tileItems[gridSize * i + indices[j]] !== null) {
                //移动 + 合并
                tileItems[gridSize * i + j].destroyFlag = true;
                tileItems[gridSize * i + j].z = -1;
                tileItems[gridSize * i + j].opacity = 0;
                tileItems[gridSize * i + j].x = cells.itemAt(gridSize * i + indices[j]).x;
                //更新合并后样式
                var tileText = getValue(v2[indices[j]]);
                var sty = computeTileStyle(v2[indices[j]], tileText);
                tileItems[gridSize * i + indices[j]].tileText = tileText;
                tileItems[gridSize * i + indices[j]].color = sty.bgColor;
                tileItems[gridSize * i + indices[j]].tileColor = sty.fgColor;
                tileItems[gridSize * i + indices[j]].tileFontSize = sty.fontSize;
            } else {
                //移动
                tileItems[gridSize * i + j].x = cells.itemAt(gridSize * i + indices[j]).x;
                tileItems[gridSize * i + indices[j]] = tileItems[gridSize * i + j];
            }
            tileItems[gridSize * i + j] = null;
        }
    }
}

//竖直方向合并
function moveMergeTilesUpDown(i, v, v2, indices, up) {
    var j0, j;
    for (j0 = 0;j0 < v.length;j0++) {
        if (up)
            j = j0;
        else
            j = v.length - 1 - j0;

        if (v[j] > 0 && indices[j] !== j) {
            if (v2[indices[j]] > v[j] && tileItems[gridSize * indices[j] + i] !== null) {
                tileItems[gridSize * j + i].destroyFlag = true;
                tileItems[gridSize * j + i].z = -1;
                tileItems[gridSize * j + i].opacity = 0;
                tileItems[gridSize * j + i].y = cells.itemAt(gridSize * indices[j] + i).y;

                var tileText = getValue(v2[indices[j]]);
                var sty = computeTileStyle(v2[indices[j]], tileText);
                tileItems[gridSize * indices[j] + i].tileText = tileText;
                tileItems[gridSize * indices[j] + i].color = sty.bgColor;
                tileItems[gridSize * indices[j] + i].tileColor = sty.fgColor;
                tileItems[gridSize * indices[j] + i].tileFontSize = sty.fontSize;
            } else {
                tileItems[gridSize * j + i].y = cells.itemAt(gridSize * indices[j] + i).y;
                tileItems[gridSize * indices[j] + i] = tileItems[gridSize * j + i];
            }
            tileItems[gridSize * j + i] = null;
        }
    }
}
