import { _decorator, Component, Label, log, Node, Sprite, SpriteFrame, tween, UITransform, Vec3, sp, Prefab, instantiate } from 'cc';
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
    numberTaskHasShow: number = 0;

    // for position hand
    positiveDis = new Vec3(0, 60, 0);
    negativeDis = new Vec3(0, 25, 0);
    timeAnim = 0.3;


    @property({ type: Prefab })
    stock: Prefab = null;

    start() {
        this.getData();
        // this.renderTempStock();
    }

    getData() {
        let t = this;
        t.loadUITaskMission();
        t.renderTempStock();

        // t.loadUITempStock();
        t.numberTaskHasShow = GameData.instance.countTask;
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

    // all pos is positionWorld => cancel
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
                t.itemMove.getComponent(Sprite).spriteFrame = null;
                t.loadUITempStock()
                GameData.instance.eventAnim = false
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
        let check = false
        // action item fly to task
        tween(t.itemMove)
            .to(time, { position: loacalTo })
            .call(() => {
                t.itemMove.getComponent(Sprite).spriteFrame = null;
                check ? t.animationTakeBox(t.taskMission.children[GameData.instance.eventTask]) : 0;
            })
            .start()


        // t.animationTakeBox(t.taskMission.children[GameData.instance.eventTask]);
        if (t.numberTaskHasShow != GameData.instance.countTask) {
            t.numberTaskHasShow = GameData.instance.countTask;
            check = true;
            // t.animationTakeBox(t.taskMission.children[GameData.instance.eventTask]);
            time += (t.timeAnim * 2)
        }
        t.scheduleOnce(() => {
            t.loadUITaskMission();
            GameData.instance.eventAnim = check;
        }, time)
    }

    // type loi duyet moi task voi stock lq meos thg o ngoai
    animStockToTask() {
        let t = this;
        let time = 1;
        let data = GameData.instance.checkItemInStock(GameData.instance.typeItemCleanStock);
        GameData.instance.scoreLose -= data.length;

        let task = t.taskMission.children[GameData.instance.findTaskByTypeItem(GameData.instance.typeItemCleanStock)]
        // let data = GameData.instance.removeItemInTempStock(type);
        // let time = 1;
        // let index = GameData.instance.findTaskByTypeItem(type)
        // let test = GameData.instance.getTaskMission()
        // log(index, type, test, "check index");
        // let task = t.taskMission.children[index]
        let taskPos = new Vec3;
        if (taskPos) {
            taskPos = task.getWorldPosition(new Vec3);
        }
        GameData.instance.needCleanStock = false;
        // t.animationHandMachine(task.getChildByName("handMachine"))
        for (let i = 0; i < data.length; i++) {
            let e = data[i];
            let temp = t.tempStock.children[e];
            if (temp) {
                let icon = temp.getChildByName("icon");
                let posOrigin = icon.getWorldPosition(new Vec3);
                GameData.instance.addItemToTask(GameData.instance.typeItemCleanStock);
                tween(icon)
                    .to(time, { worldPosition: taskPos })
                    .call(() => {
                        GameData.instance.remoteItemInStock(GameData.instance.typeItemCleanStock);
                        GameData.instance.addItemToTask(GameData.instance.typeItemCleanStock)
                        icon.getComponent(Sprite).spriteFrame = null;
                    })
                    .to(0, { worldPosition: posOrigin })
                    .delay((i * 0.1))
                    .call(() => {
                        t.loadUITempStock();
                        t.loadUITaskMission()

                    })
                    .start()
            }
        }



    }

    findTaskByTypeItem(type: number) {
        let t = this;

    }

    // n is hand machine
    animationTakeBox(n: Node) {
        // all time 1.5s
        let t = this;
        let leftH = n.getChildByName("handLeft");
        let rightH = n.getChildByName("handRight");
        let box = n.getChildByName("boxActive");
        box.getChildByName("clipboard").active = false;
        box.getChildByName("Done").active = true;
        box.getChildByName("icon").active = false;
        tween(leftH)
            .to(t.timeAnim, { position: t.negativeDis })
            .call(() => {
                leftH.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                leftH.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAnim)
            .by(t.timeAnim, { position: t.positiveDis })
            .start();
        tween(rightH)
            .to(t.timeAnim, { position: t.negativeDis })
            .call(() => {
                rightH.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                rightH.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAnim)
            .to(t.timeAnim, { position: t.positiveDis })
            .start();
        tween(box)
            .delay(t.timeAnim * 2)
            .to(t.timeAnim, { position: new Vec3(0, 35, 0) })
            .delay(t.timeAnim)
            .call(() => {
                t.animationDropBox(n)
                box.getChildByName("Done").active = false;
                box.getChildByName("icon").active = true;
            })
            .start();

    }


    animationDropBox(n: Node) {
        let t = this;
        let leftH = n.getChildByName("handLeft");
        let rightH = n.getChildByName("handRight");
        let box = n.getChildByName("boxActive");
        box.getChildByName("clipboard").active = true;
        tween(leftH)
            .to(t.timeAnim, { position: t.negativeDis })
            .call(() => {
                leftH.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                leftH.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAnim)
            .to(t.timeAnim, { position: t.positiveDis })
            .start();
        tween(rightH)
            .to(t.timeAnim, { position: t.negativeDis })
            .call(() => {
                rightH.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                rightH.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAnim)
            .to(t.timeAnim, { position: t.positiveDis })
            .call(() => {
                GameData.instance.eventAnim = false;
            })
            .start();
        tween(box)
            .to(t.timeAnim, { position: Vec3.ZERO })
            .start();


    }


    // func calculation temp stock need render

    // 1080/8 135
    renderTempStock() {
        let t = this;
        let temp = 135;
        let n = GameData.instance.numberSlotTempTask;
        let startX = -temp * (n - 1) / 2;
        for (let i = 0; i < n; i++) {
            let e = instantiate(t.stock);
            e.name = i.toString();
            t.tempStock.addChild(e);
            let x = startX + i * temp;
            e.setPosition(new Vec3(x, 6.5, 0));
        }
    }



    update(deltaTime: number) {

    }
}

