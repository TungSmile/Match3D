import { _decorator, Component, log, Node } from 'cc';
import { Constants } from './Constants';
const { ccclass, property } = _decorator;


interface Task {
    type: number;
    quantity: number;
}

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


    useScriptGame: boolean = false;
    numberSlotTaskMission: number = 2;
    numberSlotTempTask: number = 3;
    numberTypeItem: number = 4;
    quanlityForType: number = 3;
    private poolItem: number[] = [];
    private poolTask: Task[] = [];
    private poolTempTask: number[] = [];
    newTask: boolean = false;
    eventStock: number = -1;
    eventTask: number = -1;
    needCleanStock: boolean = false;

    // allItem []  type<numberTypeItem , count %3==0;
    // taskMission [{type:1,quanlity:7},..] type E type allItem , count %3==0;
    // temp [{type:1,count:7},..] type E type allItem , count %3==0;



    createDataLogicGame() {
        let t = this;
        // run once 
        if (t.poolItem.length > 0) {
            return;
        }
        for (let i = 0; i < t.numberTypeItem; i++) {
            t.poolItem.push(t.quanlityForType);
        }
        let tempTask: Task = { type: -1, quantity: 0 }
        t.poolTask = Array(t.numberSlotTaskMission).fill(null).map(() => ({ ...tempTask }));
        t.poolTempTask = Array(t.numberSlotTempTask).fill(-1);
        // while (!t.refreshTaskMission(t.randomItemInPool())) {
        //     t.newTask = true;
        // }

        for (let i = 0; i < t.numberSlotTaskMission; i++) {
            t.newTask = true;
            t.refreshTaskMission(-1)
            // log(t.poolTask, "start2");

        }
        // console.log(t.poolTask);

    }

    getPoolItem() {
        return this.poolItem;
    }

    getTaskMission() {
        return this.poolTask;
    }

    getTempTask() {
        return this.poolTempTask;
    }

    // refresh task
    refreshTaskMission(typeItem: number) {
        let t = this;
        let valueRd = t.randomItemInPool();
        if (!t.newTask && valueRd >= 0) {
            log("no task complete or empty pool")
            return false;
        }

        // xử lý clean tempstock (not ok)
        // let qua = t.removeItemInTempStock(valueRd);
        // if (qua > 2) {
        //     log('is run ???')
        // }

        // check tempStock has item
        t.needCleanStock = t.poolTempTask.indexOf(valueRd) ? true : false;


        for (let i = 0; i < t.poolTask.length; i++) {
            let e = t.poolTask[i];
            if (e.type == -1) {
                e.type = valueRd;
                e.quantity = 3;
                t.newTask = false;
                // log("please1");
                return true;

            }
        }
        return false;
    }

    createTaskMission() {
        let t = this;
        t.numberSlotTaskMission++;
        t.poolTask.push({ type: -1, quantity: 0 });
    }


    createSlotTempTask() {
        let t = this;
        t.numberSlotTempTask++;
        t.poolTempTask.push(-1);
    }

    removeItem(typeItem: number) {
        let t = this;
        if (typeItem >= 0 && typeItem < t.numberTypeItem) {
            // minus item in pool
            // t.poolItem.forEach(e => {
            //     if (e.type == typeItem) {
            //         e.quanlity--;
            //         return true;
            //     }
            // })
            if (t.poolItem[typeItem] > 0) {
                t.poolItem[typeItem]--
                return true
            } else {
                log("item empty in pool");
                return false;
            }
        } else {
            log("u sure about typeItem");
            return false;
        }
    }

    addItemToTask(typeItem: number) {
        let t = this;
        for (let i = 0; i < t.poolTask.length; i++) {
            let e = t.poolTask[i];
            if (e.type == typeItem) {
                t.eventTask = i;
                e.quantity--;
                //clean task if done
                if (e.quantity <= 0) {
                    e.type = -1;
                    e.quantity = 0;
                    t.newTask = true;
                    t.refreshTaskMission(-1)
                }
                return true;
            }
        }
        // t.poolTask.forEach(e => {
        //     if (e.type == typeItem) {

        //         e.quantity--;
        //         //clean task if done
        //         if (e.quantity <= 0) {
        //             e.type = -1;
        //             e.quantity = 0;
        //             t.newTask = true;
        //             t.refreshTaskMission(-1)
        //         }
        //         return true;
        //     }
        // })
        return false;
    }

    addItemToTempStock(typeItem: number) {
        let t = this;
        // t.poolTempTask.forEach(e => {
        //     if (e == -1) {
        //         e = typeItem;
        //         return true;
        //     }
        // })
        for (let i = 0; i < t.poolTempTask.length; i++) {
            if (t.poolTempTask[i] == -1) {
                t.poolTempTask[i] = typeItem;
                t.eventStock = i;
                return true;
            }
        }
        return false;
    }


    // slove all item if done return true
    removeItemInTempStock(typeItem: number) {
        let t = this;
        let count = [];
        for (let i = 0; i < t.poolTempTask.length && count.length < 3; i++) {
            if (t.poolTempTask[i] == typeItem) {
                t.poolTempTask[i] = -1;
                count.push(i)
                // return i;
            }
        }
        // return false;
        return count;
    }


    // poolItem=[3,2,3,1]  [3,3]

    // chưa xử lý item nằm ở temp stock
    randomItemInPool() {
        let t = this;
        let poolItem = [...t.poolItem];
        let taskItem = [...t.poolTask];
        let stockItem = [...t.poolTempTask]

        stockItem.forEach(e => {
            if (poolItem[e] > -1)
                poolItem[e]++;
        })

        taskItem.forEach(e => {
            if (poolItem[e.type])
                poolItem[e.type] -= e.quantity;
        })

        const validIndices = poolItem
            .map((value, index) => (value >= 3 ? index : -1))
            .filter(index => index !== -1);

        if (validIndices.length == 0) {
            t.newTask = false;
            return -1

        }
        const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
        return randomIndex;


    }


    findTaskByTypeItem(typeItem: number) {
        let t = this;
        t.poolTask
        for (let i = 0; i < t.poolTask.length; i++) {
            if (t.poolTask[i].type == typeItem) {
                return i
            }
        }
        return -1;
    }


}

