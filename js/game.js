// game.js -- ties together drawboard.js and events.js into a playable game

// tile: px size per grid square (recalculated on resize)
// Cols/Rows: board size in tiles | speed values: ms per tick (lower = faster)
let   tile         = 28
let   Cols         = 20
let   Rows         = 20
const speedNormal = 150
const speedFast   = 80
const speedSlow   = 250

// sounds
const sfxEat = new Audio('Sounds/ding.mp3')
sfxEat.volume = 0.6
const bgMusic = new Audio('Sounds/')
bgMusic.loop = true; bgMusic.volume = 0.35

function playEatSound() { sfxEat.currentTime = 0; sfxEat.play().catch(() => {}) }
function startMusic()   { bgMusic.currentTime = 0; bgMusic.play().catch(() => {}) }
function stopMusic()    { bgMusic.pause(); bgMusic.currentTime = 0 }

// score & multipliers
// pointMult: set by events | foodStreak: consecutive eats | streakMult: bonus from eating in a row
let score = 0, highScore = parseInt(localStorage.getItem('snakeHighScore') || '0', 10), pointMult = 1, foodStreak = 0, streakMult = 1
const scoreDisplay     = document.getElementById('scoreDisplay')
const highScoreDisplay = document.getElementById('highScoreDisplay')
highScoreDisplay.textContent = highScore
const streakDisplay    = document.getElementById('streakDisplay')
const streakCountEl    = document.getElementById('streakCount')
const streakMultEl     = document.getElementById('streakMult')

// ── Per-game stat tracking (reset each startGame) ──
let statFoodEaten    = 0   // normal food eaten this game
let statBonusEaten   = 0   // bonus food eaten
let statBombsEaten   = 0   // bombs eaten
let statEventsLived  = 0   // events survived
let statWinLevel     = 0   // highest win level reached
let statGameStart    = 0   // Date.now() at game start

// Returns length mult config — scales up each win level
function getLengthMultConfig() {
    const tierSize  = Math.max(2, 5 - winLevel)
    const tierBonus = 0.25 + winLevel * 0.25
    const maxTier   = 4 + winLevel * 2
    return { tierSize, tierBonus, maxTier }
}

// Returns current length multiplier (frozen = 1x, boosted = 2x)
function getLengthMult() {
    if (Snake.multFrozen) return 1
    const { tierSize, tierBonus } = getLengthMultConfig()
    const extra = Math.max(0, Snake.body.length - 3)
    const base = 1 + Math.floor(extra / tierSize) * tierBonus
    return Snake.multBoosted ? base * 2 : base
}

const lengthMultBar   = document.getElementById('lengthMultBar')
const lengthMultFill  = document.getElementById('lengthMultFill')
const lengthMultValue = document.getElementById('lengthMultValue')

// Redraws the length mult bar each tick — gold pulse at max, hidden until snake grows
function updateLengthMultBar() {
    const len   = Snake.body.length
    const extra = Math.max(0, len - 3)
    const { tierSize, tierBonus, maxTier } = getLengthMultConfig()
    const tier  = Math.floor(extra / tierSize)
    const prog  = (extra % tierSize) / tierSize
    const mult  = 1 + tier * tierBonus

    if (len > 3) lengthMultBar.classList.remove('hidden')

    const pct = Math.min(100, ((tier + prog) / maxTier) * 100)
    lengthMultFill.style.width = pct + '%'
    lengthMultValue.textContent = '🐍 ' + mult.toFixed(2) + 'x'

    lengthMultFill.classList.toggle('maxed', tier >= maxTier)
    lengthMultFill.classList.remove('drained')
}

// Stacks all multipliers, updates score + high score
function addScore(base) {
    const lengthMult = getLengthMult()
    // Prismatic: random surprise multiplier (0.5x – 8x) each eat
    const prismMult = Snake.prismatic ? (0.5 + Math.random() * 7.5) : 1
    if (Snake.prismatic && prismMult !== 1) {
        // Briefly show the multiplier on the message
        // (message will be overwritten by caller, so we flash it for 500ms here)
        const prismLabel = prismMult.toFixed(1) + '×'
        setTimeout(() => {
            if (gameRunning && Snake.prismatic) setMessage('🌈 Prismatic ' + prismLabel + '!')
        }, 0)
    }
    let pts = Math.round(base * pointMult * streakMult * lengthMult * prismMult)
    score += pts
    scoreDisplay.textContent = score
    if (score > highScore) { highScore = score; highScoreDisplay.textContent = highScore; localStorage.setItem('snakeHighScore', highScore) }
    return pts
}

// Increments streak, bumps streakMult every 3 eats, animates display
function onEat() {
    foodStreak++
    streakMult = 1 + Math.floor(foodStreak / 3) * 0.5
    if (foodStreak >= 3) {
        streakDisplay.classList.remove('hidden')
        streakCountEl.textContent = foodStreak
        streakMultEl.textContent  = streakMult.toFixed(1) + 'x'
        streakDisplay.classList.remove('bump')
        void streakDisplay.offsetWidth
        streakDisplay.classList.add('bump')
    }
}

function onMiss()    { foodStreak = 0; streakMult = 1; streakDisplay.classList.add('hidden') }

function resetScore() {
    score = 0; pointMult = 1; foodStreak = 0; streakMult = 1
    scoreDisplay.textContent = 0; streakDisplay.classList.add('hidden')
    lengthMultBar.classList.add('hidden')
    lengthMultFill.style.width = '0%'
    lengthMultValue.textContent = '1.00x'
}

// input — buffers direction changes, supports SWAP/REVERSE CONTROLS events
document.addEventListener('keydown', (e) => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault()
    if (!gameRunning) return   // blocked when paused, game over, or help open
    let d = Snake.direction
    let key = e.key

    // Normalise WASD → Arrow equivalent
    if (key === 'w' || key === 'W') key = 'ArrowUp'
    else if (key === 's' || key === 'S') key = 'ArrowDown'
    else if (key === 'a' || key === 'A') key = 'ArrowLeft'
    else if (key === 'd' || key === 'D') key = 'ArrowRight'

    if (Snake.swappedControls) {
        if (key === 'ArrowUp')    key = 'ArrowDown'
        else if (key === 'ArrowDown')  key = 'ArrowUp'
        else if (key === 'ArrowLeft')  key = 'ArrowRight'
        else if (key === 'ArrowRight') key = 'ArrowLeft'
    }

    if (Snake.reversedControls) {
        if (key === 'ArrowUp'    && d !== 'UP')    Snake.nextDirection = 'DOWN'
        if (key === 'ArrowDown'  && d !== 'DOWN')  Snake.nextDirection = 'UP'
        if (key === 'ArrowLeft'  && d !== 'LEFT')  Snake.nextDirection = 'RIGHT'
        if (key === 'ArrowRight' && d !== 'RIGHT') Snake.nextDirection = 'LEFT'
    } else {
        if (key === 'ArrowUp'    && d !== 'DOWN')  Snake.nextDirection = 'UP'
        if (key === 'ArrowDown'  && d !== 'UP')    Snake.nextDirection = 'DOWN'
        if (key === 'ArrowLeft'  && d !== 'RIGHT') Snake.nextDirection = 'LEFT'
        if (key === 'ArrowRight' && d !== 'LEFT')  Snake.nextDirection = 'RIGHT'
    }
})

// ui helpers
const messageText    = document.getElementById('messageText')
const eventBanner    = document.getElementById('eventBanner')
const eventNameLabel = document.getElementById('eventName')
const eventIconLabel = document.getElementById('eventIcon')
const eventTimerBar  = document.getElementById('eventTimerBar')
const eventTimerFill = document.getElementById('eventTimerFill')
const titleScreen    = document.getElementById('titleScreen')
const controlsDiv    = document.getElementById('controls')
let timerRAF = null

function setMessage(msg) { messageText.textContent = msg }

// Shows event banner — red for harmful, rainbow for legendary, full rainbow for mythic
function showEventBanner(icon, name, harmful, rarity) {
    eventIconLabel.textContent = icon
    eventNameLabel.textContent = name + '  [' + rarity.toUpperCase() + ']'
    eventBanner.classList.remove('hidden', 'harmful', 'legendary', 'mythic')
    if (rarity === 'mythic') {
        eventBanner.classList.add('mythic')
    } else {
        eventBanner.classList.toggle('harmful', harmful && rarity !== 'legendary')
        eventBanner.classList.toggle('legendary', rarity === 'legendary')
    }
}
function hideEventBanner() { eventBanner.classList.add('hidden'); stopTimerBar() }

// Smooth countdown bar using rAF — turns red for harmful events
function startTimerBar(duration, harmful) {
    stopTimerBar()
    eventTimerFill.style.width = '100%'
    eventTimerBar.classList.remove('hidden')
    eventTimerBar.classList.toggle('harmful', harmful)
    let start = performance.now()
    const tick = (now) => {
        let pct = Math.max(0, 1 - (now - start) / duration)
        eventTimerFill.style.width = (pct * 100) + '%'
        timerRAF = pct > 0 ? requestAnimationFrame(tick) : (stopTimerBar(), null)
    }
    timerRAF = requestAnimationFrame(tick)
}
function stopTimerBar() {
    if (timerRAF) { cancelAnimationFrame(timerRAF); timerRAF = null }
    eventTimerBar.classList.add('hidden')
    eventTimerFill.style.width = '100%'
}

// game state
let gameRunning = false
let gameLoop    = null   // kept for compatibility checks (not an interval ID anymore)
let eventTimeout      = null

// ── rAF-based game loop ──
// currentSpeed: target ms per logic tick (replaces setInterval interval)
// lerpFactor:   0-1, how far between the last tick and the next — used for smooth rendering
let currentSpeed   = 150
let lerpFactor     = 0
let _loopRAF       = null
let _lastFrameTime = 0
let _tickAccum     = 0

function startGameLoop() {
    stopGameLoop()
    _lastFrameTime = 0
    _tickAccum     = 0
    lerpFactor     = 0
    _loopRAF = requestAnimationFrame(_rafLoop)
}

function stopGameLoop() {
    if (_loopRAF) { cancelAnimationFrame(_loopRAF); _loopRAF = null }
}

