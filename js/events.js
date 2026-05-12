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
    },

    // ══════════════════════════════════
    // ──────── NEW EVENTS ───────────────
    // ══════════════════════════════════

    // ── COMMON ──
    {
        name: 'LUCKY CLOVER',
        icon: '🍀',
        duration: 0,
        harmful: false,
        rarity: 'common',
        apply: applyLuckyClover,
        remove: removeLuckyClover
    },
    {
        name: 'FOOD RAIN',
        icon: '🌧️',
        duration: 5000,
        harmful: false,
        rarity: 'common',
        apply: applyFoodRain,
        remove: removeFoodRain
    },
    {
        name: 'SCORE SEEP',
        icon: '🕳️',
        duration: 6000,
        harmful: true,
        rarity: 'common',
        apply: applyScoreSeep,
        remove: removeScoreSeep
    },

    // ── RARE ──
    {
        name: 'ANTIDOTE',
        icon: '💉',
        duration: 0,
        harmful: false,
        rarity: 'rare',
        apply: applyAntidote,
        remove: removeAntidote
    },
    {
        name: 'ELIXIR',
        icon: '🧪',
        duration: 8000,
        harmful: false,
        rarity: 'rare',
        apply: applyElixir,
        remove: removeElixir
    },
    {
        name: 'FLAT BONUS',
        icon: '💵',
        duration: 7000,
        harmful: false,
        rarity: 'rare',
        apply: applyFlatBonus,
        remove: removeFlatBonus
    },
    {
        name: 'CARNIVAL',
        icon: '🎡',
        duration: 7000,
        harmful: false,
        rarity: 'rare',
        apply: applyCarnival,
        remove: removeCarnival
    },
    {
        name: 'LEECH',
        icon: '🩸',
        duration: 6000,
        harmful: true,
        rarity: 'rare',
        apply: applyLeech,
        remove: removeLeech
    },
    {
        name: 'MUDDY GROUND',
        icon: '🟫',
        duration: 6000,
        harmful: true,
        rarity: 'rare',
        apply: applyMuddyGround,
        remove: removeMuddyGround
    },

    // ── EPIC ──
    {
        name: 'OVERDRIVE',
        icon: '🏎️',
        duration: 5000,
        harmful: false,
        rarity: 'epic',
        apply: applyOverdrive,
        remove: removeOverdrive
    },
    {
        name: 'ERUPTION',
        icon: '🌋',
        duration: 8000,
        harmful: true,
        rarity: 'epic',
        apply: applyEruption,
        remove: removeEruption
    },
    {
        name: 'STREAK LOCK',
        icon: '🔐',
        duration: 6000,
        harmful: false,
        rarity: 'epic',
        apply: applyStreakLock,
        remove: removeStreakLock
    },
    {
        name: 'TRIDENT',
        icon: '🔱',
        duration: 7000,
        harmful: false,
        rarity: 'epic',
        apply: applyTrident,
        remove: removeTrident
    },
    {
        name: 'CORPSE WALK',
        icon: '🧟',
        duration: 5000,
        harmful: true,
        rarity: 'epic',
        apply: applyCorpseWalk,
        remove: removeCorpseWalk
    },
    {
        name: 'SCORE FREEZE',
        icon: '🥶',
        duration: 5000,
        harmful: true,
        rarity: 'epic',
        apply: applyScoreFreeze,
        remove: removeScoreFreeze
    },

    // ── LEGENDARY ──
    {
        name: 'ECLIPSE',
        icon: '🌒',
        duration: 10000,
        harmful: true,
        rarity: 'legendary',
        apply: applyEclipse,
        remove: removeEclipse
    },
    {
        name: 'ECHO',
        icon: '🔊',
        duration: 8000,
        harmful: false,
        rarity: 'legendary',
        apply: applyEcho,
        remove: removeEcho
    },
    {
        name: 'NECROMANCER',
        icon: '💀',
        duration: 0,
        harmful: false,
        rarity: 'legendary',
        apply: applyNecromancer,
        remove: removeNecromancer
    },
    {
        name: 'PLAGUE',
        icon: '☣️',
        duration: 8000,
        harmful: true,
        rarity: 'legendary',
        apply: applyPlague,
        remove: removePlague
    },
    {
        name: 'WORMHOLE',
        icon: '🌀',
        duration: 10000,
        harmful: false,
        rarity: 'legendary',
        apply: applyWormhole,
        remove: removeWormhole
    },

    // ── NEW BOARD-MESSING EVENTS ──
    {
        name: 'QUAKE',
        icon: '🌍',
        duration: 6000,
        harmful: true,
        rarity: 'rare',
        apply: applyQuake,
        remove: removeQuake
    },
    {
        name: 'CELL DIVIDE',
        icon: '🔬',
        duration: 0,
        harmful: false,
        rarity: 'epic',
        apply: applyCellDivide,
        remove: removeCellDivide
    },
    {
        name: 'VOID',
        icon: '🕳️',
        duration: 8000,
        harmful: true,
        rarity: 'epic',
        apply: applyVoid,
        remove: removeVoid
    },
    {
        name: 'GRAVITY WELL',
        icon: '🌑',
        duration: 7000,
        harmful: true,
        rarity: 'rare',
        apply: applyGravityWell,
        remove: removeGravityWell
    },
    {
        name: 'SCRAMBLE',
        icon: '🌀',
        duration: 0,
        harmful: true,
        rarity: 'rare',
        apply: applyScramble,
        remove: removeScramble
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
            const ringProgress = (((elapsed / 600 + r * 0.25) % 1) + 1) % 1
            const ringR = Math.max(0, ringProgress * Math.max(c.width, c.height) * 0.75)
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

// ══════════════════════════════════════════════════════════════════════════════
// ── NEW EVENT IMPLEMENTATIONS ─────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

// ── COMMON ──

// LUCKY CLOVER — 3 green clover tiles appear. Eating one grants +30 pts and a tiny speed buff for 1.5s.
function applyLuckyClover() {
    Food.luckyClovers = []
    for (let i = 0; i < 3; i++) Food.luckyClovers.push(Food._emptyAvoidFood())
    setMessage('🍀 LUCKY CLOVER — 3 clovers on the board! Each is worth +30 pts!')
}
function removeLuckyClover() { Food.luckyClovers = [] }

// FOOD RAIN — a new bonus food drops every 1.2s for 5s (up to 4 extra)
let _foodRainInterval = null
function applyFoodRain() {
    setMessage('🌧️ FOOD RAIN — bonus food is raining down!')
    clearInterval(_foodRainInterval)
    let drops = 0
    _foodRainInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_foodRainInterval); return }
        Food.placeBonus()
        drops++
        if (drops >= 4) { clearInterval(_foodRainInterval); _foodRainInterval = null }
    }, 1200)
}
function removeFoodRain() {
    clearInterval(_foodRainInterval); _foodRainInterval = null
    Food.clearBonus()
}

