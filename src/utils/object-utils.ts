//helper function to safely parse JSON strings
export function stripUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
    const out: Partial<T> = {};
    for (const k of Object.keys(obj)) {
        const v = (obj as any)[k];
        if (v !== undefined) out[k as keyof T] = v;
    }
  return out;
}