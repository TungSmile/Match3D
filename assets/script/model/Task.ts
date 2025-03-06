import { _decorator, Component, Label, log, Node, sp, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Task')
export class Task extends Component {
    private typeItem: number = -1;
    private capacityItem: number = 0;
    private itemPicker: number = 0;
    private upPos = new Vec3(0, 35, 0);
    private downPos = new Vec3(0, -35, 0);
    private hasAnim: boolean = false;
    private timeAction: number = 0.3;

    @property({ type: Label })
    broadCount: Label = null;
    @property({ type: Node })
    box: Node = null;
    @property({ type: Node })
    lock: Node = null;
    @property({ type: Node })
    handLeft: Node = null;
    @property({ type: Node })
    handRight: Node = null;



    start() {

    }

    fillData(data) {
        let t = this;
        let backUp = { type: t.typeItem, quantity: t.itemPicker, capacity: t.capacityItem };
        if (t.setTypeItem(data.type) && t.setCapacity(data.capacity) && t.setItemPicker(data.quantity)) {
            t.setImageItem(data.img);
            return true
        } else {
            t.setTypeItem(backUp.type);
            t.setCapacity(backUp.capacity);
            t.setItemPicker(backUp.quantity);
            log("erros when fill data task")
            return false
        }
    }



    setTypeItem(type: number) {
        let t = this;
        if (type < -1) {
            log("problem what kind type item ???");
            t.typeItem = -1
            return false
        }
        t.typeItem = type;
        return true
    }

    setCapacity(capacity: number) {
        let t = this;
        if (capacity < 1) {
            log("problem when set capacity in task");
            t.typeItem = 0;
            return false
        }
        t.typeItem = capacity;
        return true
    }


    setItemPicker(numItem: number) {
        let t = this;
        let broad;
        if (numItem < t.itemPicker) {
            log("problem i dont remeber has func minus item ");
            return false
        }
        if (numItem > t.capacityItem) {
            log("problem item picker greate than capacity :))");
            return false
        }
        t.itemPicker = numItem;
        t.broadCount.string = numItem.toString();
        return true
    }

    setImageItem(img: SpriteFrame) {
        let t = this;
        let icon = t.box.getChildByName("icon")
        if (img == null) {
            icon.active = false;
        } else {
            icon.active = true;
            icon.getComponent(Sprite).spriteFrame = img;
        }
    }


    setLockTask() {
        let t = this;
        t.box.active = false;
        t.lock.active = true;
    }

    showItemPicker() {
        let t = this;
        let broad = t.box.getChildByName("clipboard");
        if (!broad.active) {
            broad.active = true;
        }
        t.broadCount.string = t.itemPicker.toString();
    }


    actionResetTask(img: SpriteFrame) {
        let t = this;
        if (t.hasAnim) {
            log("stack over flow action hand ");
            return false;
        }
        t.hasAnim = true;
        t.handHoldBox();
        if (t.typeItem > -1) {
            t.scheduleOnce(() => {
                t.setImageItem(img)
                t.handDropBox();
            }, (t.timeAction * 3))
            t.scheduleOnce(() => {
                t.hasAnim = false;
            }, (t.timeAction * 6))
        }
        return true;
    }

    handHoldBox() {
        let t = this;
        t.box.getChildByName("clipboard").active = false;
        t.box.getChildByName("Done").active = true;
        t.box.getChildByName("icon").active = false;
        tween(t.handLeft)
            .by(t.timeAction, { position: t.downPos })
            .call(() => {
                t.handLeft.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                t.handLeft.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAction)
            .by(t.timeAction, { position: t.upPos })
            .start();

        tween(t.handRight)
            .by(t.timeAction, { position: t.downPos })
            .call(() => {
                t.handRight.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                t.handRight.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAction)
            .by(t.timeAction, { position: t.upPos })
            .start();

        tween(t.box)
            .delay(t.timeAction * 2)
            .by(t.timeAction, { position: t.upPos })
            .delay(t.timeAction)
            .call(() => {
                t.box.getChildByName("Done").active = false;
                t.box.getChildByName("icon").active = true;
            })
            .start();
    }

    handDropBox() {
        let t = this;
        tween(t.handLeft)
            .by(t.timeAction, { position: t.downPos })
            .call(() => {
                t.handLeft.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                t.handLeft.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAction)
            .by(t.timeAction, { position: t.upPos })
            .start();

        tween(t.handRight)
            .by(t.timeAction, { position: t.downPos })
            .call(() => {
                t.handRight.getComponent(sp.Skeleton).setAnimation(0, "action", false);
                t.handRight.getComponent(sp.Skeleton).addAnimation(0, "end", true);
            })
            .delay(t.timeAction)
            .by(t.timeAction, { position: t.upPos })
            .start();

        tween(t.box)
            .by(t.timeAction, { position: t.downPos })
            .start();


    }

    update(deltaTime: number) {

    }
}

