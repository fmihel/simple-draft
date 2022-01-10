import DraftLine from './DraftLine';
import DraftSize from './DraftSize';

export const DG_LINE = 'line';
export const DG_UGOL90 = 'ugol-90';
export const DG_R10 = 'skrug-10';

export default class DraftGenerator {
    constructor(draft, param = {}) {
        this.draft = draft;
        this.default = {
            width: 300, // начальная ширина
            height: 80,
            ...param,
            start: { x: 0, y: -30, ...param.start }, // начальная координата
            step: { x: 20, y: 20, ...param.step }, // шаг
        };
    }

    /** создает эскиз по заданным кол-ву линиям и концам */
    generate(o) {
        const p = {
            nodes: [
                { left: DG_R10, right: DG_R10 },
                { left: DG_R10, right: DG_LINE },
            ],
            ...o,
        };

        this._global = {
            ...this.default,

            xmin: this.default.start.x - this.default.width / 2,
            xmax: this.default.start.x + this.default.width / 2,
            ymin: this.default.start.y,
            ymax: this.default.start.y + this.default.height,

        };
        p.nodes.map((node, i) => {
            const prev = (i > 0 ? p.nodes[i - 1] : false);
            this._genLine(i, node, prev);
        });

        const w05 = this.default.width / 2;
        this.draft.add(new DraftSize(false), false).add({
            vert: false,
            lines: [{
                x1: this.default.start.x - w05,
                y1: 0,
                x2: this.default.start.x - w05,
                y2: this.default.start.y - 40,
            }, {
                x1: this.default.start.x + w05,
                y1: 0,
                x2: this.default.start.x + w05,
                y2: this.default.start.y - 40,
            }],
            arrow: {
                a: this.default.start.y - 35,
                a1: this.default.start.x - w05,
                a2: this.default.start.x + w05,
            },
            text: 'xxx m',
        });
        const xmin = this.default.start.x - w05;
        const ytop = this.default.start.y + this.default.height + 10;
        const ybottom = this.default.start.y;
        this.draft.add(new DraftSize(false), false).add({
            vert: true,
            lines: [
                {
                    x2: xmin - 30,
                    y1: ybottom,
                    x1: xmin + w05,
                    y2: ybottom,
                },
                {
                    x2: xmin - 30,
                    y1: ytop,
                    x1: xmin + w05,
                    y2: ytop,
                }],
            arrow: {
                a: xmin - 25,
                a2: ytop,
                a1: ybottom,
            },
            text: 'xxx m',
        });

        this._global = undefined;
    }

    _genLine(i, node, prev) {
        const d = this.draft;
        const g = this._global;
        const points = [];
        //-----------------------------------------------------------------

        const dy = g.step.y;
        const dx = { left: 0, right: 0 };

        //-----------------------------------------------------------------
        if (node.left === DG_LINE) {
            points.push({ x: g.xmin, y: g.ymin });
        }

        if (node.left === DG_UGOL90) {
            points.push({ x: g.xmin, y: g.ymax });
            points.push({ x: g.xmin, y: g.ymin });
            dx.left = g.step.x;
        }
        if (node.left === DG_R10) {
            points.push({ x: g.xmin, y: g.ymax });
            points.push({ x: g.xmin, y: g.ymin });
            dx.left = g.step.x;
        }

        //-----------------------------------------------------------------
        if (node.right === DG_LINE) {
            points.push({ x: g.xmax, y: g.ymin });
        }
        if (node.right === DG_UGOL90) {
            points.push({ x: g.xmax, y: g.ymin });
            points.push({ x: g.xmax, y: g.ymax });
            dx.right = g.step.x;
        }
        if (node.right === DG_R10) {
            points.push({ x: g.xmax, y: g.ymin });
            points.push({ x: g.xmax, y: g.ymax });
            dx.right = g.step.x;
        }
        //-----------------------------------------------------------------
        g.xmin += dx.left;
        g.xmax -= dx.right;
        g.ymin += dy;
        //-----------------------------------------------------------------
        const line = d.add(new DraftLine(), false);
        points.map((point) => line.add(point));

        if (node.left === DG_R10) {
            line.setNodeAsCurve(line.items(1));
        }
        if (node.right === DG_R10) {
            line.setNodeAsCurve(line.items(line.count() - 2));
        }
        //-----------------------------------------------------------------
    }
}
