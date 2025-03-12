import { _decorator, Camera, Component, Node, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cam3DController')
export class Cam3DController extends Component {

    @property({ type: Camera })
    camera: Camera = null;

    start() {
        this.adjustCamera();
        view.on('design-resolution-changed', this.onResize, this);
    }

    adjustCamera() {
        const screenSize = view.getVisibleSize();
        const aspectRatio = screenSize.width / screenSize.height;

        if (this.camera.projection === 0) { // Perspective
            const defaultVerticalFov = 60;
            this.camera.fov = defaultVerticalFov;
            console.log("Adjusted FOV:", this.camera.fov);
        } else { // Orthographic
            this.camera.orthoHeight = screenSize.height / 100;
            console.log("Adjusted Ortho Height:", this.camera.orthoHeight);
        }
    }

    onResize() {
        this.adjustCamera();
    }

    onDestroy() {
        view.off('design-resolution-changed', this.onResize, this);
    }
}

