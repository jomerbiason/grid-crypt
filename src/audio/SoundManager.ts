import { loadSettings } from '../systems/SaveData';

interface ToneOptions {
    startFreq: number;
    endFreq: number;
    duration: number;
    type: OscillatorType;
    volume: number;
}

class SoundManager {
    private ctx: AudioContext | null = null;
    private musicOscillators: OscillatorNode[] = [];
    private musicGain: GainNode | null = null;

    private getContext(): AudioContext {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
        return this.ctx;
    }

    private get masterVolume(): number {
        return loadSettings().volume;
    }

    private tone(options: ToneOptions): void {
        if (this.masterVolume <= 0) return;

        const ctx = this.getContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        osc.type = options.type;
        osc.frequency.setValueAtTime(options.startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(options.endFreq, 1), now + options.duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(options.volume * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + options.duration);

        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + options.duration);
    }

    shoot(): void {
        this.tone({ startFreq: 700, endFreq: 300, duration: 0.06, type: 'square', volume: 0.08 });
    }

    hit(): void {
        this.tone({ startFreq: 220, endFreq: 140, duration: 0.05, type: 'square', volume: 0.08 });
    }

    explosion(): void {
        this.tone({ startFreq: 260, endFreq: 40, duration: 0.3, type: 'sawtooth', volume: 0.16 });
    }

    powerup(): void {
        this.tone({ startFreq: 440, endFreq: 880, duration: 0.25, type: 'triangle', volume: 0.14 });
    }

    bomb(): void {
        this.tone({ startFreq: 120, endFreq: 30, duration: 0.5, type: 'sawtooth', volume: 0.2 });
    }

    warning(): void {
        this.tone({ startFreq: 500, endFreq: 500, duration: 0.4, type: 'square', volume: 0.14 });
    }

    uiClick(): void {
        this.tone({ startFreq: 600, endFreq: 600, duration: 0.05, type: 'square', volume: 0.1 });
    }

    startMusic(): void {
        if (this.masterVolume <= 0 || this.musicOscillators.length > 0) return;

        const ctx = this.getContext();
        this.musicGain = ctx.createGain();
        this.musicGain.gain.value = 0.05 * this.masterVolume;
        this.musicGain.connect(ctx.destination);

        const notes = [110, 130.81, 146.83, 110];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            osc.detune.value = i * 2;
            osc.connect(this.musicGain!);
            osc.start();
            this.musicOscillators.push(osc);
        });
    }

    stopMusic(): void {
        this.musicOscillators.forEach((osc) => osc.stop());
        this.musicOscillators = [];
        this.musicGain?.disconnect();
        this.musicGain = null;
    }
}

export default new SoundManager();