function _rafLoop(timestamp) {
    if (!gameRunning) { _loopRAF = null; return }

    if (_lastFrameTime === 0) _lastFrameTime = timestamp
    // Cap delta to 100ms so a stall doesn't cause multiple ticks at once
    const delta = Math.min(timestamp - _lastFrameTime, 100)
    _lastFrameTime = timestamp
    _tickAccum += delta

    if (_tickAccum >= currentSpeed) {
        _tickAccum -= currentSpeed
        // Snapshot previous positions for interpolated rendering
        Snake.prevBody = Snake.body.map(s => ({ x: s.x, y: s.y }))
        gameTick()
    }

    // gameTick() may have called endGame() — don't overdraw the game over screen
    if (!gameRunning) { _loopRAF = null; return }

    lerpFactor = Math.min(1, _tickAccum / currentSpeed)
    Renderer.drawFrame()

    _loopRAF = requestAnimationFrame(_rafLoop)
}
let eventInterval     = null
let drainInterval     = null
let fullSendFoodInterval = null
let boardAnimInterval    = null
let spawnProtectInterval = null   // cleared on restart/endGame
let activeEvent = null

// win state — winLevel grows each continue, scaling up multipliers and targets
let winLevel  = 0
let winTarget = 1000
const winScreen    = document.getElementById('winScreen')
const winScoreDisp = document.getElementById('winScoreDisplay')
const winNextDisp  = document.getElementById('winNextDisplay')
const winBonusInfo = document.getElementById('winBonusInfo')

// Resets everything and starts a fresh game
function startGame() {
    console.log('Game started')
    // Cancel any pending low-score auto-remove countdown from the previous run
    if (typeof _lowScoreCountdown !== 'undefined' && _lowScoreCountdown) {
        clearInterval(_lowScoreCountdown); _lowScoreCountdown = null
    }
    winLevel = 0; winTarget = 1000
    Cols = 20; Rows = 20
    Snake.init()
    Food.clearBonus(); Food.place()
    Food.mazeTiles  = []
    Food.fakeFoods  = []
    Food.tickingBomb = null
    Renderer.blindMode = false
    Renderer.resizeCanvas()
    resetScore()
    activeEvent = null

    // Reset per-game stats
    statFoodEaten = 0; statBonusEaten = 0; statBombsEaten = 0
    statEventsLived = 0; statWinLevel = 0; statGameStart = Date.now()

    clearTimeout(eventTimeout)
    stopGameLoop()
    clearInterval(eventInterval)
    clearInterval(drainInterval)
    clearInterval(spawnProtectInterval); spawnProtectInterval = null
    cancelWarning()

    setMessage('Eat the orange food!')
    hideEventBanner()
    titleScreen.classList.add('hidden')
    winScreen.classList.add('hidden')
    controlsDiv.classList.remove('hidden')
    document.getElementById('upcomingPanel').classList.add('hidden')
    window._allSeeingEyeActive = false
    upcomingEventQueue = []
    if (typeof _rewindHistory !== 'undefined') _rewindHistory.length = 0
    if (typeof _cosmicJackpotUsed !== 'undefined') _cosmicJackpotUsed = false
    fillUpcomingQueue()

    gameRunning   = true
    currentSpeed  = speedNormal
    gameLoop      = true   // truthy sentinel — code checks gameLoop != null
    startGameLoop()
    eventInterval = setInterval(triggerRandomEvent, 8000)
    startMusic()
}

// Main tick: move → check collisions → check food → check win → draw
function gameTick() {
    // ── Rewind history: keep snapshots for last ~4 seconds ──
    if (typeof _rewindHistory !== 'undefined') {
        _rewindHistory.push({ ts: Date.now(), body: Snake.body.map(s => ({ ...s })) })
        // Keep ~40 snapshots max (at 150ms/tick ≈ 6s worth)
        if (_rewindHistory.length > 40) _rewindHistory.shift()
    }

    let result = Snake.step()
    if (result.hitWall || result.hitSelf) { endGame(); return }

    let head = Snake.body[0], ate = false

    if (head.x === Food.main.x && head.y === Food.main.y) {
        console.log('Ate food — score:', score)
        onEat()
        const lm = getLengthMult()
        const lmTag = lm > 1 ? ` (🐍x${lm.toFixed(2)})` : ''
        setMessage('+' + addScore(10) + ' points!' + lmTag)
        Food.place(); playEatSound(); ate = true
        statFoodEaten++
        if (Snake.frozenGrowth) Snake.removeTail()  // cancel the growth
    }

    for (let i = Food.bonus.length - 1; i >= 0; i--) {
        if (head.x === Food.bonus[i].x && head.y === Food.bonus[i].y) {
            const lm = getLengthMult()
            const lmTag = lm > 1 ? ` (🐍x${lm.toFixed(2)})` : ''
            setMessage('+' + addScore(25) + ' BONUS points!' + lmTag)
            Food.bonus.splice(i, 1); playEatSound(); ate = true
            statBonusEaten++
            if (Snake.frozenGrowth) Snake.removeTail()
        }
    }

    // Fake food — eating it plays a sound but gives nothing and doesn't grow
    for (let i = (Food.fakeFoods || []).length - 1; i >= 0; i--) {
        if (head.x === Food.fakeFoods[i].x && head.y === Food.fakeFoods[i].y) {
            Food.fakeFoods.splice(i, 1)
            playEatSound()
            setMessage('🪤 FAKE FOOD — fooled you! No points.')
            Snake.removeTail()   // no growth, but remove tail to prevent free length
            ate = true
        }
    }

    // Ticking time bomb — eating it defuses it and gives +20 pts
    if (Food.tickingBomb && head.x === Food.tickingBomb.x && head.y === Food.tickingBomb.y) {
        Food.tickingBomb = null
        if (typeof _tickingBombTimeout !== 'undefined' && _tickingBombTimeout) {
            clearTimeout(_tickingBombTimeout); _tickingBombTimeout = null
        }
        playEatSound()
        const pts = addScore(20)
        setMessage('💣 DEFUSED! +' + pts + ' pts!')
        ate = true
        if (Snake.frozenGrowth) Snake.removeTail()
    }

    // Bomb food array — eating any bomb is painful
    for (let i = Food.bombs.length - 1; i >= 0; i--) {
        const b = Food.bombs[i]
        if (head.x === b.x && head.y === b.y) {
            Food.bombs.splice(i, 1)
            playEatSound()
            statBombsEaten++
            if (score <= 30) {
                // Bomb would wipe out the score — game over
                score = 0
                scoreDisplay.textContent = 0
                setMessage('💥 ' + (b.disguised ? 'DISGUISED BOMB' : 'BOMB') + ' — wiped your score. GAME OVER!')
                endGame(); return
            }
            score -= 30
            scoreDisplay.textContent = score
            if (Snake.body.length > 6) Snake.body.splice(Snake.body.length - 3, 3)
            else if (Snake.body.length > 3) Snake.cutToLength(3)
            setMessage(b.disguised ? '💥 DISGUISED BOMB — -30 pts & -3 segments!' : '💥 BOMB — -30 pts & -3 segments!')
            ate = true
        }
    }

    // Legacy single bomb
    if (Food.bomb && head.x === Food.bomb.x && head.y === Food.bomb.y) {
        Food.bomb = null
        playEatSound()
        if (score <= 30) {
            score = 0
            scoreDisplay.textContent = 0
            setMessage('💥 BOMB — wiped your score. GAME OVER!')
            endGame(); return
        }
        score -= 30
        scoreDisplay.textContent = score
        if (Snake.body.length > 6) Snake.body.splice(Snake.body.length - 3, 3)
        else if (Snake.body.length > 3) Snake.cutToLength(3)
        setMessage('💥 BOMB — -30 pts & -3 segments!')
        ate = true
    }

    // Mystery box — eating it triggers a random reward
    if (Food.mysteryBox && head.x === Food.mysteryBox.x && head.y === Food.mysteryBox.y) {
        Food.mysteryBox = null
        playEatSound()
        triggerMysteryBoxReward()
        ate = true
    }

    if (!ate) { onMiss(); Snake.removeTail() }

    updateLengthMultBar()
    // Drawing is handled by the rAF loop for smooth interpolation

    if (score >= winTarget) triggerWin()
}

// Pauses game, shows win screen with next target preview
function triggerWin() {
    // Kill the cosmic celebration instantly so it doesn't bleed over the win screen
    if (typeof _cosmicCancelFn === 'function' && _cosmicCancelFn) { _cosmicCancelFn(); _cosmicCancelFn = null }
    gameRunning = false
    stopGameLoop()
    clearInterval(eventInterval)
    clearInterval(drainInterval); clearInterval(poisonInterval)
    clearInterval(movingFoodInterval); clearInterval(fullSendFoodInterval)
    clearInterval(magnetInterval); clearInterval(dashInterval)
    clearTimeout(eventTimeout)
    cancelActiveEvent()
    hideEventBanner()
    gameLoop = null
    stopMusic()

    const nextTarget = winTarget + 1000 + winLevel * 500
    winScoreDisp.textContent = winTarget
    winNextDisp.textContent  = nextTarget

    const { tierSize, tierBonus } = getLengthMultConfig()
    const nextTierBonus = tierBonus + 0.25
    const nextTierSize  = Math.max(2, tierSize - 1)
    winBonusInfo.textContent = `Level ${winLevel + 1} unlocked! Next: +${nextTierBonus.toFixed(2)}x per ${nextTierSize} segs 🚀`

    winScreen.classList.remove('hidden')
    controlsDiv.classList.add('hidden')
}

// Resumes game after win — increments winLevel, advances target, keeps snake/score
function continueGame() {
    winLevel++
    statWinLevel = winLevel
    winTarget += 1000 + (winLevel - 1) * 500

    winScreen.classList.add('hidden')
    controlsDiv.classList.remove('hidden')
    cancelActiveEvent()

    gameRunning   = true
    currentSpeed  = speedNormal
    gameLoop      = true
    startGameLoop()
    eventInterval = setInterval(triggerRandomEvent, 8000)
    startMusic()
    setMessage(`🏆 Level ${winLevel}! Next goal: ${winTarget} pts`)
    updateLengthMultBar()

    // 5-second spawn protection — can't die from walls or self
    Snake.invincible = true
    Snake.ghostMode  = true
    let countdown = 5
    setMessage(`🛡️ Spawn protection: ${countdown}s`)
    spawnProtectInterval = setInterval(() => {
        countdown--
        if (countdown > 0) {
            setMessage(`🛡️ Spawn protection: ${countdown}s`)
        } else {
            clearInterval(spawnProtectInterval)
            spawnProtectInterval = null
            Snake.invincible = false
            Snake.ghostMode  = false
            setMessage('Spawn protection ended — watch out!')
        }
    }, 1000)
}

