import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuHeader')
export class Menu2D extends Component {


    @property({ type: Node })
    tempStock: Node = null

    @property({ type: Node })
    taskMission: Node = null
    start() {

    }

    update(deltaTime: number) {

    }
}

