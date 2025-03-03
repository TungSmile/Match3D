import { _decorator, Camera, Component, EventTouch, geometry, log, Node, PhysicsSystem, SpriteFrame, Vec3 } from 'cc';
import { AudioManager } from './AudioManager';
import { Constants } from '../data/Constants';
import { Item } from './Item';
import { GameData } from '../data/GameData';
import { Menu2D } from './MenuHeader';
const { ccclass, property } = _decorator;

@ccclass('GameControll')
export class GameControll extends Component {

    @property
    useScriptGame: boolean = false;


    @property({ type: Camera })
    CamMain: Camera = null;

    @property({ type: Node })
    Menu2d: Node = null

    private ItemHoldUp: Node = null;
    // block muti event touch
    private eventTouch: boolean = true;

    endGame: boolean = false;

    // world position
    posTouchHand: Vec3 = null


    protected onLoad(): void {
        GameData.instance.createDataLogicGame();
        GameData.instance.useScriptGame = this.useScriptGame;
    }



    start() {
        let t = this;
        // AudioManager.playMusic(Constants.AudioSource.BACKGROUND) ko hiểu tại sao thừa tham số mà vẫn viết đc ???
        // AudioManager.playSound(Constants.AudioSource.BACKGROUND);
        GameData.instance.createDataLogicGame();
        GameData.instance.useScriptGame = t.useScriptGame;
        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_START, t.touchStart, t);
        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_END, t.touchEnd, t);
        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_CANCEL, t.touchCancel, t);
        // t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_MOVE, t.touchCancel, t);
    }


    // sự kiện bắt item
    touchStart(event) {
        let t = this;
        if (!t.eventTouch) {
            return
        }
        t.eventTouch = false;
        t.posTouchHand = t.Menu2d.getChildByName("Camera").getComponent(Camera).screenToWorld(new Vec3(event.getLocationX(), event.getLocationY(), 0))
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
        let typeItem = Number(n.name);
        log(typeItem, "check")
        let taskS = GameData.instance.getTaskMission();
        if (n.getComponent(Item)) {
            t.ItemHoldUp = n
            n.getComponent(Item).pickByHand();
            n.getComponent(Item).lightFrame(true)
        }
        // log(taskS.some(item => item.type == typeItem))
        // if (taskS.some(item => item.type == typeItem)) {
        //     n.destroy();
        //     GameData.instance.removeItem(typeItem);
        //     log(GameData.instance.getPoolItem())
        // }
    }



    touchEnd(event) {
        let t = this;
        let inOrOut: boolean = false;
        // sovle 2 way
        // 1. if unTouch on item => corect
        // 2. mouse or  figher outside frame item => wrong
        let itemInHand = t.ItemHoldUp?.getComponent(Item);
        if (!itemInHand) {
            console.log("Item hasnt script ???/ u are select planet");
            t.eventTouch = true;
            t.ItemHoldUp = null;
            return;
        }
        let taskS = GameData.instance.getTaskMission();
        let typeItem = Number(t.ItemHoldUp.name);
        if (taskS.some(item => item.type == typeItem)) {
            t.correctItem(typeItem);
            // GameData.instance.removeItem(typeItem);
            // t.ItemHoldUp.destroy();
            // t.ItemHoldUp = null;
        } else {
            t.wrongItem(typeItem);
            // t.ItemHoldUp.getComponent(Item).lightFrame(false)
            // t.ItemHoldUp.getComponent(Item).unPicKItem();
            // t.ItemHoldUp = null;
        }
        // if (inOrOut) {
        //     t.ItemHoldUp.getComponent(Item).unPicKItem();
        //     t.ItemHoldUp = null;
        // } else {
        //     t.ItemHoldUp = null;
        // }
        t.eventTouch = true;
    }

    touchCancel() {
        let t = this;
        let itemInHand = t.ItemHoldUp?.getComponent(Item);
        if (itemInHand) {
            t.ItemHoldUp.getComponent(Item).lightFrame(false)
            t.ItemHoldUp.getComponent(Item).unPicKItem();
        }
        t.eventTouch = true;
        t.ItemHoldUp = null;
    }



    correctItem(typeItem: number) {
        let t = this;
        GameData.instance.removeItem(typeItem);
        GameData.instance.addItemToTask(typeItem);

        // log(GameData.instance.getTaskMission())
        //  : GameData.instance.addItemToTempStock(typeItem) ? log(GameData.instance.getTempTask()) : t.endGame = true;
        t.refreshUIMenu(Constants.StatusItem.PoolToTask, typeItem);
        t.ItemHoldUp.destroy();
        t.ItemHoldUp = null;


    }

    wrongItem(typeItem: number) {
        let t = this;
        // GameData.instance.removeItem(typeItem);
        if (GameData.instance.addItemToTempStock(typeItem)) {
            GameData.instance.removeItem(typeItem);
            t.ItemHoldUp.destroy();
            t.ItemHoldUp = null;
            t.refreshUIMenu(Constants.StatusItem.PoolToTemp, typeItem);
        } else {
            t.endGame = true;
            t.touchCancel()
        }
        log(GameData.instance.getTempTask(), t.endGame)

    }

    refreshUIMenu(status, type: number) {
        let t = this;
        let uiAnimtion = t.Menu2d.getChildByName("HeadMenu").getComponent(Menu2D);
        
        switch (status) {
            case Constants.StatusItem.PoolToTask:
                uiAnimtion.setItemEvent(type)
                uiAnimtion.animItemToTask(t.posTouchHand);
                break;
            case Constants.StatusItem.PoolToTemp:
                uiAnimtion.setItemEvent(type)
                uiAnimtion.animItemToStock(t.posTouchHand);

                break;
            default:
                break;
        }

        // t.Menu2d.getChildByName("HeadMenu").getComponent(Menu2D).getData();
    }


    update(deltaTime: number) {

    }
}

