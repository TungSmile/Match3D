import { _decorator, Camera, Component, EventTouch, geometry, Node, PhysicsSystem, SpriteFrame } from 'cc';
import { AudioManager } from './AudioManager';
import { Constants } from '../data/Constants';
import { Item } from './Item';
import { GameData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass('GameControll')
export class GameControll extends Component {

    @property({ type: Camera })
    CamMain: Camera = null;

    @property({ type: Node })
    Menu2d: Node = null

    private ItemHoldUp: Node = null;
    // block muti event touch
    private eventTouch: boolean = true;


    @property({ type: [SpriteFrame] })
    poolIcons: SpriteFrame[] = [];

    // public onEnable(): void {
    // }


    start() {
        let t = this;
        // AudioManager.playMusic(Constants.AudioSource.BACKGROUND) ko hiểu tại sao thừa tham số mà vẫn viết đc ???
        // AudioManager.playSound(Constants.AudioSource.BACKGROUND);
        GameData.instance.createDataLogicGame();
        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_START, t.touchStart, t);
        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_END, t.touchEnd, t)
        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_CANCEL, t.touchEnd, t)

    }


    // sự kiện bắt item
    touchStart(event) {
        let t = this;

        if (!t.eventTouch) {
            return
        }
        t.eventTouch = false;
        // const touches = event.getAllTouches();
        // t.startEventRotation = event.getLocation();
        const camera = t.CamMain.getComponent(Camera);
        let ray = new geometry.Ray();
        camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        const mask = 0xffffffff;
        const maxDistance = 100;
        const queryTrigger = true;
        const bResult = PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger);
        if (bResult) {
            // raycasst chạy qua hết
            const results = PhysicsSystem.instance.raycastResults;
            // raycast gặp vật cản đầu tiên
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            // bắt = colider
            const collider = raycastClosestResult.collider;
            if (collider.node) {
                // fun checkItem sovle all above
                // 1 animation pull up item
                // 2 light bold
                t.checkItem(collider.node)
            } else {
                t.eventTouch = true;
                return
            }
        }
    }



    checkItem(n: Node) {
        let t = this;
        console.log(n.name);
        if (n.getComponent(Item)) {
            t.ItemHoldUp = n
            n.getComponent(Item).pickByHand();
            n.getComponent(Item).lightFrame(true)
        }
    }






    touchEnd() {
        let t = this;
        let inOrOut: boolean = false;
        // sovle 2 way
        // 1. if unTouch on item => corect
        // 2. mouse or  figher outside frame item => wrong


        let itemInHand = t.ItemHoldUp?.getComponent(Item);
        if (!itemInHand) {
            console.log("Item hasnt script ???");
            t.eventTouch = true;
            t.ItemHoldUp = null;
            return;
        }
        t.ItemHoldUp.getComponent(Item).lightFrame(false)
        t.ItemHoldUp.getComponent(Item).unPicKItem();
        t.ItemHoldUp = null;

        // if (inOrOut) {
        //     t.ItemHoldUp.getComponent(Item).unPicKItem();
        //     t.ItemHoldUp = null;
        // } else {
        //     t.ItemHoldUp = null;
        // }
        t.eventTouch = true;
    }



















    update(deltaTime: number) {

    }
}

