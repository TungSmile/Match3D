import { _decorator, Component, Label, Node, sp, SpriteFrame, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Task')
export class Task extends Component {
    private typeItem: number = -1;
    private capacityItem: number = 0;
    private hasItem: number = 0;
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
    }



    setTypeItem(type: number) {
        let t = this;

    }


    actionResetTask(type: number,img:SpriteFrame) {
        let t = this;
        t.hasAnim=true;


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

