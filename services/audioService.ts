class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgm: HTMLAudioElement | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.4;

      // Initialize Background Music
      // Path is relative to index.html (root)
      this.bgm = new Audio("music.wav");
      this.bgm.loop = true;
      this.bgm.volume = 0.5;
      this.bgm.preload = "auto";

      // Attach error handler
      this.bgm.onerror = (e) => {
        console.warn("Background music failed to load:", e);

        // Fallback only if the main file definitely fails
        if (this.bgm) {
          this.bgm.src =
            "https://cdn.pixabay.com/audio/2022/10/25/audio_000842835e.mp3";
        }
      };
    } catch (e) {
      console.error("Web Audio API not supported");
    }
  }

  async init() {
    if (this.ctx?.state === "suspended") {
      await this.ctx.resume();
    }
    this.playBGM();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      if (this.isMuted) {
        this.ctx.suspend();
        this.bgm?.pause();
      } else {
        this.ctx.resume();
        this.playBGM();
      }
    }
    return this.isMuted;
  }

  private playBGM() {
    if (this.bgm && !this.isMuted) {
      const playPromise = this.bgm.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn(
            "Audio autoplay prevented. Waiting for interaction.",
            error
          );
        });
      }
    }
  }

  setEnginePitch(intensity: number) {
    // No-op: Procedural engine replaced by MP3 BGM
  }

  playLaser() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      100,
      this.ctx.currentTime + 0.15
    );

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playExplosion() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    // Create noise buffer
    const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }

  playMilestoneChime() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, this.ctx.currentTime); // A4
    osc.frequency.setValueAtTime(554.37, this.ctx.currentTime + 0.1); // C#5
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.2); // E5

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }
}

export const audioService = new AudioService();
