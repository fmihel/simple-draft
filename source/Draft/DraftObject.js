export default class DraftObject {
    constructor() {
        this.owner = undefined;
        this.state = 'draw';
        this.id = Math.floor(Math.random() * 100000);
        this.name = 'undef';
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

    data(set = undefined) {

    }

    doChange(o) {
        this.owner._doChange({ event: 'object', sender: this, ...o });
    }
}
