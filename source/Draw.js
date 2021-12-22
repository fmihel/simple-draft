import {
    ut, JX, parentDOM, binds,
} from 'fmihel-browser-lib';

export default class Draw {
    constructor(ownerDOM) {
        binds(this, 'worldX', 'worldY', '_doMove', '_doMouseDown', '_doMouseUp');
        this.owner = ownerDOM;
        this.parent = parentDOM(ownerDOM);
        this.canvas = this.owner.getContext('2d');
        this.buffer = [];
        this.listStore = [];

        this.onMove = undefined;
        this.onMouseDown = undefined;
        this.onMouseUp = undefined;
        this.pressed = -1;

        ownerDOM.addEventListener('mousemove', this._doMove);
        ownerDOM.addEventListener('mousedown', this._doMouseDown);
        ownerDOM.addEventListener('mouseup', this._doMouseUp);

        this.resizeObserver = new ResizeObserver(() => {
            this.resize();
        });
        this.resizeObserver.observe(this.parent);

        this.resize();
    }

    _doMove(o) {
        if (this.onMove) {
            this.onMove({
                pressed: this.pressed,
                button: o.button,
                x: this.localX(o.offsetX),
                y: this.localY(o.offsetY),
            });
        }
    }

    _doMouseDown(o) {
        this.pressed = o.button;
        if (this.onMouseDown) {
            this.onMouseDown({
                button: o.button,
                pressed: this.pressed,
                x: this.localX(o.offsetX),
                y: this.localY(o.offsetY),
            });
        }
    }

    _doMouseUp(o) {
        this.pressed = -1;
        if (this.onMouseUp) {
            this.onMouseUp({
                pressed: this.pressed,
                button: o.button,
                x: this.localX(o.offsetX),
                y: this.localY(o.offsetY),
            });
        }
    }

    free() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    updateSC() {
        const w = this.owner.width;
        const h = this.owner.height;
        this.world = {
            x1: 0, y1: 0, x2: w - 1, y2: h - 1,
        };
        this.local = {
            x1: -w / 2,
            y1: h / 2,
            x2: w / 2,
            y2: -h / 2,
        };
    }

    resize() {
        if (this.timerOut) {
            clearTimeout(this.timerOut);
        }
        //        this.timerOut = setTimeout(() => {
        this.timerOut = undefined;

        this.owner.width = this.parent.clientWidth;
        this.owner.height = this.parent.clientHeight;
        this.updateSC();
        // this.out();
        //        }, 10);
    }

    worldX(x) {
        const l = this.local;
        const w = this.world;
        return ut.translate(x, l.x1, l.x2, w.x1, w.x2);
    }

    worldY(y) {
        const l = this.local;
        const w = this.world;
        return ut.translate(y, l.y1, l.y2, w.y1, w.y2);
    }

    localX(x) {
        const l = this.local;
        const w = this.world;
        return ut.translate(x, w.x1, w.x2, l.x1, l.x2);
    }

    localY(y) {
        const l = this.local;
        const w = this.world;
        return ut.translate(y, w.y1, w.y2, l.y1, l.y2);
    }

    saveCommand(command) {
        this.buffer.push(command);
    }

    _store(type, newMean) {
        const c = this.canvas;
        if (newMean) {
            if (type === 'fill') {
                this.listStore.fillStyle = c.fillStyle;
                c.fillStyle = newMean;
            } else if (type === 'color') {
                this.listStore.strokeStyle = c.strokeStyle;
                c.strokeStyle = newMean;
            }
        }
    }

    _reStore(type, newMean) {
        const c = this.canvas;
        if (newMean) {
            if (type === 'fill') {
                c.fillStyle = this.listStore.fillStyle;
            } else if (type === 'color') {
                c.strokeStyle = this.listStore.strokeStyle;
            }
        }
    }

    _color(o) {
        this.canvas.strokeStyle = o.color;
    }

    _lineWidth(o) {
        this.canvas.lineWidth = o.lineWidth;
    }

    _fill(o) {
        this.canvas.fillStyle = o.color;
    }

