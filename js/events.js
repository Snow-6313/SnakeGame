// events.js — all random event definitions and their apply/remove logic
// depends on: config.js, snake.js, food.js, score.js, renderer.js, ui.js
// Game.loop / Game.running are referenced from game.js (loaded after this)


//Apply: Applys the event effect
//Remove: Removes the event that was applied (8 second burts)
const EVENTS = [
    {
        name: 'SPEED BOOST',
        icon: '💨',
        duration: 5000,
        harmful: false,
        rarity: 'common',
        apply: applySpeedBoost,
        remove: removeSpeedBoost
    },
    {
        name: 'SLOW MOTION',
        icon: '🐢',
        duration: 5000,
        harmful: false,
        rarity: 'common',
        apply: applySlowMotion,
        remove: removeSlowMotion
    },
    {
        name: 'DOUBLE POINTS',
        icon: '⭐',
        duration: 6000,
        harmful: false,
        rarity: 'rare',
        apply: applyDoublePoints,
        remove: removeDoublePoints
    },
    {
        name: 'BONUS FOOD',
        icon: '🍎',
        duration: 4000,
        harmful: false,
        rarity: 'common',
        apply: applyBonusFood,
        remove: removeBonusFood
    },
    {
        name: 'GHOST MODE',
        icon: '👻',
        duration: 4000,
        harmful: false,
        rarity: 'rare',
        apply: applyGhostMode,
        remove: removeGhostMode
    },
    {
        name: 'TRIPLE POINTS',
        icon: '💎',
        duration: 5000,
        harmful: false,
        rarity: 'epic',
        apply: applyTriplePoints,
        remove: removeTriplePoints
    },
    {
        name: 'FOOD FRENZY',
        icon: '🍕',
        duration: 6000,
        harmful: false,
        rarity: 'rare',
        apply: applyFoodFrenzy,
        remove: removeFoodFrenzy
    },
    {
        name: 'INVINCIBLE',
        icon: '🛡️',
        duration: 4000,
        harmful: false,
        rarity: 'epic',
        apply: applyInvincible,
        remove: removeInvincible
    },
    {
        name: 'SHRINK',
        icon: '✂️',
        duration: 0,
        harmful: false,
        rarity: 'epic',
        apply: applyShrink,
        remove: removeShrink
    },
        {
        name: 'GROWTH',
        icon: '🐍',
        duration: 0,
        harmful: true,
        rarity: 'common',
        apply: applyGrowth,
        remove: removeGrowth
    },
    {
        name: 'MINI SNAKE',
        icon: '🔻',
        duration: 0,
        harmful: false,
        rarity: 'rare',
        apply: applyMiniSnake,
        remove: removeMiniSnake
    },
        {
        name: 'BIGGER SNAKE',
        icon: '🔺',
        duration: 0,
        harmful: true,
        rarity: 'common',
        apply: applyBiggerSnake,
        remove: removeBiggerSnake
    },
    {
        name: 'SCORE DRAIN',
        icon: '💸',
        duration: 5000,
        harmful: true,
        rarity: 'rare',
        apply: applyScoreDrain,
        remove: removeScoreDrain
    },
    {
        name: 'SCORE GROWTH',
        icon: '📈',
        duration: 5000,
        harmful: false,
        rarity: 'epic',
        apply: applyScoreGrowth,
        remove: removeScoreGrowth
    },
    {
        name: 'REVERSE CONTROLS',
        icon: '🔄',
        duration: 5000,
        harmful: true,
        rarity: 'rare',
        apply: applyReverse,
        remove: removeReverse
    },
    {
        name: 'EXPAND BOARD',
        icon: '🔲',
        duration: 0,
        harmful: false,
        rarity: 'rare',
        apply: applyExpandBoard,
        remove: removeExpandBoard
    },
    {
        name: 'SHRINK BOARD',
        icon: '📦',
        duration: 0,
        harmful: true,
        rarity: 'epic',
        apply: applyShrinkBoard,
        remove: removeShrinkBoard
    },
    {
        name: 'SPEED TRAP',
        icon: '⚡',
        duration: 4000,
        harmful: true,
        rarity: 'epic',
        apply: applySpeedTrap,
        remove: removeSpeedTrap
    },
    {
        name: 'BLIND',
        icon: '🌑',
        duration: 4000,
        harmful: true,
        rarity: 'epic',
        apply: applyBlind,
        remove: removeBlind
    },
    {
        name: 'TELEPORT',
        icon: '🌀',
        duration: 0,
        harmful: true,
        rarity: 'common',
        apply: applyTeleport,
        remove: removeTeleport
    },
    {
        name: 'POINT SURGE',
        icon: '🪄',
        duration: 0,
        harmful: false,
        rarity: 'rare',
        apply: applyPointSurge,
        remove: removePointSurge
    },
    {
        name: 'SCORE MULTIPLIER x5',
        icon: '🌟',
        duration: 4000,
        harmful: false,
        rarity: 'epic',
        apply: applyX5Points,
        remove: removeX5Points
    },
    {
        name: 'SHUFFLE FOOD',
        icon: '🌪️',
        duration: 0,
        harmful: true,
        rarity: 'rare',
        apply: applyShuffleFood,
        remove: removeShuffleFood
    },
    {
        name: 'POISON',
        icon: '💀',
        duration: 6000,
        harmful: true,
        rarity: 'epic',
        apply: applyPoison,
        remove: removePoison
    },
    {
        name: 'MOVING FOOD',
        icon: '🎯',
        duration: 6000,
        harmful: false,
        rarity: 'rare',
        apply: applyMovingFood,
        remove: removeMovingFood
    },
    {
        name: 'CHAOS',
        icon: '🎲',
        duration: 0,
        harmful: true,
        rarity: 'epic',
        apply: applyChaos,
        remove: removeChaos
    },
    {
        name: 'SWAP CONTROLS',
        icon: '🔃',
        duration: 5000,
        harmful: true,
        rarity: 'rare',
        apply: applySwapControls,
        remove: removeSwapControls
    },
    {
        name: 'LENGTH DRAIN',
        icon: '📉',
        duration: 0,
        harmful: true,
        rarity: 'rare',
        apply: applyLengthDrain,
        remove: removeLengthDrain
    },
    // ── LEGENDARY beneficial events ──
    {
        name: 'GOLDEN HOUR',
        icon: '👑',
        duration: 8000,
        harmful: false,
        rarity: 'legendary',
        apply: applyGoldenHour,
        remove: removeGoldenHour
    },
    {
        name: 'SCORE JACKPOT',
        icon: '💰',
        duration: 0,
        harmful: false,
        rarity: 'legendary',
        apply: applyScoreJackpot,
        remove: removeScoreJackpot
    },
    {
        name: 'FULL SEND',
        icon: '🔥',
        duration: 8000,
        harmful: false,
        rarity: 'legendary',
        apply: applyFullSend,
        remove: removeFullSend
    },
    {
        name: 'TIME STOP',
        icon: '⏸️',
        duration: 5000,
        harmful: false,
        rarity: 'legendary',
        apply: applyTimeStop,
        remove: removeTimeStop
    },
    {
        name: 'FEAST',
        icon: '🍽️',
        duration: 0,
        harmful: false,
        rarity: 'legendary',
        apply: applyFeast,
        remove: removeFeast
    },
    // ── EPIC harmful events ──
    {
        name: 'LENGTH SURGE',
        icon: '📶',
        duration: 0,
        harmful: false,
        rarity: 'epic',
        apply: applyLengthSurge,
        remove: removeLengthSurge
    },
    {
        name: 'MULTIPLIER FREEZE',
        icon: '🧊',
        duration: 6000,
        harmful: true,
        rarity: 'epic',
        apply: applyMultFreeze,
        remove: removeMultFreeze
    },
    {
        name: 'MULTIPLIER BOOST',
        icon: '🚀',
        duration: 6000,
        harmful: false,
        rarity: 'epic',
        apply: applyMultBoost,
        remove: removeMultBoost
    },
    // ── NEW EVENTS ──
    {
        name: 'MAGNET',
        icon: '🧲',
        duration: 6000,
        harmful: false,
        rarity: 'rare',
        apply: applyMagnet,
        remove: removeMagnet
    },
    {
        name: 'FREEZE GROWTH',
        icon: '❄️',
        duration: 5000,
        harmful: false,
        rarity: 'rare',
        apply: applyFreezeGrowth,
        remove: removeFreezeGrowth
    },
    {
        name: 'BOMB FOOD',
        icon: '💥',
        duration: 8000,
        harmful: true,
        rarity: 'epic',
        apply: applyBombFood,
        remove: removeBombFood
    },
    {
        name: 'DASH',
        icon: '🏃',
        duration: 5000,
        harmful: true,
        rarity: 'epic',
        apply: applyDash,
        remove: removeDash
    },
    {
        name: 'MYSTERY BOX',
        icon: '🎁',
        duration: 0,
        harmful: false,
        rarity: 'rare',
        apply: applyMysteryBox,
        remove: removeMysteryBox
    },
    {
        name: 'FOOD SWAP',
        icon: '🔀',
        duration: 0,
        harmful: true,
        rarity: 'epic',
        apply: applyFoodSwap,
        remove: removeFoodSwap
    },
    {
        name: 'MIRROR BOARD',
        icon: '🪞',
        duration: 7000,
        harmful: true,
        rarity: 'epic',
        apply: applyMirrorBoard,
        remove: removeMirrorBoard
    },
    // ── NEW LEGENDARY EVENTS ──
    {
        name: 'ALL SEEING EYE',
        icon: '🔮',
        duration: 0,
        harmful: false,
        rarity: 'legendary',
        apply: applyAllSeeingEye,
        remove: removeAllSeeingEye
    },
    {
        name: "THE DEVIL'S GLARE",
        icon: '😈',
        duration: 0,
        harmful: true,
        rarity: 'legendary',
        apply: applyDevilsGlare,
        remove: removeDevilsGlare
    },
    {
        name: "GOD'S EYE",
        icon: '👁️',
        duration: 0,
        harmful: false,
        rarity: 'legendary',
        apply: applyGodsEye,
        remove: removeGodsEye
    },
    // ── COMMON ──
    {
        name: 'LOOP BOARD',
        icon: '🔁',
        duration: 6000,
        harmful: false,
        rarity: 'common',
        apply: applyLoopBoard,
        remove: removeLoopBoard
    },
    // ── RARE ──
    {
        name: 'WALL MAZE',
        icon: '🧱',
        duration: 8000,
        harmful: true,
        rarity: 'rare',
        apply: applyWallMaze,
        remove: removeWallMaze
    },
    {
        name: 'FAKE FOOD',
        icon: '🪤',
        duration: 6000,
        harmful: true,
        rarity: 'rare',
        apply: applyFakeFood,
        remove: removeFakeFood
    },
    // ── EPIC ──
    {
        name: 'TICKING TIME BOMB',
        icon: '💣',
        duration: 5000,
        harmful: true,
        rarity: 'epic',
        apply: applyTickingBomb,
        remove: removeTickingBomb
    },
    {
        name: 'GAMBLE',
        icon: '🎰',
        duration: 0,
        harmful: false,
        rarity: 'epic',
        apply: applyGamble,
        remove: removeGamble
    },
    {
        name: 'REWIND',
        icon: '⏪',
        duration: 0,
        harmful: false,
        rarity: 'epic',
        apply: applyRewind,
        remove: removeRewind
    },
    // ── LEGENDARY ──
    {
        name: 'PRISMATIC',
        icon: '🌈',
        duration: 8000,
        harmful: false,
        rarity: 'legendary',
        apply: applyPrismatic,
        remove: removePrismatic
    },
    {
        name: 'DIVINE TRADE',
        icon: '👼',
        duration: 0,
        harmful: false,
        rarity: 'legendary',
        apply: applyDivineTrade,
        remove: removeDivineTrade
    },
    {
        name: 'GRAVITY FLIP',
        icon: '🪐',
        duration: 6000,
        harmful: true,
        rarity: 'legendary',
        apply: applyGravityFlip,
        remove: removeGravityFlip
    },
    // ── MYTHIC (1% chance, once per session) ──
    {
        name: 'COSMIC JACKPOT',
        icon: '🌠',
        duration: 0,
        harmful: false,
        rarity: 'mythic',
        apply: applyCosmicJackpot,
        remove: removeCosmicJackpot
    }
]

