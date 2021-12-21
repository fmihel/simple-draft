export default class DrawObject {
    constructor() {
        this.owner = undefined;
        this.state = 'draw';
        this.id = Math.floor(Math.random() * 100000);
    }

    underCursor(x, y) {}

    add(o) {}

    draw() {}

    move(x, y) {}

    mouseMove(o) {}

    mouseDown(o) {}

    mouseUp(o) {}
}
