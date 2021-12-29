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
        this.onSelect = undefined;
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
        // this._drawGabarit();
    }

    _drawGabarit() {
        let max = -80;
        const d = 20;
        this.list.map((it) => {
            const gab = it.getGabarit();
            if (gab) {
                if (it.gabarit.vert) {
                    it.drawGabarit(true,
                        gab.vert.min.x,
                        gab.vert.min.y,
                        gab.vert.max.x, gab.vert.max.y, 10, it.gabarit.vert.text);
                }
                if (it.gabarit.horiz) {
                    it.drawGabarit(false,
                        gab.horiz.min.x,
                        gab.horiz.min.y,
                        gab.horiz.max.x, gab.horiz.max.y, max, it.gabarit.horiz.text);

                    max += d;
                }
            }
        });
    }

    current(setNew = undefined) {
        if (setNew === 'free') {
            if (this._current) this._current.select(false);
            this._current = undefined;
            if (this.onSelect) {
                this.onSelect({ sender: this, current: undefined });
            }
        } else if (setNew) {
            if (this._current) this._current.select(false);
            this._current = setNew;
            this._current.select();
            if (this.onSelect) {
                this.onSelect({ sender: this, current: this._current });
            }
        }
        return this._current;
    }

    mouseMove(o) {
        this.hover = undefined;
        if (this._current) {
            this._current.mouseMove(o);
            if (!this._current.underCursor(o.x, o.y)) {
                this.hover = this.list.find((it) => it.underCursor(o.x, o.y));
            }
        } else {
            this.hover = this.list.find((it) => it.underCursor(o.x, o.y));
        }
    }

    mouseDown(o) {
        if (o.button == 2) {
            this.current('free');
        }
        if (this.hover && this._current !== !this.hover) {
            this.current(this.hover);
        }
        if (this._current) {
            this._current.mouseDown(o);
        }
        /*
        if (!this._current && this.hover) {
            this.current(this.hover);
        } else if (this._current) {
            this._current.mouseDown(o);
        } */
    }

    mouseUp(o) {
        if (this._current) {
            this._current.mouseUp(o);
        }
    }

    render() {
        this.drawer.animate(() => {
            const draw = this.drawer;
            draw.grid(10);
            draw.color('#ff0000');
            // draw.text('(-20;-30)', -20, -30);
            // draw.circle(-20, -30, 2);
            // draw.text('(0;0)', 0, -10);
            // draw.text('X', 100, -10);
            // draw.text('Y', -10, 100);
            // draw.line(-25, 0, 25, 0);
            // draw.line(0, -25, 0, 25);

            /*
            const a = { x: 0, y: 0 };
            const b = { x: 120, y: 0 };
            const c = { x: 70, y: 30 };
            const d = { x: 90, y: 0 };
            draw.line(a.x, a.y, b.x, b.y);
            draw.line(b.x, b.y, c.x, c.y);
            draw.line(c.x, c.y, d.x, d.y);
            draw.circle(a.x, a.y, 3);
            draw.circle(b.x, b.y, 3);
            draw.circle(c.x, c.y, 3);
            draw.circle(d.x, d.y, 3);

            const off = 10;
            const out = DrawUtils.getCoordOff(b.x, b.y, a.x, a.y, off);
            draw.circle(out.x, out.y, 3);
*/
            // DrawUtils.getCoordOff(a.x,a.y,)

            // draw.bezier(0, 0, 20, 20, 20, 20, 60, 0, 'red');
            this.draw();
        });
    }

    delete() {
        if (this._current) {
            const del = this._current;
            this.current('free');
            this.list = this.list.filter((it) => !it.eq(del));
        }
    }

    clear() {
        this.list = [];
        this._current = undefined;
        this.hover = undefined;
    }
}
