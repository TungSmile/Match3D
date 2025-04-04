import { _decorator, Component, ICollisionEvent, log, MeshRenderer, Quat, renderer, RigidBody, Vec3 } from 'cc';
import { Constants } from '../data/Constants';
import { GameData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
    private rigiBody: RigidBody = null;
    private timeSmooth: number = 0.2;
    private id: number = 0;
    private indexOld: number;
    // private mat: renderer.MaterialInstance = null;
    start() {
        let t = this;
        t.rigiBody = t.node.getComponent(RigidBody)!;
        // t.indexOld = t.node.getSiblingIndex();
        // t.mat = t.node.getChildByName("ligh")?.getComponent(MeshRenderer)?.getMaterial[0];
    }

    pickByHand() {
        let t = this;
        if (!t.rigiBody) {
            log('Item hasnt rigibody')
            return;
        }
        t.rigiBody.applyLocalForce(new Vec3(0, 700, 700));
        // t.scheduleOnce(() => {
        //     t.rigiBody.clearVelocity()
        //     t.rigiBody.useGravity = false;
        // }, t.timeSmooth)
    }
    unPicKItem() {
        let t = this;
        t.rigiBody.applyLocalForce(new Vec3(0, -500, 0));
        t.scheduleOnce(() => {
            t.rigiBody.clearVelocity()
            t.rigiBody.useGravity = true;
        }, t.timeSmooth)
    }



    pullToCam(cameraPos: Vec3, isPull: boolean) {
        // cam is positionWorld
        let t = this;
        // if (!isPull) {
        //     // t.rigiBody.clearVelocity()
        //     t.rigiBody.useGravity = true;
        //     return;
        // }
        // const objectPos = t.node.getWorldPosition(new Vec3);
        // const direction = new Vec3();
        // isPull ? Vec3.subtract(direction, cameraPos, objectPos)   : Vec3.subtract(direction, objectPos, cameraPos)
        // direction.normalize();
        // const force = new Vec3();
        // Vec3.multiplyScalar(force, direction, Constants.forceMagnitude);
        // t.rigiBody.applyForce(force);
        t.rigiBody.applyForce(new Vec3(0, isPull ? 100 : -100, 0));
        // log(force, "how strong")
        // t.scheduleOnce(() => {
        //     t.rigiBody.clearVelocity()
        //     // t.rigiBody.useGravity = false;
        // }, t.timeSmooth * 0.5)


    }



    // light round only shade is sphene :V
    // this hot fix
    turnLight: boolean = false;
    camForward: Vec3
    lightFrame(on: boolean = true, posCam: Vec3 = new Vec3(), newId: number = 0) {
        let t = this;
        let round = t.node.getChildByName("light");
        // let item = t.node.getChildByName("item");
        if (round) {
            round.active = on;
            // item.active = !on;
            // t.node.setSiblingIndex(on ? newId : t.indexOld)

        }



        // t.turnLight = on;

        // if (on) {
        //     round.lookAt(posCam);
        //     t.camForward = posCam
        // }
        // t.getIndi()

        // let mesh = t.node.children[0].getComponent(MeshRenderer);
        // log(t.mat)
        // if (on && t.mat) {
        //     // mesh.setInstancedAttribute("i_mainColor", GameData.instance.insColor.WHITE)
        //     t.mat.setProperty('lineWidth', 60);
        // } else {
        //     t.mat.setProperty('lineWidth', 0);
        // }



    }


    cleanVector() {
        let t = this;
        // t.rigiBody.clearVelocity();
        // t.rigiBody.useGravity = true;
        t.rigiBody.applyForce(new Vec3(0, -500, 0));
    }





    private onColliderEnter(event: ICollisionEvent) {
        let t = this;
        const otherCollider = event.otherCollider;
        // xử lý to up 
    }



    getPos() {
        let t = this;
        let mesh = t.node.children[0].getComponent(MeshRenderer).mesh;
        if (mesh) {
            return mesh.renderingSubMeshes[0].geometricInfo.positions;
        }
        // log(mesh.renderingSubMeshes[0].geometricInfo.indices), "test dinh";
    }

    getIndi() {
        let t = this;
        let mesh = t.node.children[0].getComponent(MeshRenderer).mesh;
        if (mesh) {
            return mesh.renderingSubMeshes[0].geometricInfo.indices;
        }
    }




    getId() {
        return this.id;
    }

    setID(id: number) {
        this.id = id;
    }

    update(deltaTime: number) {
        let t = this;

    }
}