// ── Pre-event warning system ──
const warningOverlay  = document.getElementById('warningOverlay')
const warningIcon     = document.getElementById('warningIcon')
const warningTitle    = document.getElementById('warningTitle')
const warningEventName = document.getElementById('warningEventName')
const warningSubtext  = document.getElementById('warningSubtext')
const warningBarFill  = document.getElementById('warningBarFill')

let warningRAF    = null   // rAF for countdown bar
let warningTimeout = null  // fires the actual event after warning
let pendingTeleportTile = null  // { x, y } shown as crosshair during teleport warn
let teleportPulseRAF = null

function hideWarningOverlay() {
    warningOverlay.classList.add('hidden')
    warningOverlay.classList.remove('speed-warn', 'teleport-warn')
    Renderer.canvas.classList.remove('warn-harmful', 'warn-speed', 'warn-teleport')
    if (warningRAF)       { cancelAnimationFrame(warningRAF); warningRAF = null }
    pendingTeleportTile  = null
    if (teleportPulseRAF) { cancelAnimationFrame(teleportPulseRAF); teleportPulseRAF = null }
}

function showWarningOverlay(ev, duration, onFire) {
    // Classify the event for styling
    const isSpeed     = ['SPEED BOOST','SPEED TRAP','FULL SEND'].includes(ev.name)
    const isTeleport  = ev.name === 'TELEPORT'
    const isHarmful   = ev.harmful

    warningOverlay.classList.remove('speed-warn', 'teleport-warn')
    if (isSpeed)         { warningOverlay.classList.add('speed-warn');    Renderer.canvas.classList.add('warn-speed') }
    else if (isTeleport) { warningOverlay.classList.add('teleport-warn'); Renderer.canvas.classList.add('warn-teleport') }
    else                 { Renderer.canvas.classList.add('warn-harmful') }

    // Icon / title text — kept short for the compact badge
    warningIcon.textContent = ev.icon
    warningEventName.textContent = ev.name

    // Title label per event type
    if (isTeleport) {
        // Pick a safe landing tile now so we can preview it
        pendingTeleportTile = pickTeleportDest()
        warningTitle.textContent = 'INCOMING'
        // Animate the crosshair during warning
        let startTime = performance.now()
        const pulseTick = (now) => {
            if (!pendingTeleportTile) { teleportPulseRAF = null; return }
            const alpha = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin((now - startTime) / 300))
            Renderer.drawFrame()
            Renderer.drawTeleportTarget(pendingTeleportTile.x, pendingTeleportTile.y, alpha, Snake.direction)
            teleportPulseRAF = requestAnimationFrame(pulseTick)
        }
        teleportPulseRAF = requestAnimationFrame(pulseTick)
    } else if (isSpeed) {
        warningTitle.textContent = 'SPEED UP'
    } else if (isHarmful) {
        warningTitle.textContent = 'INCOMING'
    } else {
        warningTitle.textContent = 'INCOMING'
    }

    // Countdown bar
    warningBarFill.style.width = '100%'
    warningOverlay.classList.remove('hidden')
    const start = performance.now()
    const barTick = (now) => {
        const pct = Math.max(0, 1 - (now - start) / duration)
        warningBarFill.style.width = (pct * 100) + '%'
        if (pct > 0) warningRAF = requestAnimationFrame(barTick)
        else warningRAF = null
    }
    warningRAF = requestAnimationFrame(barTick)

    warningTimeout = setTimeout(() => {
        // Save the teleport tile BEFORE hideWarningOverlay clears it
        const savedTeleportTile = pendingTeleportTile
        hideWarningOverlay()
        if (savedTeleportTile) pendingTeleportTile = savedTeleportTile
        onFire()
    }, duration)
}

function cancelWarning() {
    clearTimeout(warningTimeout)
    warningTimeout = null
    hideWarningOverlay()
}

// Returns true if teleporting the snake head to (dest.x, dest.y) is safe:
//   • not on or directly adjacent to any body segment
//   • the next step in the current direction won't hit a wall or body
function isSafeTeleportDest(dest) {
    // Must not land on or right next to a body tile
    if (Snake.body.some(seg => Math.abs(seg.x - dest.x) <= 2 && Math.abs(seg.y - dest.y) <= 2))
        return false

    // Simulate the next step from the destination
    let nx = dest.x, ny = dest.y
    const dir = Snake.direction
    if (dir === 'UP')    ny--
    if (dir === 'DOWN')  ny++
    if (dir === 'LEFT')  nx--
    if (dir === 'RIGHT') nx++

    // Next step would hit a wall (ghost mode wraps, so it's always safe)
    if (!Snake.ghostMode && (nx < 0 || nx >= Cols || ny < 0 || ny >= Rows))
        return false

    // Next step would land on a body segment (skip index 0 since head moves away)
    for (let i = 1; i < Snake.body.length; i++)
        if (Snake.body[i].x === nx && Snake.body[i].y === ny)
            return false

    return true
}

// Picks a safe teleport destination, biased toward the centre of the board.
// Uses a Gaussian-like method: pick the better of two random candidates,
// preferring whichever is closer to the board centre.
function pickTeleportDest() {
    const midX = Cols / 2
    const midY = Rows / 2
    // Edge margin — tiles within this many cells of the wall are penalised
    const margin = Math.min(3, Math.floor(Math.min(Cols, Rows) / 4))

    function centerScore(x, y) {
        // Distance from centre, normalised 0-1 (0 = dead centre = best)
        const dx = Math.abs(x - midX) / midX
        const dy = Math.abs(y - midY) / midY
        // Extra penalty for being very close to an edge
        const edgePen = (x < margin || x >= Cols - margin || y < margin || y >= Rows - margin) ? 0.4 : 0
        return dx + dy + edgePen
    }

    // Try up to 100 safe candidates, keep a running "best" by centre score
    let best = null, bestScore = Infinity
    for (let i = 0; i < 100; i++) {
        const dest = Food._empty()
        if (!isSafeTeleportDest(dest)) continue
        const s = centerScore(dest.x, dest.y)
        if (s < bestScore) { bestScore = s; best = dest }
        // Early-out: close enough to centre and safe — stop looking
        if (bestScore < 0.35) break
    }
    if (best) return best

    // Fallback: relax safety, just avoid landing directly on body
    for (let i = 0; i < 50; i++) {
        const dest = Food._empty()
        if (!Snake.body.some(seg => seg.x === dest.x && seg.y === dest.y)) return dest
    }
    return Food._empty()
}

// ── Persistent 5-ahead event queue ─────────────────────────────────────────
// Always kept at 5 events. When one fires, a new one is pushed to the back.
// God's Eye and All Seeing Eye both read/write this array.
const EVENT_QUEUE_SIZE = 5
let upcomingEventQueue = []

function pickWeightedEvent() {
    // 1% chance for COSMIC JACKPOT — but only if it hasn't been awarded this session
    if (!_cosmicJackpotUsed && Math.random() < 0.01) {
        const cosmic = EVENTS.find(e => e.name === 'COSMIC JACKPOT')
        if (cosmic) return cosmic
    }

    let pool = []
    for (let ev of EVENTS) {
        if (ev.rarity === 'mythic') continue   // mythic is handled above only
        let weight = ev.rarity === 'common' ? 6 : ev.rarity === 'rare' ? 3 : ev.rarity === 'epic' ? 1 : 0
        if (ev.rarity === 'legendary' && Math.random() < 0.08) weight = 1
        for (let j = 0; j < weight; j++) pool.push(ev)
    }
    if (pool.length === 0) return EVENTS[0]
    return pool[Math.floor(Math.random() * pool.length)]
}

function fillUpcomingQueue() {
    while (upcomingEventQueue.length < EVENT_QUEUE_SIZE) {
        upcomingEventQueue.push(pickWeightedEvent())
    }
    renderUpcomingPanel()
}

function renderUpcomingPanel() {
    const list = document.getElementById('upcomingList')
    if (!list) return
    list.innerHTML = ''
    upcomingEventQueue.slice(0, 5).forEach((ev, i) => {
        const el = document.createElement('div')
        const cls = ev.rarity === 'mythic' ? 'mythic' : ev.rarity === 'legendary' ? 'legendary' : ev.harmful ? 'harmful' : ev.rarity === 'epic' ? 'epic' : ''
        el.className = 'upcoming-item ' + cls
        el.innerHTML = `<span class="upcoming-item-pos">${i + 1}</span><span class="upcoming-item-icon">${ev.icon}</span><span class="upcoming-item-name">${ev.name}</span>`
        list.appendChild(el)
    })
}

// Picks a weighted random event — common 6x, rare 3x, epic 1x, legendary 8% flat chance
function triggerRandomEvent() {
    if (!gameRunning) return
    cancelActiveEvent()
    cancelWarning()

    let ev

    // Debug override — if a forced event was queued via the debug panel, use it instead
    if (typeof _debugGetForcedEvent === 'function') {
        const forced = _debugGetForcedEvent()
        if (forced) { ev = forced }
    }

    // Draw from the persistent upcoming queue if no debug override
    if (!ev) {
        fillUpcomingQueue()
        ev = upcomingEventQueue.shift()
        fillUpcomingQueue()   // immediately refill the slot
    }

    console.log('Event triggered:', ev.name, '|', ev.rarity)


    // Events that warrant a pre-warning (harmful, speed changes, teleport)
    const needsWarn = ev.harmful || ['SPEED BOOST','SPEED TRAP','FULL SEND','TELEPORT','BLIND','SHRINK BOARD','REVERSE CONTROLS','SWAP CONTROLS'].includes(ev.name)
    const WARN_DURATION = ev.name === 'TELEPORT' ? 3000 : 2000

    const fireEvent = () => {
        if (!gameRunning) return
        statEventsLived++
        activeEvent = ev
        showEventBanner(ev.icon, ev.name, ev.harmful, ev.rarity)
        setMessage(ev.icon + ' ' + ev.name + (ev.harmful ? ' ⚠️ watch out!' : ' active!'))

        // For teleport: if we pre-picked the destination, use it
        if (ev.name === 'TELEPORT' && pendingTeleportTile) {
            Snake.body[0].x = pendingTeleportTile.x
            Snake.body[0].y = pendingTeleportTile.y
            pendingTeleportTile = null
            setMessage('🌀 TELEPORT — your head got moved!')
            activeEvent = null
            setTimeout(hideEventBanner, 1500)
        } else {
            ev.apply()
            if (ev.duration > 0) {
                startTimerBar(ev.duration, ev.harmful)
                eventTimeout = setTimeout(() => {
                    ev.remove(); activeEvent = null
                    hideEventBanner(); setMessage('Event ended.')
                }, ev.duration)
            } else {
                activeEvent = null
                setTimeout(hideEventBanner, 1500)
            }
        }
    }

    if (needsWarn) {
        const warnSecs = Math.round(WARN_DURATION / 1000)
        showWarningOverlay(ev, WARN_DURATION, fireEvent)
        showEventBanner(ev.icon, ev.name, ev.harmful, ev.rarity)
        setMessage(ev.icon + ' ' + ev.name + ` ⚠️ incoming in ${warnSecs} seconds...`)
    } else {
        fireEvent()
    }
}