// --- apply / remove functions ---
// reference plain vars/functions from game.js (score, pointMult, gameLoop, etc.)

function applySpeedBoost() {
    currentSpeed = speedFast
}
function removeSpeedBoost() {
    if (gameRunning) currentSpeed = speedNormal
}

function applySlowMotion() {
    currentSpeed = speedSlow
}
function removeSlowMotion() {
    if (gameRunning) currentSpeed = speedNormal
}

function applyDoublePoints() { pointMult = 2 }
function removeDoublePoints() { pointMult = 1 }

function applyBonusFood() { Food.placeBonus() }
function removeBonusFood() { Food.clearBonus() }

function applyGhostMode() { Snake.ghostMode = true }
function removeGhostMode() { Snake.ghostMode = false }

function applyShrink() {
    if (Snake.body.length > 3) Snake.cutToLength(Math.floor(Snake.body.length / 2))
    setMessage('✂️ SHRINK — your snake got cut in half!')
}
function removeShrink() {}

function applyGrowth() {
    const tail = Snake.body[Snake.body.length - 1]
    for (let i = 0; i < 5; i++) Snake.body.push({ ...tail })
    setMessage('🐍 GROWTH — your snake got longer!')
}
function removeGrowth() {}

function applyScoreDrain() {
    clearInterval(drainInterval)
    drainInterval = setInterval(function() {
        if (!gameRunning) { clearInterval(drainInterval); return }
        score = Math.max(0, score - 3)
        scoreDisplay.textContent = score
        setMessage('💸 SCORE DRAIN — losing 3 pts/sec!')
    }, 1000)
}
function removeScoreDrain() { clearInterval(drainInterval) }

