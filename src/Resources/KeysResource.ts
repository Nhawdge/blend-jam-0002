// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
let dirty = false;
let previousFrame = new Set<string>();
const keys = new Set<string>();

window.addEventListener("keydown", (e) => {
    keys.add(e.key);
    dirty = true;
}, false);

window.addEventListener("keyup", (e) => {
    keys.delete(e.key);
    dirty = true;
}, false);

function isKeyDown(key:string): boolean {
    return keys.has(key);
}

function keyJustReleased(key:string): boolean {
    return !keys.has(key) && previousFrame.has(key);
}

function isAnyKeyDown(): boolean {
    return !keys.keys().next().done;
}

function tick(): void {
    if (!dirty) { return; }

    previousFrame = new Set<string>(keys);
    dirty = false;
}

export default {
    isKeyDown,
    isAnyKeyDown,
    keyJustReleased,
    tick
};
