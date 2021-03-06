import DraftObject from './DraftObject';
import { DrawUtils } from '../Draw';

export default class DraftSize extends DraftObject {
    constructor(vert = true) {
        super();
        this.name = 'DraftSize';
        // this.owner = undefined;
        // this.state = 'draw';
        // this.id = Math.floor(Math.random() * 100000);
        this.nodeModif = undefined;
        this.defaultData = {
            horiz: {
                align: 'horiz',
                lines: [{
                    x1: -50, y1: 10, x2: -50, y2: -35,
                }, {
                    x1: 50, y1: 10, x2: 50, y2: -35,
                }],
                arrow: { a: -30, a1: -50, a2: 50 },
                text: 'xxx m',
            },
            vert: {
                align: 'vert',
                lines: [{
                    y1: -50, x1: 10, y2: -50, x2: -35,
                }, {
                    y1: 50, x1: 10, y2: 50, x2: -35,
                }],
                arrow: { a: -30, a1: -50, a2: 50 },
                text: 'xxxx m',
            },
        };
        this._data = ((vert === true || vert === 'vert') ? this.defaultData.vert : this.defaultData.horiz);
    }

    underCursor(x, y) {
        const { lines, arrow } = this._data;
        let res = false;
        const off = 2;
        // eslint-disable-next-line no-return-assign
        lines.map((l) => {
            res = res || (DrawUtils.inLine(x, l.x1, l.x2, true, off) && DrawUtils.inLine(y, l.y1, l.y2, true, off));
        });
        if (!res) {
            if (this._data.align === 'vert') {
                res = DrawUtils.inLine(y, arrow.a1, arrow.a2, true, off) && DrawUtils.inLine(x, arrow.a - off, arrow.a + off);
            } else {
                res = DrawUtils.inLine(x, arrow.a1, arrow.a2, true, off) && DrawUtils.inLine(y, arrow.a - off, arrow.a + off);
            }
        }
        return res;
    }

    add(o) {
        this._data = { ...o };
    }

    draw() {
        const { state, _data: data } = this;
        const d = this.owner.drawer;
        const color = state === 'draw' ? 'gray' : 'red';

        if (state === 'draw') {
            if (data.align === 'vert') {

            } else {

            }
        } else if (state === 'modif') {
            d.lineWidth(3);
            if (data.align === 'vert') {
                d.circle(data.lines[0].x1, data.lines[0].y1, 4);
                d.circle(data.lines[1].x1, data.lines[1].y1, 4);
            } else {
                d.circle(data.lines[0].x1, data.lines[0].y1, 4);
                d.circle(data.lines[1].x1, data.lines[1].y1, 4);
            }
            d.lineWidth(1);
        }

        data.lines.map((l) => d.line(l.x1, l.y1, l.x2, l.y2, color));
        d.arrowVH(data.align === 'vert', data.arrow.a, data.arrow.a1, data.arrow.a2, 3, true, true, color);

        const textPos = { x: 0, y: 0 };
        const charW = 5;
        const charH = 12;
        if (data.align === 'vert') {
            textPos.x = data.arrow.a - (data.text.length * charW) / 2;
            textPos.y = (data.arrow.a1 + data.arrow.a2) / 2;
        } else {
            textPos.y = data.arrow.a - 5;
            textPos.x = (data.arrow.a1 + data.arrow.a2) / 2 - (data.text.length * charW) / 2;
        }
        d.fillRect(textPos.x - 5,
            textPos.y - 5,
            textPos.x + data.text.length * 5 + 10,
            textPos.y + charH,
            'white');

        d.text(data.text, textPos.x, textPos.y, 'black', 12);
    }

    move(x, y) {

    }

    select(select = true) {
        this.state = select ? 'modif' : 'draw';
    }

    mouseMove(o) {
        const { _data: data } = this;
        const { lines } = data;
        this.mouse = { ...o };
        if (this.state === 'modif') {
            if (o.pressed === 0) {
                const dx = this.fixMouseCoord.x - o.x;
                const dy = this.fixMouseCoord.y - o.y;
                if (this.nodeModif === undefined) {
                    data.lines = data.lines.map((it) => ({
                        ...it,
                        x1: it.x1 - dx,
                        y1: it.y1 - dy,
                        x2: it.x2 - dx,
                        y2: it.y2 - dy,
                    }));
                    if (data.align === 'vert') {
                        data.arrow.a -= dx;
                        data.arrow.a1 -= dy;
                        data.arrow.a2 -= dy;
                    } else {
                        data.arrow.a -= dy;
                        data.arrow.a1 -= dx;
                        data.arrow.a2 -= dx;
                    }
                } else {
                    //---
                    // eslint-disable-next-line no-lonely-if
                    if (data.align === 'vert') {
                        data.lines[this.nodeModif].x1 -= dx;
                        data.lines[this.nodeModif].y1 -= dy;
                        data.lines[this.nodeModif].y2 -= dy;
                        if (this.nodeModif === 0) data.arrow.a1 -= dy;
                        else data.arrow.a2 -= dy;
                    } else {
                        data.lines[this.nodeModif].x1 -= dx;
                        data.lines[this.nodeModif].y1 -= dy;
                        data.lines[this.nodeModif].x2 -= dx;
                        if (this.nodeModif === 0) data.arrow.a1 -= dx;
                        else data.arrow.a2 -= dx;
                    }
                }
                this.fixMouseCoord = { ...o };
                this.doChange();
            } else {
                this.nodeModif = undefined;
                //---
                // eslint-disable-next-line no-lonely-if
                if (DrawUtils.inBox(o.x, o.y,
                    lines[0].x1 - 3,
                    lines[0].y1 - 3,
                    lines[0].x1 + 3,
                    lines[0].y1 + 3)
                ) {
                    this.nodeModif = 0;
                }
                if (DrawUtils.inBox(o.x, o.y,
                    lines[1].x1 - 3,
                    lines[1].y1 - 3,
                    lines[1].x1 + 3,
                    lines[1].y1 + 3)
                ) {
                    this.nodeModif = 1;
                }
            }
        }
    }

    mouseDown(o) {
        if (o.button === 0 && this.state === 'modif') {
            this.fixMouseCoord = { ...o };
        }
    }

    mouseUp(o) {}

    getGabarit() {
    }

    data(set = undefined) {
        if (set) {
            this._data = { ...set };
        }
        return this._data;
    }
}