function applyScoreGrowth() {
    clearInterval(drainInterval)
    drainInterval = setInterval(function() {
        if (!gameRunning) { clearInterval(drainInterval); return }
        score += 3
        scoreDisplay.textContent = score
        setMessage('📈 SCORE GROWTH — gaining 3 pts/sec!')
    }, 1000)
}
function removeScoreGrowth() { clearInterval(drainInterval) }

function applyReverse() {
    Snake.reversedControls = true
    setMessage('🔄 REVERSE CONTROLS — controls are flipped!')
}
function removeReverse() { Snake.reversedControls = false }

function applySpeedTrap() {
    currentSpeed = 55
}
function removeSpeedTrap() {
    if (gameRunning) currentSpeed = speedNormal
}

function applyTriplePoints() { pointMult = 3 }
function removeTriplePoints() { pointMult = 1 }

function applyFoodFrenzy() {
    Food.placeBonus(); Food.placeBonus(); Food.placeBonus()
    setMessage('🍕 FOOD FRENZY — 3 bonus foods spawned!')
}
function removeFoodFrenzy() { Food.clearBonus() }

function applyInvincible() { Snake.invincible = true }
function removeInvincible() { Snake.invincible = false }

function applyMiniSnake() {
    Snake.cutToLength(3)
    setMessage('🔻 MINI SNAKE — cut down to 3 blocks!')
}
function removeMiniSnake() {}

function applyBiggerSnake() {
    const tail = Snake.body[Snake.body.length - 1]
    for (let i = 0; i < 3; i++) Snake.body.push({ ...tail })
    setMessage('🔺 BIGGER SNAKE — gained 3 extra blocks!')
}
function removeBiggerSnake() {}

function applyBlind() { Renderer.blindMode = true }
function removeBlind() { Renderer.blindMode = false }

function applyTeleport() {
    // Handled by triggerRandomEvent when a pre-picked tile is available.
    // This fallback fires only when called outside the warning flow.
    if (typeof pendingTeleportTile !== 'undefined' && pendingTeleportTile) {
        Snake.body[0].x = pendingTeleportTile.x
        Snake.body[0].y = pendingTeleportTile.y
        pendingTeleportTile = null
        setMessage('🌀 TELEPORT — your head got moved!')
        return
    }
    const dest = pickTeleportDest()
    Snake.body[0].x = dest.x
    Snake.body[0].y = dest.y
    setMessage('🌀 TELEPORT — your head got moved!')
}
function removeTeleport() {}

function applyExpandBoard() {
    const newCols = Math.min(Cols + 5, 35)
    const newRows = Math.min(Rows + 5, 35)
    setMessage('🔲 EXPAND BOARD incoming — green = new space!')

    let elapsed = 0
    const showMs = 1200
    boardAnimInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(boardAnimInterval); boardAnimInterval = null; return }
        Renderer.drawFrame()
        Renderer.drawGainOverlay(Cols, Rows, newCols, newRows, 'rgba(78,201,78,0.35)')
        elapsed += 80
        if (elapsed >= showMs) {
            clearInterval(boardAnimInterval); boardAnimInterval = null
            Cols = newCols
            Rows = newRows
            Renderer.resizeCanvas()
            Food.place()
            setMessage('🔲 EXPAND BOARD — more space!')
        }
    }, 80)
}
function removeExpandBoard() {}

