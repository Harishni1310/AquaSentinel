import '/src/styles/style.css'

/* ============================================================
   HERO CANVAS ANIMATION
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let W, H, particles, waves, dataCards, animFrame

  const COLORS = {
    blue: 'rgba(14,165,233,',
    cyan: 'rgba(34,211,238,',
    teal: 'rgba(45,212,191,'
  }

  const DATA_LABELS = [
    { label: 'pH', value: '7.2' },
    { label: 'DO', value: '8.4 mg/L' },
    { label: 'Temp', value: '25°C' },
    { label: 'Turbidity', value: '2.3 NTU' },
    { label: 'Salinity', value: '0.5 PSU' },
    { label: 'Chlorophyll', value: '3.1 μg/L' }
  ]

  function resize() {
    W = canvas.width = canvas.offsetWidth
    H = canvas.height = canvas.offsetHeight
    initScene()
  }

  function initScene() {
    // Particles
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: [COLORS.blue, COLORS.cyan, COLORS.teal][Math.floor(Math.random() * 3)]
    }))

    // Wave layers
    waves = [
      { amp: 18, freq: 0.012, speed: 0.018, phase: 0, y: H * 0.72, alpha: 0.06, color: COLORS.blue },
      { amp: 12, freq: 0.018, speed: 0.025, phase: 1.5, y: H * 0.76, alpha: 0.05, color: COLORS.cyan },
      { amp: 22, freq: 0.009, speed: 0.012, phase: 3, y: H * 0.80, alpha: 0.07, color: COLORS.teal }
    ]

    // Floating data cards
    dataCards = DATA_LABELS.map((d, i) => ({
      ...d,
      x: 80 + (i % 3) * (W / 3.5),
      y: H * 0.15 + Math.floor(i / 3) * 80 + Math.random() * 40,
      vy: -0.18 - Math.random() * 0.1,
      alpha: 0,
      fadeDir: 1,
      delay: i * 90,
      tick: 0
    }))
  }

  function drawWave(wave, t) {
    ctx.beginPath()
    ctx.moveTo(0, H)
    for (let x = 0; x <= W; x += 4) {
      const y = wave.y + Math.sin(x * wave.freq + wave.phase + t * wave.speed) * wave.amp
      ctx.lineTo(x, y)
    }
    ctx.lineTo(W, H)
    ctx.closePath()
    ctx.fillStyle = wave.color + wave.alpha + ')'
    ctx.fill()
  }

  function drawParticle(p) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = p.color + p.alpha + ')'
    ctx.fill()
  }

  function drawDataCard(card) {
    if (card.alpha <= 0) return
    const pad = 10
    const w = 110
    const h = 38
    const x = card.x
    const y = card.y
    ctx.save()
    ctx.globalAlpha = card.alpha
    // Card bg
    ctx.fillStyle = 'rgba(7,20,40,0.75)'
    ctx.strokeStyle = 'rgba(56,189,248,0.3)'
    ctx.lineWidth = 1
    roundRect(ctx, x, y, w, h, 6)
    ctx.fill()
    ctx.stroke()
    // Label
    ctx.fillStyle = 'rgba(125,211,252,0.8)'
    ctx.font = '500 9px Inter, sans-serif'
    ctx.fillText(card.label, x + pad, y + 14)
    // Value
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = '600 12px Inter, sans-serif'
    ctx.fillText(card.value, x + pad, y + 28)
    ctx.restore()
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  // Radar ring
  let radarAngle = 0
  function drawRadar() {
    const cx = W * 0.82, cy = H * 0.35, maxR = 80
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath()
      ctx.arc(cx, cy, (maxR / 3) * i, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(14,165,233,${0.06 - i * 0.015})`
      ctx.lineWidth = 1
      ctx.stroke()
    }
    // Sweep
    const grad = ctx.createConicalGradient
      ? ctx.createConicalGradient(cx, cy, radarAngle)
      : null
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(radarAngle)
    const sweep = ctx.createLinearGradient(0, 0, maxR, 0)
    sweep.addColorStop(0, 'rgba(14,165,233,0.25)')
    sweep.addColorStop(1, 'rgba(14,165,233,0)')
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, maxR, -0.5, 0.5)
    ctx.closePath()
    ctx.fillStyle = sweep
    ctx.fill()
    ctx.restore()
    radarAngle += 0.012
  }

  let t = 0
  function draw() {
    ctx.clearRect(0, 0, W, H)
    t++

    // Waves
    waves.forEach(w => drawWave(w, t))

    // Radar
    drawRadar()

    // Particles
    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = W
      if (p.x > W) p.x = 0
      if (p.y < 0) p.y = H
      if (p.y > H) p.y = 0
      drawParticle(p)
    })

    // Data cards
    dataCards.forEach(card => {
      card.tick++
      if (card.tick < card.delay) return
      card.y += card.vy
      if (card.fadeDir === 1) {
        card.alpha = Math.min(card.alpha + 0.008, 0.85)
        if (card.alpha >= 0.85) card.fadeDir = -1
      } else {
        card.alpha = Math.max(card.alpha - 0.004, 0)
        if (card.alpha <= 0) {
          card.y = H * 0.55 + Math.random() * 60
          card.x = 60 + Math.random() * (W - 180)
          card.fadeDir = 1
          card.tick = 0
          card.delay = Math.random() * 120
        }
      }
      drawDataCard(card)
    })

    animFrame = requestAnimationFrame(draw)
  }

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()
  draw()
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar')
  const hamburger = document.getElementById('hamburger')
  const mobileMenu = document.getElementById('mobileMenu')

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20)
  }, { passive: true })

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open')
    hamburger.setAttribute('aria-expanded', open)
    mobileMenu.classList.toggle('open', open)
    mobileMenu.setAttribute('aria-hidden', !open)
  })

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open')
      hamburger.setAttribute('aria-expanded', false)
      mobileMenu.classList.remove('open')
      mobileMenu.setAttribute('aria-hidden', true)
    })
  })

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('.nav-link')
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'))
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`)
        if (active) active.classList.add('active')
      }
    })
  }, { threshold: 0.4 })
  sections.forEach(s => observer.observe(s))
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
  const els = document.querySelectorAll('.reveal')
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })
  els.forEach(el => observer.observe(el))
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.model-stat-num[data-target]')
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const el = entry.target
      const target = parseInt(el.dataset.target)
      let current = 0
      const step = Math.ceil(target / 30)
      const timer = setInterval(() => {
        current = Math.min(current + step, target)
        el.textContent = current
        if (current >= target) clearInterval(timer)
      }, 40)
      observer.unobserve(el)
    })
  }, { threshold: 0.5 })
  counters.forEach(c => observer.observe(c))
}

/* ============================================================
   FORM VALIDATION
   ============================================================ */
