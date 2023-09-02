import constants from "../constants";
import Vec2 from "../Utils/Vec2";

const BEATS_PER_BAR = 4;
const TOTAL_BEATS = BEATS_PER_BAR * constants.TIMING.BARS;
const TOTAL_TIME = (TOTAL_BEATS * 60) / constants.TIMING.BPM;

// Optimizations
const TOTAL_RADIANS = Math.PI * 2;
const TOTAL_BEATS_INV = 1 / TOTAL_BEATS;
const TOTAL_RADIANS_INV = 1 / TOTAL_RADIANS;

function getPlaceInSong(ray:Vec2) {
    const radians = ray.radians();
    const percentage = (radians + Math.PI) * TOTAL_RADIANS_INV;
    
    const closestBeat = Math.round(percentage * TOTAL_BEATS);
    return TOTAL_BEATS - closestBeat;
}

function getPlaceOnRing(beat:number, radius:number) {
    const percentage = beat * TOTAL_BEATS_INV;
    const radians = (percentage * TOTAL_RADIANS) - (Math.PI / 2);

    var newX = Math.cos(radians) * radius;
    var newY = Math.sin(radians) * radius;
    return new Vec2(newX, newY);
}

export {
    TOTAL_TIME,
    TOTAL_BEATS,
    getPlaceInSong,
    getPlaceOnRing
};