// Stops any active event and resets all event-modified flags
function cancelActiveEvent() {
    cancelWarning()
    clearTimeout(eventTimeout)
    clearInterval(drainInterval); clearInterval(poisonInterval)
    clearInterval(movingFoodInterval); clearInterval(fullSendFoodInterval)
    clearInterval(magnetInterval); clearInterval(dashInterval)
    clearInterval(boardAnimInterval); boardAnimInterval = null
    // Clear intervals owned by events.js
    if (typeof _gravityInterval !== 'undefined' && _gravityInterval) { clearInterval(_gravityInterval); _gravityInterval = null }
    if (typeof _devilsGlareTimeout !== 'undefined' && _devilsGlareTimeout) { clearTimeout(_devilsGlareTimeout); _devilsGlareTimeout = null }
    if (typeof _tickingBombTimeout !== 'undefined' && _tickingBombTimeout) { clearTimeout(_tickingBombTimeout); _tickingBombTimeout = null }
    stopTimerBar()
    if (activeEvent) { activeEvent.remove(); activeEvent = null }

    pointMult = 1
    Snake.ghostMode        = false
    Snake.reversedControls = false
    Snake.swappedControls  = false
    Snake.invincible       = false
    Snake.multFrozen       = false
    Snake.multBoosted      = false
    Snake.frozenGrowth     = false
    Snake.mirrorBoard      = false
    Snake.loopBoard        = false
    Snake.prismatic        = false
    Snake.gravityFlip      = false
    Food.bomb              = null
    Food.bombs             = []
    Food.mysteryBox        = null
    Food.mazeTiles         = []
    Food.fakeFoods         = []
    Food.tickingBomb       = null
    lengthMultFill.classList.remove('drained')
    Renderer.blindMode   = false
    Food.clearBonus()
}

// Stops everything, shows game-over on canvas
function endGame() {
    // Kill the cosmic celebration instantly so it doesn't bleed over game over
    if (typeof _cosmicCancelFn === 'function' && _cosmicCancelFn) { _cosmicCancelFn(); _cosmicCancelFn = null }
    console.log('Game over — final score:', score)
    gameRunning = false
    stopGameLoop()
    cancelWarning()
    clearInterval(eventInterval)
    clearInterval(drainInterval); clearInterval(poisonInterval)
    clearInterval(movingFoodInterval); clearInterval(fullSendFoodInterval)
    clearInterval(magnetInterval); clearInterval(dashInterval)
    clearInterval(boardAnimInterval); boardAnimInterval = null
    clearInterval(spawnProtectInterval); spawnProtectInterval = null
    clearTimeout(eventTimeout)
    if (typeof _gravityInterval !== 'undefined' && _gravityInterval) { clearInterval(_gravityInterval); _gravityInterval = null }
    if (typeof _devilsGlareTimeout !== 'undefined' && _devilsGlareTimeout) { clearTimeout(_devilsGlareTimeout); _devilsGlareTimeout = null }
    if (typeof _tickingBombTimeout !== 'undefined' && _tickingBombTimeout) { clearTimeout(_tickingBombTimeout); _tickingBombTimeout = null }
    if (activeEvent) { try { activeEvent.remove() } catch(e) {} }
    activeEvent = null; hideEventBanner(); gameLoop = null
    stopMusic()
    Leaderboard.saveEntry(score, false)
    if (score > highScore) {
        highScore = score; highScoreDisplay.textContent = highScore
        setMessage('New High Score: ' + highScore + '! Press RESTART.')
    } else {
        setMessage('Game Over! Score: ' + score + '. Press RESTART.')
    }

    // If score is under 50, auto-remove this run from the leaderboard after 30s
    if (score > 0 && score < 50) {
        const playerName = (document.getElementById('playerNameInput').value || '').trim() || 'Anonymous'
        let countdown = 30
        _lowScoreCountdown = setInterval(() => {
            countdown--
            if (countdown <= 0) {
                clearInterval(_lowScoreCountdown); _lowScoreCountdown = null
                Leaderboard.removeEntryByName(playerName)
                setMessage('Score too low — leaderboard entry removed. Press RESTART.')
            } else {
                setMessage(`Score too low! Leaderboard entry will be removed in ${countdown}s…`)
            }
        }, 1000)
    }

    Renderer.drawGameOver()

    // Silently focus the hidden cheat input so keystrokes are captured
    setTimeout(() => {
        const ci = document.getElementById('cheatInput')
        ci.value = ''
        ci.focus()
    }, 100)
}

// ── Hidden cheat-code: "curtis67" ─────────────────────────────────────────
// Typed after death (no UI, invisible input captures it).
// Correct code → resume run in-place with 5s invincibility, score/LB untouched.
;(() => {
    const CHEAT = 'curtis67'
    const cheatInput = document.getElementById('cheatInput')

    cheatInput.addEventListener('input', () => {
        const val = cheatInput.value.toLowerCase().replace(/[^a-z0-9]/g, '')
        // Only keep the tail equal in length to the code so we don't need to clear manually
        if (val.length > CHEAT.length) {
            cheatInput.value = val.slice(-CHEAT.length)
            return
        }
        if (val === CHEAT) {
            cheatInput.value = ''
            activateCheatContinue()
        }
    })

    // Also intercept keydown so arrow keys etc. don't get swallowed weirdly
    cheatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cheatInput.blur()
    })
})()

function activateCheatContinue() {
    if (gameRunning) return   // already running, ignore

    // Cancel any pending low-score auto-delete countdown
    if (_lowScoreCountdown) { clearInterval(_lowScoreCountdown); _lowScoreCountdown = null }

    // Remove the last leaderboard entry so the duplicate-name check
    // doesn't block saving a new (hopefully better) entry at the end
    if (_lastSavedName) Leaderboard.removeEntryByName(_lastSavedName)

    // Restore the snake to a safe minimal state if it somehow ended up empty
    if (!Snake.body || Snake.body.length === 0) Snake.init()

    // Place food if missing
    if (!Food.main) Food.place()

    // Resume game state
    activeEvent = null
    hideEventBanner()
    stopTimerBar()
    cancelWarning()
    winScreen.classList.add('hidden')
    restartPrompt.classList.add('hidden')
    controlsDiv.classList.remove('hidden')

    gameRunning  = true
    currentSpeed = speedNormal
    gameLoop     = true
    startGameLoop()
    eventInterval = setInterval(triggerRandomEvent, 8000)
    startMusic()

    // 5 seconds of ghost mode as a grace period (pass through walls and self)
    Snake.invincible = true
    Snake.ghostMode  = true
    setMessage('🔑 Code accepted! 5s ghost mode active…')
    setTimeout(() => {
        if (gameRunning) {
            Snake.invincible = false
            Snake.ghostMode  = false
            setMessage('Eat the orange food!')
        }
    }, 5000)
}

// ── GOD'S EYE overlay ───────────────────────────────────────────────────────
let _godsEyeLegendaryAdded = 0   // tracks legendaries added this session (max 1)

function openGodsEyeOverlay() {
    if (!gameRunning) return
    // Pause game
    gameRunning = false
    stopGameLoop()
    clearInterval(eventInterval)
    _godsEyeLegendaryAdded = 0

    const overlay    = document.getElementById('godsEyeOverlay')
    const queueList  = document.getElementById('godsEyeQueueList')
    const eventList  = document.getElementById('godsEyeEventList')
    const searchEl   = document.getElementById('godsEyeSearch')
    const invincChk  = document.getElementById('godsEyeInvincCheck')
    const confirmBtn = document.getElementById('godsEyeConfirmBtn')

    invincChk.checked = false
    searchEl.value = ''

    function renderGEQueue() {
        queueList.innerHTML = ''
        if (upcomingEventQueue.length === 0) {
            queueList.innerHTML = '<div class="ge-queue-empty">Queue empty — add 5 events to continue</div>'
        } else {
            upcomingEventQueue.forEach((ev, idx) => {
                const row = document.createElement('div')
                const cls = ev.rarity === 'mythic' ? 'mythic' : ev.rarity === 'legendary' ? 'legendary' : ev.harmful ? 'harmful' : ev.rarity === 'epic' ? 'epic' : ''
                row.className = 'ge-queue-item ' + cls
                row.innerHTML = `<span>${idx + 1}</span><span>${ev.icon}</span><span>${ev.name}</span><span class="ge-ev-rarity">${ev.rarity}</span><button class="ge-del-btn" title="Remove">✕</button>`
                row.querySelector('.ge-del-btn').addEventListener('click', () => {
                    upcomingEventQueue.splice(idx, 1)
                    // Recalculate legendary count from actual queue contents
                    _godsEyeLegendaryAdded = upcomingEventQueue.filter(e => e.rarity === 'legendary').length
                    renderGEQueue()
                    renderGEEventList(searchEl.value)
                    updateConfirmState()
                })
                queueList.appendChild(row)
            })
        }
        updateConfirmState()
    }

    function updateConfirmState() {
        const count = upcomingEventQueue.length
        const ready = count === EVENT_QUEUE_SIZE
        confirmBtn.disabled = !ready
        confirmBtn.title = ready ? '' : `Queue must have exactly 5 events (${count}/5)`
        confirmBtn.textContent = ready ? '✔ Confirm & Resume' : `✔ Confirm & Resume (${count}/5)`
        confirmBtn.style.opacity = ready ? '1' : '0.45'
        confirmBtn.style.cursor  = ready ? 'pointer' : 'not-allowed'
    }

    function renderGEEventList(filter) {
        eventList.innerHTML = ''
        const q = (filter || '').toLowerCase()
        EVENTS
            .filter(ev => ev.name.toLowerCase().includes(q) || ev.rarity.toLowerCase().includes(q))
            .forEach(ev => {
                const row = document.createElement('div')
                const cls = ev.rarity === 'mythic' ? 'mythic' : ev.rarity === 'legendary' ? 'legendary' : ev.harmful ? 'harmful' : ''
                row.className = 'ge-ev-item ' + cls
                // Grey out add button if queue is full
                const full = upcomingEventQueue.length >= EVENT_QUEUE_SIZE
                row.innerHTML = `<span>${ev.icon}</span><span class="ge-ev-name">${ev.name}</span><span class="ge-ev-rarity rarity-${ev.rarity}">${ev.rarity}</span>`
                row.style.opacity = full ? '0.4' : '1'
                row.style.cursor  = full ? 'not-allowed' : 'pointer'
                row.addEventListener('click', () => {
                    if (upcomingEventQueue.length >= EVENT_QUEUE_SIZE) return
                    if (ev.rarity === 'legendary') {
                        if (_godsEyeLegendaryAdded >= 1) {
                            document.getElementById('godsEyeLegendaryNote').textContent = '⛔ Already added 1 legendary this edit!'
                            document.getElementById('godsEyeLegendaryNote').style.color = '#ff5555'
                            setTimeout(() => {
                                document.getElementById('godsEyeLegendaryNote').textContent = '⚠ Max 1 legendary per edit'
                                document.getElementById('godsEyeLegendaryNote').style.color = ''
                            }, 2000)
                            return
                        }
                        _godsEyeLegendaryAdded++
                    }
                    upcomingEventQueue.push(ev)
                    renderGEQueue()
                    renderGEEventList(searchEl.value)
                })
                eventList.appendChild(row)
            })
    }

    renderGEQueue()
    renderGEEventList('')
    searchEl.addEventListener('input', () => renderGEEventList(searchEl.value))

    overlay.classList.remove('hidden')

    confirmBtn.onclick = () => {
        if (upcomingEventQueue.length !== EVENT_QUEUE_SIZE) return   // safety guard
        overlay.classList.add('hidden')
        renderUpcomingPanel()

        gameRunning  = true
        currentSpeed = currentSpeed || speedNormal
        gameLoop     = true
        startGameLoop()
        eventInterval = setInterval(triggerRandomEvent, 8000)

        if (invincChk.checked) {
            Snake.invincible = true
            Snake.ghostMode  = true
            setMessage('👁️ GOD\'S EYE — queue edited! 5s protection active.')
            setTimeout(() => {
                if (gameRunning) { Snake.invincible = false; Snake.ghostMode = false; setMessage('Eat the orange food!') }
            }, 5000)
        } else {
            setMessage('👁️ GOD\'S EYE — queue edited!')
        }
    }
}

