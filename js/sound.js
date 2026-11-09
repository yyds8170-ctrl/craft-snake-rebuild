// 程序化音效：Web Audio 合成，无外部音频文件。AudioContext 可注入以便测试。
export const SOUNDS = {
  eat: { freq: 660, endFreq: 880, duration: 0.09, type: "square" },
  over: { freq: 320, endFreq: 90, duration: 0.35, type: "sawtooth" },
};

export function createSoundEngine(ctx) {
  let muted = false;

  function play(name) {
    const spec = SOUNDS[name];
    if (!ctx || muted || !spec) return false;
    if (ctx.state === "suspended") ctx.resume();

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = spec.type;
    osc.frequency.setValueAtTime(spec.freq, t);
    osc.frequency.exponentialRampToValueAtTime(spec.endFreq, t + spec.duration);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + spec.duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + spec.duration);
    return true;
  }

  return {
    play,
    setMuted(v) { muted = v; },
    isMuted() { return muted; },
  };
}
