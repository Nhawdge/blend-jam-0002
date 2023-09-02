
export default {
    STAGE_SIZE: [1280, 800],
    STAGE_CENTER: [1280 / 2, 800 / 2],
    PLATFORM_WIDTH: [9 * 32, 9 * 32],
    SCALE: 1,
    TILE_SIZE: 32,
    PLAYER_ACCELERATION: 0.4,
    MAX_PLAYER_SPEED: 5,
    PLAYER_DRAG: 0.2,
    PLATFORM_RADIUS: 275,
    RING_1_RADIUS: 295, //inner-most ring's center point
    RING_2_RADIUS: 311,
    RING_3_RADIUS: 327,
    RING_4_RADIUS: 343,
    RING_5_RADIUS: 359,
    MAX_ENEMIES_ON_SCREEN: 8,
    SPAWN_SIZE: 400,
    SWIPE_TIME: 500,
    SWIPE_RADIUS: 30,
    TIMING: {
        BPM: 120,
        BARS: 4,
    },
    NOTES: [
        { NOTE: "C", COLOR: 0xec9e14 },
        { NOTE: "D", COLOR: 0xecb913 },
        { NOTE: "E", COLOR: 0xefd50e },
        { NOTE: "G", COLOR: 0xe96254 },
        { NOTE: "A", COLOR: 0xe46a28 },
    ],
};