function applyShrinkBoard() {
    const newCols = Math.max(Cols - 5, 10)
    const newRows = Math.max(Rows - 5, 10)
    setMessage('📦 SHRINK BOARD incoming — RED zone is being cut!')

    let elapsed = 0
    const showMs = 1500
    boardAnimInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(boardAnimInterval); boardAnimInterval = null; return }
        Renderer.drawFrame()
        Renderer.drawDangerOverlay(newCols, newRows, 'rgba(220,30,0,0.45)')
        elapsed += 80
        if (elapsed >= showMs) {
            clearInterval(boardAnimInterval); boardAnimInterval = null

            const head = Snake.body[0]
            if (head.x >= newCols || head.y >= newRows) {
                Cols = newCols; Rows = newRows
                Renderer.resizeCanvas()
                endGame(); return
            }

            Snake.body = Snake.body.filter((seg, i) => i === 0 || (seg.x < newCols && seg.y < newRows))
            if (Snake.body.length < 1) { endGame(); return }

            Cols = newCols; Rows = newRows
            if (Food.main.x >= Cols || Food.main.y >= Rows) Food.place()
            Food.bonus = Food.bonus.map(b =>
                (b.x < Cols && b.y < Rows) ? b : Food._empty()
            )

            Renderer.resizeCanvas()
            setMessage('📦 SHRINK BOARD — segments in red zone removed!')
        }
    }, 80)
}
function removeShrinkBoard() {}

// --- NEW EVENTS ---

// POINT SURGE — instantly grants +25 points
function applyPointSurge() {
    score += 25
    scoreDisplay.textContent = score
    if (score > highScore) { highScore = score; highScoreDisplay.textContent = highScore; localStorage.setItem('snakeHighScore', highScore) }
    setMessage('🪄 POINT SURGE — +25 points!')
}
function removePointSurge() {}

// SCORE MULTIPLIER x5 — short burst of 5x points
function applyX5Points() { pointMult = 5; setMessage('🌟 x5 MULTIPLIER — score everything!') }
function removeX5Points() { pointMult = 1 }

// SHUFFLE FOOD — relocates all food instantly
function applyShuffleFood() {
    Food.place()
    Food.bonus = Food.bonus.map(() => Food._empty())
    setMessage('🌪️ SHUFFLE FOOD — food moved!')
}
function removeShuffleFood() {}

// POISON — snake loses 1 segment every 1.5 seconds
let poisonInterval = null
function applyPoison() {
    clearInterval(poisonInterval)
    poisonInterval = setInterval(function() {
        if (!gameRunning) { clearInterval(poisonInterval); return }
        if (Snake.body.length > 3) {
            Snake.body.pop()
            setMessage('💀 POISON — losing segments!')
        }
    }, 1500)
}
function removePoison() { clearInterval(poisonInterval) }

// MOVING FOOD — main food drifts 1 tile in a random direction every second
let movingFoodInterval = null
function applyMovingFood() {
    setMessage('🎯 MOVING FOOD — food is on the move!')
    clearInterval(movingFoodInterval)
    movingFoodInterval = setInterval(function() {
        if (!gameRunning) { clearInterval(movingFoodInterval); return }
        const dirs = [{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}]
        const d = dirs[Math.floor(Math.random() * dirs.length)]
        const nx = Food.main.x + d.x
        const ny = Food.main.y + d.y
        if (nx >= 0 && nx < Cols && ny >= 0 && ny < Rows) {
            Food.main.x = nx; Food.main.y = ny
        }
    }, 1000)
}
function removeMovingFood() { clearInterval(movingFoodInterval) }

// CHAOS — triggers 2 random events back-to-back (excluding CHAOS itself)
function applyChaos() {
    setMessage('🎲 CHAOS — double event incoming!')
    const pool = EVENTS.filter(e => e.name !== 'CHAOS')
    for (let i = 0; i < 2; i++) {
        const ev = pool[Math.floor(Math.random() * pool.length)]
        ev.apply()
    }
}
function removeChaos() {}

// SWAP CONTROLS — swaps left↔right and up↔down (different from full reverse)
function applySwapControls() {
    Snake.swappedControls = true
    setMessage('🔃 SWAP CONTROLS — up/down and left/right are swapped!')
}
function removeSwapControls() { Snake.swappedControls = false }

// LENGTH SURGE — instantly bumps the snake up a full multiplier tier (+5 segments worth)
function applyLengthSurge() {
    const tail = Snake.body[Snake.body.length - 1]
    for (let i = 0; i < 5; i++) Snake.body.push({ ...tail })
    setMessage('📶 LENGTH SURGE — multiplier tier jumped up!')
}
function removeLengthSurge() {}

// MULTIPLIER FREEZE — locks the length multiplier at 1x for the duration
function applyMultFreeze() {
    Snake.multFrozen = true
    lengthMultFill.classList.add('drained')
    setMessage('🧊 MULTIPLIER FREEZE — length bonus locked at 1x!')
}
function removeMultFreeze() {
    Snake.multFrozen = false
    lengthMultFill.classList.remove('drained')
}

// MULTIPLIER BOOST — doubles the length multiplier for the duration
function applyMultBoost() {
    Snake.multBoosted = true
    setMessage('🚀 MULTIPLIER BOOST — length bonus doubled!')
}
function removeMultBoost() { Snake.multBoosted = false }

// LENGTH DRAIN — cuts 5 segments off (drops one multiplier tier)
function applyLengthDrain() {
    if (Snake.body.length > 8) {
        Snake.body.splice(Snake.body.length - 5, 5)
    } else if (Snake.body.length > 3) {
        Snake.cutToLength(3)
    }
    setMessage('📉 LENGTH DRAIN — lost a multiplier tier!')
}
function removeLengthDrain() {}

// ── LEGENDARY EVENTS ──

// GOLDEN HOUR — x10 points + ghost mode + invincible for 8s
function applyGoldenHour() {
    pointMult = 10
    Snake.ghostMode = true
    Snake.invincible = true
    setMessage('👑 GOLDEN HOUR — x10 points, ghost & invincible!')
}
function removeGoldenHour() {
    pointMult = 1
    Snake.ghostMode = false
    Snake.invincible = false
}

// SCORE JACKPOT — instantly grants +200 points
function applyScoreJackpot() {
    score += 200
    scoreDisplay.textContent = score
    if (score > highScore) { highScore = score; highScoreDisplay.textContent = highScore; localStorage.setItem('snakeHighScore', highScore) }
    setMessage('💰 SCORE JACKPOT — +200 points, just like that!')
}
function removeScoreJackpot() {}