// Name validation helper — returns true and clears error, or false and shakes
function validatePlayerName() {
    const input    = document.getElementById('playerNameInput')
    const errorMsg = document.getElementById('nameErrorMsg')
    const name     = (input.value || '').trim()
    if (name.length === 0) {
        errorMsg.textContent = '⚠️ Please enter a name to continue!'
        input.classList.remove('name-error')
        void input.offsetWidth                    // force reflow so animation restarts
        input.classList.add('name-error')
        input.focus()
        // Remove the error class after animation ends
        setTimeout(() => input.classList.remove('name-error'), 600)
        return false
    }
    // Duplicate name check (case-insensitive)
    const entries = Leaderboard.load()
    const isDuplicate = entries.some(e => e.name.toLowerCase() === name.toLowerCase())
    if (isDuplicate) {
        errorMsg.textContent = '⚠️ That name is already on the leaderboard — pick a different name!'
        input.classList.remove('name-error')
        void input.offsetWidth
        input.classList.add('name-error')
        input.focus()
        setTimeout(() => input.classList.remove('name-error'), 600)
        return false
    }
    errorMsg.textContent = ''
    return true
}

// Allow pressing Enter in the name field to start the game
document.getElementById('playerNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { if (validatePlayerName()) startGame() }
})

// button listeners
document.getElementById('startBtn').addEventListener('click', () => {
    if (validatePlayerName()) startGame()
})

// ── Post-death restart prompt ──────────────────────────────────────────────
// Tracks the name and low-score countdown from the last run
let _lastSavedName       = null
let _lowScoreCountdown   = null   // interval ID for the auto-remove countdown

const restartPrompt      = document.getElementById('restartPrompt')
const restartNameInput   = document.getElementById('restartNameInput')
const restartNameError   = document.getElementById('restartNameError')
const restartPromptMsg   = document.getElementById('restartPromptMsg')
const restartSameNameBtn = document.getElementById('restartSameNameBtn')
const restartSameNameLbl = document.getElementById('restartSameNameLabel')

function showRestartPrompt() {
    const hasEntry = _lastSavedName &&
        Leaderboard.load().some(e => e.name.toLowerCase() === _lastSavedName.toLowerCase())

    if (hasEntry) {
        restartSameNameLbl.textContent = _lastSavedName
        restartSameNameBtn.style.display = ''
        document.getElementById('restartPromptDivider').style.display = ''
        restartPromptMsg.textContent = 'Keep playing as your last name, or pick a new one:'
    } else {
        restartSameNameBtn.style.display = 'none'
        document.getElementById('restartPromptDivider').style.display = 'none'
        restartPromptMsg.textContent = 'Pick a new name to play again:'
    }

    restartNameInput.value = ''
    restartNameError.textContent = ''
    restartPrompt.classList.remove('hidden')
    setTimeout(() => restartNameInput.focus(), 50)
}

// "Play as [same name]" — deletes last entry, cancels any low-score countdown, restarts
restartSameNameBtn.addEventListener('click', () => {
    // Cancel the low-score auto-remove countdown so it doesn't fire after restart
    if (_lowScoreCountdown) { clearInterval(_lowScoreCountdown); _lowScoreCountdown = null }
    if (_lastSavedName) Leaderboard.removeEntryByName(_lastSavedName)
    restartPrompt.classList.add('hidden')
    startGame()
})

// "Play with new name" button
document.getElementById('restartNewNameBtn').addEventListener('click', () => {
    const newName = restartNameInput.value.trim()
    if (!newName) {
        restartNameError.textContent = '⚠️ Please enter a name!'
        restartNameInput.focus()
        return
    }
    const duplicate = Leaderboard.load().some(e => e.name.toLowerCase() === newName.toLowerCase())
    if (duplicate) {
        restartNameError.textContent = '⚠️ That name is already on the leaderboard!'
        restartNameInput.focus()
        return
    }
    // Swap in the new name and go
    document.getElementById('playerNameInput').value = newName
    restartPrompt.classList.add('hidden')
    startGame()
})

// Allow Enter key in the restart name input
restartNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('restartNewNameBtn').click()
})

// RESTART button (shown after death on the controls bar) → show the prompt
document.getElementById('restartBtn').addEventListener('click', showRestartPrompt)

document.getElementById('continueBtn').addEventListener('click', continueGame)
document.getElementById('winRestartBtn').addEventListener('click', startGame)

// ── How To Play modal — pauses game while open ──
let helpPaused = false   // true if the game was running when help opened

const helpModal    = document.getElementById('helpModal')
const howToPlayBtn = document.getElementById('howToPlayBtn')
const helpCloseBtn = document.getElementById('helpCloseBtn')

function openHelp() {
    if (gameRunning) {
        helpPaused = true
        gameRunning = false
        stopGameLoop()
        clearInterval(eventInterval)
        // pause the warning countdown too
        if (warningTimeout) { clearTimeout(warningTimeout); }
        if (warningRAF)     { cancelAnimationFrame(warningRAF); }
        if (teleportPulseRAF) { cancelAnimationFrame(teleportPulseRAF); }
    } else {
        helpPaused = false
    }
    helpModal.classList.remove('hidden')
}

function closeHelp() {
    helpModal.classList.add('hidden')
    if (helpPaused) {
        helpPaused = false
        gameRunning = true
        currentSpeed  = currentSpeed || speedNormal
        gameLoop      = true
        startGameLoop()
        eventInterval = setInterval(triggerRandomEvent, 8000)
        // restart warning visual if there was a pending teleport tile
        if (pendingTeleportTile) {
            let startTime = performance.now()
            const pulseTick = (now) => {
                if (!pendingTeleportTile) { teleportPulseRAF = null; return }
                const alpha = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin((now - startTime) / 300))
                Renderer.drawFrame()
                Renderer.drawTeleportTarget(pendingTeleportTile.x, pendingTeleportTile.y, alpha, Snake.direction)
                teleportPulseRAF = requestAnimationFrame(pulseTick)
            }
            teleportPulseRAF = requestAnimationFrame(pulseTick)
        }
        // re-animate the warning countdown bar from whatever is left
        if (!warningOverlay.classList.contains('hidden')) {
            const remaining = 1500   // give a fair 1.5s to react after re-open
            warningTimeout = setTimeout(() => {
                const savedTeleportTile = pendingTeleportTile
                hideWarningOverlay()
                if (savedTeleportTile) pendingTeleportTile = savedTeleportTile
                // fire stored event
                if (typeof _pendingFireEvent === 'function') { _pendingFireEvent(); _pendingFireEvent = null }
            }, remaining)
        }
    }
}

howToPlayBtn.addEventListener('click', openHelp)
helpCloseBtn.addEventListener('click', closeHelp)
// Close on backdrop click
helpModal.addEventListener('click', (e) => { if (e.target === helpModal) closeHelp() })
// Close with Escape
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !helpModal.classList.contains('hidden')) closeHelp() })

// Draw the static background on page load (before any game starts)
Renderer.drawBackground()