const FIELD_RULES = {
  avgSpeed:      { min: 0,    max: null, int: false, label: 'Average Water Speed' },
  avgDir:        { min: 0,    max: 360,  int: false, label: 'Average Water Direction' },
  chlorophyll:   { min: 0,    max: null, int: false, label: 'Chlorophyll' },
  temperature:   { min: -10,  max: 60,   int: false, label: 'Temperature' },
  dissolvedO2:   { min: 0,    max: null, int: false, label: 'Dissolved Oxygen' },
  dissolvedO2Sat:{ min: 0,    max: 200,  int: false, label: 'DO % Saturation' },
  ph:            { min: 0,    max: 14,   int: false, label: 'pH' },
  salinity:      { min: 0,    max: null, int: false, label: 'Salinity' },
  turbidity:     { min: 0,    max: null, int: false, label: 'Turbidity' },
  year:          { min: 2000, max: 2100, int: true,  label: 'Year' },
  month:         { min: 1,    max: 12,   int: true,  label: 'Month' },
  day:           { min: 1,    max: 31,   int: true,  label: 'Day' },
  hour:          { min: 0,    max: 23,   int: true,  label: 'Hour' },
  dayOfWeek:     { min: 0,    max: 6,    int: true,  label: 'Day of Week' }
}

function validateField(id) {
  const input = document.getElementById(id)
  const errorEl = input.nextElementSibling
  const rule = FIELD_RULES[id]
  const val = input.value.trim()

  if (val === '') {
    setError(input, errorEl, `${rule.label} is required`)
    return false
  }
  const num = Number(val)
  if (isNaN(num)) {
    setError(input, errorEl, 'Must be a valid number')
    return false
  }
  if (rule.int && !Number.isInteger(num)) {
    setError(input, errorEl, 'Must be a whole number')
    return false
  }
  if (rule.min !== null && num < rule.min) {
    setError(input, errorEl, `Minimum value is ${rule.min}`)
    return false
  }
  if (rule.max !== null && num > rule.max) {
    setError(input, errorEl, `Maximum value is ${rule.max}`)
    return false
  }
  clearError(input, errorEl)
  return true
}

