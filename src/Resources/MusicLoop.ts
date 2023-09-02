import * as Tone from 'tone'
import { Instrument as inst } from 'tone/build/esm/instrument/Instrument'


/*
Music tracks are 128 beats (8 bars * 8th notes)

Tracks are:
 * Kick
 * Snare
 * Bass note
 * Chord
 * Lead

Kick and Snare are repetitive - adding a note adds it to every bar
    If 'single' is true, the note only appears on the specified beat, even if it's repetitive
Bass and chords are holds - the note sustains until it hits another note
The lead is a sustain - the note sustains until it hits another note or for a set value

Each loop, the player reads the positions in the track and sets note durations based on the commands


*/

function getChordNotes(): Array<string>{

    var notes:Array<string>=new Array<string>(3);

    return new Array<string>();
}


interface Instrument {
    playNote(note:string | null):void;
}


class Kick implements Instrument{
    playNote(note:string | null): void {
        const synth = new Tone.MembraneSynth().toDestination();
        synth.triggerAttackRelease("C1", "8n");
    }
}

class Snare implements Instrument{
    playNote(note:string | null): void {
        const noiseSynth = new Tone.NoiseSynth().toDestination();
        noiseSynth.triggerAttackRelease("8n", 0.05);
    }
}

class Chord implements Instrument{
    playNote(note:string | null): void {
        const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
        const synth = new Tone.PolySynth().connect(chorus);
        // set the attributes across all the voices using 'set'
        synth.set({ detune: -1200 });
        // play a chord
        synth.triggerAttackRelease(["C4", "E4", "A4"], '8n');
    }
}

class Lead implements Instrument{
    playNote(note:string | null): void {
        if (!note) { return; }

        const freeverb = new Tone.Freeverb().toDestination();
        freeverb.dampening = 1000;
        const synth = new Tone.Synth().connect(freeverb);
        synth.triggerAttackRelease(note, "8n"); 
        //synth.triggerAttackRelease("C4", "8n"); 
    }
}

class Track {
    notes: Map<number, string | null>
    instrument: Instrument

    constructor(instrument: Instrument) {
        this.notes = new Map<number, string | null>();
        this.instrument = instrument;
    }
}

class MusicLoop {
    tracks:Array<Track>

    constructor() {
        this.tracks = [
            new Track(new Kick()),
            new Track(new Snare()),
            new Track(new Chord()),
            new Track(new Lead()),
        ];
    }

    play(beat:number) {
        for (const track of this.tracks) {
            if (track.notes.has(beat)) {
                const note = track.notes.get(beat)!;
                track.instrument.playNote(note);
            }
        }
    }

    addNote(trackId: number, beat:number, note:string | null) {
        this.tracks[trackId].notes.set(beat, note);
    }
}

export default MusicLoop