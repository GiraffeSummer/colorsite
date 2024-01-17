export function saveLocalStorage(key: string, data: any) {
    localStorage.setItem(key, typeof data == 'object' ? JSON.stringify(data) : data)
}

export function loadLocalStorage(key: string) {
    if (!(key in localStorage)) return null
    const data = localStorage.getItem(key);
    if (data == null) return null;
    try {
        return JSON.parse(data);
    } catch (error) {
        return data;
    }
}

export function removeLocalStorage(key: string) {
    if (!(key in localStorage)) return false
    localStorage.removeItem(key);
    return true;
}
