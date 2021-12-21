export default class Draws {
    constructor(drawer) {
        this.drawer = drawer;
        this.list = [];
        this.current = undefined;
        this.hover = undefined;
    }

    add(o, asCurrent = false) {
        // eslint-disable-next-line no-param-reassign
        o.owner = this;
        this.list.push(o);
        if (asCurrent) this.current = o;
        return o;
    }

    draw() {
        this.list.map((it) => it.draw());
    }

    current(set = undefined) {
        if (set === 'free') {
            this.current = undefined;
        } else if (set) {
            this.current = set;
        }
        return this.current;
    }

    mouseMove(o) {
        if (this.current) this.current.mouseMove(o);

        this.hover = undefined;
        const hover = this.list.find((it) => it.underCursor(o.x, o.y));
        if (hover) {
            this.hover = hover;
        }
    }

    mouseDown(o) {
        if (this.hover) {
            this.current = this.hover;
            this.current.state = 'add';
        }
        if (this.current) this.current.mouseDown(o);
    }

    mouseUp(o) {
        if (o.button === 2) {
            if (this.current) {
                this.current.state = 'draw';
            }
            this.add(new Line(), true).state = 'add';
        } else
        if (this.current) {
            this.current.mouseUp(o);
        }
    }
}
