import { _decorator, Component, Node } from 'cc';
import super_html_playable from '../super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('ADsManager')
export class ADsManager extends Component {
   
    androidLink: string = "https://play.google.com/store/apps/details?id=com.gplay.match.packing3d";

    iosLink: string = "https://play.google.com/store/apps/details?id=com.gplay.match.packing3d";

    defaultLink: string = "https://play.google.com/store/apps/details?id=com.gplay.match.packing3d";


    start() {
        super_html_playable.set_google_play_url(this.androidLink);
        super_html_playable.set_app_store_url(this.iosLink);
    }

    openAdUrl() {
        super_html_playable.download();
    }
}