// ── Debug Event Forcer — only active when URL contains ?debug ──
;(function initDebugPanel() {
    if (!location.search.includes('debug')) return

    const panel        = document.getElementById('debugPanel')
    const filterInput  = document.getElementById('debugFilter')
    const listEl       = document.getElementById('debugList')
    const queueCountEl = document.getElementById('debugQueueCount')
    const queueListEl  = document.getElementById('debugQueueList')
    const clearBtn     = document.getElementById('debugClearBtn')
    const fireNowBtn   = document.getElementById('debugFireNow')

    panel.style.display = 'flex'

    // ── Score Setter ──
    const scoreInput = document.getElementById('debugScoreInput')
    const scoreBtn   = document.getElementById('debugScoreBtn')

    function applyDebugScore() {
        const val = parseInt(scoreInput.value, 10)
        if (isNaN(val) || val < 0) { scoreInput.classList.add('debug-input-error'); return }
        scoreInput.classList.remove('debug-input-error')
        score = val
        scoreDisplay.textContent = score
        if (score > highScore) {
            highScore = score
            highScoreDisplay.textContent = highScore
            localStorage.setItem('snakeHighScore', highScore)
        }
        scoreInput.value = ''
        scoreBtn.textContent = '✓'
        setTimeout(() => { scoreBtn.textContent = 'Set' }, 800)
    }

    scoreBtn.addEventListener('click', applyDebugScore)
    scoreInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyDebugScore() })

    // ── Leaderboard Editor ──
    const lbNameInput  = document.getElementById('debugLbName')
    const lbScoreInput = document.getElementById('debugLbScore')
    const lbAddBtn     = document.getElementById('debugLbAddBtn')
    const lbRemoveInput = document.getElementById('debugLbRemoveIdx')
    const lbRemoveBtn  = document.getElementById('debugLbRemoveBtn')
    const lbClearBtn2  = document.getElementById('debugLbClearBtn')
    const lbFeedback   = document.getElementById('debugLbFeedback')

    function lbFlash(msg, isError) {
        lbFeedback.textContent = msg
        lbFeedback.style.color = isError ? '#ff6b6b' : '#4ec94e'
        clearTimeout(lbFlash._t)
        lbFlash._t = setTimeout(() => { lbFeedback.textContent = '' }, 2000)
    }

    lbAddBtn.addEventListener('click', () => {
        const name = (lbNameInput.value || '').trim().slice(0, 16) || null
        const sc   = parseInt(lbScoreInput.value, 10)
        let err = false
        if (!name) { lbNameInput.classList.add('debug-input-error'); err = true } else lbNameInput.classList.remove('debug-input-error')
        if (isNaN(sc) || sc < 0) { lbScoreInput.classList.add('debug-input-error'); err = true } else lbScoreInput.classList.remove('debug-input-error')
        if (err) return
        const now = new Date()
        const entries = Leaderboard.load()
        entries.push({
            score: sc, name, won: false, winLevel: 0,
            food: 0, bonus: 0, bombs: 0, events: 0,
            snake: 0, duration: 0,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ts: now.getTime()
        })
        // Save via internal key — use exposed save shim
        Leaderboard._save(entries)
        lbNameInput.value = ''
        lbScoreInput.value = ''
        lbFlash(`✓ Added "${name}" with score ${sc}`)
    })

    lbRemoveBtn.addEventListener('click', () => {
        const rank = parseInt(lbRemoveInput.value, 10)
        const entries = Leaderboard.load()
        const sorted  = [...entries].sort((a, b) => b.score - a.score || b.ts - a.ts)
        if (isNaN(rank) || rank < 1 || rank > sorted.length) {
            lbRemoveInput.classList.add('debug-input-error')
            lbFlash(`Rank must be 1–${sorted.length || '?'}`, true)
            return
        }
        lbRemoveInput.classList.remove('debug-input-error')
        const target = sorted[rank - 1]
        const newEntries = entries.filter(e => e.ts !== target.ts)
        Leaderboard._save(newEntries)
        lbRemoveInput.value = ''
        lbFlash(`✓ Removed rank #${rank} ("${target.name}", ${target.score} pts)`)
    })

    lbClearBtn2.addEventListener('click', () => {
        if (confirm('Clear all leaderboard entries? This cannot be undone.')) {
            Leaderboard._save([])
            lbFlash('✓ Leaderboard cleared')
        }
    })

    let eventQueue = []

    // ── Render the event picker list ──
    function buildList(filter) {
        listEl.innerHTML = ''
        const q = (filter || '').toLowerCase()
        EVENTS
            .filter(ev => ev.name.toLowerCase().includes(q) || ev.rarity.toLowerCase().includes(q))
            .forEach(ev => {
                const row = document.createElement('div')
                const harmClass = ev.harmful ? 'badge-harmful' : 'badge-beneficial'
                const harmLabel = ev.harmful ? '⚠' : '✓'
                row.className = 'debug-item' +
                    (ev.rarity === 'mythic' ? ' mythic' : ev.rarity === 'legendary' ? ' legendary' : ev.harmful ? ' harmful' : ' beneficial')
                row.title = 'Click to add to queue'
                row.innerHTML = `
                    <span class="debug-icon">${ev.icon}</span>
                    <span class="debug-name">${ev.name}</span>
                    <span class="debug-rarity rarity-${ev.rarity}">${ev.rarity}</span>
                    <span class="debug-harm-badge ${harmClass}">${harmLabel}</span>
                    <span class="debug-add-btn" title="Add to queue">＋</span>`
                row.addEventListener('click', () => { addToQueue(ev); })
                listEl.appendChild(row)
            })
    }

    // ── Render the queue ──
    function buildQueue() {
        queueListEl.innerHTML = ''
        queueCountEl.textContent = eventQueue.length

        if (eventQueue.length === 0) {
            queueListEl.innerHTML = '<div class="debug-queue-empty">Queue is empty — events will be random</div>'
            return
        }

        eventQueue.forEach((ev, idx) => {
            const row = document.createElement('div')
            row.className = 'debug-queue-item' +
                (ev.rarity === 'mythic' ? ' mythic' : ev.rarity === 'legendary' ? ' legendary' : ev.harmful ? ' harmful' : ' beneficial')
            row.draggable = true

            row.innerHTML = `
                <span class="dq-pos">${idx + 1}</span>
                <span class="dq-icon">${ev.icon}</span>
                <span class="dq-name">${ev.name}</span>
                <span class="dq-rarity rarity-${ev.rarity}">${ev.rarity}</span>
                <span class="dq-controls">
                    <button class="dq-btn dq-up"   title="Move up"   ${idx === 0 ? 'disabled' : ''}>▲</button>
                    <button class="dq-btn dq-down" title="Move down" ${idx === eventQueue.length - 1 ? 'disabled' : ''}>▼</button>
                    <button class="dq-btn dq-del"  title="Remove">✕</button>
                </span>`

            row.querySelector('.dq-up').addEventListener('click', (e) => {
                e.stopPropagation()
                if (idx > 0) { [eventQueue[idx - 1], eventQueue[idx]] = [eventQueue[idx], eventQueue[idx - 1]]; buildQueue() }
            })
            row.querySelector('.dq-down').addEventListener('click', (e) => {
                e.stopPropagation()
                if (idx < eventQueue.length - 1) { [eventQueue[idx + 1], eventQueue[idx]] = [eventQueue[idx], eventQueue[idx + 1]]; buildQueue() }
            })
            row.querySelector('.dq-del').addEventListener('click', (e) => {
                e.stopPropagation()
                eventQueue.splice(idx, 1); buildQueue()
            })

            // Drag-and-drop reorder
            row.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', idx)
                row.classList.add('dragging')
            })
            row.addEventListener('dragend', () => row.classList.remove('dragging'))
            row.addEventListener('dragover', (e) => { e.preventDefault(); row.classList.add('drag-over') })
            row.addEventListener('dragleave', () => row.classList.remove('drag-over'))
            row.addEventListener('drop', (e) => {
                e.preventDefault()
                row.classList.remove('drag-over')
                const from = parseInt(e.dataTransfer.getData('text/plain'))
                if (from !== idx) {
                    const item = eventQueue.splice(from, 1)[0]
                    eventQueue.splice(idx, 0, item)
                    buildQueue()
                }
            })

            queueListEl.appendChild(row)
        })
    }

    function addToQueue(ev) {
        eventQueue.push(ev)
        buildQueue()
        // Brief flash on the queue section to confirm
        queueListEl.classList.remove('flash')
        void queueListEl.offsetWidth
        queueListEl.classList.add('flash')
        setTimeout(() => queueListEl.classList.remove('flash'), 300)
    }

    buildList()
    buildQueue()

    filterInput.addEventListener('input', () => buildList(filterInput.value))

    clearBtn.addEventListener('click', () => {
        eventQueue = []
        buildQueue()
    })

    // Fire the next queued event immediately (skipping the normal interval)
    fireNowBtn.addEventListener('click', () => {
        if (!gameRunning) return
        clearInterval(eventInterval)
        triggerRandomEvent()
        if (gameRunning) eventInterval = setInterval(triggerRandomEvent, 8000)
    })

    // Called by triggerRandomEvent — pops and returns the next queued event, or null
    window._debugGetForcedEvent = function() {
        if (eventQueue.length === 0) return null
        const ev = eventQueue.shift()
        buildQueue()
        return ev
    }

    // ── localStorage Import / Export ──
    const exportBtn      = document.getElementById('debugExportBtn')
    const importBtn      = document.getElementById('debugImportBtn')
    const importFile     = document.getElementById('debugImportFile')
    const storageFeedback = document.getElementById('debugStorageFeedback')

    function storageFeedbackMsg(msg, isError) {
        storageFeedback.textContent = msg
        storageFeedback.style.color = isError ? '#ff6b6b' : '#4ec94e'
        clearTimeout(storageFeedbackMsg._t)
        storageFeedbackMsg._t = setTimeout(() => { storageFeedback.textContent = '' }, 3000)
    }

    exportBtn.addEventListener('click', () => {
        const data = {}
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            data[key] = localStorage.getItem(key)
        }
        const json = JSON.stringify(data, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href     = url
        a.download = `snake-save-${new Date().toISOString().slice(0,10)}.json`
        a.click()
        URL.revokeObjectURL(url)
        storageFeedbackMsg(`✓ Exported ${Object.keys(data).length} key(s)`)
    })

    importBtn.addEventListener('click', () => importFile.click())

    importFile.addEventListener('change', () => {
        const file = importFile.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result)
                if (typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid format')
                const keys = Object.keys(data)
                keys.forEach(key => localStorage.setItem(key, data[key]))
                storageFeedbackMsg(`✓ Imported ${keys.length} key(s) — reload to apply`)
            } catch (err) {
                storageFeedbackMsg('✗ Invalid JSON file', true)
            }
            importFile.value = ''
        }
        reader.readAsText(file)
    })
})()