// FULL SEND — ultra fast speed + x5 points + 5 bonus foods spawned for 8s
function applyFullSend() {
    currentSpeed = 60
    pointMult = 5
    for (let i = 0; i < 5; i++) Food.placeBonus()
    fullSendFoodInterval = setInterval(function() {
        if (!gameRunning) { clearInterval(fullSendFoodInterval); return }
        Food.placeBonus()
    }, 1500)
    setMessage('🔥 FULL SEND — FAST + x5 pts + food storm!')
}
function removeFullSend() {
    clearInterval(fullSendFoodInterval)
    if (gameRunning) currentSpeed = speedNormal
    pointMult = 1
    Food.clearBonus()
}

// TIME STOP — pauses the event interval so no new bad events can trigger for 5s
function applyTimeStop() {
    clearInterval(eventInterval)
    eventInterval = null
    setMessage('⏸️ TIME STOP — no new events for 5 seconds!')
}
function removeTimeStop() {
    if (gameRunning) eventInterval = setInterval(triggerRandomEvent, 8000)
    setMessage('⏸️ TIME STOP ended — events resume!')
}

// FEAST — spawns 8 bonus foods and gives +50 points instantly
function applyFeast() {
    for (let i = 0; i < 8; i++) Food.placeBonus()
    score += 50
    scoreDisplay.textContent = score
    if (score > highScore) { highScore = score; highScoreDisplay.textContent = highScore; localStorage.setItem('snakeHighScore', highScore) }
    setMessage('🍽️ FEAST — 8 bonus foods + 50 pts, eat up!')
}
function removeFeast() {}

// ── NEW EVENTS ──

// MAGNET — food is pulled 1 tile toward the snake head each second
let magnetInterval = null
function applyMagnet() {
    setMessage('🧲 MAGNET — food is being pulled toward you!')
    clearInterval(magnetInterval)
    magnetInterval = setInterval(function() {
        if (!gameRunning) { clearInterval(magnetInterval); return }
        const head = Snake.body[0]
        // Pull main food 1 step toward head
        const dx = Math.sign(head.x - Food.main.x)
        const dy = Math.sign(head.y - Food.main.y)
        // Move along whichever axis has more distance (avoids diagonal)
        const adx = Math.abs(head.x - Food.main.x)
        const ady = Math.abs(head.y - Food.main.y)
        if (adx === 0 && ady === 0) return
        if (adx >= ady) Food.main.x += dx
        else            Food.main.y += dy
    }, 500)
}
function removeMagnet() { clearInterval(magnetInterval) }

// FREEZE GROWTH — eating food scores points but the snake doesn't grow
function applyFreezeGrowth() {
    Snake.frozenGrowth = true
    setMessage('❄️ FREEZE GROWTH — eating scores but you won\'t grow!')
}
function removeFreezeGrowth() { Snake.frozenGrowth = false }

// BOMB FOOD — 8 bombs scatter the board (4 disguised as normal food) + 6 real bonus
// foods flood the board so the player can't easily track which are which
function applyBombFood() {
    Food.bombs = []
    // 4 disguised (look exactly like real food), 4 obvious skulls
    // Use _emptyAvoidFood() so no bomb lands on top of existing food
    for (let i = 0; i < 8; i++) {
        const t = Food._emptyAvoidFood()
        t.disguised = (i < 4)
        Food.bombs.push(t)
    }
    // 6 extra disguised bombs flood the board — ALL harmful, none give points
    for (let i = 0; i < 6; i++) {
        const t = Food._emptyAvoidFood()
        t.disguised = true
        Food.bombs.push(t)
    }
    setMessage('💥 BOMB FOOD — the board is mined! Some look just like normal food!')
}
function removeBombFood() {
    Food.bombs = []
}

// DASH — every other game tick the snake moves an extra step automatically
let dashInterval = null
function applyDash() {
    setMessage('🏃 DASH — extra steps firing every tick!')
    clearInterval(dashInterval)
    dashInterval = setInterval(function() {
        if (!gameRunning) { clearInterval(dashInterval); return }
        // Fire an extra move without the normal tick delay
        const result = Snake.step()
        if (result.hitWall || result.hitSelf) { endGame(); return }
        const head = Snake.body[0]
        let ate = false
        if (head.x === Food.main.x && head.y === Food.main.y) {
            onEat()
            const lm = getLengthMult()
            setMessage('+' + addScore(10) + ' pts! (🏃 dash)')
            Food.place(); playEatSound(); ate = true
        }
        for (let i = Food.bonus.length - 1; i >= 0; i--) {
            if (head.x === Food.bonus[i].x && head.y === Food.bonus[i].y) {
                setMessage('+' + addScore(25) + ' BONUS! (🏃 dash)')
                Food.bonus.splice(i, 1); playEatSound(); ate = true
            }
        }
        if (!ate) Snake.removeTail()
        updateLengthMultBar()
        Renderer.drawFrame()
        if (score >= winTarget) triggerWin()
    }, speedNormal * 1.5)
}
function removeDash() { clearInterval(dashInterval) }

// MYSTERY BOX — a rainbow ? tile appears on the board; eating it gives a random reward
function applyMysteryBox() {
    Food.mysteryBox = Food._empty()
    setMessage('🎁 MYSTERY BOX — a rainbow tile appeared! Eat it for a surprise!')
}
function removeMysteryBox() { Food.mysteryBox = null }

