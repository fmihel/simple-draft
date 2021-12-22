import { binds } from 'fmihel-browser-lib';

export default class Draft {
    constructor(drawer) {
        this.drawer = drawer;
        this.list = [];
        this._current = undefined;
        this.hover = undefined;
        this.state = 'free';
        binds(this, 'mouseMove', 'mouseDown', 'mouseUp');
        this.drawer.onMove = this.mouseMove;
        this.drawer.onMouseDown = this.mouseDown;
        this.drawer.onMouseUp = this.mouseUp;
    }

    add(o, asCurrent = false) {
        // eslint-disable-next-line no-param-reassign
        o.owner = this;
        this.list.push(o);
        if (asCurrent) {
            this.current(o);
        }
        return o;
    }

    draw() {
        this.list.map((it) => it.draw());
    }

    current(setNew = undefined) {
        if (setNew === 'free') {
            if (this._current) this._current.select(false);
            this._current = undefined;
        } else if (setNew) {
            if (this._current) this._current.select(false);
            this._current = setNew;
            this._current.select();
        }
        return this._current;
    }

    mouseMove(o) {
        this.hover = this.list.find((it) => it.underCursor(o.x, o.y));
        if (this._current) {
            this._current.mouseMove(o);
        }
    }

    mouseDown(o) {
        if (!this._current && this.hover) {
            this.current(this.hover);
        } else if (this._current) {
            this._current.mouseDown(o);
        }
    }

    mouseUp(o) {
        if (this._current) {
            this._current.mouseUp(o);
        }
    }

    render() {
        this.drawer.animate(() => {
            const draw = this.drawer;
            draw.grid(20);
            draw.color('#ff0000');
            draw.text('(-20;-30)', -20, -30);
            draw.circle(-20, -30, 2);
            draw.text('(0;0)', 0, -10);
            draw.text('X', 100, -10);
            draw.text('Y', -10, 100);
            draw.line(-250, 0, 250, 0);
            draw.line(0, -250, 0, 250);
            this.draw();
        });
    }
}