// ══════════════════════════════════════════════════════
// ── LEADERBOARD ──────────────────────────────────────
// Versioned localStorage key — bump LB_VERSION if the
// schema ever changes to avoid reading stale data.
// ══════════════════════════════════════════════════════
const Leaderboard = (() => {
    const LB_VERSION  = 1
    const STORAGE_KEY = `snakeLB_v${LB_VERSION}`
    const MAX_ENTRIES = 50   // cap so localStorage never bloats

    // ── Helpers ──────────────────────────────────────
    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return []
            const parsed = JSON.parse(raw)
            // Basic integrity check: must be a non-null array
            if (!Array.isArray(parsed)) return []
            // Filter out any malformed entries
            return parsed.filter(e =>
                e && typeof e.score === 'number' &&
                typeof e.name === 'string' &&
                typeof e.date === 'string'
            )
        } catch { return [] }
    }

    function save(entries) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
        } catch (err) {
            console.warn('Leaderboard save failed (storage full?):', err)
        }
    }

    function getPlayerName() {
        const raw = (document.getElementById('playerNameInput').value || '').trim()
        return raw.length > 0 ? raw.slice(0, 16) : 'Anonymous'
    }

    // ── Public: save a game result ────────────────────
    function saveEntry(finalScore, won) {
        if (finalScore <= 0) return   // don't record zero-score runs
        const entries = load()
        const now = new Date()
        const playerName = getPlayerName()
        const entry = {
            score:      finalScore,
            name:       playerName,
            won:        !!won,
            winLevel:   statWinLevel,
            food:       statFoodEaten,
            bonus:      statBonusEaten,
            bombs:      statBombsEaten,
            events:     statEventsLived,
            snake:      Snake.body.length,
            duration:   Math.round((Date.now() - statGameStart) / 1000),
            date:       now.toLocaleDateString(),
            time:       now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ts:         now.getTime()   // numeric timestamp for sorting
        }
        // Duplicate-name check (case-insensitive): keep only best score per name
        const dupIdx = entries.findIndex(e => e.name.toLowerCase() === playerName.toLowerCase())
        if (dupIdx !== -1) {
            if (finalScore > entries[dupIdx].score) {
                entries[dupIdx] = entry   // replace with better score
            }
            // otherwise discard — existing entry is better
        } else {
            entries.push(entry)
        }
        // Keep only MAX_ENTRIES, dropping the lowest scorers when over limit
        if (entries.length > MAX_ENTRIES) {
            entries.sort((a, b) => b.score - a.score)
            entries.splice(MAX_ENTRIES)
        }
        save(entries)
        // Remember which name was saved so the restart prompt can offer deletion
        _lastSavedName = playerName
    }

    // ── Public: remove a player's entry by name (case-insensitive) ───
    function removeEntryByName(name) {
        const entries = load()
        const filtered = entries.filter(e => e.name.toLowerCase() !== name.toLowerCase())
        save(filtered)
    }

    // ── UI ────────────────────────────────────────────
    const modal      = document.getElementById('lbModal')
    const listEl     = document.getElementById('lbList')
    const countEl    = document.getElementById('lbEntryCount')
    const tabs       = document.querySelectorAll('.lb-tab')
    const clearBtn   = null  // Clear button removed from UI; clearing is done via debug panel
    let   currentSort = 'score'   // 'score' | 'date'

    function rankLabel(rank) {
        if (rank === 1) return '🥇'
        if (rank === 2) return '🥈'
        if (rank === 3) return '🥉'
        return rank
    }

    function fmtDuration(secs) {
        const m = Math.floor(secs / 60), s = secs % 60
        return m > 0 ? `${m}m ${s}s` : `${s}s`
    }

    function render() {
        const entries = load()
        countEl.textContent = entries.length + ' game' + (entries.length !== 1 ? 's' : '') + ' recorded'

        if (entries.length === 0) {
            listEl.innerHTML = '<div class="lb-empty">No games recorded yet — play a round first!</div>'
            return
        }

        // Sort: by-score keeps rank stable, by-date shows newest first
        const sorted = [...entries].sort(currentSort === 'score'
            ? (a, b) => b.score - a.score || b.ts - a.ts
            : (a, b) => b.ts - a.ts
        )

        // Build rank map (by score order, regardless of current tab)
        const byScore = [...entries].sort((a, b) => b.score - a.score)
        const rankOf = new Map(byScore.map((e, i) => [e.ts, i + 1]))

        listEl.innerHTML = ''
        sorted.forEach((e, i) => {
            const rank = currentSort === 'score' ? i + 1 : rankOf.get(e.ts) ?? '?'
            const row = document.createElement('div')
            row.className = 'lb-row' +
                (rank === 1 ? ' rank-1' : rank === 2 ? ' rank-2' : rank === 3 ? ' rank-3' : '')

            const wonBadge = e.won || e.winLevel > 0
                ? `<strong style="color:#4ec94e">🏆 L${e.winLevel}</strong>`
                : ''

            row.innerHTML = `
                <div class="lb-rank">${rankLabel(rank)}</div>
                <div class="lb-info">
                    <div class="lb-name">${escHtml(e.name)}</div>
                    <div class="lb-details">
                        ${wonBadge}
                        <span>🍎 <strong>${e.food ?? '?'}</strong></span>
                        <span>🎁 <strong>${e.bonus ?? '?'}</strong></span>
                        <span>💥 <strong>${e.bombs ?? '?'}</strong> bombs</span>
                        <span>⚡ <strong>${e.events ?? '?'}</strong> events</span>
                        <span>🐍 <strong>${e.snake ?? '?'}</strong> segs</span>
                        <span>⏱ <strong>${fmtDuration(e.duration ?? 0)}</strong></span>
                    </div>
                </div>
                <div class="lb-score-col">
                    <div class="lb-score">${e.score}</div>
                    <div class="lb-date">${e.date} ${e.time}</div>
                </div>`
            listEl.appendChild(row)
        })
    }

    function escHtml(str) {
        return str.replace(/[&<>"']/g, c =>
            ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]))
    }

    let lbPaused = false

    function open() {
        if (gameRunning) {
            lbPaused = true
            gameRunning = false
            stopGameLoop()
            clearInterval(eventInterval)
        } else {
            lbPaused = false
        }
        render()
        modal.classList.remove('hidden')
    }

    function close() {
        modal.classList.add('hidden')
        if (lbPaused) {
            lbPaused = false
            gameRunning = true
            currentSpeed = currentSpeed || speedNormal
            gameLoop      = true
            startGameLoop()
            eventInterval = setInterval(triggerRandomEvent, 8000)
        }
    }

    // Tab clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'))
            tab.classList.add('active')
            currentSort = tab.dataset.sort
            render()
        })
    })

    // Open via in-game controls button
    document.getElementById('lbBtn').addEventListener('click', open)
    // Open via title screen button
    document.getElementById('titleLbBtn').addEventListener('click', open)
    // Close button
    document.getElementById('lbCloseBtn').addEventListener('click', close)
    // Backdrop click
    modal.addEventListener('click', e => { if (e.target === modal) close() })
    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) close()
    })

    return { saveEntry, removeEntryByName, open, close, load, _save: save }
})()