// Called from game.js when the snake eats the mystery box tile
function triggerMysteryBoxReward() {
    const roll = Math.random()
    if (roll < 0.34) {
        // Random beneficial event
        const pool = EVENTS.filter(e => !e.harmful && e.name !== 'MYSTERY BOX' && e.duration > 0)
        const ev = pool[Math.floor(Math.random() * pool.length)]
        setMessage('🎁 MYSTERY BOX — ' + ev.icon + ' ' + ev.name + '!')
        showEventBanner(ev.icon, ev.name, false, ev.rarity)
        ev.apply()
        if (ev.duration > 0) {
            startTimerBar(ev.duration, false)
            setTimeout(() => { ev.remove(); hideEventBanner() }, ev.duration)
        }
    } else if (roll < 0.67) {
        // Big point bonus
        const bonus = 50 + Math.floor(Math.random() * 100)
        score += bonus
        scoreDisplay.textContent = score
        if (score > highScore) { highScore = score; highScoreDisplay.textContent = highScore; localStorage.setItem('snakeHighScore', highScore) }
        setMessage('🎁 MYSTERY BOX — +' + bonus + ' points!')
        showEventBanner('🎁', 'MYSTERY BONUS', false, 'rare')
        setTimeout(hideEventBanner, 1500)
    } else {
        // Max out length multiplier
        const { maxTier, tierSize } = getLengthMultConfig()
        const targetLen = 3 + maxTier * tierSize
        const tail = Snake.body[Snake.body.length - 1]
        while (Snake.body.length < targetLen) Snake.body.push({ ...tail })
        setMessage('🎁 MYSTERY BOX — 🐍 LENGTH MAXED OUT!')
        showEventBanner('🎁', 'LENGTH MAXED', false, 'legendary')
        setTimeout(hideEventBanner, 2000)
        updateLengthMultBar()
    }
}

// FOOD SWAP — snake head and main food positions swap
function applyFoodSwap() {
    const head = Snake.body[0]
    const fx = Food.main.x, fy = Food.main.y
    Food.main.x = head.x; Food.main.y = head.y
    head.x = fx; head.y = fy
    setMessage('🔀 FOOD SWAP — you and the food switched places!')
}
function removeFoodSwap() {}

// MIRROR BOARD — canvas is flipped horizontally: left looks right, right looks left
// The snake's actual direction is also mirrored so movement input feels backwards visually
function applyMirrorBoard() {
    Snake.mirrorBoard = true
    setMessage('🪞 MIRROR BOARD — the screen is flipped! Left is right, right is left!')
}
function removeMirrorBoard() {
    Snake.mirrorBoard = false
    Renderer.drawFrame()   // force a clean unmirrored redraw immediately
}

// ── ALL SEEING EYE — reveals the upcoming event queue panel ──
function applyAllSeeingEye() {
    window._allSeeingEyeActive = true
    renderUpcomingPanel()
    document.getElementById('upcomingPanel').classList.remove('hidden')
    setMessage('🔮 ALL SEEING EYE — next 5 events revealed!')
}
function removeAllSeeingEye() {
    window._allSeeingEyeActive = false
    document.getElementById('upcomingPanel').classList.add('hidden')
}

// ── THE DEVIL'S GLARE — next 3 events fire in rapid succession (3s apart) ──
let _devilsGlareTimeout = null
function applyDevilsGlare() {
    setMessage("😈 THE DEVIL'S GLARE — 3 events incoming fast!")
    let fired = 0
    function fireNext() {
        if (!gameRunning || fired >= 3) return
        fired++
        triggerRandomEvent()
        if (fired < 3) _devilsGlareTimeout = setTimeout(fireNext, 3000)
    }
    _devilsGlareTimeout = setTimeout(fireNext, 500)
}
function removeDevilsGlare() {
    if (_devilsGlareTimeout) { clearTimeout(_devilsGlareTimeout); _devilsGlareTimeout = null }
}

// ── GOD'S EYE — pauses game, opens queue editor overlay ──
function applyGodsEye() {
    openGodsEyeOverlay()
}
function removeGodsEye() {}

// ── LOOP BOARD — walls wrap around pacman-style ──
function applyLoopBoard() {
    Snake.loopBoard = true
    setMessage('🔁 LOOP BOARD — walls wrap around! You can\'t die from walls.')
}
function removeLoopBoard() {
    Snake.loopBoard = false
    setMessage('🔁 LOOP BOARD ended — walls are back!')
}

// ── WALL MAZE — scatter random wall tiles on the board ──
let _mazeTiles = []
function applyWallMaze() {
    _mazeTiles = []
    const count = 6
    const occupied = new Set(Snake.body.map(s => `${s.x},${s.y}`))
    occupied.add(`${Food.main.x},${Food.main.y}`)
    for (let i = 0; i < count; i++) {
        let x, y, tries = 0
        do {
            x = Math.floor(Math.random() * Cols)
            y = Math.floor(Math.random() * Rows)
            tries++
        } while (occupied.has(`${x},${y}`) && tries < 200)
        occupied.add(`${x},${y}`)
        _mazeTiles.push({ x, y })
    }
    Food.mazeTiles = _mazeTiles
    setMessage('🧱 WALL MAZE — 6 wall tiles scattered! Avoid them!')
}
function removeWallMaze() {
    _mazeTiles = []
    Food.mazeTiles = []
    setMessage('🧱 WALL MAZE cleared.')
}

// ── FAKE FOOD — 3 decoy tiles that score nothing and don't grow the snake ──
function applyFakeFood() {
    Food.fakeFoods = []
    for (let i = 0; i < 3; i++) Food.fakeFoods.push(Food._empty())
    setMessage('🪤 FAKE FOOD — 3 decoys on the board! They look real…')
}
function removeFakeFood() {
    Food.fakeFoods = []
    setMessage('🪤 FAKE FOOD cleared.')
}

// ── TICKING TIME BOMB — eat the tile in 5s or lose pts + segments ──
let _tickingBombTimeout = null
function applyTickingBomb() {
    Food.tickingBomb = Food._emptyAvoidFood()
    Food.tickingBomb.spawnTime = Date.now()
    Food.tickingBomb.duration  = 5000
    setMessage('💣 TICKING TIME BOMB — eat it in 5 seconds!')
    _tickingBombTimeout = setTimeout(() => {
        if (Food.tickingBomb) {
            Food.tickingBomb = null
            score = Math.max(0, score - 10)
            scoreDisplay.textContent = score
            if (Snake.body.length > 5) Snake.body.splice(Snake.body.length - 2, 2)
            else if (Snake.body.length > 3) Snake.cutToLength(3)
            setMessage('💣 BOMB EXPLODED — -10 pts & -2 segments!')
            if (gameRunning) Renderer.flashBorder('#ff0000', 3)
        }
    }, 5000)
}
function removeTickingBomb() {
    if (_tickingBombTimeout) { clearTimeout(_tickingBombTimeout); _tickingBombTimeout = null }
    Food.tickingBomb = null
}

