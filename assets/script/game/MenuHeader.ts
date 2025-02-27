import { _decorator, Component, game, Label, log, Node, Sprite, SpriteFrame } from 'cc';
import { GameData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass('MenuHeader')
export class Menu2D extends Component {


    @property({ type: Node })
    tempStock: Node = null;

    @property({ type: Node })
    taskMission: Node = null;


    @property({ type: [SpriteFrame] })
    poolIcons: SpriteFrame[] = [];

    start() {
        this.getData()
    }

    getData() {
        let t = this;
        let data = GameData.instance.getTaskMission();
        log(data)
        for (let i = 0; i < t.taskMission.children.length; i++) {
            let e = t.taskMission.children[i];
            let d = data[i]
            if (d && d.type >= 0) {
                e.getChildByName("boxActive").active = true;
                e.getChildByPath("boxActive/clipboard/Label").getComponent(Label).string = d.quantity.toString();
                e.getChildByPath("boxActive/icon").getComponent(Sprite).spriteFrame = t.poolIcons[d.type];
            } else {
                e.getChildByName("lock").active = true;
            }
        }
        t.loadUITempStock()
    }

    refreshTask() {
        let t = this
    }


    newTaskMission() {
        let t = this;

    }

    loadUITempStock() {
        let t = this;
        let data = GameData.instance.getTempTask();
        log(data, "fortemp")
        for (let i = 0; i < t.tempStock.children.length; i++) {
            let e = t.tempStock.children[i];
            let d: number = data[i];
            if (d) {
                e.active = true;
                if (d != -1) {
                    e.getChildByName("icon").active = true;
                    e.getChildByName("icon").getComponent(Sprite).spriteFrame = t.poolIcons[d];
                } else
                    e.getChildByName("icon").active = false;
            } else
                e.active = false;
        }

    }


    update(deltaTime: number) {

    }
}

