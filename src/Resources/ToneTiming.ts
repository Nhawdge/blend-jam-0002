import constants from "../constants";
import Vec2 from "../Utils/Vec2";
import DeltaTime from "./DeltaTime";
import MusicLoop from "./MusicLoop";

const BEATS_PER_BAR = 4;
const TOTAL_BEATS = BEATS_PER_BAR * constants.TIMING.BARS;
const TOTAL_TIME = ((TOTAL_BEATS * 60) / constants.TIMING.BPM) * 1000;


// Optimizations
const TOTAL_RADIANS = Math.PI * 2;
const TOTAL_BEATS_INV = 1 / TOTAL_BEATS;
const TOTAL_RADIANS_INV = 1 / TOTAL_RADIANS;

const loop = new MusicLoop();
let time = 0;
let nextBeat = TOTAL_BEATS_INV;
let percent = 0;
let beat = 0;

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

function reset() {
    time = 0;
    nextBeat = TOTAL_BEATS_INV;
    beat = 0;
    percent = 0;
}

function getPercent() { return percent; }

function tick() {
    time += DeltaTime.get();

    percent = time / TOTAL_TIME;

    if (percent > nextBeat) {
        beat += 1;     

        while (beat >= TOTAL_BEATS) {
            beat -= TOTAL_BEATS;
        }

        
        nextBeat = (beat + 1) * TOTAL_BEATS_INV;
        loop.play(beat);

    }

    while (percent > 1) {
        time -= TOTAL_TIME;
        percent = time / TOTAL_TIME;
    }

}

export default {
    TOTAL_TIME,
    TOTAL_BEATS,
    getPlaceInSong,
    getPlaceOnRing,
    loop,
    tick,
    reset,
    getPercent
};

