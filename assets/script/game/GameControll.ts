import { _decorator, Camera, Component, EventTouch, geometry, log, Node, PhysicsSystem, SpriteFrame, tween, Vec3, view } from 'cc';
// import { AudioManager } from './AudioManager';
import { Constants } from '../data/Constants';
import { GameData } from '../data/GameData';
import { Menu2D } from './MenuHeader';
import { Item } from '../model/Item';
import { PoolItem } from './PoolItem';
const { ccclass, property } = _decorator;

@ccclass('GameControll')
export class GameControll extends Component {

    @property
    useScriptGame: boolean = false;


    @property({ type: Camera })
    CamMain: Camera = null;

    @property({ type: Node })
    Menu2d: Node = null


    @property({ type: Node })
    TaskController: Node = null


    @property({ type: Node })
    poolItem: Node = null

    @property({ type: Node })
    nodeHint: Node = null


    private ItemHoldUp: Node = null;
    // block muti event touch
    private eventTouch: boolean = true;

    endGame: boolean = false;

    // world position
    posTouchHand: Vec3 = null


    fristTouchCount: boolean = false;

    protected onLoad(): void {
        GameData.instance.useScriptGame = this.useScriptGame;
        GameData.instance.createDataLogicGame();
        view.on("canvas-resize", () => {
            this.setWhenStart();
        });
    }

    setWhenStart() {
        let t = this;
        const screenSize = view.getVisibleSize();
        let width = screenSize.width;
        let height = screenSize.height;
        let ratio = width / height;
        log(width, height, ratio)
    }


    start() {
        let t = this;
        // AudioManager.playMusic(Constants.AudioSource.BACKGROUND) ko hiểu tại sao thừa tham số mà vẫn viết đc ???
        // AudioManager.playSound(Constants.AudioSource.BACKGROUND);
        GameData.instance.createDataLogicGame();
        GameData.instance.useScriptGame = t.useScriptGame;
        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_START, t.fristTouch, t);

