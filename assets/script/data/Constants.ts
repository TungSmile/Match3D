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





@ccclass("Constants")
export class Constants {
    public static AudioSource = AudioSource;
    public static EventGame = EventGame;

}