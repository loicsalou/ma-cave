
export function sanitizeBeforeSave(object: any): any {
  return JSON.parse(JSON.stringify(object, function (k, v) {
    if (v === undefined) {
      return null;
    }
    return v;
  }));
}
