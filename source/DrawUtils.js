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

    static deq(a, a1, d = 1) { return DrawUtils.inLine(a, a1 - d, a1 + d); }

    static IsPointOnLine(x, y, z, x1, y1, z1, x2, y2, z2, d = 3) {
        let result = false;

        if ((x1 == x2) && (y1 == y2) && (z1 == z2)) {
            return false;
        }
        if (x1 == x2) {
            result = (x == x1);
            if (y1 == y2) {
                result = result && (y == y1);
            } else {
                result = result && ((z - z1) * (y2 - y1) == (z2 - z1) * (y - y1));
            }
        } else {
            const t = (x - x1) / (x2 - x1);
            result = (z == (z1 + t * (z2 - z1)));
            result = result && (DrawUtils.deq(y, (y1 + t * (y2 - y1)), d));
        }

        return result;
    }

    static inBox(x, y, x1, y1, x2, y2, strong = true) {
        return DrawUtils.inLine(x, x1, x2, strong) && DrawUtils.inLine(y, y1, y2, strong);
    }
}
