import {
    ut, JX, parentDOM, binds,
} from 'fmihel-browser-lib';

export default class Draw {
    constructor(ownerDOM) {
        binds(this, 'worldX', 'worldY', '_doMove', '_doMouseDown', '_doMouseUp');
        this.owner = ownerDOM;
        this.parent = parentDOM(ownerDOM);
        this.canvas = this.owner.getContext('2d');
        this.resizeObserver = new ResizeObserver((o) => {
            this.resize();
        });
        this.resizeObserver.observe(this.parent);
        this.buffer = [];
        this.listStore = [];
        this.resize(true);

        this.onMove = undefined;
        this.onMouseDown = undefined;
        this.onMouseUp = undefined;

        ownerDOM.addEventListener('mousemove', this._doMove);
        ownerDOM.addEventListener('mousedown', this._doMouseDown);
        ownerDOM.addEventListener('mouseup', this._doMouseUp);
    }

    _doMove(o) {
        if (this.onMove) {
            this.onMove({
                button: o.button,
                x: this.localX(o.offsetX),
                y: this.localY(o.offsetY),
            });
        }
    }

    _doMouseDown(o) {
        if (this.onMouseDown) {
            this.onMouseDown({
                button: o.button,
                x: this.localX(o.offsetX),
                y: this.localY(o.offsetY),
            });
        }
    }

    _doMouseUp(o) {
        if (this.onMouseUp) {
            this.onMouseUp({
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
        const size = JX.pos(this.parent);

        this.owner.width = size.w - 5;
        this.owner.height = size.h - 5;

        this.out();
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

    clear() {
        this.buffer = [];
        this.canvas.fillStyle = 'white';
        this.canvas.fillRect(this.world.x1, this.world.y1, this.world.x2, this.world.y2);
    }

    animate(event, param) {
        if (this.timerAnimate) return;
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
}