// Theme presets — used by the title screen theme picker modal
const THEME_PRESETS = {
    classic: {
        label: 'Classic',
        tag: 'default',
        // CSS / UI colours
        uiBg:      '#0a1628',
        uiBodyBg:  '#0c1e3a',
        uiAccent:  '#ff8c00',
        uiBorder:  '#1e3a6e',
        uiGlow:    'rgba(255,140,0,0.25)',
        // Canvas rendering
        background:     '#0d1f3c',
        grid:           'rgba(30,58,110,0.5)',
        food:           '#ff8c00',
        bonus:          '#ff4444',
        bonusAccent:    '#ffaaaa',
        snakeHead:      '#ffffff',
        snakeBodyRGB:   '255,255,255',
        ghostRGB:       '180,220,255',
        mazeFill:       '#2a1a0a',
        mazeStroke:     '#8B4513',
        mazeBrick:      '#5c3317',
        fakeFoodShimmer:'255,255,255',
        // Mini-preview colours
        previewBg:  '#0d1f3c',
        previewSnake: '#fff',
        previewFood: '#ff8c00'
    },
    neon: {
        label: 'Neon',
        tag: 'cyberpunk',
        uiBg:      '#050010',
        uiBodyBg:  '#0a0028',
        uiAccent:  '#00ffe0',
        uiBorder:  '#003a4a',
        uiGlow:    'rgba(0,255,200,0.3)',
        background:     '#050014',
        grid:           'rgba(0,255,200,0.08)',
        food:           '#00ffe0',
        bonus:          '#ff00d0',
        bonusAccent:    '#ff9adf',
        snakeHead:      '#00ff9a',
        snakeBodyRGB:   '0,255,154',
        ghostRGB:       '100,255,220',
        mazeFill:       '#081217',
        mazeStroke:     '#003a3a',
        mazeBrick:      '#06282a',
        fakeFoodShimmer:'255,255,255',
        previewBg:  '#050014',
        previewSnake: '#00ff9a',
        previewFood: '#00ffe0'
    },
    forest: {
        label: 'Forest',
        tag: 'nature',
        uiBg:      '#031a0a',
        uiBodyBg:  '#071f0e',
        uiAccent:  '#5cdb6b',
        uiBorder:  '#0f7a43',
        uiGlow:    'rgba(92,219,107,0.25)',
        background:     '#071f0e',
        grid:           'rgba(20,90,45,0.55)',
        food:           '#7bd389',
        bonus:          '#ffd27b',
        bonusAccent:    '#fff1d6',
        snakeHead:      '#dfffe0',
        snakeBodyRGB:   '100,200,115',
        ghostRGB:       '160,230,180',
        mazeFill:       '#07321a',
        mazeStroke:     '#1a8a50',
        mazeBrick:      '#0b5632',
        fakeFoodShimmer:'200,255,210',
        previewBg:  '#071f0e',
        previewSnake: '#64c873',
        previewFood: '#ffd27b'
    },
    cosmic: {
        label: 'Cosmic',
        tag: 'space',
        uiBg:      '#030010',
        uiBodyBg:  '#0a0028',
        uiAccent:  '#b370ff',
        uiBorder:  '#3a1a6e',
        uiGlow:    'rgba(179,112,255,0.3)',
        background:     '#040018',
        grid:           'rgba(40,20,80,0.45)',
        food:           '#ff8c00',
        bonus:          '#b19cff',
        bonusAccent:    '#e9d7ff',
        snakeHead:      '#fff0ff',
        snakeBodyRGB:   '200,170,255',
        ghostRGB:       '200,180,255',
        mazeFill:       '#1b003b',
        mazeStroke:     '#6b2fff',
        mazeBrick:      '#3a005a',
        fakeFoodShimmer:'255,255,255',
        previewBg:  '#040018',
        previewSnake: '#c8aaff',
        previewFood: '#ff8c00'
    },
    lava: {
        label: 'Lava',
        tag: 'fire',
        uiBg:      '#180800',
        uiBodyBg:  '#2a0e00',
        uiAccent:  '#ff4500',
        uiBorder:  '#5a1200',
        uiGlow:    'rgba(255,69,0,0.35)',
        background:     '#1a0600',
        grid:           'rgba(90,18,0,0.55)',
        food:           '#ffda00',
        bonus:          '#ff6a00',
        bonusAccent:    '#ffb380',
        snakeHead:      '#ff7043',
        snakeBodyRGB:   '255,112,67',
        ghostRGB:       '255,160,120',
        mazeFill:       '#3a0800',
        mazeStroke:     '#c02800',
        mazeBrick:      '#7a1400',
        fakeFoodShimmer:'255,220,120',
        previewBg:  '#1a0600',
        previewSnake: '#ff7043',
        previewFood: '#ffda00'
    },
    ocean: {
        label: 'Ocean',
        tag: 'deep sea',
        uiBg:      '#020d1a',
        uiBodyBg:  '#04192e',
        uiAccent:  '#00b4d8',
        uiBorder:  '#023e5e',
        uiGlow:    'rgba(0,180,216,0.3)',
        background:     '#030f1e',
        grid:           'rgba(0,80,130,0.4)',
        food:           '#00e5ff',
        bonus:          '#00b4d8',
        bonusAccent:    '#90e0ef',
        snakeHead:      '#caf0f8',
        snakeBodyRGB:   '100,200,240',
        ghostRGB:       '150,220,255',
        mazeFill:       '#011426',
        mazeStroke:     '#034e6a',
        mazeBrick:      '#012a44',
        fakeFoodShimmer:'220,240,255',
        previewBg:  '#030f1e',
        previewSnake: '#64c8f0',
        previewFood: '#00e5ff'
    },
    retro: {
        label: 'Retro',
        tag: 'arcade',
        uiBg:      '#0d0d00',
        uiBodyBg:  '#1a1a00',
        uiAccent:  '#ccff00',
        uiBorder:  '#3a3a00',
        uiGlow:    'rgba(204,255,0,0.28)',
        background:     '#0a0a00',
        grid:           'rgba(40,40,0,0.6)',
        food:           '#ccff00',
        bonus:          '#ff0066',
        bonusAccent:    '#ff99cc',
        snakeHead:      '#ffffff',
        snakeBodyRGB:   '180,255,0',
        ghostRGB:       '200,255,150',
        mazeFill:       '#1a1a00',
        mazeStroke:     '#666600',
        mazeBrick:      '#333300',
        fakeFoodShimmer:'255,255,150',
        previewBg:  '#0a0a00',
        previewSnake: '#b4ff00',
        previewFood: '#ccff00'
    },
    blood: {
        label: 'Blood Moon',
        tag: 'horror',
        uiBg:      '#0e0000',
        uiBodyBg:  '#200000',
        uiAccent:  '#cc0000',
        uiBorder:  '#440000',
        uiGlow:    'rgba(200,0,0,0.35)',
        background:     '#110000',
        grid:           'rgba(60,0,0,0.55)',
        food:           '#ff1744',
        bonus:          '#ff6600',
        bonusAccent:    '#ffaa66',
        snakeHead:      '#ffcccc',
        snakeBodyRGB:   '220,80,80',
        ghostRGB:       '255,150,150',
        mazeFill:       '#220000',
        mazeStroke:     '#880000',
        mazeBrick:      '#550000',
        fakeFoodShimmer:'255,180,180',
        previewBg:  '#110000',
        previewSnake: '#dc5050',
        previewFood: '#ff1744'
    },
    ice: {
        label: 'Blizzard',
        tag: 'frozen',
        uiBg:      '#06101e',
        uiBodyBg:  '#0c1e34',
        uiAccent:  '#a8d8ff',
        uiBorder:  '#1a3a5c',
        uiGlow:    'rgba(168,216,255,0.28)',
        background:     '#080f1a',
        grid:           'rgba(80,130,180,0.18)',
        food:           '#e0f7ff',
        bonus:          '#60cfff',
        bonusAccent:    '#c8eeff',
        snakeHead:      '#ffffff',
        snakeBodyRGB:   '160,210,255',
        ghostRGB:       '200,240,255',
        mazeFill:       '#0a1825',
        mazeStroke:     '#3a6a9a',
        mazeBrick:      '#1a3050',
        fakeFoodShimmer:'200,240,255',
        previewBg:  '#080f1a',
        previewSnake: '#a0d2ff',
        previewFood: '#e0f7ff'
    },
    gold: {
        label: 'Gilded',
        tag: 'luxury',
        uiBg:      '#0f0a00',
        uiBodyBg:  '#1e1400',
        uiAccent:  '#ffd700',
        uiBorder:  '#5a4000',
        uiGlow:    'rgba(255,215,0,0.3)',
        background:     '#110c00',
        grid:           'rgba(80,60,0,0.45)',
        food:           '#ffd700',
        bonus:          '#ffaa00',
        bonusAccent:    '#ffe980',
        snakeHead:      '#fffacd',
        snakeBodyRGB:   '220,185,80',
        ghostRGB:       '255,230,150',
        mazeFill:       '#1e1400',
        mazeStroke:     '#8a6200',
        mazeBrick:      '#4a3400',
        fakeFoodShimmer:'255,230,100',
        previewBg:  '#110c00',
        previewSnake: '#dce060',
        previewFood: '#ffd700'
    }
}

// ── Theme selection ──
let _selectedTheme = localStorage.getItem('snakeTheme') || 'classic'

function applySelectedTheme() {
    const preset = THEME_PRESETS[_selectedTheme] || THEME_PRESETS.classic
    Renderer.setTheme(preset)
    // Apply CSS variable overrides for UI tinting
    const root = document.documentElement
    root.style.setProperty('--theme-bg',      preset.uiBg)
    root.style.setProperty('--theme-body-bg', preset.uiBodyBg || preset.uiBg)
    root.style.setProperty('--theme-accent',  preset.uiAccent)
    root.style.setProperty('--theme-border',  preset.uiBorder)
    root.style.setProperty('--theme-glow',    preset.uiGlow)
    // Update canvas inline styles to match (overrides any CSS defaults)
    const canvas = document.getElementById('gameCanvas')
    canvas.style.borderColor = preset.uiBorder
    canvas.style.background  = preset.background || preset.uiBg
    canvas.style.boxShadow   = `0 0 20px ${preset.uiGlow}`
    // Redraw background immediately so the change is visible before next tick
    if (typeof Renderer !== 'undefined') Renderer.drawBackground()
}

// ── Theme card builder ──
function buildThemeCards() {
    const grid = document.getElementById('themeCardGrid')
    if (!grid) return
    grid.innerHTML = ''

    Object.entries(THEME_PRESETS).forEach(([key, preset]) => {
        const card = document.createElement('div')
        card.className = 'theme-card' + (key === _selectedTheme ? ' selected' : '')
        card.dataset.theme = key

        // Mini canvas preview
        const canvas = document.createElement('canvas')
        canvas.width = 155
        canvas.height = 80
        const ctx = canvas.getContext('2d')
        drawThemePreview(ctx, preset, 155, 80)

        const preview = document.createElement('div')
        preview.className = 'theme-card-preview'
        preview.appendChild(canvas)

        const labelRow = document.createElement('div')
        labelRow.className = 'theme-card-label'
        labelRow.style.background = preset.uiBg
        labelRow.style.color = preset.uiAccent
        labelRow.innerHTML = `
            <span class="theme-card-name">${preset.label}</span>
            <span class="theme-card-tag">${preset.tag}</span>`

        card.appendChild(preview)
        card.appendChild(labelRow)

        card.addEventListener('click', () => {
            _selectedTheme = key
            localStorage.setItem('snakeTheme', key)
            applySelectedTheme()
            // Update button label
            const btn = document.getElementById('themePickerBtnLabel')
            if (btn) btn.textContent = preset.label
            // Update all card selected states
            grid.querySelectorAll('.theme-card').forEach(c => c.classList.toggle('selected', c.dataset.theme === key))
        })

        grid.appendChild(card)
    })
}

// Draws a tiny snake game scene into a 2d context for the card preview
function drawThemePreview(ctx, preset, w, h) {
    const tileW = Math.floor(w / 12), tileH = Math.floor(h / 8)

    // Background
    ctx.fillStyle = preset.previewBg || preset.background
    ctx.fillRect(0, 0, w, h)

    // Grid lines
    ctx.strokeStyle = preset.grid
    ctx.lineWidth = 0.5
    for (let x = 0; x < w; x += tileW) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
    for (let y = 0; y < h; y += tileH) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

    // Draw a small snake (5 segments)
    const body = [
        {x:7,y:3},{x:6,y:3},{x:5,y:3},{x:4,y:3},{x:3,y:3}
    ]
    body.forEach((seg, i) => {
        const alpha = 1 - (i / body.length) * 0.55
        ctx.fillStyle = i === 0 ? (preset.snakeHead || preset.previewSnake) : preset.previewSnake
        ctx.globalAlpha = alpha
        ctx.fillRect(seg.x * tileW + 1, seg.y * tileH + 1, tileW - 2, tileH - 2)
    })
    ctx.globalAlpha = 1

    // Draw food
    ctx.fillStyle = preset.previewFood || preset.food
    ctx.fillRect(9 * tileW + 2, 5 * tileH + 2, tileW - 4, tileH - 4)

    // Vignette overlay to make it feel more like a screen
    const vgr = ctx.createRadialGradient(w/2, h/2, Math.min(w,h)*0.2, w/2, h/2, Math.max(w,h)*0.7)
    vgr.addColorStop(0, 'rgba(0,0,0,0)')
    vgr.addColorStop(1, 'rgba(0,0,0,0.45)')
    ctx.fillStyle = vgr
    ctx.fillRect(0, 0, w, h)
}

// ── Theme picker modal ──
function openThemeModal() {
    buildThemeCards()
    document.getElementById('themeModal').classList.remove('hidden')
}
function closeThemeModal() {
    document.getElementById('themeModal').classList.add('hidden')
}

// Wire up button + close
document.getElementById('themePickerBtn').addEventListener('click', openThemeModal)
document.getElementById('themeModalClose').addEventListener('click', closeThemeModal)
document.getElementById('themeModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('themeModal')) closeThemeModal()
})

// Set button label to current theme name on load
;(() => {
    const p = THEME_PRESETS[_selectedTheme]
    const btn = document.getElementById('themePickerBtnLabel')
    if (btn && p) btn.textContent = p.label
})()

// Apply currently selected theme to the renderer
applySelectedTheme()

// Ensure startGame uses the selected theme (also covers restarts)
const originalStartGame = startGame
startGame = function() {
    applySelectedTheme()
    originalStartGame()
}
