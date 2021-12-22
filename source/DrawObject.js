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

    select(select = true) {}

    mouseMove(o) {}

    mouseDown(o) {}

    mouseUp(o) {}

    eq(obj) {
        return (obj && (obj.id === this.id));
    }

    getGabarit() {

    }
}
