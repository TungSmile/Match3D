import { _decorator, Component, Enum, Node } from 'cc';
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
    PoolToManaget = 5
}



@ccclass("Constants")
export class Constants {
    public static AudioSource = AudioSource;
    public static EventGame = EventGame;
    public static scriptGAme = [];
    public static StatusItem = StatusItem
}