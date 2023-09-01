let deltaTime = 0;

const DeltaTime = {
    get() { return deltaTime; },
    set(time:number) { deltaTime = time; }
};

export default DeltaTime;