import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { GameData } from '../data/GameData';
import { Constants } from '../data/Constants';
import { Item } from '../model/Item';
const { ccclass, property } = _decorator;

@ccclass('PoolItem')
export class PoolItem extends Component {

    @property({ type: Prefab })
    item: Prefab[] = [];

    start() {
        this.autoSetPosItem()
    }


    // chưa xử lý đc cách tính kích thước cho vật 
    // là bug thành tính năng :V
    autoSetPosItem() {
        let t = this;
        let data = GameData.instance.getPoolItem();
        for (let i = 0; i < data.length; i++) {
            let qualityItem = data[i];
            for (let j = 0; j < qualityItem; j++) {
                t.scheduleOnce(() => { })
                let item = instantiate(t.item[i]);
                item.name = i.toString();
                item.setPosition(new Vec3(t.randomDecimalToTwo(Constants.ConfigPoolItem.StartX, Constants.ConfigPoolItem.EndX), t.randomDecimalToTwo(Constants.ConfigPoolItem.StartY, Constants.ConfigPoolItem.EndY), t.randomDecimalToTwo(Constants.ConfigPoolItem.StartZ, Constants.ConfigPoolItem.EndZ)))
                t.node.addChild(item);
                // item.getComponent(Item).unPicKItem()
                // t.scheduleOnce(() => {
                //     item.getComponent(Item).cleanVector();
                // }, 0.2)
            }
        }
    }

    randomDecimalToTwo(min: number, max: number) {
        let randomNum = Math.random() * (max - min) + min;
        return Number(randomNum.toFixed(2));
    }


    findPosItemClosetByType(type: number) {
        let t = this;
        let rs = null;
        t.node.children.forEach(e => {
            if (e.name == type.toString()) {
                let tg = e
                if (rs != null) {
                    if (rs.getPosition(new Vec3).y < tg.getPosition(new Vec3).y) {
                        rs = tg
                    }
                } else {
                    rs = tg;
                }
            }
        });
        return rs;
    }


    findItemById(id: number) {
        let t = this;
        for (let i = 0; i < t.node.children.length; i++) {
            let item = t.node.children[i];
            if (item.getComponent(Item).getId() == id) {
                return item;
            }
        }
        return null
    }


    update(deltaTime: number) {

    }
}

