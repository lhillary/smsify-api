/**
 *
 *
 * @param {*} obj
 * @return {*}  {*}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(v => toCamelCase(v));
    } else if (obj != null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => ({
                ...result,
                [key.replace(/(_\w)/g, k => k[1].toUpperCase())]: toCamelCase(obj[key])
            }),
            {}
        );
    }
    return obj;
}