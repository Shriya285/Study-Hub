import { useEffect, useRef } from 'react'

function makeRain(ctx, gain) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf; src.loop = true
  const filt = ctx.createBiquadFilter()
  filt.type = 'lowpass'; filt.frequency.value = 400; filt.Q.value = 0.5
  src.connect(filt); filt.connect(gain); src.start()
  return src
}

function makeForest(ctx, gain) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
  const d = buf.getChannelData(0)
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1
    b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759
    b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856
    b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980
    d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926
  }
  const src = ctx.createBufferSource()
  src.buffer = buf; src.loop = true; src.connect(gain); src.start()
  return src
}

function makeCafe(ctx, gain) {
  const sr = ctx.sampleRate
  const buf = ctx.createBuffer(1, sr * 4, sr)
  const d = buf.getChannelData(0)
  let b = 0
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1
    b = 0.95 * b + w * 0.05
    const t = i / sr
    const rhythm = 0.85 + 0.15 * Math.sin(2 * Math.PI * 1.2 * t) * Math.sin(2 * Math.PI * 0.3 * t)
    d[i] = (w * 0.4 + b * 0.6) * rhythm
  }
  const src = ctx.createBufferSource()
  src.buffer = buf; src.loop = true
  const filt = ctx.createBiquadFilter()
  filt.type = 'bandpass'; filt.frequency.value = 700; filt.Q.value = 0.6
  const g2 = ctx.createGain(); g2.gain.value = 0.5
  src.connect(filt); filt.connect(gain)
  src.connect(g2); g2.connect(gain)
  src.start()
  return src
}

export default function AmbientPlayer({ sound, volume }) {
  const ctxRef = useRef(null)
  const srcRef = useRef(null)
  const gainRef = useRef(null)

  function stop() {
    try { srcRef.current?.stop() } catch {}
    try { ctxRef.current?.close() } catch {}
    ctxRef.current = null; srcRef.current = null; gainRef.current = null
  }

  useEffect(() => {
    stop()
    if (sound === 'off') return
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx
    const g = ctx.createGain(); g.gain.value = volume / 100
    g.connect(ctx.destination); gainRef.current = g
    if (sound === 'rain')   srcRef.current = makeRain(ctx, g)
    if (sound === 'forest') srcRef.current = makeForest(ctx, g)
    if (sound === 'cafe')   srcRef.current = makeCafe(ctx, g)
    return stop
  }, [sound])

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume / 100
  }, [volume])

  return null
}
