import Draw from './Draw';

/* eslint-disable eqeqeq */
export default class DrawUtils {
    static inLine(x, x1, x2, strong = true, off = 0) {
        if (x1 === x2 && off === 0) {
            return x1 === x;
        }
        if (x1 < x2) {
            return strong ? ((x1 - off) <= x && x <= (x2 + off)) : ((x1 - off) < x && x < (x2 + off));
        }
        return strong ? ((x2 - off) <= x && x <= (x1 + off)) : ((x2 - off) < x && x < (x1 + off));
    }

    static deq(a, a1, plusMinus = 1) { return DrawUtils.inLine(a, a1 - plusMinus, a1 + plusMinus); }

    static IsPointOnLine(x, y, x1, y1, x2, y2, plusMinus = 5) {
        let result = false;

        // точка
        if (DrawUtils.deq(x1, x2, plusMinus) && DrawUtils.deq(y1, y2, plusMinus)) {
            return (DrawUtils.deq(x, x1, plusMinus) && DrawUtils.deq(y, y1, plusMinus)) || (DrawUtils.deq(x, x2, plusMinus) && DrawUtils.deq(y, y2, plusMinus));
        }

        // линия вертикальная
        if (DrawUtils.deq(x1, x2, plusMinus)) {
            result = DrawUtils.inLine(x, x1, x2, true, plusMinus) && DrawUtils.inLine(y, y1, y2, true, plusMinus);
        } else if (DrawUtils.inLine(x, x1, x2, true, plusMinus)) {
            const k = (y1 - y2) / (x1 - x2);
            const b = y1 - x1 * k;
            const yeq = k * x + b;
            result = DrawUtils.deq(y, yeq, plusMinus);
        }

        return result;
    }

    static inBox(x, y, x1, y1, x2, y2, strong = true) {
        return DrawUtils.inLine(x, x1, x2, strong) && DrawUtils.inLine(y, y1, y2, strong);
    }
}
