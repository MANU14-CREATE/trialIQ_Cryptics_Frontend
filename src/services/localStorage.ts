export function saveLocalStorage(key: any, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorage(key: any) {
    const Item = localStorage.getItem(key);
    return JSON.parse(Item);
}

export function clearLocalStorage() {
    localStorage.clear();
}