
export default function createEvent<T>() {
    let events:T[] = [];
    let pendingEvents:T[] = [];

    function tick() {
        if (events.length == 0 && pendingEvents.length == 0)
            return;
        
        events = pendingEvents;
        pendingEvents = [];
    }

    function read():T[] {
        return events;
    }

    function push(event:T) {
        pendingEvents.push(event);
    }

    return {
        tick, read, push
    };
}

