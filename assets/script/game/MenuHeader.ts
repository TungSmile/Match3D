import { _decorator, Component, Label, log, Node, Sprite, SpriteFrame, tween, UITransform, Vec3, sp } from 'cc';
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
    positiveDis = new Vec3(0, 35, 0);
    negativeDis = new Vec3(0, -35, 0);
    timeAnim = 0.3;
    start() {
        this.getData()
    }

    getData() {
        let t = this;
        t.loadUITaskMission();
        t.loadUITempStock();
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


        // action item fly to task
        tween(t.itemMove)
            .to(time, { position: loacalTo })
            .call(() => {
                log(' anim item to task done');
                t.itemMove.getComponent(Sprite).spriteFrame = null;
            })
            .start()


        // t.animationTakeBox(t.taskMission.children[GameData.instance.eventTask]);
        log("???", GameData.instance.countTask)
        if (t.numberTaskHasShow != GameData.instance.countTask) {
            t.numberTaskHasShow = GameData.instance.countTask;
            t.animationTakeBox(t.taskMission.children[GameData.instance.eventTask]);
            time += (t.timeAnim * 2)
            log("are run in func item to task")
        }


        log(time, "check time")
        t.scheduleOnce(() => {
            t.loadUITaskMission()
        }, time)
    }

    // type loi duyet moi task voi stock lq meos thg o ngoai
    animStockToTask() {
        let t = this;
        let time = 1;
        let data = GameData.instance.checkItemInStock(GameData.instance.typeItemCleanStock);
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
            log("??????")
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


        // data.forEach(e => {
        //     let temp = t.tempStock.children[e]
        //     if (temp) {
        //         let icon = temp.getChildByName("icon");
        //         let posOrigin = icon.getWorldPosition(new Vec3);
        //         GameData.instance.addItemToTask(GameData.instance.typeItemCleanStock);
        //         tween(icon)
        //             .to(time, { worldPosition: taskPos })
        //             .call(() => {
        //                 GameData.instance.remoteItemInStock(GameData.instance.typeItemCleanStock)
        //                 icon.getComponent(Sprite).spriteFrame = null;
        //             })
        //             .to(0, { worldPosition: posOrigin })
        //             .call(() => {
        //                 t.loadUITaskMission()
        //                 t.loadUITempStock()
        //             })
        //             .start()
        //     }
        // });
        // t.scheduleOnce(() => {
        //     // log(GameData.instance.getTempTask(), "after clean stock");
        //     log(GameData.instance.getTaskMission(), "after clean stock");
        //     // log(GameData.instance.getPoolItem(), "after clean stock");
        //     t.loadUITaskMission()
        //     // t.loadUITempStock()
        // }, time + (data.length * 0.1))
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
            .by(t.timeAnim, { position: t.negativeDis })
            .call(() => {
                leftH.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                leftH.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAnim)
            .by(t.timeAnim, { position: t.positiveDis })
            .start();
        tween(rightH)
            .by(t.timeAnim, { position: t.negativeDis })
            .call(() => {
                rightH.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                rightH.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAnim)
            .by(t.timeAnim, { position: t.positiveDis })
            .start();
        tween(box)
            .delay(t.timeAnim * 2)
            .by(t.timeAnim, { position: t.positiveDis })
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
            .by(t.timeAnim, { position: t.negativeDis })
            .call(() => {
                leftH.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                leftH.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAnim)
            .by(t.timeAnim, { position: t.positiveDis })
            .start();
        tween(rightH)
            .by(t.timeAnim, { position: t.negativeDis })
            .call(() => {
                rightH.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                rightH.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAnim)
            .by(t.timeAnim, { position: t.positiveDis })
            .start();
        tween(box)
            .by(t.timeAnim, { position: t.negativeDis })
            .start();


    }

    update(deltaTime: number) {

    }
}