// ── GAMBLE — 50/50: big reward or big penalty ──
function applyGamble() {
    const win = Math.random() < 0.5
    if (win) {
        score += 100
        scoreDisplay.textContent = score
        if (score > highScore) { highScore = score; highScoreDisplay.textContent = highScore; localStorage.setItem('snakeHighScore', highScore) }
        const tail = Snake.body[Snake.body.length - 1]
        const addCount = Math.max(1, Math.floor(Snake.body.length))
        for (let i = 0; i < addCount; i++) Snake.body.push({ ...tail })
        setMessage('🎰 GAMBLE — YOU WIN! +100 pts & snake doubled!')
        if (gameRunning) Renderer.flashBorder('#00ff88', 4)
    } else {
        score = Math.max(0, score - 50)
        scoreDisplay.textContent = score
        Snake.cutToLength(3)
        setMessage('🎰 GAMBLE — YOU LOSE! -50 pts & shrunk to 3!')
        if (gameRunning) Renderer.flashBorder('#ff3300', 4)
    }
}
function removeGamble() {}

// ── REWIND — snake body snaps back to position 3 seconds ago ──
let _rewindHistory = []   // ring buffer of snake body snapshots — populated by gameTick() in game.js
function applyRewind() {
    // Capture snapshot now and rewind to 3s ago (or earliest available)
    if (_rewindHistory.length === 0) {
        setMessage('⏪ REWIND — no history yet!')
        return
    }
    // Pick snapshot closest to 3s ago
    const targetTime = Date.now() - 3000
    let best = _rewindHistory[0]
    for (const snap of _rewindHistory) {
        if (Math.abs(snap.ts - targetTime) < Math.abs(best.ts - targetTime)) best = snap
    }
    Snake.body = best.body.map(s => ({ ...s }))
    setMessage('⏪ REWIND — snake rewound 3 seconds!')
    if (gameRunning) Renderer.flashBorder('#00ccff', 3)
}
function removeRewind() {}

// ── PRISMATIC — each food gives a random multiplier per eat ──
function applyPrismatic() {
    Snake.prismatic = true
    setMessage('🌈 PRISMATIC — every food has a surprise multiplier!')
}
function removePrismatic() {
    Snake.prismatic = false
    pointMult = 1
}

// ── DIVINE TRADE — offer: sacrifice half score for permanent run multiplier boost ──
function applyDivineTrade() {
    if (score < 20) {
        setMessage('👼 DIVINE TRADE — score too low to trade!')
        return
    }
    gameRunning = false
    stopGameLoop()
    clearInterval(eventInterval)

    const overlay = document.createElement('div')
    overlay.id = 'divineTadeOverlay'
    overlay.style.cssText = `
        position:absolute;inset:0;background:rgba(5,10,30,0.97);
        display:flex;align-items:center;justify-content:center;z-index:460;
        font-family:Arial,sans-serif;color:#fff;text-align:center;
    `
    const half = Math.floor(score / 2)
    overlay.innerHTML = `
        <div style="background:#0d1f3c;border:2px solid #ffd700;border-radius:12px;padding:28px 28px;max-width:320px;display:flex;flex-direction:column;gap:14px;align-items:center;">
            <div style="font-size:2.2rem">👼</div>
            <div style="color:#ffd700;font-size:1.1rem;font-weight:bold;letter-spacing:1px">DIVINE TRADE</div>
            <div style="color:#ccc;font-size:0.85rem">Sacrifice <strong style="color:#ff8c00">${half} pts</strong> (half your score) to permanently boost all multipliers by +0.5× for this run?</div>
            <div style="display:flex;gap:10px;width:100%">
                <button id="divineAccept" style="flex:1;background:#ffd700;color:#000;border:none;padding:10px;border-radius:7px;font-weight:bold;cursor:pointer;font-size:0.9rem">✔ Accept</button>
                <button id="divineDecline" style="flex:1;background:#333;color:#aaa;border:1px solid #555;padding:10px;border-radius:7px;cursor:pointer;font-size:0.9rem">✕ Decline</button>
            </div>
        </div>`

    document.getElementById('canvasWrapper').appendChild(overlay)

    function resume() {
        overlay.remove()
        gameRunning  = true
        currentSpeed = currentSpeed || speedNormal
        gameLoop     = true
        startGameLoop()
        eventInterval = setInterval(triggerRandomEvent, 8000)
    }

    document.getElementById('divineAccept').onclick = () => {
        score -= half
        scoreDisplay.textContent = score
        window._divineTradeBonus = (window._divineTradeBonus || 0) + 0.5
        setMessage(`👼 DIVINE TRADE accepted! Permanent +${window._divineTradeBonus.toFixed(1)}× multiplier active.`)
        resume()
    }
    document.getElementById('divineDecline').onclick = () => {
        setMessage('👼 DIVINE TRADE declined.')
        resume()
    }
}
function removeDivineTrade() {}

// ── GRAVITY FLIP — all food drifts upward each tick ──
let _gravityInterval = null
function applyGravityFlip() {
    Snake.gravityFlip = true
    setMessage('🪐 GRAVITY FLIP — food is floating upward!')
    clearInterval(_gravityInterval)
    _gravityInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_gravityInterval); return }
        // Drift main food up 1 tile, wrap around
        Food.main.y = (Food.main.y - 1 + Rows) % Rows
        // Drift bonus foods
        for (const b of Food.bonus) b.y = (b.y - 1 + Rows) % Rows
    }, 600)
}
function removeGravityFlip() {
    Snake.gravityFlip = false
    clearInterval(_gravityInterval)
    _gravityInterval = null
    setMessage('🪐 GRAVITY FLIP ended.')
}