        // t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_MOVE, t.touchCancel, t);
        t.scheduleOnce(() => {
            t.fristTouch()
            t.stepHint(GameData.instance.scoreWin);
        }, 5)
    }


    fristTouch() {
        let t = this;
        if (t.fristTouchCount) {
            return
        }
        t.fristTouchCount = true;
        t.Menu2d.getChildByName("ArenaListenerTouch").off(Node.EventType.TOUCH_START, t.fristTouch, t);
        // t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_START, t.touchStart, t);
        // t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_END, t.touchEnd, t);
        // t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_CANCEL, t.touchCancel, t);
        // t.stepHint(GameData.instance.scoreWin);

    }





    // sự kiện bắt item
    touchStart(event) {
        let t = this;
        if (!t.eventTouch || t.endGame) {
            return
        }
        t.eventTouch = false;
        t.posTouchHand = t.Menu2d.getChildByName("Camera").getComponent(Camera).screenToWorld(new Vec3(event.getLocationX(), event.getLocationY(), 0))
        // t.startEventRotation = event.getLocation();
        const camera = t.CamMain.getComponent(Camera);
        let ray = new geometry.Ray();
        camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        const mask = 0xffffffff;
        const maxDistance = 10000;
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
                t.checkItem(collider.node);
                // log(collider.node.name, "check touch item ")
            } else {
                t.eventTouch = true;
                return
            }
        }
        t.resetAnimHint(true)
    }


    checkItem(n: Node) {
        let t = this;
        // let typeItem = Number(n.name);
        // log(typeItem, "check")
        // let taskS = GameData.instance.getTaskMission();
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
        // sovle 2 way
        // 1. if unTouch on item => corect
        // 2. mouse or  figher outside frame item => wrong
        let itemInHand = t.ItemHoldUp?.getComponent(Item);
        if (!itemInHand) {
            log("Item hasnt script ???/ u are select planet");
            t.eventTouch = true;
            t.ItemHoldUp = null;
            return;
        }
        let typeItem = Number(t.ItemHoldUp.name);
        if (GameData.instance.findIdTaskByType(typeItem) > -1) {
            t.correctItem(typeItem);
        } else {
            t.wrongItem(typeItem);
        }
        t.eventTouch = true;
        // t.scheduleOnce(() => {
        //     t.stepHint(GameData.instance.scoreWin);
        // }, 2.8)
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
        GameData.instance.removeItemInPool(typeItem);
        GameData.instance.addItemToTask(typeItem);
        if (GameData.instance.scoreWin < 2) {
            t.refreshUIMenu(Constants.StatusItem.HintToTask, typeItem);
        }
        else if (GameData.instance.needCleanStock) {
            t.refreshUIMenu(Constants.StatusItem.TempToTask, typeItem);
        } else
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
            GameData.instance.removeItemInPool(typeItem);
            t.ItemHoldUp.destroy();
            t.ItemHoldUp = null;
            t.refreshUIMenu(Constants.StatusItem.PoolToTemp, typeItem);
        } else {

            // chưa có logic full stock và add thêm item thì sẽ show gì
            // t.endGame = true;


            t.touchCancel()
        }
    }

    refreshUIMenu(status, type: number) {
        let t = this;
        let uiAnimtion = t.Menu2d.getChildByName("HeadMenu").getComponent(Menu2D);
        log(status, "check staus is number")
        switch (status) {
            case Constants.StatusItem.PoolToTask:
                uiAnimtion.setItemEvent(type)
                uiAnimtion.animItemToTask(t.posTouchHand);
                GameData.instance.scoreWin++;
                break;
            case Constants.StatusItem.PoolToTemp:
                uiAnimtion.setItemEvent(type)
                uiAnimtion.animItemToStock(t.posTouchHand);
                GameData.instance.scoreLose++;
                break;
            case Constants.StatusItem.TempToTask:
                GameData.instance.scoreWin++;
                uiAnimtion.setItemEvent(type);
                uiAnimtion.animItemToTask(t.posTouchHand);
                t.scheduleOnce(() => {
                    uiAnimtion.animStockToTask()
                }, 1);
                break;
            case Constants.StatusItem.HintToTask:
                uiAnimtion.setItemEvent(type)
                uiAnimtion.animItemToTask(t.posTouchHand);
                GameData.instance.scoreWin++;
                break;
            default:
                break;
        }


    }

    getPosForHint() {
        let t = this;
        let item = t.poolItem.getComponent(PoolItem).findPosItemClosetByType(Constants.scriptGame[GameData.instance.hintCount]);
        let pos = t.CamMain.convertToUINode(item.getWorldPosition(new Vec3), t.Menu2d, new Vec3);
        t.ItemHoldUp = item;
        return pos;
    }


    stepHint(step: number = 0) {
        let t = this;
        let pos
        log("next step hint", step)


        switch (step) {
            case 0:
                pos = t.getPosForHint();
                console.log(pos, "check");
                tween(t.nodeHint)
                    .to(1, { position: pos })
                    .call(() => {
                        t.animPushHand()
                    })
                    .delay(3)
                    .call(() => {
                        t.posTouchHand = pos;
                        t.correctItem(Number(t.ItemHoldUp.name))
                    }).delay(0.5)
                    .call(() => {
                        t.stepHint(GameData.instance.scoreWin);
                    })
                    .start()
                break;
            case 1:
                pos = t.getPosForHint();
                t.resetAnimHint()
                tween(t.nodeHint)
                    .to(1, { position: pos })
                    .call(() => {
                        t.animPushHand()
                    })
                    .delay(3)
                    .call(() => {
                        t.correctItem(Number(t.ItemHoldUp.name))
                    }).delay(0.5)
                    .call(() => {
                        t.stepHint(GameData.instance.scoreWin);
                    })
                    .start()
                break;
            case 2:
                pos = t.getPosForHint();
                t.resetAnimHint()
                tween(t.nodeHint)
                    .to(1, { position: pos })
                    .call(() => {
                        t.animPushHand();
                        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_START, t.touchStart, t);
                        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_END, t.touchEnd, t);
                        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_CANCEL, t.touchCancel, t);
                    })
                    .start()
                break;
            default:
                break;
        }


    }




    effHand = null;
    animPushHand() {
        let t = this;
        let hand = t.nodeHint.getChildByName("hand");
        hand.active = true;
        let timeAnim = 0.5;
        t.effHand = tween(hand)
            .to(timeAnim, { position: new Vec3(0, - 15, 0) })
            .to(timeAnim, { position: new Vec3(0, 15, 0) })
            // .to(timeAnim, { position: new Vec3(0, -15, 0) })
            // .to(timeAnim, { position: new Vec3(0, 15, 0) })
            // .to(timeAnim, { position: new Vec3(0, -15, 0) })
            // .to(timeAnim, { position: new Vec3(0, 15, 0) })
            // .to(timeAnim, { position: new Vec3(0, -15, 0) })
            // .to(timeAnim, { position: new Vec3(0, 15, 0) })
            .call(() => {
                t.animPushHand()
            })
            .start()

        // tween(hand)
        //     .sequence(eff)
        //     .repeat(time)
        //     .start();


    }





    resetAnimHint(isDestroy: boolean = false) {
        let t = this;
        if (t.effHand != null) {
            t.effHand.stop();
            t.effHand = null;
        }

        if (isDestroy) {
            t.nodeHint.destroy()
        }
    }



    checkEndGame() {
        let t = this;
        if (GameData.instance.scoreWin == 3) {
            // event end game when win
            t.endGame = true;

        }
        if (GameData.instance.scoreLose == 3) {
            // event end game when lose
            t.endGame = true;

        }
    }

    update(deltaTime: number) {

    }
}

