import { _decorator, Vec3 } from 'cc';
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
    StartX = 1.8,
    EndX = -1.8,
    StartY = 2,
    EndY = 4,
    StartZ = 1.8,
    EndZ = -1.8
}






@ccclass("Constants")
export class Constants {
    public static AudioSource = AudioSource;
    public static EventGame = EventGame;
    public static scriptGame = [0, 1, 2, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5];
    public static StatusItem = StatusItem;
    public static ConfigPoolItem = ConfigPoolItem;
    public static forceMagnitude = 500;
}