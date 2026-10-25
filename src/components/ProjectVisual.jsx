/**
 * Generated cinematic mockups used when a project has no screenshot.
 * Pure SVG — crisp at any size, no image download.
 */

// deterministic pseudo-random so renders are stable
function rand(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const Defs = ({ id }) => (
  <defs>
    <radialGradient id={`${id}-glow`} cx="70%" cy="20%" r="80%">
      <stop offset="0" stopColor="#ff5a3c" stopOpacity="0.55" />
      <stop offset="0.45" stopColor="#c2311f" stopOpacity="0.15" />
      <stop offset="1" stopColor="#08090c" stopOpacity="0" />
    </radialGradient>
    <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#10131c" />
      <stop offset="1" stopColor="#07080b" />
    </linearGradient>
    <linearGradient id={`${id}-ember`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#ff8a5c" />
      <stop offset="1" stopColor="#e2402a" />
    </linearGradient>
  </defs>
)

function VoiceVisual() {
  const r = rand(7)
  const bars = Array.from({ length: 42 }, (_, i) => {
    const env = Math.sin((i / 41) * Math.PI)
    return 8 + env * (30 + r() * 80)
  })
  return (
    <svg viewBox="0 0 800 560" className="anim-svg h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs id="v" />
      <rect width="800" height="560" fill="url(#v-bg)" />
      <rect width="800" height="560" fill="url(#v-glow)" />
      <g fill="none" stroke="#f4f1ec" strokeOpacity="0.08">
        {[70, 120, 175, 235, 300].map((rad) => (
          <circle key={rad} cx="400" cy="270" r={rad} />
        ))}
      </g>
      <circle cx="400" cy="270" r="175" fill="none" stroke="#ff5a3c" strokeOpacity="0.5" strokeDasharray="2 10" style={{ transformOrigin: '400px 270px', animation: 'drift-a 30s linear infinite' }} />
      <circle cx="400" cy="270" r="235" fill="none" stroke="#ff5a3c" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="120 600" />
      <g transform="translate(400 270)">
        {bars.map((h, i) => (
          <rect
            key={i}
            x={(i - 21) * 7.5}
            y={-h / 2}
            width="3"
            height={h}
            rx="1.5"
            fill={Math.abs(i - 21) < 8 ? 'url(#v-ember)' : '#f4f1ec'}
            fillOpacity={Math.abs(i - 21) < 8 ? 1 : 0.35}
          />
        ))}
      </g>
      <g fontFamily="Space Grotesk, Inter, sans-serif" fill="#f4f1ec">
        <text x="48" y="64" fontSize="13" letterSpacing="3" fillOpacity="0.55">JARVIS · ONLINE</text>
        <circle cx="38" cy="59" r="4" fill="#4ade80" />
        <text x="752" y="64" fontSize="13" letterSpacing="3" fillOpacity="0.55" textAnchor="end">LISTENING…</text>
        <text x="48" y="470" fontSize="22" fillOpacity="0.9">“Open VS Code and check system status.”</text>
        <text x="48" y="505" fontSize="14" fillOpacity="0.45" letterSpacing="1">→ launching application · cpu 18% · memory ok</text>
      </g>
    </svg>
  )
}

function BrowserVisual() {
  return (
    <svg viewBox="0 0 800 560" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs id="b" />
      <rect width="800" height="560" fill="url(#b-bg)" />
      <rect width="800" height="560" fill="url(#b-glow)" />
      <g transform="translate(80 70)">
        <rect width="640" height="420" rx="12" fill="#0b0d12" stroke="#f4f1ec" strokeOpacity="0.12" />
        <rect width="640" height="38" rx="12" fill="#12151c" />
        <rect y="26" width="640" height="12" fill="#12151c" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={22 + i * 18} cy="19" r="5" fill="#f4f1ec" fillOpacity={0.18} />
        ))}
        <rect x="190" y="11" width="260" height="16" rx="8" fill="#f4f1ec" fillOpacity="0.06" />
        <text x="320" y="23" fontSize="10" fill="#f4f1ec" fillOpacity="0.45" textAnchor="middle" fontFamily="Inter, sans-serif">
          pvns1108.github.io
        </text>
        {/* mini hero */}
        <g fontFamily="Anton, Impact, sans-serif" fill="#f4f1ec">
          <text x="36" y="160" fontSize="92" letterSpacing="-1">PRAKASH</text>
          <text x="36" y="250" fontSize="92" fill="none" stroke="#f4f1ec" strokeOpacity="0.7" strokeWidth="1.3">KUMAR</text>
        </g>
        <rect x="36" y="290" width="210" height="6" rx="3" fill="#f4f1ec" fillOpacity="0.25" />
        <rect x="36" y="304" width="170" height="6" rx="3" fill="#f4f1ec" fillOpacity="0.15" />
        <rect x="470" y="282" width="134" height="40" rx="20" fill="url(#b-ember)" />
        <rect x="36" y="350" width="568" height="1" fill="#f4f1ec" fillOpacity="0.1" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${36 + i * 196} 366)`}>
            <rect width="176" height="34" rx="4" fill="#f4f1ec" fillOpacity="0.04" stroke="#f4f1ec" strokeOpacity="0.08" />
            <rect x="12" y="14" width={70 + i * 14} height="6" rx="3" fill="#f4f1ec" fillOpacity="0.2" />
          </g>
        ))}
      </g>
      {/* phone */}
      <g transform="translate(600 250)">
        <rect width="150" height="280" rx="22" fill="#0b0d12" stroke="#f4f1ec" strokeOpacity="0.18" />
        <rect x="58" y="10" width="34" height="6" rx="3" fill="#f4f1ec" fillOpacity="0.15" />
        <text x="16" y="88" fontSize="36" fill="#f4f1ec" fontFamily="Anton, Impact, sans-serif">PRAKASH</text>
        <text x="16" y="126" fontSize="36" fill="none" stroke="#f4f1ec" strokeOpacity="0.7" strokeWidth="0.8" fontFamily="Anton, Impact, sans-serif">KUMAR</text>
        <rect x="16" y="150" width="100" height="5" rx="2.5" fill="#f4f1ec" fillOpacity="0.22" />
        <rect x="16" y="162" width="76" height="5" rx="2.5" fill="#f4f1ec" fillOpacity="0.14" />
        <rect x="16" y="226" width="118" height="30" rx="15" fill="url(#b-ember)" />
      </g>
    </svg>
  )
}

function SpectrumVisual() {
  const r = rand(23)
  const cols = 48
  const rows = 18
  const cells = []
  for (let c = 0; c < cols; c++) {
    const energy = 0.35 + 0.65 * Math.abs(Math.sin(c / 5.5))
    for (let row = 0; row < rows; row++) {
      const fall = 1 - row / rows
      const v = Math.max(0, Math.min(1, energy * (1 - fall * 0.85) * (0.55 + r() * 0.6)))
      cells.push({ c, row, v })
    }
  }
  const wave = Array.from({ length: 160 }, (_, i) => {
    const x = 48 + i * 4.4
    const amp = 26 * Math.abs(Math.sin(i / 14)) * (0.6 + r() * 0.5)
    const y = 118 + Math.sin(i * 1.7) * amp
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg viewBox="0 0 800 560" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs id="s" />
      <rect width="800" height="560" fill="url(#s-bg)" />
      <rect width="800" height="560" fill="url(#s-glow)" />
      <g fontFamily="Space Grotesk, Inter, sans-serif" fill="#f4f1ec">
        <text x="48" y="56" fontSize="13" letterSpacing="3" fillOpacity="0.55">VOICESHIELD · SAMPLE ANALYSIS</text>
        <text x="752" y="56" fontSize="13" letterSpacing="3" fillOpacity="0.55" textAnchor="end">AASIST</text>
      </g>
      <polyline points={wave} fill="none" stroke="#f4f1ec" strokeOpacity="0.55" strokeWidth="1.2" />
      <g transform="translate(48 180)">
        {cells.map(({ c, row, v }) => (
          <rect
            key={`${c}-${row}`}
            x={c * 14.66}
            y={row * 14}
            width="13"
            height="12.5"
            rx="1"
            fill={v > 0.62 ? '#ff5a3c' : v > 0.4 ? '#c2311f' : '#f4f1ec'}
            fillOpacity={v > 0.4 ? 0.25 + v * 0.7 : 0.03 + v * 0.18}
          />
        ))}
      </g>
      <g fontFamily="Space Grotesk, Inter, sans-serif" fill="#f4f1ec">
        <rect x="48" y="456" width="704" height="1" fillOpacity="0.12" />
        <text x="48" y="494" fontSize="13" fillOpacity="0.45" letterSpacing="2">SPOOF SCORE</text>
        <rect x="190" y="484" width="380" height="8" rx="4" fillOpacity="0.08" />
        <rect x="190" y="484" width="150" height="8" rx="4" fill="url(#s-ember)" />
        <text x="752" y="494" fontSize="13" fillOpacity="0.45" textAnchor="end" letterSpacing="2">NOT A PROBABILITY</text>
      </g>
    </svg>
  )
}

const visuals = { voice: VoiceVisual, browser: BrowserVisual, spectrum: SpectrumVisual }

export default function ProjectVisual({ kind }) {
  const V = visuals[kind] ?? BrowserVisual
  return <V />
}
