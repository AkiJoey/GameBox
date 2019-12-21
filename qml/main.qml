import QtQuick 2.2
import QtQuick.Controls 1.1
import QtQuick.Controls.Styles 1.1
// import QtQuick.Dialogs 1.1
import QtQuick.Window 2.2

// ApplicationWindow {
Window {
	visible: true
	x: (Screen.width - width) / 2
	y: (Screen.height - height) / 2
	width: 550
	height: 630
	title: qsTr("GameBox")
	// color: "#FAF8EF"

	Button {
		y: 100
		width: 200
		height: 100
		anchors.horizontalCenter: parent.horizontalCenter

		style: ButtonStyle {
			background: Rectangle {
				color: "#85C1E9"
				radius: 5
				Text {
					anchors.centerIn: parent
					text: qsTr("Start 2048")
					color: "#F9F6F2"
					font.pixelSize: 25
					font.family: "Microsoft YaHei"
					font.bold: true
				}
			}
		}
		onClicked: Qt.createComponent("/qml/ttafe/ttafe.qml").createObject().show()
	}

	Button {
		y: 250
		width: 200
		height: 100
		anchors.horizontalCenter: parent.horizontalCenter

		style: ButtonStyle {
			background: Rectangle {
				color: "#85C1E9"
				radius: 5
				Text {
					anchors.centerIn: parent
					text: qsTr("Start Tetris")
					color: "#F9F6F2"
					font.pixelSize: 25
					font.family: "Microsoft YaHei"
					font.bold: true
				}
			}
		}
		onClicked: Qt.createComponent("/qml/tetris/tetris.qml").createObject().show()
	}

	Button {
		y: 400
		width: 200
		height: 100
		anchors.horizontalCenter: parent.horizontalCenter

		style: ButtonStyle {
			background: Rectangle {
				color: "#85C1E9"
				radius: 5
				Text {
					anchors.centerIn: parent
					text: qsTr("Start Snake")
					color: "#F9F6F2"
					font.pixelSize: 25
					font.family: "Microsoft YaHei"
					font.bold: true
				}
			}
		}
		onClicked: Qt.createComponent("/qml/snake/snake.qml").createObject().show()
	}
}