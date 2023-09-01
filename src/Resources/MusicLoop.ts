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
    note: string = ""
    playBeat(): void {

    }
    constructor(note?:string) {
        if (typeof note != "undefined") {
            this.note=note
        }
    }    
}


class Kick extends Instrument{

}

class Snare extends Instrument{

}

class Bass extends Instrument{

}

class Chord extends Instrument{

}

class Lead extends Instrument{

}

abstract class MusicTrack{
    beats:Array<string>=new Array<string>(128)
    instrument:Instrument=new Kick("C4")

    add(note:string, beat:number, single:boolean) {

    }

    constructor(instrument:Instrument) {
        this.instrument=instrument
    }
}

class HoldTrack extends MusicTrack{

}

class RepeatTrack extends MusicTrack{

}

class SustainTrack extends MusicTrack{

}

class MusicLoop{
    //Whether track is running
    playing:boolean=false

    //Current BPM
    bpm:number=120

    //Which beat are we on?
    currentBeat:number=0

    kick:MusicTrack=new RepeatTrack(new Kick())
    snare:MusicTrack=new RepeatTrack(new Snare())
    bass:MusicTrack=new HoldTrack(new Bass())
    chord:MusicTrack=new HoldTrack(new Chord())
    lead:MusicTrack=new SustainTrack(new Lead())

    tracks:Array<MusicTrack> = new Array<MusicTrack>(5)

    play() {
    }

    pause() {

    }

    constructor() {
        Tone.Transport.bpm.value=this.bpm
    }

}


export default MusicLoop