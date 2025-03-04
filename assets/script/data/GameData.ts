import { _decorator, Component, log, Node } from 'cc';
import { Constants } from './Constants';
const { ccclass, property } = _decorator;


interface Task {
    type: number;
    quantity: number;
    capacity: number;
    needRest: boolean;
    unlock: boolean;
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

    poolItem: number[] = [];
    numberTypeItem: number = 4;
    quanlityForType: number = 9;


    numberSlotTaskMission: number = 2;
    limitTaskMission: number = 4;
    poolTask: Task[] = [];
    newTask: boolean = false;
    eventTask: number = -1;
    capacityItemTask: number = 3;


    numberSlotTempTask: number = 4;
    poolTempTask: number[] = [];
    eventStock: number = -1;
    needCleanStock: boolean = false;
    typeItemCleanStock: number = -1;
    countTask: number = 0; // => useless

    // block muti item event
    eventItem: boolean = false;

    createDataLogicGame() {
        let t = this;
        if (t.poolItem.length > 0) {
            return;
        }
        for (let i = 0; i < t.numberTypeItem; i++) {
            t.poolItem.push(t.quanlityForType);
        }
        for (let i = 0; i < t.limitTaskMission; i++) {
            let task: Task = { type: -1, quantity: 0, capacity: t.capacityItemTask, needRest: false, unlock: i < t.numberSlotTaskMission ? true : false };
            t.poolTask.push(task)
        }
        t.poolTempTask = Array(t.numberSlotTempTask).fill(-1);

        for (let i = 0; i < t.numberSlotTaskMission; i++) {
            t.newTask = true;
            t.refreshTaskMission(-1)
        }
    }


    checkTaskFree() {
        let t = this;
        for (let id = 0; id < t.poolTask.length; id++) {
            let task = t.poolTask[id];
            if (task.needRest && task.quantity < 1) {
                return id;
            }
        }
        return -1;
    }

    setTaskMissionByIndex(id: number, task: Task = { type: -1, quantity: 0, capacity: this.capacityItemTask, needRest: false, unlock: false }) {
        let t = this;
        t.poolTask[id] = task;
    }


    resetTaskMission() {
        let t = this;
        let valueRd = t.randomItemInPool();
        let idTask = t.checkTaskFree();
        let hasItemStock = 0; // check item has in stock
        if (valueRd < 0) {
            log("enough item to reset task");
            return false;
        }
        if (idTask < 0) {
            log("every task busy");
            return false;
        }
        if (hasItemStock > 0) {
            t.needCleanStock = true;
        }
        t.setTaskMissionByIndex(idTask, { type: valueRd, quantity: 0, capacity: t.capacityItemTask, needRest: false, unlock: true })
        return true;
    }

    addItemToTaskByType(type: number) {
        let t = this;

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
        t.needCleanStock = false;
        for (let i = 0; i < t.poolTempTask.length; i++) {
            if (t.poolTempTask[i] == valueRd) {
                t.needCleanStock = true;
                t.typeItemCleanStock = valueRd
                break;
            }

        }


        log(valueRd, t.needCleanStock, "check temp has value in task")


        for (let i = 0; i < t.poolTask.length; i++) {
            let e = t.poolTask[i];
            if (e.type == -1) {
                e.type = valueRd;
                e.quantity = 3;
                t.newTask = false;
                t.countTask++;
                // log("please1");
                return true;

            }
        }
        return false;
    }

    createTaskMission() {
        let t = this;
        t.numberSlotTaskMission++;
        t.poolTask[t.numberSlotTaskMission - 1].unlock = true
    }


    createSlotTempTask() {
        let t = this;
        t.numberSlotTempTask++;
        t.poolTempTask.push(-1);
    }

    removeItem(typeItem: number) {
        let t = this;
        if (typeItem >= 0 && typeItem < t.numberTypeItem) {
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
                    t.refreshTaskMission(-1);
                }
                return true;
            }
        }

        return false;
    }

    addItemToTempStock(typeItem: number) {
        let t = this;

        for (let i = 0; i < t.poolTempTask.length; i++) {
            if (t.poolTempTask[i] == -1) {
                t.poolTempTask[i] = typeItem;
                t.eventStock = i;
                return true;
            }
        }
        return false;
    }


    checkItemInStock(typeItem: number) {
        let t = this;
        let count = [];
        for (let i = 0; i < t.poolTempTask.length && count.length < 3; i++) {
            if (t.poolTempTask[i] == typeItem) {
                count.push(i)
            }
        }
        return count;
    }


    remoteItemInStock(typeItem: number) {
        let t = this;
        for (let i = 0; i < t.poolTempTask.length; i++) {
            if (t.poolTempTask[i] == typeItem) {
                t.poolTempTask[i] = -1;
                return true;
            }
        }
        return false;
    }



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
            return -2

        }
        const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
        return randomIndex;


    }


    findTaskByTypeItem(typeItem: number) {
        let t = this;
        for (let i = 0; i < t.poolTask.length; i++) {
            if (t.poolTask[i].type == typeItem) {
                return i
            }
        }
        return -1;
    }







}

