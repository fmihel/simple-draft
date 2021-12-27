import DrawLine from './DrawLine';

const DG_LINE = 'line';
const DG_UGOL90 = 'ugol-90';
export default class DraftGenerator {
    constructor(draft) {
        this.draft = draft;
        this.default = {
            width: 300, // начальная ширина
            height: 80,
            start: { x: 0, y: -30 }, // начальная координата
            step: { x: 10, y: 10 }, // шаг

        };
    }

    /** создает эскиз по заданным кол-ву линиям и концам */
    generate(o) {
        const p = {
            nodes: [
                { left: DG_UGOL90, right: DG_UGOL90 },
                { left: DG_LINE, right: DG_UGOL90 },

                { left: DG_UGOL90, right: DG_LINE },
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

        //-----------------------------------------------------------------
        if (node.right === DG_LINE) {
            points.push({ x: g.xmax, y: g.ymin });
        }
        if (node.right === DG_UGOL90) {
            points.push({ x: g.xmax, y: g.ymin });
            points.push({ x: g.xmax, y: g.ymax });
            dx.right = g.step.x;
        }
        //-----------------------------------------------------------------
        g.xmin += dx.left;
        g.xmax -= dx.right;
        g.ymin += dy;
        //-----------------------------------------------------------------
        const line = d.add(new DrawLine(), false);
        points.map((point) => line.add(point));
    }
}
