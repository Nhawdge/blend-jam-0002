import * as Tone from 'tone'


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

interface Instrument {
    playNote(note:string | null):void;
}


class Kick implements Instrument{
    private synth:Tone.MembraneSynth;

    constructor() {
        this.synth = new Tone.MembraneSynth().toDestination();
    }

    playNote(note:string | null): void {
        this.synth.triggerAttackRelease("C1", "8n");
    }
}

class Snare implements Instrument{
    private noiseSynth:Tone.NoiseSynth;
    constructor() {
        this.noiseSynth = new Tone.NoiseSynth({
            volume: 0,
            envelope: {
				attack: 0.01,
				decay: 0.3
			},
        }).toDestination();
    }
    
    playNote(note:string | null): void {
        this.noiseSynth.triggerAttack();
    }
}

class Chord implements Instrument{
    private chorus:Tone.Chorus;
    private synth:Tone.PolySynth;

    constructor() {
        this.chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
        this.synth = new Tone.PolySynth().connect(this.chorus);
        this.synth.set({ detune: -1200 });
    }

    playNote(note:string | null): void {
        this.synth.triggerAttackRelease(["C4", "E4", "A4"], '8n');
    }
}

class Lead implements Instrument{
    private freeverb:Tone.Freeverb;
    private synth:Tone.Synth;

    constructor() {
        this.freeverb = new Tone.Freeverb().toDestination();
        this.freeverb.dampening = 1000;

        this.synth = new Tone.Synth().connect(this.freeverb);

    }

    playNote(note:string | null): void {
        if (!note) { return; }
        this.synth.triggerAttackRelease(note, "8n"); 
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