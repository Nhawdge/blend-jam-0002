export interface IResourceMap<T> {
    add(value:T) : number
    get(id:number) : T,
    getArray() : T[]
}

export default function createResourceMap<T>() : IResourceMap<T> {
    const array = new Array<T>();

    return {
        add: (value : T) => {
            const id = array.length;
            array.push(value);
            return id;
        },
        get: (id:number) => {
            return array[id];
        },
        getArray: () => { return array; }
    }
}