// SCORE SEEP — score leaks 1 pt every 0.4 seconds (faster drain, smaller chunks)
let _scoreSeepInterval = null
function applyScoreSeep() {
    clearInterval(_scoreSeepInterval)
    _scoreSeepInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_scoreSeepInterval); return }
        score = Math.max(0, score - 1)
        scoreDisplay.textContent = score
        setMessage('🕳️ SCORE SEEP — your score is leaking!')
    }, 400)
}
function removeScoreSeep() { clearInterval(_scoreSeepInterval); _scoreSeepInterval = null }

// ── RARE ──

// ANTIDOTE — instantly clears all active negative effects and resets speed to normal
function applyAntidote() {
    // Cancel any ongoing harmful intervals
    clearInterval(drainInterval)
    clearInterval(poisonInterval)
    if (typeof _scoreSeepInterval !== 'undefined') { clearInterval(_scoreSeepInterval); _scoreSeepInterval = null }
    if (typeof _leechInterval !== 'undefined') { clearInterval(_leechInterval); _leechInterval = null }
    Snake.reversedControls = false
    Snake.swappedControls  = false
    Snake.multFrozen       = false
    Snake.mirrorBoard      = false
    if (currentSpeed < speedNormal) currentSpeed = speedNormal
    Food.bombs       = []
    Food.fakeFoods   = []
    Food.eruptionTiles = []
    Renderer.blindMode = false
    setMessage('💉 ANTIDOTE — all negative effects cleared!')
    if (gameRunning) Renderer.flashBorder('#00ff88', 3)
}
function removeAntidote() {}