function setError(input, errorEl, msg) {
  input.classList.add('error')
  errorEl.textContent = msg
}
function clearError(input, errorEl) {
  input.classList.remove('error')
  errorEl.textContent = ''
}

function validateAll() {
  return Object.keys(FIELD_RULES).map(id => validateField(id)).every(Boolean)
}

function initFieldValidation() {
  Object.keys(FIELD_RULES).forEach(id => {
    const input = document.getElementById(id)
    if (!input) return
    input.addEventListener('blur', () => validateField(id))
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(id)
    })
  })
}

/* ============================================================
   COLLECT FORM DATA
   ============================================================ */
function collectFormData() {
  return {
    'Average Water Speed':           parseFloat(document.getElementById('avgSpeed').value),
    'Average Water Direction':       parseFloat(document.getElementById('avgDir').value),
    'Chlorophyll':                   parseFloat(document.getElementById('chlorophyll').value),
    'Temperature':                   parseFloat(document.getElementById('temperature').value),
    'Dissolved Oxygen':              parseFloat(document.getElementById('dissolvedO2').value),
    'Dissolved Oxygen (%Saturation)':parseFloat(document.getElementById('dissolvedO2Sat').value),
    'pH':                            parseFloat(document.getElementById('ph').value),
    'Salinity':                      parseFloat(document.getElementById('salinity').value),
    'Turbidity':                     parseFloat(document.getElementById('turbidity').value),
    'Year':                          parseInt(document.getElementById('year').value),
    'Month':                         parseInt(document.getElementById('month').value),
    'Day':                           parseInt(document.getElementById('day').value),
    'Hour':                          parseInt(document.getElementById('hour').value),
    'DayOfWeek':                     parseInt(document.getElementById('dayOfWeek').value)
  }
}

/* ============================================================
   UI STATE HELPERS
   ============================================================ */
function showProcessing() {
  document.getElementById('aiProcessing').classList.add('active')
  document.getElementById('resultCard').classList.remove('active')
  document.getElementById('paramCards').classList.remove('active')
  document.getElementById('errorCard').classList.remove('active')
  document.getElementById('aiStatus').textContent = 'Analyzing water parameters...'
}

function hideProcessing() {
  document.getElementById('aiProcessing').classList.remove('active')
}

function showError(msg) {
  hideProcessing()
  document.getElementById('errorMessage').textContent = msg
  document.getElementById('errorCard').classList.add('active')
}

const RESULT_CONFIG = {
  Good: {
    cls: 'result-good',
    message: 'The predicted water quality is good.',
    icon: `<svg viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#22c55e" stroke-width="1.5"/>
      <circle cx="20" cy="20" r="18" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="113" stroke-dashoffset="113" style="animation:dash-in 0.6s 0.2s ease forwards"/>
      <path d="M12 20l6 6 10-12" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="30" stroke-dashoffset="30" style="animation:dash-in 0.4s 0.5s ease forwards"/>
    </svg>`
  },
  Moderate: {
    cls: 'result-moderate',
    message: 'The predicted water quality is moderate. Monitoring is recommended.',
    icon: `<svg viewBox="0 0 40 40" fill="none">
      <path d="M20 4L36 34H4L20 4z" stroke="#f59e0b" stroke-width="1.5" stroke-linejoin="round" stroke-dasharray="90" stroke-dashoffset="90" style="animation:dash-in 0.6s 0.1s ease forwards"/>
      <path d="M20 16v8M20 28h.01" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },
  Poor: {
    cls: 'result-poor',
    message: 'The predicted water quality is poor. Further investigation is recommended.',
    icon: `<svg viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="113" stroke-dashoffset="113" style="animation:dash-in 0.6s 0.1s ease forwards"/>
      <path d="M14 14l12 12M26 14L14 26" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  }
}

