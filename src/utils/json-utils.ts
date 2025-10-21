//helper function to safely parse JSON strings
export function safeParseJson<T>(s: string | null | undefined): T | null {
    if (s == null) return null;
    try { 
        return JSON.parse(s) as T; 
    } catch { 
        return null; 
    }
}

//helper function for safe JSON stringifying
export function safeStringify(v: any): string {
    try { 
        return JSON.stringify(v == null ? null : v); 
    } catch { 
        return "null"; 
    }
}