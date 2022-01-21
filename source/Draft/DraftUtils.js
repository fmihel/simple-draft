export default class DraftUtils {
/** глубокое сравнение двух объектов */
    static eq(a, b) {
        const typeA = Array.isArray(a) ? 'array' : typeof a;
        const typeB = Array.isArray(b) ? 'array' : typeof b;

        if (typeA !== typeB) return false;
        if (typeA === 'array') {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (!DraftUtils.eq(a[i], b[i])) return false;
            }
            return true;
        } if (typeA === 'object') {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            if (keysA.length !== keysB.length) return false;
            for (let i = 0; i < keysA.length; i++) {
                if (keysA[i] !== keysB[i]) return false;
                if (!DraftUtils.eq(a[keysA[i]], b[keysB[i]])) return false;
            }
            return true;
        }
        return a === b;
    }

    // проверка что занчение число
    static isNumber(n) {
        return !Number.isNaN(parseFloat(n)) && !Number.isNaN(n - 0);
    }

    // округляет все занчения полей, если они числа
    static fixedNumField(v, fixed = 2) {
        const type = (Array.isArray(v) ? 'array' : typeof v);
        if (type === 'string') {
            if (DraftUtils.isNumber(v)) {
                if (!Number.isInteger(v)) {
                    return parseFloat(parseFloat(v).toFixed(fixed));
                }
                return parseInt(v, 10);
            }
        } else if (type === 'number') {
            if (!Number.isInteger(v)) {
                return parseFloat(v.toFixed(fixed));
            }
        } else if (type === 'array') {
            return v.map((it) => DraftUtils.fixedNumField(it, fixed));
        } else if (type === 'object') {
            const keys = Object.keys(v);
            const out = {};
            keys.map((key) => {
                out[key] = DraftUtils.fixedNumField(v[key], fixed);
            });
            return out;
        }

        return v;
    }
}
