import { HowlOptions } from "howler";
import createResourceMap from "../IResourceMap";

export default function buildSoundLibrary() {
    const promises:Promise<Howl>[] = [];
    const resources = createResourceMap<Howl>();

    return {
        add: function (options: HowlOptions) {
            let howl:Howl | null = null;
            const promise = new Promise<Howl>((resolve, reject) => {
                options.onload = () => resolve(howl!);
                options.onloaderror = (_id, err) => reject(err);
                options.preload = true;
                howl = new Howl(options);
            });
            promises.push(promise);
            return resources.add(howl!);
        },
        loadAll: async function() {
            await Promise.all(promises);
            return resources;
        }
    }
}