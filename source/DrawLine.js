import DrawObject from './DrawObject';
import DrawUtils from './DrawUtils';

export default class DrawLine extends DrawObject {
    constructor() {
        super();
        this.list = [];
        this.mouse = { x: 0, y: 0 };
        this.gabarit = {
            vert: {
                text: 'vert',
                off: 'auto',
            },
            horiz: {
                text: 'horiz',
                off: 'auto',
            },

        };
    }

    underCursor(x, y) {
        const { list } = this;
        for (let i = 1; i < list.length; i++) {
            if (DrawUtils.IsPointOnLine(x, y, list[i].x, list[i].y, list[i - 1].x, list[i - 1].y)) {
                return true;
            }
        }
        return false;
    }

    add(o) {
        this.list.push({ x: o.x, y: o.y });
    }

    select(select = true) {
        if (select) {
            this.state = !this.list.length ? 'add' : 'modif';
        } else {
            this.state = 'draw';
        }
    }

    draw() {
        const d = this.owner.drawer;
        d.lineWidth(3);
        if (this.owner.hover && this.owner.hover === this) d.color('red');
        else d.color('black');
        if (this.state === 'add' || this.state === 'modif') {
            d.color('red');
        }

        let last = false;
        this.list.map((it, i) => {
            if (i > 0) {
                d.line(it.x, it.y, this.list[i - 1].x, this.list[i - 1].y);
            }
            if (this.state !== 'draw') {
                if (it !== this.nodeModif) {
                    d.circle(it.x, it.y, 4);
                } else {
                    d.box(it.x - 5, it.y - 5, it.x + 5, it.y + 5);
                }
            }
            last = it;
        });

        if (this.state === 'add' && last) {
            d.color('silver');
            d.line(last.x, last.y, this.mouse.x, this.mouse.y);
        }
        d.lineWidth(1);
    }

    drawGabarit(vert, x1, y1, x2, y2, off, text) {
        const d = this.owner.drawer;
        d.color('silver');
        d.lineWidth(1);
        if (vert) {

        } else {
            d.line(x1, y1 + 8, x1, off - 8);
            d.line(x2, y2 + 8, x2, off - 8);
            d.arrowVH(false, off, x1, x2, 3, true, true, 'silver');
        }
    }

    move(x, y) {}

    mouseMove(o) {
        this.mouse = { ...o };
        if (this.state === 'modif') {
            if (o.pressed === 0) {
                const dx = this.fixMouseCoord.x - o.x;
                const dy = this.fixMouseCoord.y - o.y;
                if (this.nodeModif) {
                    this.nodeModif.x -= dx;
                    this.nodeModif.y -= dy;
                } else {
                    this.list = this.list.map((it) => ({ ...it, x: it.x - dx, y: it.y - dy }));
                }
                this.fixMouseCoord = { ...o };
            } else {
                this.nodeModif = this._hoverNode(o.x, o.y);
            }
        }
    }

    mouseDown(o) {
        if (o.button === 2) {
            this.state = 'draw';
            this.owner.current('free');
            this.nodeModif = false;
        }

        if (o.button === 0 && this.state === 'modif') {
            // this.nodeModif = this._hoverNode(o.x, o.y);
            this.fixMouseCoord = { ...o };
        }
    }

    mouseUp(o) {
        this.isButtonDown = false;
        if (this.state === 'add') {
            this.add(o);
        }
        if (this.state === 'node-modif') {
            this.nodeModif = false;
        }
    }

    _hoverNode(x, y) {
        const { list } = this;
        const nodeSize = 3;
        for (let i = 0; i < list.length; i++) {
            if (DrawUtils.inBox(x, y,
                list[i].x - nodeSize,
                list[i].y - nodeSize,
                list[i].x + nodeSize,
                list[i].y + nodeSize)) {
                return list[i];
            }
        }
        return false;
    }

    getGabarit() {
        if (this.list.length > 1 && (this.gabarit.vert || this.gabarit.right)) {
            const out = {
                horiz: {},
                vert: {},
            };
            this.list.map((it, i) => {
                if (i === 0) {
                    out.horiz = { max: it, min: it };
                    out.vert = { max: it, min: it };
                } else {
                    if (out.horiz.max.x < it.x) out.horiz.max = it;
                    if (out.horiz.min.x > it.x) out.horiz.min = it;
                    if (out.vert.max.y < it.y) out.vert.max = it;
                    if (out.vert.min.y > it.y) out.vert.min = it;
                }
            });
            return out;
        }
        return false;
    }
}
