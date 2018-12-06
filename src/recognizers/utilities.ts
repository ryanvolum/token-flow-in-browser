import { Item, PID } from 'token-flow';

export function itemMapFromJSON(jsonString: string): Map<PID, Item> {
    const json = JSON.parse(jsonString);
    const items = json.items as Item[];
    if (items === undefined || !Array.isArray(items)) {
        throw TypeError('itemsFromJSON: expected items array.');
    }

    const map = new Map<PID, Item>();
    for (const item of items) {
        if (map.has(item.pid)) {
            throw TypeError(`itemsFromJSON: found duplicate pid in item ${item}`);
        }
        else {
            map.set(item.pid, item);
        }
    }

    return map;
}