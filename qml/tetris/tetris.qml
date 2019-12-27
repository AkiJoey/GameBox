import QtQuick 2.2
import QtQuick.Controls 1.1
import QtQuick.Controls.Styles 1.1
import QtQuick.Dialogs 1.1
import QtQuick.Window 2.2
import "tetris.js" as Script

ApplicationWindow {
	id: tetris
	visible: false
	x: (Screen.width - width) / 2
	y: (Screen.height - height) / 2
	width: 550
	height: 630
	color: "#E8FFFB"
	title: qsTr("GameBox - Tetris")
	onClosing: tetris.destroy();

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
				onTriggered: tetris.destroy();
			}
		}
		Menu {
			title: qsTr("Help")
			MenuItem {
				text: qsTr("About Tetris")
				onTriggered: aboutDialog.open();
			}
		}
	}

	Item {
		width: 500
		height: 580
		anchors.centerIn: parent

		focus: true
		Keys.onPressed: Script.changeKey(event)

		MouseArea {
			anchors.fill: parent
			onClicked: parent.forceActiveFocus()
		}

		Timer {
			id: timer
			interval: 1000
			repeat: true
			onTriggered: Script.fall()
		}

		Text {
			y: 0
			id: gameName
			font.family: "Microsoft YaHei"
			font.pixelSize: 45
			font.bold: true
			text: "Tetris"
			color: "#2AB09B"
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
					color: "#46C2AE"
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
			color: "#5CD3C0"
			radius: 6

			Grid {
				id: tileGrid
				x: 10;
				y: 10;
				rows: 8; columns: 8; spacing: 10

				Repeater {
					id: cells
					model: 64
					Rectangle {
						width: 410 / 8; height: 410 / 8
						radius: 3
						color: Qt.rgba(238/255, 228/255, 218/255, 0.35)
                    }
                }
            }
        }

		MessageDialog {
            id: aboutDialog
            title: qsTr("About Tetris")
            text: qsTr("<p>GameBox - Tetris</p><br/><p>Version 1.0.0</p><br/><p>©2019 AkiJoey &lt;akijoey@akijoey.com&gt;</p>")
            standardButtons: StandardButton.Ok
        }

        MessageDialog {
            id: deadDialog
            title: qsTr("Game Over")
            text: qsTr("Try again!")
            standardButtons: StandardButton.Abort | StandardButton.Retry
            onAccepted: Script.start();
            onRejected: tetris.destroy();
        }

        MessageDialog {
            id: winDialog
            title: qsTr("You Win")
            text: qsTr("Continue playing?")
            standardButtons: StandardButton.Yes | StandardButton.No
            onYes: {
				close();
				timer.start();
			}
            onNo: tetris.destroy()
        }
	}
	Component.onCompleted: Script.start();
}
