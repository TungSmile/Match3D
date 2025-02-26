import { _decorator, Component, ICollisionEvent, log, Node, RigidBody, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
    private rigiBody: RigidBody = null;


    start() {
        let t = this;
        t.rigiBody = t.node.getComponent(RigidBody)!;
        // t.scheduleOnce(() => {
        //     t.pickByHand()
        // }, 5)
    }





    pickByHand() {
        let t = this;
        if (!t.rigiBody) {
            log('Item hasnt rigibody')
            return;
        }
        // kéo item lên (có thể thay bằng tween + làm rõ bold)
        // chỉnh lại time để tăng smooth
        t.rigiBody.applyForce(new Vec3(0, 500, 0));
        t.scheduleOnce(() => {
            t.rigiBody.clearVelocity()
            t.rigiBody.useGravity = false;

            log('do it 2')

        }, 0.3)

        // test
        // let camFake = new Vec3(0, 5, 0)

        // let newPos: Vec3 = camFake
        // // new Vec3(camPos.x, camPos.y - 10, camPos.z);
        // let time = 1;
        // tween(t.node)
        //     .to(time, {
        //         worldPosition: newPos
        //     })
        //     .start();

    }

    unPicKItem() {
        let t = this;
        t.rigiBody.useGravity = true;
        t.rigiBody.applyForce(new Vec3(0, -500, 0));
        log('has run')
    }


    lightFrame(on: boolean = true) {
        let t = this;
        if (on) {

        } else {

        }
    }








    private onColliderEnter(event: ICollisionEvent) {
        let t = this;
        const otherCollider = event.otherCollider;
    }




    update(deltaTime: number) {

    }
}