    _line(o) {
        this._store('color', o.line.color);
        this.canvas.beginPath();
        this.canvas.moveTo(this.worldX(o.line.x1), this.worldY(o.line.y1));
        this.canvas.lineTo(this.worldX(o.line.x2), this.worldY(o.line.y2));
        this.canvas.stroke();
        this.canvas.closePath();
        this._reStore('color', o.line.color);
    }

    _grid(o) {
        this._store('color', o.grid.color);
        let left = 0;
        let right = 0;

        while (left < this.local.x2) {
            this.canvas.beginPath();
            this.canvas.moveTo(this.worldX(left), this.worldY(this.local.y1));
            this.canvas.lineTo(this.worldX(left), this.worldY(this.local.y2));
            this.canvas.stroke();
            this.canvas.closePath();

            this.canvas.beginPath();
            this.canvas.moveTo(this.worldX(right), this.worldY(this.local.y1));
            this.canvas.lineTo(this.worldX(right), this.worldY(this.local.y2));
            this.canvas.stroke();
            this.canvas.closePath();

            left += o.grid.step;
            right -= o.grid.step;
        }
        left = 0;
        right = 0;
        while (left < this.local.y1) {
            this.canvas.beginPath();
            this.canvas.moveTo(this.worldX(this.local.x1), this.worldY(left));
            this.canvas.lineTo(this.worldX(this.local.x2), this.worldY(left));
            this.canvas.stroke();
            this.canvas.closePath();

            this.canvas.beginPath();
            this.canvas.moveTo(this.worldX(this.local.x1), this.worldY(right));
            this.canvas.lineTo(this.worldX(this.local.x2), this.worldY(right));
            this.canvas.stroke();
            this.canvas.closePath();

            left += o.grid.step;
            right -= o.grid.step;
        }

        this._reStore('color', o.grid.color);
    }

    _box(o) {
        const b = o.box;
        this._store('color', b.color);
        this.canvas.beginPath();
        this.canvas.moveTo(this.worldX(b.x1), this.worldY(b.y1));
        this.canvas.lineTo(this.worldX(b.x2), this.worldY(b.y1));
        this.canvas.lineTo(this.worldX(b.x2), this.worldY(b.y2));
        this.canvas.lineTo(this.worldX(b.x1), this.worldY(b.y2));
        this.canvas.lineTo(this.worldX(b.x1), this.worldY(b.y1));

        this.canvas.stroke();
        this.canvas.closePath();
        this._reStore('color', b.color);
    }

    _point(o) {
        this._store('color', o.point.color);
        this.canvas.beginPath();
        this.canvas.moveTo(this.worldX(o.point.x), this.worldY(o.point.y));
        this.canvas.lineTo(this.worldX(o.point.x + 1), this.worldY(o.point.y + 0));
        this.canvas.stroke();
        this.canvas.closePath();
        this._reStore('color', o.point.color);
    }

    _text(o) {
        this._store(o.text.type === 'fill' ? 'fill' : 'color', o.text.color);
        this.canvas.font = `${o.text.size}px serif`;
        if (o.text.type === 'fill') {
            this.canvas.fillText(o.text.msg, this.worldX(o.text.x), this.worldY(o.text.y));
        } else {
            this.canvas.strokeText(o.text.msg, this.worldX(o.text.x), this.worldY(o.text.y));
        }

        this._reStore(o.text.type === 'fill' ? 'fill' : 'color', o.text.color);
    }

    _circle(o) {
        this._store('color', o.circle.color);
        this.canvas.beginPath();
        this.canvas.arc(this.worldX(o.circle.x), this.worldY(o.circle.y), o.circle.r, 0, 2 * Math.PI);
        this.canvas.stroke();
        this._reStore('color', o.circle.color);
    }