// ELIXIR — temporarily gives ghost mode + doubles streak multiplier for 8s
function applyElixir() {
    Snake.ghostMode = true
    Snake.elixirActive = true
    setMessage('🧪 ELIXIR — Ghost Mode + double streak for 8s!')
}
function removeElixir() {
    Snake.ghostMode = false
    Snake.elixirActive = false
}

// FLAT BONUS — every food eaten gives an extra flat +15 pts on top of all multipliers for 7s
function applyFlatBonus() {
    Snake.flatBonus = 15
    setMessage('💵 FLAT BONUS — +15 bonus pts on every food for 7s!')
}
function removeFlatBonus() { Snake.flatBonus = 0 }

// CARNIVAL — score multiplier randomly bounces between 1x–4x every 1.5s for 7s
let _carnivalInterval = null
function applyCarnival() {
    setMessage('🎡 CARNIVAL — multiplier is spinning like a wheel!')
    clearInterval(_carnivalInterval)
    _carnivalInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_carnivalInterval); return }
        const opts = [1, 1.5, 2, 2.5, 3, 4]
        pointMult = opts[Math.floor(Math.random() * opts.length)]
        setMessage(`🎡 CARNIVAL — spin! Now at ${pointMult}×!`)
    }, 1500)
}
function removeCarnival() {
    clearInterval(_carnivalInterval); _carnivalInterval = null
    pointMult = 1
}

// LEECH — your current streak is drained 1 count per second (makes streak building harder)
let _leechInterval = null
function applyLeech() {
    setMessage('🩸 LEECH — your streak is being drained!')
    clearInterval(_leechInterval)
    _leechInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_leechInterval); return }
        if (foodStreak > 0) {
            foodStreak = Math.max(0, foodStreak - 1)
            streakMult = 1 + Math.floor(foodStreak / 3) * 0.5
            if (foodStreak >= 3) {
                streakCountEl.textContent = foodStreak
                streakMultEl.textContent  = streakMult.toFixed(1) + 'x'
            } else {
                streakDisplay.classList.add('hidden')
            }
        }
    }, 1000)
}
function removeLeech() { clearInterval(_leechInterval); _leechInterval = null }

// MUDDY GROUND — moves snake at 70% of normal speed AND disables input queue (only 1 dir change buffered)
function applyMuddyGround() {
    currentSpeed = Math.round(speedNormal * 1.65)
    Snake.muddyGround = true
    setMessage('🟫 MUDDY GROUND — everything is slower, movement is sluggish!')
}
function removeMuddyGround() {
    if (gameRunning) currentSpeed = speedNormal
    Snake.muddyGround = false
}

// ── EPIC ──

// OVERDRIVE — speed increases every second until insane; multiplier scales up too
let _overdriveInterval = null
let _overdriveStack = 0
function applyOverdrive() {
    _overdriveStack = 0
    setMessage('🏎️ OVERDRIVE — speed ramping up each second! Score too!')
    clearInterval(_overdriveInterval)
    _overdriveInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_overdriveInterval); return }
        _overdriveStack = Math.min(_overdriveStack + 1, 5)
        currentSpeed = Math.max(50, speedNormal - _overdriveStack * 18)
        pointMult    = 1 + _overdriveStack * 0.5
        setMessage(`🏎️ OVERDRIVE — speed level ${_overdriveStack}, ${pointMult.toFixed(1)}× pts!`)
    }, 1000)
}
function removeOverdrive() {
    clearInterval(_overdriveInterval); _overdriveInterval = null
    _overdriveStack = 0
    if (gameRunning) currentSpeed = speedNormal
    pointMult = 1
}

