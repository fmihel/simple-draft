import DrawObject from './DrawObject';
import DrawUtils from './DrawUtils';

export default class DrawLine extends DrawObject {
    constructor() {
        super();
        this.list = [];
        this.moveLine = { x: 0, y: 0 };
    }

    underCursor(x, y) {
        const { list } = this;
        for (let i = 1; i < list.length; i++) {
            if (DrawUtils.IsPointOnLine(x, y, 0, list[i].x, list[i].y, 0, list[i - 1].x, list[i - 1].y, 0)) {
                return true;
            }
        }
        return false;
    }

    add(o) {
        this.list.push({ x: o.x, y: o.y });
    }

    draw() {
        const d = this.owner.drawer;
        let last = false;
        if (this.owner.hover && this.owner.hover.id === this.id) {
            d.color('green');
        } else d.color('black');
        if (this.state === 'add') d.color('red');

        this.list.map((it, i) => {
            if (i > 0) d.line(it.x, it.y, this.list[i - 1].x, this.list[i - 1].y);
            if (this.state !== 'draw') d.circle(it.x, it.y, 2);
            last = it;
        });

        if (this.state === 'add' && last) {
            d.color('silver');
            d.line(last.x, last.y, this.moveLine.x, this.moveLine.y);
        }
    }

    move(x, y) {}

    mouseMove(o) {
        this.moveLine = { ...o };
    }

    mouseDown(o) {

    }

    mouseUp(o) {
        if (this.state === 'add') {
            this.add(o);
        }
    }
}
