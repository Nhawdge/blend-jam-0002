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

enum TrackType {
    Repeat,
    Hold,
    Sustain
}

enum InstrumentType {
    Kick,
    Snare,
    Bass,
    Chord,
    Lead

}

abstract class Instrument {
    playBeat(): void {

    }
    playNote(note:string):void{

    }  
}


class Kick extends Instrument{
    playBeat(): void {
        const synth = new Tone.MembraneSynth().toDestination();
        synth.triggerAttackRelease("C1", "8n");
    }
}

class Snare extends Instrument{
    playBeat(): void {
        const noiseSynth = new Tone.NoiseSynth().toDestination();
        noiseSynth.triggerAttackRelease("8n", 0.05);
    }
}

class Chord extends Instrument{
    playNote(note:string): void {
        const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
        const synth = new Tone.PolySynth().connect(chorus);
        // set the attributes across all the voices using 'set'
        synth.set({ detune: -1200 });
        // play a chord
        synth.triggerAttackRelease(["C4", "E4", "A4"], 1);
    }
}

class Lead extends Instrument{
    playNote(note:string): void {
        const freeverb = new Tone.Freeverb().toDestination();
        freeverb.dampening = 1000;
        const synth = new Tone.Synth().connect(freeverb);
        synth.triggerAttackRelease(note, "8n"); 
        //synth.triggerAttackRelease("C4", "8n"); 
    }
}

class MusicTrack{
    beats:Array<string>=new Array<string>(64)
    instrument:Instrument;

    constructor(instrument:Instrument) {
        this.instrument=instrument
    }
    
    add(note:string, beat:number) {
        this.beats[beat] = note;
    }
}

class MusicLoop{
    //Whether track is running
    playing:boolean=false

    //Current BPM
    bpm:number=120

    //Which beat are we on?
    currentBeat:number=0

    kick:MusicTrack=new MusicTrack(new Kick())
    snare:MusicTrack=new MusicTrack(new Snare())
    chord:MusicTrack=new MusicTrack(new Chord())
    lead:MusicTrack=new MusicTrack(new Lead())

    tracks:Array<MusicTrack> = new Array<MusicTrack>(4)



    play() {
        if(this.kick.beats[this.currentBeat] != ""){
            this.kick.instrument.playBeat();
        }
        if(this.snare.beats[this.currentBeat] != ""){
            this.snare.instrument.playBeat();
        }
        if(this.chord.beats[this.currentBeat] != ""){
            this.chord.instrument.playNote(this.chord.beats[this.currentBeat]);
        }
        if(this.lead.beats[this.currentBeat] != ""){
            this.lead.instrument.playNote(this.lead.beats[this.currentBeat]);
        }
        if(this.playing == false){
            this.playing = true;
        }

    }

    pause() {
        this.playing = false;
    }

    constructor() {
        Tone.Transport.bpm.value=this.bpm
    }

}


export default MusicLoop