// ERUPTION — 10 lava wall tiles are scattered on the board; touching one = instant death
let _eruptionTiles = []
function applyEruption() {
    _eruptionTiles = []
    const occupied = new Set(Snake.body.map(s => `${s.x},${s.y}`))
    occupied.add(`${Food.main.x},${Food.main.y}`)
    for (let i = 0; i < 10; i++) {
        let x, y, tries = 0
        do { x = Math.floor(Math.random() * Cols); y = Math.floor(Math.random() * Rows); tries++ }
        while (occupied.has(`${x},${y}`) && tries < 300)
        occupied.add(`${x},${y}`)
        _eruptionTiles.push({ x, y })
    }
    Food.eruptionTiles = _eruptionTiles
    setMessage('🌋 ERUPTION — 10 lava tiles scattered! Avoid them or die!')
}
function removeEruption() {
    _eruptionTiles = []
    Food.eruptionTiles = []
    setMessage('🌋 ERUPTION cooled down.')
}

// STREAK LOCK — freezes your current streak counter so it cannot reset for 6s
function applyStreakLock() {
    Snake.streakFrozen = true
    setMessage('🔐 STREAK LOCK — your streak is locked in, it can\'t reset!')
}
function removeStreakLock() { Snake.streakFrozen = false }

// TRIDENT — eating food spawns 2 extra bonus foods instantly (triple harvest for 7s)
function applyTrident() {
    Snake.tridentActive = true
    setMessage('🔱 TRIDENT — every food you eat spawns 2 extra bonus tiles!')
}
function removeTrident() { Snake.tridentActive = false }

// CORPSE WALK — dead segments re-appear as hazard walls at random positions every 1.5s
let _corpseInterval = null
function applyCorpseWalk() {
    setMessage('🧟 CORPSE WALK — ghost segments haunt the board!')
    // Hazard tiles are rendered as fake food (slightly different colour via fakeFoods array)
    clearInterval(_corpseInterval)
    let spawned = 0
    _corpseInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_corpseInterval); return }
        if (spawned < 6) {
            const t = Food._emptyAvoidFood()
            Food.fakeFoods.push(t)   // reuse fakeFoods as ghost hazard tiles
            spawned++
        }
    }, 1500)
}
function removeCorpseWalk() {
    clearInterval(_corpseInterval); _corpseInterval = null
    Food.fakeFoods = []
}

// SCORE FREEZE — all score gains are nullified for 5s (eating food gives 0 pts but still grows)
function applyScoreFreeze() {
    Snake.scoreFrozen = true
    setMessage('🥶 SCORE FREEZE — no points can be earned for 5s!')
}
function removeScoreFreeze() { Snake.scoreFrozen = false }

// ── LEGENDARY ──

// ECLIPSE — near-total darkness AND wall-loop disabled AND all bonus food removed for 10s
function applyEclipse() {
    Renderer.blindMode = true
    Snake.loopBoard    = false
    Food.clearBonus()
    Food.luckyClovers  = []
    setMessage('🌒 ECLIPSE — darkness falls. No help, no escape!')
    if (gameRunning) Renderer.flashBorder('#220000', 3)
}
function removeEclipse() {
    Renderer.blindMode = false
    setMessage('🌒 ECLIPSE ended — light returns.')
}

// ECHO — food appears twice (ghost copy a few tiles away worth 50% pts). Both are real.
function applyEcho() {
    Snake.echoActive = true
    setMessage('🔊 ECHO — food has a ghost echo copy! Both are real!')
}
function removeEcho() { Snake.echoActive = false }

// NECROMANCER — revives the last 5 segments that were lost (re-attaches them to the tail)
function applyNecromancer() {
    const regrow = Math.min(5, 15 - Snake.body.length + 5)
    const tail = Snake.body[Snake.body.length - 1]
    for (let i = 0; i < regrow; i++) Snake.body.push({ ...tail })
    score += 30
    scoreDisplay.textContent = score
    if (score > highScore) { highScore = score; highScoreDisplay.textContent = highScore; localStorage.setItem('snakeHighScore', highScore) }
    setMessage('💀 NECROMANCER — lost segments restored + 30 pts!')
    if (gameRunning) Renderer.flashBorder('#8800ff', 4)
}
function removeNecromancer() {}

