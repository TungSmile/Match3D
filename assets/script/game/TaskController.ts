import { _decorator, Component, instantiate, Node, Prefab, Sprite, SpriteFrame, tween, UITransform, Vec3 } from 'cc';
import { GameData } from '../data/GameData';
import { Task } from '../model/Task';
const { ccclass, property } = _decorator;

@ccclass('TaskController')
export class TaskController extends Component {

    @property({ type: Prefab })
    task: Prefab = null;

    @property({ type: Node })
    poolTask: Node = null;

    @property({ type: Node })
    poolTempTask: Node = null;

    @property({ type: [SpriteFrame] })
    poolIcons: SpriteFrame[] = [];

    @property({ type: Node })
    itemAnimation: Node = null;

    hasAnimation: boolean = false;
    timeAction: number = 0.5


    start() {

    }


    createTask() {
        let t = this;
        let data = GameData.instance.getTaskMission();
        for (let i = 0; i < data.length; i++) {
            let dataTask = data[i];
            let task = instantiate(t.task);
            task.name = i.toString();
            if (dataTask.unlock) {
                task.getComponent(Task).fillData({ type: dataTask.type, capacity: dataTask.capacity, quantity: dataTask.quantity, img: t.poolIcons[dataTask.type] })
            } else {
                task.getComponent(Task).setLockTask();
            }
            t.poolTask.addChild(task)
        }
    }


    itemPoolToTask(typeItem: number, positionItem: Vec3) {
        let t = this;
        let startPos = t.node.getComponent(UITransform).convertToNodeSpaceAR(positionItem, new Vec3);
        let taskEventPos = t.poolTask.children[GameData.instance.eventTask].getWorldPosition(new Vec3);
        let endPos = t.node.getComponent(UITransform).convertToNodeSpaceAR(taskEventPos, new Vec3);
        t.itemAnimation.getComponent(Sprite).spriteFrame = t.poolIcons[typeItem];
        t.itemAnimation.setPosition(startPos);
        t.hasAnimation = true;
        tween(t.itemAnimation)
            .to(t.timeAction, { position: endPos })
            .call(() => {
            })
            .start();
    }

    itemPoolToTempTask(typeItem: number, positionItem: Vec3) {
        let t = this;
        let startPos = t.node.getComponent(UITransform).convertToNodeSpaceAR(positionItem, new Vec3);
        let taskEventPos = t.poolTempTask.children[GameData.instance.eventStock].getWorldPosition(new Vec3);
        let endPos = t.node.getComponent(UITransform).convertToNodeSpaceAR(taskEventPos, new Vec3);
        t.itemAnimation.getComponent(Sprite).spriteFrame = t.poolIcons[typeItem];
        t.itemAnimation.setPosition(startPos);
        t.hasAnimation = true;
        tween(t.itemAnimation)
            .to(t.timeAction, { position: endPos })
            .call(() => {
            })
            .start();
    }

    itemTempTaskToTask() {
        let t = this;
        let data = GameData.instance.checkItemInStock(GameData.instance.typeItemCleanStock);
        let taskPos = t.poolTask.children[GameData.instance.findTaskByTypeItem(GameData.instance.typeItemCleanStock)].getWorldPosition(new Vec3);
        GameData.instance.needCleanStock = false;
        for (let i = 0; i < data.length; i++) {
            let e = data[i];
            let tempTask = t.poolTempTask.children[e];
            if (tempTask) {
                let icon = temp.getChildByName("icon");
                let posOrigin = icon.getWorldPosition(new Vec3);
            }
        }

    }




    update(deltaTime: number) {

    }
}

