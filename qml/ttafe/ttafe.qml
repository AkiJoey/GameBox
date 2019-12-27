import QtQuick 2.2
import QtQuick.Controls 1.1
import QtQuick.Controls.Styles 1.1
import QtQuick.Dialogs 1.1
import QtQuick.Window 2.2
import "ttafe.js" as Script

ApplicationWindow {
	id: ttafe
	visible: false
	x: (Screen.width - width) / 2
	y: (Screen.height - height) / 2
	width: 550
	height: 630
	color: "#FAF8EF"
	title: qsTr("GameBox - 2048")
	onClosing: ttafe.destroy();

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
				onTriggered: ttafe.destroy();
			}
		}
		Menu {
			title: qsTr("Help")
			MenuItem {
				text: qsTr("About 2048")
				onTriggered: aboutDialog.open();
			}
		}
	}

	Item {
		width: 500
		height: 580
		anchors.centerIn: parent

		focus: true
		Keys.onPressed: Script.moveKey(event)

		MouseArea {
			anchors.fill: parent
			onClicked: parent.forceActiveFocus()
		}

		Text {
			y: -5
			id: gameName
			font.family: "Microsoft YaHei"
			font.pixelSize: 50
			font.bold: true
			text: "2048"
			color: "#776E62"
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
					color: "#BBADA0"
					property string scoreText: (index === 0) ? Script.score.toString() : Script.bestScore.toString()
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
			color: "#BBADA0"
			radius: 6

			Grid {
				id: tileGrid
				x: 15;
				y: 15;
				rows: 4; columns: 4; spacing: 15

				Repeater {
					id: cells
					model: 16
					Rectangle {
						width: 425 / 4; height: 425 / 4
						radius: 3
						color: Qt.rgba(238/255, 228/255, 218/255, 0.35)
                    }
                }
            }
        }

		MessageDialog {
            id: aboutDialog
            title: qsTr("About 2048")
            text: qsTr("<p>GameBox - 2048</p><br/><p>Version 1.0.0</p><br/><p>©2019 AkiJoey &lt;akijoey@akijoey.com&gt;</p>")
            standardButtons: StandardButton.Ok
        }

        MessageDialog {
            id: deadDialog
            title: qsTr("Game Over")
            text: qsTr("Try again!")
            standardButtons: StandardButton.Abort | StandardButton.Retry
            onAccepted: Script.start();
            onRejected: ttafe.destroy();
        }

        MessageDialog {
            id: winDialog
            title: qsTr("You Win")
            text: qsTr("You win! Continue playing?")
            standardButtons: StandardButton.Yes | StandardButton.No
            onYes: close()
            onNo: ttafe.destroy()
        }
	}
	Component.onCompleted: Script.start();
}
