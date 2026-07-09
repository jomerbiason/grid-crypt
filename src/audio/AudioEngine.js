import { state } from '../core/state.js';

export const AudioEngine = {
    ctx: null, musicStarted: false, musicGain: null, sfxGain: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.musicGain = this.ctx.createGain();
            this.sfxGain = this.ctx.createGain();
            this.musicGain.connect(this.ctx.destination);
            this.sfxGain.connect(this.ctx.destination);
            this.applyVolumes();
            this.startMusic();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    },
    applyVolumes() {
        if (!this.ctx) return;
        const m = state.muted ? 0 : state.settings.musicVol / 100;
        const s = state.muted ? 0 : state.settings.sfxVol / 100;
        this.musicGain.gain.setValueAtTime(m, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(s, this.ctx.currentTime);
    },
    setMuted(m) { this.applyVolumes(); },
    startMusic() {
        if (this.musicStarted) return; this.musicStarted = true;
        const playLayer = (freq, vol, speed) => {
            const osc = this.ctx.createOscillator(); const lfo = this.ctx.createOscillator(); const lfoGain = this.ctx.createGain(); const gain = this.ctx.createGain();
            osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            lfo.type = 'sine'; lfo.frequency.setValueAtTime(speed, this.ctx.currentTime);
            lfoGain.gain.setValueAtTime(freq * 0.02, this.ctx.currentTime); gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            lfo.connect(lfoGain); lfoGain.connect(osc.frequency); osc.connect(gain); gain.connect(this.musicGain);
            osc.start(); lfo.start();
        };
        playLayer(60, 0.003, 0.1); playLayer(85, 0.003, 0.15);
    },
    play(freq, type, dur, vol = 0.1, freqEnd = null) {
        this.init(); const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.type = type; osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + dur);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);
        osc.connect(gain); gain.connect(this.sfxGain); osc.start(); osc.stop(this.ctx.currentTime + dur);
    },
    noise(dur, vol = 0.05) {
        this.init(); const bufferSize = this.ctx.sampleRate * dur; const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0); for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const source = this.ctx.createBufferSource(); source.buffer = buffer;
        const gain = this.ctx.createGain(); gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);
        source.connect(gain); gain.connect(this.sfxGain); source.start();
    },
    sfx(type) {
        if(!this.ctx) return;
        switch(type) {
            case 'sword-on': this.play(800, 'sine', 0.1, 0.1, 1200); break;
            case 'sword-off': this.play(400, 'sine', 0.1, 0.1, 200); break;
            case 'shield-on': this.play(300, 'square', 0.1, 0.05, 500); break;
            case 'shield-off': this.play(300, 'square', 0.1, 0.05, 150); break;
            case 'torch': this.noise(0.2, 0.1); break;
            case 'potion': this.play(200, 'sine', 0.3, 0.1, 600); break;
            case 'ui-click': this.play(1000, 'sine', 0.05, 0.05); break;
            case 'sword-hit': this.play(1200, 'sine', 0.1, 0.05); this.play(800, 'triangle', 0.15); break;
            case 'punch': this.play(120, 'triangle', 0.1); break;
            case 'block': this.play(400, 'square', 0.08, 0.05); break;
            case 'hurt': this.play(100, 'sawtooth', 0.2); break;
            case 'pickup': this.play(600, 'sine', 0.1); setTimeout(()=>this.play(900, 'sine', 0.1), 50); break;
            case 'lvl': this.play(440, 'sine', 0.2); setTimeout(()=>this.play(880, 'sine', 0.4), 100); break;
            case 'denied': this.play(150, 'square', 0.15, 0.06); break;
        }
    }
};
