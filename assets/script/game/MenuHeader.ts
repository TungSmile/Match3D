import { _decorator, Component, game, Label, log, Node, Sprite, SpriteFrame, tween, UITransform, Vec3 } from 'cc';
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

    @property({ type: Node })
    itemMove: Node = null;

    typeItemSelecter: number = -1;


    start() {
        this.getData()
    }

    getData() {
        let t = this;
        t.loadUITaskMission()
        t.loadUITempStock()
    }

    refreshTask() {
        let t = this
    }


    newTaskMission() {
        let t = this;

    }

    loadUITaskMission() {
        let t = this;
        let data = GameData.instance.getTaskMission();
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
    }


    loadUITempStock() {
        let t = this;
        let data = GameData.instance.getTempTask();
        log(data, "fortemp")
        for (let i = 0; i < t.tempStock.children.length; i++) {
            let e = t.tempStock.children[i];
            let d: number = data[i];
            if (!isNaN(d)) {
                e.active = true;
                if (d != -1) {
                    e.getChildByName("icon").active = true;
                    e.getChildByName("icon").getComponent(Sprite).spriteFrame = t.poolIcons[d];
                } else
                    e.getChildByName("icon").getComponent(Sprite).spriteFrame = null;
            } else
                e.active = false;
        }

    }

    setItemEvent(type: number) {
        this.typeItemSelecter = type;
    }

    // all pos is positionWorld => cancal
    // all pos is localPos

    animItemToStock(posFrom: Vec3) {
        let t = this;
        let time = 0.5;
        let localFrom = t.node.getComponent(UITransform).convertToNodeSpaceAR(posFrom, new Vec3);
        let posTo = t.tempStock.children[GameData.instance.eventStock].getWorldPosition(new Vec3);
        let loacalTo = t.node.getComponent(UITransform).convertToNodeSpaceAR(posTo, new Vec3);

        t.itemMove.getComponent(Sprite).spriteFrame = t.poolIcons[t.typeItemSelecter];
        t.itemMove.setPosition(localFrom);

        tween(t.itemMove)
            .to(time, { position: loacalTo })
            .call(() => {
                log(' anim item to stock done');
                t.itemMove.getComponent(Sprite).spriteFrame = null;
                t.loadUITempStock()
            })
            .start()
    }

    animItemToTask(posFrom: Vec3) {
        let t = this;
        let time = 0.5;
        let localFrom = t.node.getComponent(UITransform).convertToNodeSpaceAR(posFrom, new Vec3);
        let posTo = t.taskMission.children[GameData.instance.eventTask].getWorldPosition(new Vec3);
        let loacalTo = t.node.getComponent(UITransform).convertToNodeSpaceAR(posTo, new Vec3);

        t.itemMove.getComponent(Sprite).spriteFrame = t.poolIcons[t.typeItemSelecter];
        t.itemMove.setPosition(localFrom);

        tween(t.itemMove)
            .to(time, { position: loacalTo })
            .call(() => {
                log(' anim item to task done');
                t.itemMove.getComponent(Sprite).spriteFrame = null;
                t.loadUITaskMission()
            })
            .start()
    }


    animStockToTask(type: number) {
        let t = this;
        let data = GameData.instance.removeItemInTempStock(-2);
        let time = 1;

        GameData.instance.needCleanStock = false;
        data.forEach(e => {
            let temp = t.tempStock.children[e]
            if (temp) {
                let icon = temp.getChildByName("icon");
                tween(icon)
                    .to(time, { position: new Vec3 })
            }
        });
    }

    findTaskByTypeItem(type: number) {
        let t = this;

    }


    update(deltaTime: number) {

    }
}

