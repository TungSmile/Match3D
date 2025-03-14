import { _decorator, Component, ICollisionEvent, log, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
    private rigiBody: RigidBody = null;
    private timeSmooth: number = 0.2;
    private light: boolean = false;

    start() {
        let t = this;
        t.rigiBody = t.node.getComponent(RigidBody)!;

    }

    pickByHand() {
        let t = this;
        if (!t.rigiBody) {
            log('Item hasnt rigibody')
            return;
        }
        t.rigiBody.applyForce(new Vec3(0, 500, 0));
        t.scheduleOnce(() => {
            t.rigiBody.clearVelocity()
            t.rigiBody.useGravity = false;
        }, t.timeSmooth)



    }
    unPicKItem() {
        let t = this;
        t.rigiBody.useGravity = true;
        t.rigiBody.applyForce(new Vec3(0, -500, 0));
    }

    lightFrame(on: boolean = true, posCam: Vec3 = new Vec3()) {
        let t = this;
        let round = t.node.getChildByName("round");
        round.active = on;
        on ? round.lookAt(posCam, new Vec3(0, 0, 1)) : 0;
    }


    cleanVector() {
        this.rigiBody.clearVelocity()
    }



    private onColliderEnter(event: ICollisionEvent) {
        let t = this;
        const otherCollider = event.otherCollider;
    }




    update(deltaTime: number) {

       
    }
}