function showResult(prediction, confidence) {
  hideProcessing()
  document.getElementById('aiStatus').textContent = 'Prediction complete'

  const cfg = RESULT_CONFIG[prediction] || RESULT_CONFIG.Good
  const card = document.getElementById('resultCard')
  card.className = `result-card active ${cfg.cls}`
  document.getElementById('resultIcon').innerHTML = cfg.icon
  document.getElementById('resultStatus').textContent = prediction.toUpperCase()
  document.getElementById('resultMessage').textContent = cfg.message

  // Confidence bars
  const confSection = document.getElementById('confidenceSection')
  const confBars = document.getElementById('confidenceBars')
  if (confidence && typeof confidence === 'object') {
    confBars.innerHTML = ''
    const classes = ['Good', 'Moderate', 'Poor']
    classes.forEach(cls => {
      const pct = Math.round((confidence[cls] || 0) * 100)
      const row = document.createElement('div')
      row.className = 'confidence-row'
      row.innerHTML = `
        <div class="confidence-row-header">
          <span>${cls}</span>
          <span>${pct}%</span>
        </div>
        <div class="confidence-bar-track">
          <div class="confidence-bar-fill bar-${cls.toLowerCase()}" data-pct="${pct}"></div>
        </div>`
      confBars.appendChild(row)
    })
    confSection.style.display = ''
    // Animate bars after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        confBars.querySelectorAll('.confidence-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%'
        })
      })
    })
  } else {
    confSection.style.display = 'none'
  }
}

function showParamCards(data) {
  const DISPLAY = [
    { key: 'Temperature', label: 'Temperature', unit: '°C' },
    { key: 'pH', label: 'pH', unit: '' },
    { key: 'Dissolved Oxygen', label: 'Dissolved Oxygen', unit: 'mg/L' },
    { key: 'Turbidity', label: 'Turbidity', unit: 'NTU' },
    { key: 'Salinity', label: 'Salinity', unit: 'PSU' },
    { key: 'Chlorophyll', label: 'Chlorophyll', unit: 'μg/L' }
  ]
  const grid = document.getElementById('paramGrid')
  grid.innerHTML = ''
  DISPLAY.forEach(d => {
    const val = data[d.key]
    if (val === undefined) return
    const item = document.createElement('div')
    item.className = 'param-item'
    item.innerHTML = `<p class="param-item-label">${d.label}</p>
      <p class="param-item-value">${val}${d.unit ? ' ' + d.unit : ''}</p>`
    grid.appendChild(item)
  })
  document.getElementById('paramCards').classList.add('active')
}

/* ============================================================
   PREDICTION API CALL
   ============================================================ */
async function predict(data) {
  const res = await fetch('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Server error ${res.status}${text ? ': ' + text : ''}`)
  }
  return res.json()
}

/* ============================================================
   FORM SUBMIT
   ============================================================ */
function initForm() {
  const form = document.getElementById('predictionForm')
  const btn = document.getElementById('predictBtn')

  form.addEventListener('submit', async e => {
    e.preventDefault()
    if (!validateAll()) {
      // Scroll to first error
      const firstError = form.querySelector('.input-field.error')
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const data = collectFormData()
    btn.classList.add('loading')
    btn.disabled = true
    showProcessing()

    // Scroll results into view on mobile
    if (window.innerWidth < 1024) {
      document.getElementById('resultsPanel').scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    try {
      // Minimum display time for animation
      const [result] = await Promise.all([
        predict(data),
        new Promise(r => setTimeout(r, 1800))
      ])

      if (!result.prediction) throw new Error('Invalid response from server')
      document.getElementById('aiStatus').textContent = 'Prediction complete'
      await new Promise(r => setTimeout(r, 500))
      showResult(result.prediction, result.confidence)
      showParamCards(data)
    } catch (err) {
      if (err.name === 'TypeError') {
        showError('Unable to connect to the prediction server. Make sure the Flask backend is running.')
      } else {
        showError(err.message || 'An unexpected error occurred.')
      }
    } finally {
      btn.classList.remove('loading')
      btn.disabled = false
    }
  })
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas()
  initNavbar()
  initReveal()
  initCounters()
  initFieldValidation()
  initForm()
})
