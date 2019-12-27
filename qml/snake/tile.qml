import QtQuick 2.2

Rectangle {
    id: tileContainer
    width: 405 / 16
    height: 405 / 16
    radius: 3
    color: "white"
    property string tileText: ""
    property int tileFontSize: 55
    property color tileColor: "black"
    property int moveAnimTime: 100
    property int newTileAnimTime: 200
    property bool runNewTileAnim: true
    property bool destroyFlag: false

    Text {
        id: tileLabel
        text: tileText
        color: tileColor
        font.family: "Microsoft YaHei"
        font.pixelSize: tileFontSize
        font.bold: true
        anchors.centerIn: parent
        Behavior on text {
            PropertyAnimation {
                target: tileContainer
                property: "opacity"
                from: 0.5
                to: 1
                duration: moveAnimTime
            }
        }
    }

    ParallelAnimation {
        running: runNewTileAnim
        NumberAnimation {
            target: tileContainer
            property: "opacity"
            from: 0.0
            to: 1.0
            duration: newTileAnimTime
        }

        ScaleAnimator {
            target: tileContainer
            from: 0
            to: 1
            duration: newTileAnimTime
            easing.type: Easing.OutQuad
        }
    }

    Behavior on color {
        ColorAnimation {
            duration: moveAnimTime
        }
    }

    Behavior on y {
        NumberAnimation {
            duration: moveAnimTime
            onRunningChanged: {
                if ((!running) && destroyFlag) {
                    tileContainer.destroy();
                }
            }
        }
    }

    Behavior on x {
        NumberAnimation {
            duration: moveAnimTime
            onRunningChanged: {
                if ((!running) && destroyFlag) {
                    tileContainer.destroy();
                }
            }
        }
    }
}