// ── COSMIC JACKPOT — 1% once-per-session: +2500 pts, rainbow celebration ──
let _cosmicJackpotUsed = false
let _cosmicCancelFn = null   // call this to abort the celebration early

function applyCosmicJackpot() {
    _cosmicJackpotUsed = true
    score += 2500
    scoreDisplay.textContent = score
    if (score > highScore) {
        highScore = score
        highScoreDisplay.textContent = highScore
        localStorage.setItem('snakeHighScore', highScore)
    }
    setMessage('🌠 COSMIC JACKPOT — +2500 POINTS!')
    _showCosmicCelebration()
}
function removeCosmicJackpot() {
    if (_cosmicCancelFn) { _cosmicCancelFn(); _cosmicCancelFn = null }
}

function _showCosmicCelebration() {
    // Kill any previous leak
    if (_cosmicCancelFn) { _cosmicCancelFn(); _cosmicCancelFn = null }

    const wrapper = document.getElementById('canvasWrapper')
    const cel = document.createElement('div')
    cel.id = 'cosmicCelebration'
    cel.style.cssText = `
        position:absolute;inset:0;z-index:500;
        pointer-events:none;border-radius:3px;overflow:hidden;
    `
    const c = document.createElement('canvas')
    c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'
    cel.appendChild(c)

    const txt = document.createElement('div')
    txt.style.cssText = `
        position:absolute;inset:0;display:flex;flex-direction:column;
        align-items:center;justify-content:center;gap:10px;
        font-family:Arial,sans-serif;text-align:center;pointer-events:none;
    `
    txt.innerHTML = `
        <div id="cosmicIcon" style="font-size:3.5rem;line-height:1;filter:drop-shadow(0 0 12px #fff);">🌠</div>
        <div style="font-size:1.6rem;font-weight:bold;letter-spacing:3px;
             text-shadow:0 0 20px #fff,0 0 40px #fff;color:#fff;">COSMIC JACKPOT</div>
        <div style="font-size:1.1rem;color:#fffde7;text-shadow:0 0 10px #ffd700,0 0 20px #ffd700;
             font-weight:bold;letter-spacing:2px;">+2500 POINTS</div>
        <div style="font-size:0.7rem;color:rgba(255,255,255,0.6);margin-top:4px;">✦ Once in a lifetime ✦</div>
    `
    cel.appendChild(txt)
    wrapper.appendChild(cel)

    const resize = () => { c.width = wrapper.offsetWidth; c.height = wrapper.offsetHeight }
    resize()

    const ctx = c.getContext('2d')
    let startTime = performance.now()
    const DURATION = 3200
    let cancelled = false
    let rafId = null

    // Expose cancellation — called by removeCosmicJackpot, endGame, triggerWin
    _cosmicCancelFn = () => {
        cancelled = true
        if (rafId) { cancelAnimationFrame(rafId); rafId = null }
        if (cel.parentNode) cel.remove()
        _cosmicCancelFn = null
    }

    const particles = []
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * (c.width || 560),
            y: Math.random() * (c.height || 560),
            vx: (Math.random() - 0.5) * 3,
            vy: -1 - Math.random() * 3,
            size: 2 + Math.random() * 5,
            hue: Math.random() * 360,
            alpha: 0.7 + Math.random() * 0.3,
            spin: (Math.random() - 0.5) * 0.2,
        })
    }

    function frame(now) {
        if (cancelled) return
        const elapsed = now - startTime
        const progress = elapsed / DURATION

        if (progress >= 1) {
            if (cel.parentNode) cel.remove()
            _cosmicCancelFn = null
            return
        }

        const fadeAlpha = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1
        resize()
        ctx.clearRect(0, 0, c.width, c.height)

        const hueShift = (elapsed / 20) % 360
        const grad = ctx.createLinearGradient(0, 0, c.width, c.height)
        for (let i = 0; i <= 6; i++) {
            grad.addColorStop(i / 6, `hsla(${(hueShift + i * 60) % 360},100%,55%,${0.22 * fadeAlpha})`)
        }
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, c.width, c.height)

        for (const p of particles) {
            p.x  += p.vx
            p.y  += p.vy
            p.vy += 0.04
            p.hue = (p.hue + 2) % 360
            if (p.y > c.height + 10) { p.y = -10; p.x = Math.random() * c.width; p.vy = -2 - Math.random() * 2 }
            ctx.save()
            ctx.globalAlpha = p.alpha * fadeAlpha
            ctx.translate(p.x, p.y)
            ctx.rotate(p.spin * elapsed / 16)
            ctx.fillStyle = `hsl(${p.hue},100%,72%)`
            ctx.shadowColor = `hsl(${p.hue},100%,72%)`
            ctx.shadowBlur = 8
            ctx.beginPath()
            for (let s = 0; s < 5; s++) {
                const angle = (s * 4 * Math.PI) / 5 - Math.PI / 2
                const r = s % 2 === 0 ? p.size : p.size * 0.4
                ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
            }
            ctx.closePath()
            ctx.fill()
            ctx.restore()
        }

        const rings = 4
        const cx = c.width / 2, cy = c.height / 2
        for (let r = 0; r < rings; r++) {
            const ringProgress = ((elapsed / 600 + r * 0.25) % 1)
            const ringR = ringProgress * Math.max(c.width, c.height) * 0.75
            const ringAlpha = (1 - ringProgress) * 0.35 * fadeAlpha
            ctx.save()
            ctx.strokeStyle = `hsla(${(hueShift + r * 90) % 360},100%,75%,${ringAlpha})`
            ctx.lineWidth = 3
            ctx.shadowColor = `hsl(${(hueShift + r * 90) % 360},100%,75%)`
            ctx.shadowBlur = 12
            ctx.beginPath()
            ctx.arc(cx, cy, ringR, 0, Math.PI * 2)
            ctx.stroke()
            ctx.restore()
        }

        txt.style.opacity = fadeAlpha
        const iconEl = document.getElementById('cosmicIcon')
        if (iconEl) iconEl.style.transform = `scale(${1 + 0.15 * Math.sin(elapsed / 200)})`

        rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)
}
