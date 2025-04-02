import { _decorator, AudioClip, Camera, Component, EventTouch, geometry, GradientRange, Graphics, log, macro, Mat4, Node, PhysicsSystem, Size, Sprite, SpriteFrame, tween, UITransform, Vec2, Vec3, view } from 'cc';
// import { AudioManager } from './AudioManager';
import { Constants } from '../data/Constants';
import { GameData } from '../data/GameData';
import { Menu2D } from './MenuHeader';
import { Item } from '../model/Item';
import { PoolItem } from './PoolItem';
import super_html_playable from '../super_html_playable';
import { ADsManager } from './ADsManager';
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
    framePool: Node = null

    @property({ type: Node })
    nodeHint: Node = null

    @property({ type: [AudioClip] })
    sound: AudioClip[] = [];

    @property({ type: Graphics })
    pen: Graphics = null

    private ItemHoldUp: Node = null;
    // block muti event touch
    private eventTouch: boolean = true;

    endGame: boolean = false;

    // world position
    posTouchHand: Vec3 = null

    fristTouchCount: boolean = false;

    scaleNew: Vec3 = null;

    protected onLoad(): void {
        GameData.instance.useScriptGame = this.useScriptGame;
        GameData.instance.createDataLogicGame();
        this.responsize()
        view.on("canvas-resize", () => {
            this.responsize();
        });
    }

    responsize() {
        let t = this;
        const screenSize = view.getVisibleSize();
        let width = screenSize.width;
        let height = screenSize.height;
        let ratio = width / height;
        // log(width, height, ratio, "???");
        let header = t.Menu2d.getChildByName("HeadMenu");
        let body = t.Menu2d.getChildByName("ArenaListenerTouch");
        let footer = t.Menu2d.getChildByName("footerCTA");
        let textF = t.Menu2d.getChildByName("text");
        let hint = t.Menu2d.getChildByName("hint");

        if (width > height) {
            // ngang
            t.CamMain.node.setPosition(new Vec3(0, 14, -0.6 - (ratio * 0.1)));
            // t.CamMain.node.setRotationFromEuler(new Vec3(-90, -90, 0));
            t.scaleNew = new Vec3(1 / (ratio), 1 / (ratio), 1 / (ratio))
            t.nodeHint.setScale(new Vec3(0.5, 0.5, 0.5))

            // header.setRotationFromEuler(new Vec3(0, 0, 90));
            // header.getComponent(UITransform).setContentSize(new Size(50, 108));

            // footer.setRotationFromEuler(new Vec3(0, 0, 90));
            // footer.getComponent(UITransform).setContentSize(new Size(200, 1080));

            // body.setRotationFromEuler(new Vec3(0, 0, 90));
            // body.getComponent(UITransform).setContentSize(new Size(120, 108));

            // textF?.setRotationFromEuler(new Vec3(0, 0, 90));
            // textF?.setScale(new Vec3(1 / (ratio), 1 / (ratio), 1 / (ratio)))

            // hint?.setRotationFromEuler(new Vec3(0, 0, 90));
            // hint?.setScale(new Vec3(1 / ratio, 1 / ratio, 1 / ratio))

        } else {
            // doc
            t.CamMain.node.setPosition(new Vec3(0, 14 + ratio, ratio > 0.6 ? -ratio - 0.2 : -0.6));
            // t.CamMain.node.setRotationFromEuler(new Vec3(-90, 0, 0));

            t.scaleNew = new Vec3(1, 1, 1)

            t.nodeHint.setScale(new Vec3(1, 1, 1))
            // header.setRotationFromEuler(new Vec3(0, 0, 0));
            // header.getComponent(UITransform).setContentSize(new Size(108, 50));

            // footer.setRotationFromEuler(new Vec3(0, 0, 0));
            // footer.getComponent(UITransform).setContentSize(new Size(1080, 200));

            // body.setRotationFromEuler(new Vec3(0, 0, 0));
            // body.getComponent(UITransform).setContentSize(new Size(108, 120));

            // textF?.setRotationFromEuler(new Vec3(0, 0, 0));
            // textF?.setScale(new Vec3(1, 1, 1))
            // t.scaleNew = new Vec3(1, 1, 1)

            // hint?.setRotationFromEuler(new Vec3(0, 0, 0));
            // hint?.setScale(new Vec3(1, 1, 1))

        }
        log("check pos cam", t.CamMain.node.getPosition(new Vec3), ratio)
    }


    start() {
        let t = this;
        // AudioManager.playMusic(Constants.AudioSource.BACKGROUND) ko hiểu tại sao thừa tham số mà vẫn viết đc ???
        // AudioManager.playSound(Constants.AudioSource.BACKGROUND);
        GameData.instance.createDataLogicGame();
        GameData.instance.useScriptGame = t.useScriptGame;
        t.animRenderFirstTouch()
        t.scheduleOnce(() => {
            t.Menu2d.getChildByName("fristTouch").on(Node.EventType.TOUCH_START, t.fristTouch, t);
        }, 2)
    }


    fristTouch() {
        let t = this;
        if (t.fristTouchCount) {
            return
        }
        // GameData.instance.playAudio(t.node, t.sound[0])
        t.fristTouchCount = true;
        t.Menu2d.getChildByName("fristTouch").destroy();
        t.Menu2d.getChildByName("text").destroy();
        t.stepHint(GameData.instance.scoreWin);
        t.resetRenderFirstTouch()
    }


    // sự kiện bắt item
    touchStart(event) {
        let t = this;
        t.resetAnimMoveHand();
        if (!t.eventTouch || t.endGame) {
            return;
        }
        t.eventTouch = false;
        t.posTouchHand = t.Menu2d.getChildByName("Camera").getComponent(Camera).screenToWorld(new Vec3(event.getLocationX(), event.getLocationY(), 0));
        let rs = t.bowRayCast(new Vec3(event.getLocationX(), event.getLocationY(), 0));
        if (rs != null) {
            t.checkItem(rs);
        } else {
            t.eventTouch = true;
        }
    }

    bowRayCast(pos: Vec3) {
        let t = this;
        let ray = new geometry.Ray();
        const camera = t.CamMain.getComponent(Camera);
        camera.screenPointToRay(pos.x, pos.y, ray);
        const mask = 0xffffffff;
        const maxDistance = 10000;
        const queryTrigger = true;
        const bResult = PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger);
        if (bResult) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            const collider = raycastClosestResult.collider;
            if (collider.node) {
                return collider.node;
            }
        }
        return null;
    }


    checkItem(n: Node) {
        let t = this;

        log(n.name, "check name node")
        // let pen = t.node.getComponent(Graphics);
        if (n.getComponent(Item)) {
            t.ItemHoldUp = n
            // n.getComponent(Item).pickByHand();
            n.getComponent(Item).pullToCam(t.CamMain.node.getWorldPosition(new Vec3), true)
            n.getComponent(Item).lightFrame(true, t.CamMain.node.getWorldPosition(new Vec3));
            // let positions = n.getComponent(Item).getPos();
            // let indices = n.getComponent(Item).getIndi();
            // t.pen.clear();
            // t.pen.lineWidth = 50;
            // t.pen.strokeColor.fromHEX('#FF0000');
            // for (let i = 0; i < indices.length; i += 3) {
            //     const v0 = new Vec3(positions[indices[i] * 3], positions[indices[i] * 3 + 1], positions[indices[i] * 3 + 2]);
            //     const v1 = new Vec3(positions[indices[i + 1] * 3], positions[indices[i + 1] * 3 + 1], positions[indices[i + 1] * 3 + 2]);
            //     const v2 = new Vec3(positions[indices[i + 2] * 3], positions[indices[i + 2] * 3 + 1], positions[indices[i + 2] * 3 + 2]);
            //     // Chuyển đổi sang tọa độ thế giới
            //     Vec3.transformMat4(v0, v0, n.worldMatrix);
            //     Vec3.transformMat4(v1, v1, n.worldMatrix);
            //     Vec3.transformMat4(v2, v2, n.worldMatrix);
            //     // Chuyển đổi sang tọa độ 2D
            //     const p0 = this.convert3DTo2D(v0);
            //     const p1 = this.convert3DTo2D(v1);
            //     const p2 = this.convert3DTo2D(v2);
            //     // Vẽ tam giác
            //     t.pen.moveTo(p0.x, p0.y);
            //     t.pen.lineTo(p1.x, p1.y);
            //     t.pen.lineTo(p2.x, p2.y);
            //     t.pen.lineTo(p0.x, p0.y);
            //     t.pen.stroke();
            // }
            // t.pen.moveTo(0, 0);
            // t.pen.lineTo(10, 10);
            // t.pen.lineTo(50, 50);
            // t.pen.lineTo(100, 100);
            // t.pen.stroke();

        } else {
            t.touchCancel()
        }

    }

    convert3DTo2D(worldPos: Vec3): Vec3 {
        let t = this;
        return this.CamMain.getComponent(Camera).convertToUINode(worldPos, t.Menu2d);
    }


    touchMove(event) {
        let t = this;
        if (t.endGame) {
            return
        }
        let curentPoint = t.Menu2d.getChildByName("Camera").getComponent(Camera).screenToWorld(new Vec3(event.getLocationX(), event.getLocationY(), 0));
        // if (Vec3.distance(curentPoint, t.posTouchHand) > 50) {
        //     t.touchCancel();
        // }
        let rs = t.bowRayCast(new Vec3(event.getLocationX(), event.getLocationY(), 0));
        if (rs != null) {
            if (t.ItemHoldUp == null) {
                t.checkItem(rs);
                return;
            } else if (t.ItemHoldUp.getSiblingIndex() != rs.getSiblingIndex()) {
                t.ItemHoldUp.getComponent(Item).lightFrame(false);
                t.ItemHoldUp.getComponent(Item).pullToCam(t.CamMain.node.getWorldPosition(new Vec3), false);
                t.checkItem(rs);
                return;
            }
            log('case special', t.ItemHoldUp.getSiblingIndex(), rs.getSiblingIndex())
            // if (t.ItemHoldUp != null && t.ItemHoldUp.getSiblingIndex() != rs.getSiblingIndex())
            //     t.checkItem(rs);
        }
        t.eventTouch = true;
        t.touchCancel();
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
            GameData.instance.playAudio(t.node, t.sound[0])
            t.correctItem(typeItem);
            t.eventTouch = true;
        } else {
            GameData.instance.playAudio(t.node, t.sound[0])
            t.wrongItem(typeItem);
            t.eventTouch = true;
        }

        t.scheduleOnce(() => {
            t.checkEndGame();
        }, 0.5)
    }

    touchCancel() {
        let t = this;
        let itemInHand = t.ItemHoldUp?.getComponent(Item);
        if (itemInHand) {
            t.ItemHoldUp.getComponent(Item).lightFrame(false)
            t.ItemHoldUp.getComponent(Item).pullToCam(t.CamMain.node.getWorldPosition(new Vec3), false)
            // t.ItemHoldUp.getComponent(Item).unPicKItem();

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

            t.refreshUIMenu(Constants.StatusItem.PoolToTask, typeItem);
        t.ItemHoldUp.destroy();
        t.ItemHoldUp = null;


    }

    wrongItem(typeItem: number) {
        let t = this;
        if (GameData.instance.addItemToTempStock(typeItem)) {
            GameData.instance.removeItemInPool(typeItem);
            t.ItemHoldUp.destroy();
            t.ItemHoldUp = null;
            t.refreshUIMenu(Constants.StatusItem.PoolToTemp, typeItem);
        } else {
            // chưa có logic full stock và add thêm item thì sẽ show gì
            GameData.instance.scoreLose = 4;
            t.endGame = true;
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
                t.scheduleOnce(() => {
                    GameData.instance.playAudio(t.node, t.sound[2])
                }, 0.3)
                GameData.instance.scoreWin++;
                break;
            case Constants.StatusItem.PoolToTemp:
                uiAnimtion.setItemEvent(type)
                uiAnimtion.animItemToStock(t.posTouchHand);
                t.scheduleOnce(() => {
                    GameData.instance.playAudio(t.node, t.sound[1])
                }, 0.3)
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
                t.scheduleOnce(() => {
                    GameData.instance.playAudio(t.node, t.sound[2])
                }, 0.3)
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
        log(pos, "check Pos")
        return pos;
    }


    stepHint(step: number = 0) {
        let t = this;
        let pos: Vec3;
        switch (step) {
            case 0:
                pos = t.getPosForHint();
                tween(t.nodeHint)
                    // .delay(1)
                    .to(1, { position: pos })
                    .call(() => {
                        t.Menu2d.getChildByName("footerCTA").on(Node.EventType.TOUCH_START, () => {
                            GameData.instance.scoreLose = 4;
                            t.checkEndGame();
                        }, t);
                        t.animMoveHand();
                    })
                    // .delay(3)
                    .call(() => {
                        t.posTouchHand = t.nodeHint.getWorldPosition(new Vec3)
                        t.correctItem(Number(t.ItemHoldUp.name))
                        GameData.instance.playAudio(t.node, t.sound[0])
                    }).delay(0.5)
                    .call(() => {
                        t.stepHint(GameData.instance.scoreWin);
                    })
                    .start()
                break;
            case 1:
                pos = t.getPosForHint();
                // t.resetAnimHint()
                t.resetAnimMoveHand()
                tween(t.nodeHint)
                    .to(1, { position: pos })
                    .call(() => {
                        // t.animPushHand()
                        t.animMoveHand()
                    })
                    // .delay(3)
                    .call(() => {
                        t.posTouchHand = t.nodeHint.getWorldPosition(new Vec3)
                        t.correctItem(Number(t.ItemHoldUp.name))
                        GameData.instance.playAudio(t.node, t.sound[0])

                    }).delay(0.5)
                    .call(() => {
                        t.stepHint(GameData.instance.scoreWin);
                    })
                    .start()
                break;
            case 2:
                pos = t.getPosForHint();

                // t.resetAnimHint()
                t.resetAnimMoveHand()
                tween(t.nodeHint)
                    .to(1, { position: pos })
                    .call(() => {
                        t.animMoveHand();
                        t.animScaleFooter();
                        t.cleanHint = true;
                        t.ItemHoldUp.getComponent(Item).lightFrame(true)
                        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_START, t.touchStart, t);
                        t.Menu2d.getChildByName("ArenaListenerTouch").on(Node.EventType.TOUCH_MOVE, t.touchMove, t);
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
        let timeAnim = 0.3;

        t.effHand = tween(hand)
            .to(timeAnim, { position: new Vec3(0, - 15, 0) })
            .to(timeAnim, { position: new Vec3(0, 15, 0) })
            .call(() => {
                t.animPushHand()
            })
            .start()

        // tween(hand)
        //     .sequence(eff)
        //     .repeat(time)
        //     .start();
    }
    effHand1 = null;
    animMoveHand() {
        let t = this;
        let hand = t.nodeHint.getChildByName("hand");
        t.nodeHint.setPosition(t.getPosForHint())
        hand.active = true;
        let timeAnim = 0.3;
        t.effHand1 = tween(hand)
            .by(timeAnim, { scale: new Vec3(0.1, 0.1, 0.1) })
            .by(timeAnim, { scale: new Vec3(-0.1, -0.1, -0.1) })
            // .to(timeAnim, { scale: new Vec3(0, 15, 0) })
            .call(() => {
                t.animMoveHand()
            })
            .start()

    }

    cleanHint: boolean = false
    resetAnimMoveHand() {
        let t = this;
        if (t.effHand1 != null) {
            t.effHand1.stop();
            t.effHand1 = null;
        }
        if (t.cleanHint) {
            t.cleanHint = false
            t.nodeHint.destroy();
            t.ItemHoldUp.getComponent(Item).lightFrame(false)

        }
    }



    resetAnimHint(isDestroy: boolean = false) {
        let t = this;
        if (t.effHand != null) {
            t.effHand.stop();
            t.effHand = null;
        }

        if (isDestroy) {
            t.nodeHint.destroy()
            t.ItemHoldUp.getComponent(Item).lightFrame(false)

        }
    }


    turnOffEventTouch() {
        let t = this;
        t.Menu2d.getChildByName("ArenaListenerTouch").off(Node.EventType.TOUCH_START, t.touchStart, t);
        t.Menu2d.getChildByName("ArenaListenerTouch").off(Node.EventType.TOUCH_MOVE, t.touchMove, t);
        t.Menu2d.getChildByName("ArenaListenerTouch").off(Node.EventType.TOUCH_END, t.touchEnd, t);
        t.Menu2d.getChildByName("ArenaListenerTouch").off(Node.EventType.TOUCH_CANCEL, t.touchCancel, t);
    }

    effFooter = null
    animScaleFooter() {
        let t = this;
        // let targetRD = t.Menu2d.getChildByPath("CTA/rd").getComponent(Sprite);
        // let time = 2;
        // targetRD.fillStart = 0;
        // targetRD.fillRange = 0;
        // t.effCTA = tween(targetRD)
        //     .to(time, { fillRange: 1 })
        //     .to(time, { fillStart: 1 })
        //     .call(() => {
        //         t.animRendedCTA()
        //     }).start()

        let targetRD = t.Menu2d.getChildByPath("footerCTA/text");
        targetRD.active = true;
        let timeAnim = 0.6;
        t.effFooter = tween(targetRD)
            .by(timeAnim, { scale: new Vec3(-0.2, -0.2, -0.2) })
            .by(timeAnim, { scale: new Vec3(0.2, 0.2, 0.2) })
            .call(() => {
                t.animScaleFooter()
            })
            .start()

    }


    resetAnimCTA() {
        let t = this;
        if (t.effFooter != null) {
            t.effFooter.stop();
            t.effFooter = null;
        }
    }


    effFT
    animRenderFirstTouch() {
        let t = this;
        let targetRD = t.Menu2d.getChildByName("text").getComponent(Sprite);
        let time = 2;
        // targetRD.fillStart = 0;
        // targetRD.fillRange = 0;
        tween(targetRD)
            .to(time, { fillRange: 1 })
            .call(() => {
                t.animScaleFT()
            })
            .start()
    }


    animScaleFT() {
        let t = this;
        let targetRD = t.Menu2d.getChildByName("text");
        let timeAnim = 0.3;
        t.effFT = tween(targetRD)
            .to(timeAnim, { scale: new Vec3(t.scaleNew.x - 0.2, t.scaleNew.y - 0.2, t.scaleNew.z - 0.2) })
            .to(timeAnim, { scale: new Vec3(t.scaleNew.x + 0.2, t.scaleNew.y + 0.2, t.scaleNew.z + 0.2) })
            .call(() => {
                t.animScaleFT()
            })
            .start()
    }

    resetRenderFirstTouch() {
        let t = this;
        t.Menu2d.getChildByName("text").destroy()
        if (t.effFT != null) {
            t.effFT.stop();
            t.effFT = null;
        }
    }

    checkEndGame() {
        let t = this;
        if (GameData.instance.scoreWin >= 48) {
            // event end game when win
            t.endGame = true;
            t.turnOffEventTouch();
            t.EventNetWork();
            t.node.getComponent(ADsManager).openAdUrl();
        }
        if (GameData.instance.scoreLose >= 4) {
            // event end game when lose
            t.endGame = true;
            t.turnOffEventTouch()
            t.EventNetWork();
            t.node.getComponent(ADsManager).openAdUrl();

        }
    }
    EventNetWork() {
        super_html_playable.game_end();

    }
    update(deltaTime: number) {

    }
}