// PLAGUE — food gradually vanishes (bonus food is removed 1-by-1 every 0.8s) AND score drains 5/s
let _plagueInterval = null
function applyPlague() {
    setMessage('☣️ PLAGUE — your food is rotting and score is decaying!')
    clearInterval(_plagueInterval)
    _plagueInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_plagueInterval); return }
        if (Food.bonus.length > 0) Food.bonus.pop()
        score = Math.max(0, score - 5)
        scoreDisplay.textContent = score
    }, 800)
}
function removePlague() {
    clearInterval(_plagueInterval); _plagueInterval = null
    setMessage('☣️ PLAGUE lifted.')
}

// WORMHOLE — every 2.5s while active, eating food randomly teleports the snake's head to a new safe tile (keeps momentum)
let _wormholeInterval = null
function applyWormhole() {
    Snake.wormholeActive = true
    setMessage('🌀 WORMHOLE — eating food now teleports your head!')
    clearInterval(_wormholeInterval)
    _wormholeInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_wormholeInterval); return }
        // Ripple effect on board borders
        if (gameRunning) Renderer.flashBorder('#4400ff', 1)
    }, 2500)
}
function removeWormhole() {
    clearInterval(_wormholeInterval); _wormholeInterval = null
    Snake.wormholeActive = false
    setMessage('🌀 WORMHOLE closed.')
}


// ══════════════════════════════════════════════════════════════════════════════
// ── NEW BOARD-MESSING EVENTS ──────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

// QUAKE — food and maze tiles shift 1 tile randomly every 0.8s
// ============================================================================
// NEW BOARD-MESSING EVENTS
// ============================================================================

// QUAKE - food and maze tiles shift 1 tile randomly every 0.8s
let _quakeInterval = null
function applyQuake() {
    setMessage('\u{1F30D} QUAKE \u2014 the board is shaking! Everything is moving!')
    if (gameRunning) Renderer.flashBorder('#cc8800', 3)
    clearInterval(_quakeInterval)
    _quakeInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_quakeInterval); _quakeInterval = null; return }
        const dirs = [{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}]
        const d = dirs[Math.floor(Math.random() * dirs.length)]
        const nx = (Food.main.x + d.x + Cols) % Cols
        const ny = (Food.main.y + d.y + Rows) % Rows
        if (!Snake.body.some(s => s.x === nx && s.y === ny)) { Food.main.x = nx; Food.main.y = ny }
        for (const b of Food.bonus) {
            const db = dirs[Math.floor(Math.random() * dirs.length)]
            b.x = (b.x + db.x + Cols) % Cols
            b.y = (b.y + db.y + Rows) % Rows
        }
        if (Food.mazeTiles.length > 0) {
            const occ = new Set(Snake.body.map(s => s.x + ',' + s.y))
            occ.add(Food.main.x + ',' + Food.main.y)
            Food.mazeTiles = Food.mazeTiles.map(() => {
                let x, y, t = 0
                do { x = Math.floor(Math.random() * Cols); y = Math.floor(Math.random() * Rows); t++ }
                while (occ.has(x + ',' + y) && t < 100)
                return { x, y }
            })
        }
        Renderer.flashBorder('#cc8800', 1)
    }, 800)
}
function removeQuake() { clearInterval(_quakeInterval); _quakeInterval = null; setMessage('\u{1F30D} QUAKE settled.') }

// CELL DIVIDE - cuts the snake in half but spawns bonus food for each lost segment
function applyCellDivide() {
    const half = Math.floor(Snake.body.length / 2)
    const lost = Snake.body.length - half
    Snake.cutToLength(half)
    const spawns = Math.min(lost, 6)
    for (let i = 0; i < spawns; i++) Food.placeBonus()
    setMessage('\u{1F52C} CELL DIVIDE \u2014 back half gone! ' + spawns + ' bonus foods appeared!')
    if (gameRunning) Renderer.flashBorder('#00ccff', 3)
}
function removeCellDivide() {}

