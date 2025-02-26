import { _decorator, assert, assetManager, AudioClip, AudioSource, Component, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    // private static _audioSource?: AudioSource;
    // private static _cachedAudioClipMap: Record<string, AudioClip> = {};

    // public static init(audioSource: AudioSource) {
    //     log('Init AudioManager !!!');
    //     AudioManager._audioSource = audioSource;
    // }

    // public static playMusic() {
    //     const audioSource = AudioManager._audioSource!;
    //     assert(audioSource, 'AudioManager not inited!');
    //     audioSource.play();
    // }



    // éo nên dùng  res để load asset vì chậm vkl (dùng khi có user có khoảng chờ)

    // public static playSound(name: string) {
    //     const audioSource = AudioManager._audioSource!;
    //     assert(audioSource, 'AudioManager not inited!');
    //     const path = `audio/sound/${name}`;
    //     let cacheAudioClip = AudioManager._cachedAudioClipMap[path];
    //     if (cacheAudioClip) {
    //         audioSource.playOneShot(cacheAudioClip, 1)
    //     } else {
    //         assetManager.resources?.load(path, AudioClip, (err, clip) => {
    //             if (err) {
    //                 console.warn(err);
    //                 return;
    //             }
    //             AudioManager._cachedAudioClipMap[path] = clip;
    //             audioSource.playOneShot(clip, 1)
    //         })
    //     }
    // }


}

