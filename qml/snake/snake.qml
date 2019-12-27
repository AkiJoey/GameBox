import QtQuick 2.2
import QtQuick.Controls 1.1
import QtQuick.Controls.Styles 1.1
import QtQuick.Dialogs 1.1
import QtQuick.Window 2.2
import "snake.js" as Script

ApplicationWindow {
	id: snake
	visible: false
	x: (Screen.width - width) / 2
	y: (Screen.height - height) / 2
	width: 550
	height: 630
	color: "#FAEEFF"
	title: qsTr("GameBox - Snake")
	onClosing: snake.destroy();

	menuBar: MenuBar {
		Menu {
			title: qsTr("File")
			MenuItem {
				text: qsTr("New Game")
				shortcut: "Ctrl+N"
				onTriggered: Script.start();
            }
			MenuItem {
				text: qsTr("Exit")
				shortcut: "Ctrl+Q"
				onTriggered: snake.destroy();
			}
		}
		Menu {
			title: qsTr("Help")
			MenuItem {
				text: qsTr("About Snake")
				onTriggered: aboutDialog.open();
			}
		}
	}

	Item {
		width: 500
		height: 580
		anchors.centerIn: parent

		focus: true
		Keys.onPressed: Script.turnKey(event)

		MouseArea {
			anchors.fill: parent
			onClicked: parent.forceActiveFocus()
		}

		Timer {
			id: timer
			interval: 200
			repeat: true
			onTriggered: Script.move()
		}

		Text {
			y: 0
			id: gameName
			font.family: "Microsoft YaHei"
			font.pixelSize: 45
			font.bold: true
			text: "Snake"
			color: "#7E3998"
		}

		Row {
			anchors.right: parent.right
			spacing: 10
			Repeater {
				id: scoreBoard
				model: 2
				Rectangle {
					width: 120
					height: 55
					radius: 3
					color: "#D25AFF"
					property string scoreText: (index === 0) ? Script.score.toString() : Script.best.toString()
					Text {
						text: (index == 0) ? qsTr("SCORE") : qsTr("BEST")
						anchors.horizontalCenter: parent.horizontalCenter
						y: 6
						font.family: "Microsoft YaHei"
						font.pixelSize: 13
						color: "#EEE4DA"
					}
					Text {
						text: scoreText
						anchors.horizontalCenter: parent.horizontalCenter
						y: 22
						font.family: "Microsoft YaHei"
						font.pixelSize: 25
						font.bold: true
						color: "white"
					}
				}
			}

			Text {
				id: addScoreText
				font.family: "Microsoft YaHei"
				font.pixelSize: 25
				font.bold: true
				color: Qt.rgba(119/255, 110/255, 101/255, 0.9);
				anchors.horizontalCenter: parent.horizontalCenter

				property bool runAddScore: false
				property real yfrom: 0
				property real yto: -(parent.y + parent.height)
				property int addScoreAnimTime: 600

				ParallelAnimation {
					id: addScoreAnim
					running: false

					NumberAnimation {
						target: addScoreText
						property: "y"
						from: addScoreText.yfrom
						to: addScoreText.yto
						duration: addScoreText.addScoreAnimTime
					}
					NumberAnimation {
						target: addScoreText
						property: "opacity"
						from: 1
						to: 0
						duration: addScoreText.addScoreAnimTime
					}
				}
			}
		}

		Rectangle {
			y: 80
			width: 500
			height: 500
			color: "#E194FD"
			radius: 6

			Grid {
				id: tileGrid
				x: 10;
				y: 10;
				rows: 16; columns: 16; spacing: 5

				Repeater {
					id: cells
					model: 256
					Rectangle {
						width: 405 / 16; height: 405 / 16
						radius: 3
						color: Qt.rgba(238/255, 228/255, 218/255, 0.35)
                    }
                }
            }
        }

		MessageDialog {
            id: aboutDialog
            title: qsTr("About Snake")
            text: qsTr("<p>GameBox - Snake</p><br/><p>Version 1.0.0</p><br/><p>©2019 AkiJoey &lt;akijoey@akijoey.com&gt;</p>")
            standardButtons: StandardButton.Ok
        }

        MessageDialog {
            id: deadDialog
            title: qsTr("Game Over")
            text: qsTr("Try again!")
            standardButtons: StandardButton.Abort | StandardButton.Retry
            onAccepted: Script.start();
            onRejected: snake.destroy();
        }

        MessageDialog {
            id: winDialog
            title: qsTr("You Win")
            text: qsTr("You win! Continue playing?")
            standardButtons: StandardButton.Yes | StandardButton.No
            onYes: {
				close();
				timer.start();
			}
            onNo: snake.destroy()
        }
	}
	Component.onCompleted: Script.start();
}