// VOID - 5 black-hole tiles appear; touching one randomly teleports the snake head
let _voidInterval = null
function applyVoid() {
    Food.voidTiles = []
    const occupied = new Set(Snake.body.map(s => s.x + ',' + s.y))
    occupied.add(Food.main.x + ',' + Food.main.y)
    for (let i = 0; i < 5; i++) {
        let x, y, t = 0
        do { x = Math.floor(Math.random() * Cols); y = Math.floor(Math.random() * Rows); t++ }
        while ((occupied.has(x + ',' + y) || Food.voidTiles.some(v => v.x === x && v.y === y)) && t < 300)
        Food.voidTiles.push({ x, y })
    }
    setMessage('\u{1F573}\uFE0F VOID \u2014 black holes on the board! Touch one and get teleported!')
    clearInterval(_voidInterval)
    _voidInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_voidInterval); _voidInterval = null; return }
        const dirs = [{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}]
        for (const v of (Food.voidTiles || [])) {
            const d = dirs[Math.floor(Math.random() * dirs.length)]
            const nx = (v.x + d.x + Cols) % Cols
            const ny = (v.y + d.y + Rows) % Rows
            if (!Snake.body.some(s => s.x === nx && s.y === ny) &&
                !Food.voidTiles.some(o => o !== v && o.x === nx && o.y === ny)) { v.x = nx; v.y = ny }
        }
    }, 2000)
}
function removeVoid() {
    clearInterval(_voidInterval); _voidInterval = null
    Food.voidTiles = []
    setMessage('\u{1F573}\uFE0F VOID collapsed.')
}

// GRAVITY WELL - all food drifts toward board centre every 0.7s
let _gravWellInterval = null
function applyGravityWell() {
    setMessage('\u{1F311} GRAVITY WELL \u2014 food is being pulled to the centre!')
    clearInterval(_gravWellInterval)
    _gravWellInterval = setInterval(() => {
        if (!gameRunning) { clearInterval(_gravWellInterval); _gravWellInterval = null; return }
        const cx = Math.floor(Cols / 2), cy = Math.floor(Rows / 2)
        const dxM = Math.sign(cx - Food.main.x), dyM = Math.sign(cy - Food.main.y)
        if (Math.abs(cx - Food.main.x) >= Math.abs(cy - Food.main.y) && dxM !== 0) Food.main.x += dxM
        else if (dyM !== 0) Food.main.y += dyM
        for (const b of Food.bonus) {
            const dxB = Math.sign(cx - b.x), dyB = Math.sign(cy - b.y)
            if (Math.abs(cx - b.x) >= Math.abs(cy - b.y) && dxB !== 0) b.x += dxB
            else if (dyB !== 0) b.y += dyB
        }
    }, 700)
}
function removeGravityWell() { clearInterval(_gravWellInterval); _gravWellInterval = null; setMessage('\u{1F311} GRAVITY WELL dissipated.') }

// SCRAMBLE - body segments (not head) teleport to random tiles, creating self-collision risk
function applyScramble() {
    if (Snake.body.length <= 3) { setMessage('\u{1F300} SCRAMBLE \u2014 snake too short!'); return }
    const occupied = new Set()
    occupied.add(Snake.body[0].x + ',' + Snake.body[0].y)
    for (let i = 1; i < Snake.body.length; i++) {
        let x, y, t = 0
        do { x = Math.floor(Math.random() * Cols); y = Math.floor(Math.random() * Rows); t++ }
        while (occupied.has(x + ',' + y) && t < 300)
        occupied.add(x + ',' + y)
        Snake.body[i].x = x; Snake.body[i].y = y
    }
    setMessage('\u{1F300} SCRAMBLE \u2014 your body was scattered across the board!')
    if (gameRunning) Renderer.flashBorder('#ff00aa', 4)
}
function removeScramble() {}
