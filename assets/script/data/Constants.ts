import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

enum AudioSource {
    BACKGROUND = "???",
    WIN = "????",
    LOSE = "?????",
    CLICK = "????"
}

enum EventGame {
    START = "???",
    FAIL = "????",
    ENDGAME = "?????",
    REPLAY = "??????"
}

enum StatusItem {
    InPool = 0,
    PoolToTask = 1,
    PoolToTemp = 2,
    TempToTask = 3,
    TempToPool = 4,
    PoolToManaget = 5,
    HintToTask = 6
}


enum ConfigPoolItem {
    StartY = 1,
    EndY = 3,// 
    StartX = -2,
    EndX = 2,
    StartZ = 2,
    EndZ = -3.5
}


@ccclass("Constants")
export class Constants {
    public static AudioSource = AudioSource;
    public static EventGame = EventGame;
    public static scriptGame = [0, 1, 2];
    public static StatusItem = StatusItem;
    public static ConfigPoolItem = ConfigPoolItem;

}