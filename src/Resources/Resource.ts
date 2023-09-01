
export default function createResource<T>(initialValue:T) {
    let value = initialValue;


    return {
        get():T { return value; },
        set(v:T) { value = v; }
    };
}
