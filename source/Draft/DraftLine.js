/* eslint-disable camelcase */
import DraftObject from './DraftObject';
import { DrawUtils } from '../Draw';

export default class DraftLine extends DraftObject {
    constructor() {
        super();
        this.name = 'DraftLine';
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

    items(i) {
        return this.list[i];
    }

    count() {
        return this.list.length;
    }

    indexOf(node) {
        return this.list.indexOf(node);
    }

    delete(node) {
        const index = typeof node === 'object' ? this.indexOf(node) : node;
        if (index >= 0) this.list.splice(index, 1);
    }

    /** точка расположена не на концах */
    isNotBorderNode(node) {
        if (node) {
            const index = this.indexOf(node);
            return (index > 0 && index < this.count() - 1);
        }
        return false;
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

    add(o, to = -1) {
        const obj = { x: o.x, y: o.y, type: o.type || 'line' };
        if (to === -1) {
            this.list.push(obj);
        } else {
            this.list.splice(to, 0, obj);
        }
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

        let color = 'black';
        const lineWidth = 4;
        if (this.owner.hover && this.owner.hover === this) color = 'red';
        if (this.state === 'add' || this.state === 'modif') {
            color = 'red';
        }
        d.color(color);
        d.lineWidth(lineWidth);

        let last = false;
        let line_is_draw = false;
        for (let i = 0; i < this.list.length; i++) {
            const it = this.list[i];

            // this.list.map((it, i) => {
            if (i > 0) {
                if (it.type === 'curve' && i < this.list.length - 1) {
                    d.bezier(
                        this.list[i - 1].x, this.list[i - 1].y,
                        it.x, it.y,
                        it.x, it.y,
                        this.list[i + 1].x, this.list[i + 1].y,
                        color,
                    );
                    line_is_draw = true;
                } else {
                    if (!line_is_draw) d.line(it.x, it.y, this.list[i - 1].x, this.list[i - 1].y);
                    line_is_draw = false;
                }
            }
            last = it;
        }
        if (this.state === 'add' && last) {
            d.color('silver');
            d.line(last.x, last.y, DrawUtils.round(this.mouse.x), DrawUtils.round(this.mouse.y));
        }
        // опорные точки
        if (this.state !== 'draw') {
            d.lineWidth(2);
            d.color(color);
            this.list.map((it) => {
                d.lineWidth(2);
                if (it === this.nodeModif) {
                    d.box(it.x - 5, it.y - 5, it.x + 5, it.y + 5);
                } else if (it === this.nodeHover) {
                    d.circle(it.x, it.y, 5);
                } else {
                    d.circle(it.x, it.y, 4);
                }
                d.lineWidth(lineWidth);
            });

            d.lineWidth(lineWidth);
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

    // вариант модификации без прилипания к сетке
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
                this.doChange();
            }
            this.nodeHover = this._hoverNode(o.x, o.y);
        }
    }

    mouseMove_v1(o) {
        // const o = { ...a, x: DrawUtils.round(a.x), y: DrawUtils.round(a.y) };
        // const o = { ...a };

        this.mouse = { ...o };
        if (this.state === 'modif') {
            if (o.pressed === 0) {
                if (this.nodeModif) {
                    const a = { ...o, x: DrawUtils.round(o.x), y: DrawUtils.round(o.y) };
                    const dx = this.fixMouseCoord.x - a.x;
                    const dy = this.fixMouseCoord.y - a.y;
                    this.nodeModif.x -= dx;
                    this.nodeModif.y -= dy;
                    this.fixMouseCoord = { ...a };
                } else {
                    const dx = this.fixMouseCoord.x - o.x;
                    const dy = this.fixMouseCoord.y - o.y;
                    this.list = this.list.map((it) => ({ ...it, x: it.x - dx, y: it.y - dy }));
                    this.fixMouseCoord = { ...o };
                }
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
            const needChange = (this.nodeModif !== this.nodeHover);

            this.nodeModif = this.nodeHover;// this._hoverNode(o.x, o.y);
            this.fixMouseCoord = { ...o };
            if (needChange) {
                this.doChange({ event: 'select-node', node: this.nodeModif });
            }
        }
    }

    mouseUp(o) {
        this.isButtonDown = false;
        if (this.state === 'add') {
            this.add({ ...o, x: DrawUtils.round(o.x), y: DrawUtils.round(o.y) });
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

    setNodeAsCurve(node) {
        const i = this.list.indexOf(node);

        if (i > 0 && i < this.list.length - 1) {
            const nodeA = this.list[i - 1];
            const nodeB = this.list[i + 1];
            const d1 = DrawUtils.dlina(node.x, node.y, nodeA.x, nodeA.y);
            const d2 = DrawUtils.dlina(node.x, node.y, nodeB.x, nodeB.y);
            const off = 40;
            const off1 = d1 * 0.5 > off ? off : d1 * 0.5;
            const off2 = d2 * 0.5 > off ? off : d2 * 0.5;
            const c1 = DrawUtils.getCoordOff(node.x, node.y, nodeA.x, nodeA.y, off1);
            const c2 = DrawUtils.getCoordOff(node.x, node.y, nodeB.x, nodeB.y, off2);
            this.add(c1, i);
            this.add(c2, i + 2);
            node.type = 'curve';
        }
        this.doChange();
    }

    setNodeAsLine(node) {
        if (this.isNotBorderNode(node)) {
            const i = this.indexOf(node);
            node.type = 'line';
        }
    }

    currentNode() {
        return this.nodeModif;
    }

    data(set = undefined) {
        if (set) {
            this.list = [];
            this.list = [...set];
        }
        return this.list;
    }
}