    _arrowVH(o) {
        // vert,a,b1,b2,d,left,right,color
        const a = o.arrowVH;
        this._store('color', a.color);
        let x1; let x2; let y1; let y2; let left; let right;
        if (a.vert) {
            x1 = this.worldX(a.a);
            x2 = x1;
            y1 = this.worldY(a.a1);
            y2 = this.worldY(a.a2);
            left = a.left ? [x1 - a.d, y1 - 2 * a.d, x1, y1, x1 + a.d, y1 - 2 * a.d] : false;
            right = a.right ? [x1 - a.d, y2 + 2 * a.d, x1, y2, x1 + a.d, y2 + 2 * a.d] : false;
        } else {
            x1 = this.worldX(a.a1);
            x2 = this.worldX(a.a2);
            y1 = this.worldY(a.a);
            y2 = y1;
            left = a.left ? [x1 + 2 * a.d, y1 - a.d, x1, y1, x1 + 2 * a.d, y1 + a.d] : false;
            right = a.right ? [x2 - 2 * a.d, y2 - a.d, x2, y2, x2 - 2 * a.d, y2 + a.d] : false;
        }
        this.canvas.beginPath();
        this.canvas.moveTo(x1, y1);
        this.canvas.lineTo(x2, y2);
        this.canvas.stroke();
        this.canvas.closePath();
        if (left) {
            this.canvas.beginPath();
            this.canvas.moveTo(left[0], left[1]);
            this.canvas.lineTo(left[2], left[3]);
            this.canvas.lineTo(left[4], left[5]);
            this.canvas.stroke();
            this.canvas.closePath();
        }
        if (right) {
            this.canvas.beginPath();
            this.canvas.moveTo(right[0], right[1]);
            this.canvas.lineTo(right[2], right[3]);
            this.canvas.lineTo(right[4], right[5]);
            this.canvas.stroke();
            this.canvas.closePath();
        }
        this._reStore('color', a.color);
    }

    clear() {
        this.buffer = [];
        this.canvas.fillStyle = 'white';
        this.canvas.fillRect(this.world.x1, this.world.y1, this.world.x2, this.world.y2);
    }

    animate(event, param) {
        if (this.timerAnimate) { return; }
        const p = {
            delay: 100,
            stopStep: 0,
            stopTime: 0,
            ...param,

        };
        if (!event) return;
        let step = 0;
        let T = 0;
        this.timerAnimate = setInterval(() => {
            this.buffer = [];
            this.canvas.fillStyle = 'white';
            this.canvas.fillRect(this.world.x1, this.world.y1, this.world.x2, this.world.y2);
            const next = event({ step });
            step++;
            T += p.delay;
            this.out();

            if (
                (next === false)
                || ((p.stopStep > 0) && (p.stopStep <= step))
                || ((p.stopTime > 0) && (p.stopTime <= T))
            ) {
                clearInterval(this.timerAnimate);
            }
        }, p.delay);
    }

    out() {
        this.updateSC();

        this.buffer.forEach((o) => {
            if (o.fill) {
                this._fill(o);
            } else if (o.color) {
                this._color(o);
            } else if (o.line) {
                this._line(o);
            } else if (o.point) {
                this._point(o);
            } else if (o.grid) {
                this._grid(o);
            } else if (o.text) {
                this._text(o);
            } else if (o.circle) {
                this._circle(o);
            } else if (o.box) {
                this._box(o);
            } else if (o.arrowVH) {
                this._arrowVH(o);
            } else if (o.lineWidth) {
                this._lineWidth(o);
            }
        });
    }

    color(color) {
        this.saveCommand({ color });
    }

    fill(color) {
        this.saveCommand({ fill: color });
    }

    line(x1, y1, x2, y2, color = undefined) {
        this.saveCommand({
            line: {
                x1, y1, x2, y2, color,
            },
        });
    }

    point(x, y, color = undefined) {
        this.saveCommand({
            point: {
                x, y, color,
            },
        });
    }

    grid(step, color = '#E5E5E5') {
        this.saveCommand({
            grid: {
                step, color,
            },
        });
    }

    text(msg, x, y, color = 'black', size = 10, type = 'fill') {
        this.saveCommand({
            text: {
                msg, x, y, color, type, size,
            },
        });
    }

    circle(x, y, r, color = 'black') {
        this.saveCommand({
            circle: {
                x, y, r, color,
            },
        });
    }

    box(x1, y1, x2, y2, color = 'black') {
        this.saveCommand({
            box: {
                x1, y1, x2, y2, color,
            },
        });
    }

    arrowVH(vert, a, a1, a2, d, left, right, color = 'black') {
        this.saveCommand({
            arrowVH: {
                vert, a, a1, a2, d, left, right, color,
            },
        });
    }

    lineWidth(lineWidth) {
        this.saveCommand({ lineWidth });
    }
}
