import { _decorator, Component, log, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameData')
export class GameData extends Component {
    private static _instance: any = null;
    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }
        return this._instance
    }

    static get instance() {
        return this.getInstance<GameData>()
    }

    numberSlotTaskMission: number = 2;
    numberSlotTempTask: number = 5;
    numberTypeItem: number = 0;
    quanlityForType: number = 0
    private poolItem: any[] = [];
    private poolTask: any[] = [];
    private poolTempTask: number[] = [];
    newTask: boolean = false

    // allItem [{type:1,quanlity:7},...]  type<numberTypeItem , count %3==0
    // taskMission [{type:1,quanlity:7},..] type E type allItem , count %3==0
    // temp [{type:1,count:7},..] type E type allItem , count %3==0


    createDataLogicGame() {
        let t = this;
        // run once 
        if (t.poolItem.length > 0) {
            return
        }
        for (let i = 0; i < t.numberTypeItem; i++) {
            t.poolItem.push({
                type: i,
                quanlity: t.quanlityForType
            })
        }
        t.poolTask = Array(t.numberSlotTaskMission).fill({ type: -1, quanlity: 0 });
        t.poolTempTask = Array(t.numberSlotTempTask).fill(-1);

    }

    getPoolItem() {
        return this.poolItem
    }

    getTaskMission() {
        return this.poolTask
    }

    getTempTask() {
        return this.poolTempTask
    }



    // refresh task
    refreshTaskMission(typeItem: number) {
        let t = this;
        if (!t.newTask) {
            log("no task complete")
            return false;
        }
        t.poolTask.forEach(e => {
            if (e.type == -1) {
                e.type = typeItem;
                return true;
            }
        })
        return false;
    }

    createTaskMission() {
        let t = this;
        t.numberSlotTaskMission++
        t.poolTask.push({ type: -1, quanlity: 0 });
    }




    createSlotTempTask() {
        let t = this;
        t.numberSlotTempTask++;
        t.poolTempTask.push(-1);
    }

    removeItem(typeItem: number) {
        let t = this;
        if (typeItem >= 0) {
            // minus item in pool
            t.poolItem.forEach(e => {
                if (e.type == typeItem) {
                    e.quanlity--;
                    return true;
                }
            })
            return false
        } else {
            log("u sure about typeItem");
            return false
        }
    }

    addItemToTask(typeItem: number) {
        let t = this;
        t.poolTask.forEach(e => {
            if (e.type == typeItem) {
                e.count++;
                //clean task if done
                if (e.quanlity > 2) {
                    e.type = -1;
                    e.quanlity = 0;
                    t.newTask = true;
                }
                return true;
            }
        })
        return false;
    }

    addItemToTempStock(typeItem: number) {
        let t = this;
        t.poolTempTask.forEach(e => {
            if (e == -1) {
                e = typeItem;
                return true;
            }
        })
        return false;
    }


    removeItemInTempStock(typeItem: number) {
        let t = this;
        t.poolTempTask.forEach(e => {
            if (e == typeItem) {
                e = -1;
                return true;
            }
        })
        return false;
    }








}

