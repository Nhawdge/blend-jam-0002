import { ISpritesheetData, ISpritesheetFrameData, Spritesheet, Texture } from "pixi.js";

export async function generateSpritesheet(
    baseTexture:Texture, 
    width: number, 
    height: number,
    tileSize: number,
): Promise<Spritesheet> {

    const frames:{[key: string]: ISpritesheetFrameData} = {};
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width) + x;
            frames[index.toString()] = {
                "frame": { "x": x * tileSize, "y": y * tileSize, "w": tileSize, "h": tileSize },
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": { "x": 0, "y": 0 },
                "sourceSize": { "w": tileSize, "h": tileSize }
            }
        }
    }

    /*
    const positions = [...Array(height).keys()].map(y =>
        [...Array(width).keys()].map(x => ({ x, y }))
    ).flat();

    const frames:{[key: string]: ISpritesheetFrameData} = {};
    for (const pos of positions) {
        frames[`${pos.x}_${pos.y}.png`] = {
            "frame": { "x": pos.x * 16, "y": pos.y * 16, "w": 16, "h": 16 },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": { "x": 0, "y": 0 },
            "sourceSize": { "w": 16, "h": 16 }
        }
    }
    */

    const atlas:ISpritesheetData = {
        frames: frames,
        meta: {
            scale: "1"
        }
    };

    const spritesheet = new Spritesheet(baseTexture, atlas);
    await spritesheet.parse();
  
    return spritesheet;
}
