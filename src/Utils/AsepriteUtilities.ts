import * as PIXI from 'pixi.js';

// https://gist.github.com/connorjclark/270558f27130a37747eeccb015232691
// https://github.com/seleb/HowlerPixiLoaderMiddleware/blob/main/index.js
/*
import { ExtensionType, LoaderParserPriority } from "pixi.js";

export default {
    extension: {
        name: 'Aseprite Loader',
        priority: LoaderParserPriority.Normal,
        type: ExtensionType.LoadParser
    }
}
*/

// Aseprite JSON is not quite what PIXI is looking for
export async function loadAseprite(texturePath:string, jsonPath:string) : Promise<PIXI.Spritesheet> {
    const texture = await PIXI.Assets.load(texturePath) as PIXI.Texture;
    const rawJson = await PIXI.Assets.load({
        src: jsonPath,
        loadParser: 'loadTxt'
    }) as string;
    const json = JSON.parse(rawJson);

    const output:any = {};
    output.frames = {};
    for (const frameId in json.frames) {
        output.frames[frameId] = json.frames[frameId];
    }
    output.meta = json.meta;
    output.animations = {};
    for (const tag of json.meta.frameTags) {
        const length = tag.to - tag.from;
        let frames = [...Array(length + 1).keys()].map(i => (i + tag.from).toString());
        output.animations[tag.name] = frames;
    }
    const sheet = new PIXI.Spritesheet(texture, output);
    sheet.parse();
    return sheet;
}