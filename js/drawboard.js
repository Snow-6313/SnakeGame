// drawboard.js — snake, food, and rendering

// --- SNAKE ---
const Snake = {
    body: [],
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    ghostMode: false,
    invincible: false,
    reversedControls: false,
    swappedControls: false,
    multFrozen: false,
    multBoosted: false,
    frozenGrowth: false,
    mirrorBoard: false,
    loopBoard: false,
    prismatic: false,
    gravityFlip: false,
    tridentActive: false,
    echoActive: false,
    streakFrozen: false,
    flatBonus: 0,

    init() {
        this.body = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
        this.prevBody = this.body.map(s => ({ x: s.x, y: s.y }))
        this.direction = 'RIGHT'
        this.nextDirection = 'RIGHT'
        this.ghostMode = false
        this.invincible = false
        this.reversedControls = false
        this.swappedControls = false
        this.multFrozen = false
        this.multBoosted = false
        this.frozenGrowth = false
        this.mirrorBoard = false
        this.loopBoard = false
        this.prismatic = false
        this.gravityFlip = false
        this.tridentActive = false
        this.echoActive    = false
        this.streakFrozen  = false
        this.flatBonus     = 0
    },

    // returns { moved, head }, { hitWall }, or { hitSelf }
    step() {
        this.direction = this.nextDirection
        let head = { x: this.body[0].x, y: this.body[0].y }

        if (this.direction === 'UP')    head.y--
        if (this.direction === 'DOWN')  head.y++
        if (this.direction === 'LEFT')  head.x--
        if (this.direction === 'RIGHT') head.x++

        // Loop board / ghost mode both wrap edges; loop board is non-invincible wrapping
        if (this.ghostMode || this.loopBoard) {
            if (head.x < 0)     head.x = Cols - 1
            if (head.x >= Cols) head.x = 0
            if (head.y < 0)     head.y = Rows - 1
            if (head.y >= Rows) head.y = 0
        } else {
            if (head.x < 0 || head.x >= Cols || head.y < 0 || head.y >= Rows)
                return { hitWall: true }
        }

        // Maze tiles act as walls (checked before self-collision)
        if (!this.invincible && !this.ghostMode && typeof Food !== 'undefined' && Food.mazeTiles) {
            if (Food.mazeTiles.some(t => t.x === head.x && t.y === head.y))
                return { hitWall: true }
        }

        // Eruption tiles act as walls (checked before self-collision)
        if (!this.invincible && !this.ghostMode && typeof Food !== 'undefined' && Food.eruptionTiles) {
            if (Food.eruptionTiles.some(t => t.x === head.x && t.y === head.y))
                return { hitWall: true }
        }

        if (!this.invincible && !this.ghostMode) {
            for (let i = 1; i < this.body.length; i++)
                if (this.body[i].x === head.x && this.body[i].y === head.y)
                    return { hitSelf: true }
        }

        this.body.unshift(head)
        return { moved: true, head }
    },

    removeTail()     { this.body.pop() },
    cutToLength(len) { this.body = this.body.slice(0, Math.max(len, 3)) },
    clampToBoard()   { this.body = this.body.filter(s => s.x < Cols && s.y < Rows) },

    _empty() {
        let fx, fy, found = false
        while (!found) {
            fx = Math.floor(Math.random() * Cols)
            fy = Math.floor(Math.random() * Rows)
            found = !Snake.body.some(s => s.x === fx && s.y === fy)
        }
        // Mirror board: reflect across the board centre
        if (Snake.mirrorBoard) {
            fx = Cols - 1 - fx
            fy = Rows - 1 - fy
        }
        return { x: fx, y: fy }
    },

    // Like _empty() but also avoids all existing food tiles (for placing bombs/specials)
    _emptyAvoidFood() {
        const occupied = new Set()
        // Mark main food
        occupied.add(`${this.main.x},${this.main.y}`)
        // Mark bonus foods
        for (const b of this.bonus) occupied.add(`${b.x},${b.y}`)
        // Mark mystery box
        if (this.mysteryBox) occupied.add(`${this.mysteryBox.x},${this.mysteryBox.y}`)
        // Mark existing bombs
        for (const b of this.bombs) occupied.add(`${b.x},${b.y}`)

        let fx, fy, attempts = 0
        do {
            fx = Math.floor(Math.random() * Cols)
            fy = Math.floor(Math.random() * Rows)
            attempts++
            if (attempts > 500) break   // board too full, give up
        } while (
            Snake.body.some(s => s.x === fx && s.y === fy) ||
            occupied.has(`${fx},${fy}`)
        )
        if (Snake.mirrorBoard) {
            fx = Cols - 1 - fx
            fy = Rows - 1 - fy
        }
        return { x: fx, y: fy }
    }
}

// --- FOOD ---
const Food = {
    main: {},
    bonus: [],
    bomb: null,       // legacy single bomb (kept for compat)
    bombs: [],        // array of bomb tiles: { x, y, disguised }
    mysteryBox: null, // { x, y } rainbow pickup tile
    mazeTiles: [],    // wall maze tiles (WALL MAZE event)
    fakeFoods: [],    // decoy food tiles (FAKE FOOD event)
    tickingBomb: null,// { x, y, spawnTime, duration } (TICKING TIME BOMB event)
    eruptionTiles: [], // eruption tile walls (ERUPTION event)
    luckyClovers: [],  // lucky clover collectibles (LUCKY CLOVER event)

    place()      { this.main = this._empty() },
    placeBonus() { this.bonus.push(this._empty()) },
    clearBonus() { this.bonus = [] },

    clampToBoard() {
        this.bonus = this.bonus.filter(b => b.x < Cols && b.y < Rows)
        if (this.main.x >= Cols || this.main.y >= Rows) this.place()
        if (this.bomb && (this.bomb.x >= Cols || this.bomb.y >= Rows)) this.bomb = null
        this.bombs = this.bombs.filter(b => b.x < Cols && b.y < Rows)
        if (this.mysteryBox && (this.mysteryBox.x >= Cols || this.mysteryBox.y >= Rows)) this.mysteryBox = null
        this.mazeTiles  = (this.mazeTiles  || []).filter(b => b.x < Cols && b.y < Rows)
        this.fakeFoods  = (this.fakeFoods  || []).filter(b => b.x < Cols && b.y < Rows)
        if (this.tickingBomb && (this.tickingBomb.x >= Cols || this.tickingBomb.y >= Rows)) this.tickingBomb = null
        this.eruptionTiles = (this.eruptionTiles || []).filter(b => b.x < Cols && b.y < Rows)
        this.luckyClovers  = (this.luckyClovers  || []).filter(b => b.x < Cols && b.y < Rows)
    },

    _empty() {
        let fx, fy, found = false
        while (!found) {
            fx = Math.floor(Math.random() * Cols)
            fy = Math.floor(Math.random() * Rows)
            found = !Snake.body.some(s => s.x === fx && s.y === fy)
        }
        // Mirror board: reflect across the board centre
        if (Snake.mirrorBoard) {
            fx = Cols - 1 - fx
            fy = Rows - 1 - fy
        }
        return { x: fx, y: fy }
    },

    // Like _empty() but also avoids all existing food tiles (for placing bombs/specials)
    _emptyAvoidFood() {
        const occupied = new Set()
        // Mark main food
        occupied.add(`${this.main.x},${this.main.y}`)
        // Mark bonus foods
        for (const b of this.bonus) occupied.add(`${b.x},${b.y}`)
        // Mark mystery box
        if (this.mysteryBox) occupied.add(`${this.mysteryBox.x},${this.mysteryBox.y}`)
        // Mark existing bombs
        for (const b of this.bombs) occupied.add(`${b.x},${b.y}`)

        let fx, fy, attempts = 0
        do {
            fx = Math.floor(Math.random() * Cols)
            fy = Math.floor(Math.random() * Rows)
            attempts++
            if (attempts > 500) break   // board too full, give up
        } while (
            Snake.body.some(s => s.x === fx && s.y === fy) ||
            occupied.has(`${fx},${fy}`)
        )
        if (Snake.mirrorBoard) {
            fx = Cols - 1 - fx
            fy = Rows - 1 - fy
        }
        return { x: fx, y: fy }
    }
}

// --- RENDERER ---
const Renderer = {
    canvas: document.getElementById('gameCanvas'),
    ctx:    document.getElementById('gameCanvas').getContext('2d'),
    blindMode: false,

    // Theme object used by rendering functions. setTheme() merges with defaults.
    themeDefaults: {
        background: '#0d1f3c',
        grid: 'rgba(30,58,110,0.5)',
        food: '#ff8c00',
        bonus: '#ff4444',
        bonusAccent: '#ffaaaa',
        snakeHead: '#ffffff',
        snakeBodyRGB: '255,255,255',
        ghostRGB: '180,220,255',
        mazeFill: '#2a1a0a',
        mazeStroke: '#8B4513',
        mazeBrick: '#5c3317',
        fakeFoodShimmer: '255,255,255'
    },
    theme: {},

    setTheme(themeObj) {
        this.theme = Object.assign({}, this.themeDefaults, themeObj || {})
    },

    // draw helpers
    _rgba(rgbStr, alpha) {
        if (!rgbStr) return `rgba(255,255,255,${alpha})`
        // rgbStr may already be a hex or rgba; if it contains ',' treat as 'r,g,b'
        if (rgbStr.includes(',')) return `rgba(${rgbStr},${alpha})`
        // fallback: return rgbStr with alpha ignored
        return rgbStr
    },

    drawFrame() {
        const ctx = this.ctx
        if (Snake.mirrorBoard) {
            ctx.save()
            ctx.translate(this.canvas.width, 0)
            ctx.scale(-1, 1)
        }
        this.drawBackground()
        this.drawFood()
        this.drawBonusFoods()
        this.drawSnake()
        if (Snake.mirrorBoard) ctx.restore()

        if (this.blindMode && Snake.body.length > 0) {
            // blind overlay always drawn unmirrored (it follows the head pixel position)
            let hx = Snake.body[0].x * tile + tile / 2
            // mirror: head pixel position is flipped
            if (Snake.mirrorBoard) hx = this.canvas.width - hx
            let hy = Snake.body[0].y * tile + tile / 2
            ctx.save()
            ctx.fillStyle = 'rgba(0,0,0,0.93)'
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            ctx.globalCompositeOperation = 'destination-out'
            ctx.beginPath()
            ctx.arc(hx, hy, 42, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
        }
    },

    drawBackground() {
        this.ctx.fillStyle = this.theme.background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.strokeStyle = this.theme.grid
        this.ctx.lineWidth = 0.5
        for (let i = 0; i <= Cols; i++) {
            this.ctx.beginPath(); this.ctx.moveTo(i * tile, 0); this.ctx.lineTo(i * tile, this.canvas.height); this.ctx.stroke()
        }
        for (let i = 0; i <= Rows; i++) {
            this.ctx.beginPath(); this.ctx.moveTo(0, i * tile); this.ctx.lineTo(this.canvas.width, i * tile); this.ctx.stroke()
        }
    },

    drawFood() {
        this.ctx.fillStyle = this.theme.food
        this.ctx.fillRect(Food.main.x * tile + 3, Food.main.y * tile + 3, tile - 6, tile - 6)
    },

    drawBonusFoods() {
        for (let b of Food.bonus) {
            this.ctx.fillStyle = this.theme.bonus
            this.ctx.fillRect(b.x * tile + 2, b.y * tile + 2, tile - 4, tile - 4)
            this.ctx.fillStyle = this.theme.bonusAccent
            this.ctx.fillRect(b.x * tile + 5, b.y * tile + 5, 5, 5)
        }

        // ── Bomb food array ──
        const pulse = 0.55 + 0.45 * Math.sin(Date.now() / 180)
        for (let b of Food.bombs) {
            const bx = b.x * tile, by = b.y * tile
            if (b.disguised) {
                // Draw EXACTLY like real food — pixel perfect match to drawFood()
                this.ctx.fillStyle = this.theme.food
                this.ctx.fillRect(bx + 3, by + 3, tile - 6, tile - 6)
                // One almost-invisible dark pixel in the corner — only the most eagle-eyed player notices
                this.ctx.fillStyle = 'rgba(0,0,0,0.18)'
                this.ctx.fillRect(bx + tile - 7, by + 4, 2, 2)
            } else {
                // Obvious bomb — dark red flashing X with skull
                this.ctx.save()
                this.ctx.fillStyle = `rgba(160,0,0,${pulse})`
                this.ctx.fillRect(bx + 1, by + 1, tile - 2, tile - 2)
                this.ctx.strokeStyle = `rgba(255,60,0,${pulse})`
                this.ctx.lineWidth = 2.5
                this.ctx.beginPath()
                this.ctx.moveTo(bx + 5, by + 5);             this.ctx.lineTo(bx + tile - 5, by + tile - 5)
                this.ctx.moveTo(bx + tile - 5, by + 5);      this.ctx.lineTo(bx + 5, by + tile - 5)
                this.ctx.stroke()
                this.ctx.font = `${Math.round(tile * 0.52)}px serif`
                this.ctx.textAlign = 'center'
                this.ctx.textBaseline = 'middle'
                this.ctx.globalAlpha = pulse * 0.95
                this.ctx.fillStyle = '#fff'
                this.ctx.fillText('💀', bx + tile / 2, by + tile / 2)
                this.ctx.globalAlpha = 1
                this.ctx.restore()
            }
        }

        // ── Maze tiles — look like dark brick walls ──
        for (const t of (Food.mazeTiles || [])) {
            const mx = t.x * tile, my = t.y * tile
            this.ctx.save()
            this.ctx.fillStyle = this.theme.mazeFill
            this.ctx.fillRect(mx, my, tile, tile)
            this.ctx.strokeStyle = this.theme.mazeStroke
            this.ctx.lineWidth = 2
            this.ctx.strokeRect(mx + 1, my + 1, tile - 2, tile - 2)
            // brick pattern
            this.ctx.fillStyle = this.theme.mazeBrick
            this.ctx.fillRect(mx + 3, my + 3, tile - 6, tile / 2 - 4)
            this.ctx.fillRect(mx + 3, my + tile / 2, tile / 2 - 4, tile / 2 - 4)
            this.ctx.fillRect(mx + tile / 2, my + tile / 2, tile / 2 - 3, tile / 2 - 4)
            this.ctx.restore()
        }

        // ── Fake food — identical orange colour but with a subtle shimmer ──
        for (const f of (Food.fakeFoods || [])) {
            const fx = f.x * tile, fy = f.y * tile
            this.ctx.save()
            // Draw identically to real food
            this.ctx.fillStyle = this.theme.food
            this.ctx.fillRect(fx + 3, fy + 3, tile - 6, tile - 6)
            // Tiny barely-visible mark — sharp eyes might notice
            const shimmer = 0.12 + 0.08 * Math.sin(Date.now() / 400 + f.x + f.y)
            this.ctx.fillStyle = `rgba(${this.theme.fakeFoodShimmer},${shimmer})`
            this.ctx.fillRect(fx + tile - 8, fy + 4, 2, 2)
            this.ctx.restore()
        }

        // ── Ticking time bomb — countdown glow ──
        if (Food.tickingBomb) {
            const tb = Food.tickingBomb
            const tx = tb.x * tile, ty = tb.y * tile
            const elapsed = Date.now() - (tb.spawnTime || Date.now())
            const frac = Math.max(0, 1 - elapsed / (tb.duration || 5000))
            const urgency = 1 - frac   // 0=just spawned, 1=about to explode
            this.ctx.save()
            // Background glow colour — green → yellow → red
            const r = Math.round(255 * Math.min(1, urgency * 2))
            const g = Math.round(255 * Math.min(1, (1 - urgency) * 2))
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() / (200 - urgency * 150))
            this.ctx.fillStyle = `rgba(${r},${g},0,${0.75 * pulse})`
            this.ctx.fillRect(tx + 1, ty + 1, tile - 2, tile - 2)
            // Border
            this.ctx.strokeStyle = `rgba(${r},${g},0,${pulse})`
            this.ctx.lineWidth = 2
            this.ctx.strokeRect(tx + 1, ty + 1, tile - 2, tile - 2)
            // Bomb emoji in centre
            this.ctx.font = `${Math.round(tile * 0.6)}px serif`
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = 'middle'
            this.ctx.globalAlpha = 0.8 + 0.2 * pulse
            this.ctx.fillStyle = '#fff'
            this.ctx.fillText('💣', tx + tile / 2, ty + tile / 2)
            this.ctx.globalAlpha = 1
            // Countdown text
            const secsLeft = Math.ceil(frac * (tb.duration || 5000) / 1000)
            this.ctx.font = `bold ${Math.round(tile * 0.28)}px Arial`
            this.ctx.fillStyle = '#fff'
            this.ctx.fillText(secsLeft + 's', tx + tile / 2, ty + tile - 4)
            this.ctx.restore()
        }

        // Legacy single bomb (kept for compat)
        if (Food.bomb) {
            const bx = Food.bomb.x * tile, by = Food.bomb.y * tile
            this.ctx.save()
            this.ctx.fillStyle = `rgba(180,0,0,${pulse})`
            this.ctx.fillRect(bx + 1, by + 1, tile - 2, tile - 2)
            this.ctx.strokeStyle = `rgba(255,80,0,${pulse})`
            this.ctx.lineWidth = 2
            this.ctx.beginPath()
            this.ctx.moveTo(bx + 5, by + 5);  this.ctx.lineTo(bx + tile - 5, by + tile - 5)
            this.ctx.moveTo(bx + tile - 5, by + 5); this.ctx.lineTo(bx + 5, by + tile - 5)
            this.ctx.stroke()
            this.ctx.restore()
        }

        // ── Mystery Box — animated rainbow tile ──
        if (Food.mysteryBox) {
            const mx = Food.mysteryBox.x * tile, my = Food.mysteryBox.y * tile
            const t  = Date.now() / 600
            this.ctx.save()
            // Rainbow rotating gradient
            const cx = mx + tile / 2, cy = my + tile / 2
            const grad = this.ctx.createLinearGradient(
                cx + Math.cos(t) * tile, cy + Math.sin(t) * tile,
                cx - Math.cos(t) * tile, cy - Math.sin(t) * tile
            )
            grad.addColorStop(0,    `hsl(${(t * 60) % 360},100%,60%)`)
            grad.addColorStop(0.25, `hsl(${(t * 60 + 90) % 360},100%,60%)`)
            grad.addColorStop(0.5,  `hsl(${(t * 60 + 180) % 360},100%,60%)`)
            grad.addColorStop(0.75, `hsl(${(t * 60 + 270) % 360},100%,60%)`)
            grad.addColorStop(1,    `hsl(${(t * 60 + 360) % 360},100%,60%)`)
            this.ctx.fillStyle = grad
            this.ctx.fillRect(mx + 2, my + 2, tile - 4, tile - 4)
            // White border sparkle
            this.ctx.strokeStyle = `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 4)})`
            this.ctx.lineWidth = 1.5
            this.ctx.strokeRect(mx + 2, my + 2, tile - 4, tile - 4)
            // ? in the middle
            this.ctx.font = `bold ${Math.round(tile * 0.6)}px Arial`
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = 'middle'
            this.ctx.fillStyle = 'rgba(0,0,0,0.6)'
            this.ctx.fillText('?', cx + 1, cy + 1)
            this.ctx.fillStyle = '#fff'
            this.ctx.fillText('?', cx, cy)
            this.ctx.restore()
        }

        // ── Eruption tiles — glowing lava walls ──
        const erupPulse = 0.6 + 0.4 * Math.sin(Date.now() / 150)
        for (const t of (Food.eruptionTiles || [])) {
            const ex = t.x * tile, ey = t.y * tile
            this.ctx.save()
            this.ctx.fillStyle = `rgba(200,40,0,${erupPulse})`
            this.ctx.fillRect(ex, ey, tile, tile)
            this.ctx.strokeStyle = `rgba(255,140,0,${erupPulse})`
            this.ctx.lineWidth = 2
            this.ctx.strokeRect(ex + 1, ey + 1, tile - 2, tile - 2)
            this.ctx.font = `${Math.round(tile * 0.55)}px serif`
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = 'middle'
            this.ctx.globalAlpha = erupPulse
            this.ctx.fillText('🌋', ex + tile / 2, ey + tile / 2)
            this.ctx.globalAlpha = 1
            this.ctx.restore()
        }

        // ── Lucky Clover tiles — green glowing collectibles ──
        const cloverPulse = 0.7 + 0.3 * Math.sin(Date.now() / 300)
        for (const c of (Food.luckyClovers || [])) {
            const cx2 = c.x * tile, cy2 = c.y * tile
            this.ctx.save()
            this.ctx.fillStyle = `rgba(0,180,60,${cloverPulse * 0.5})`
            this.ctx.fillRect(cx2 + 1, cy2 + 1, tile - 2, tile - 2)
            this.ctx.strokeStyle = `rgba(0,255,80,${cloverPulse})`
            this.ctx.lineWidth = 1.5
            this.ctx.strokeRect(cx2 + 2, cy2 + 2, tile - 4, tile - 4)
            this.ctx.font = `${Math.round(tile * 0.55)}px serif`
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = 'middle'
            this.ctx.globalAlpha = cloverPulse
            this.ctx.fillText('🍀', cx2 + tile / 2, cy2 + tile / 2)
            this.ctx.globalAlpha = 1
            this.ctx.restore()
        }

        // ── Echo ghost food — semi-transparent double of real food ──
        if (Snake.echoActive && Food.main) {
            const echoX = (Food.main.x + 3) % Cols
            const echoY = (Food.main.y + 3) % Rows
            this.ctx.save()
            this.ctx.globalAlpha = 0.35 + 0.15 * Math.sin(Date.now() / 250)
            this.ctx.fillStyle = this.theme.food
            this.ctx.fillRect(echoX * tile + 3, echoY * tile + 3, tile - 6, tile - 6)
            this.ctx.globalAlpha = 1
            this.ctx.restore()
        }
    },

    drawSnake() {
        for (let i = 0; i < Snake.body.length; i++) {
            let { x, y } = Snake.body[i]
            if (Snake.ghostMode)  this.ctx.fillStyle = this._rgba(this.theme.ghostRGB, 0.5 - (i / Snake.body.length) * 0.3)
            else if (i === 0)     this.ctx.fillStyle = this.theme.snakeHead
            else                  this.ctx.fillStyle = `rgba(${this.theme.snakeBodyRGB},${1 - (i / Snake.body.length) * 0.55})`
            this.ctx.fillRect(x * tile + 1, y * tile + 1, tile - 2, tile - 2)
        }
    },

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.6)'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = '#ff8c00'; this.ctx.font = 'bold 34px Arial'
        this.ctx.textAlign = 'center';  this.ctx.textBaseline = 'middle'
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20)
        this.ctx.fillStyle = '#ffffff'; this.ctx.font = '16px Arial'
        this.ctx.fillText('Score: ' + score, this.canvas.width / 2, this.canvas.height / 2 + 18)
    },

    flashBorder(color, times, cb) {
        let count = 0, on = true
        let iv = setInterval(() => {
            this.canvas.style.outline = on ? `4px solid ${color}` : 'none'
            on = !on
            if (++count >= times * 2) { clearInterval(iv); this.canvas.style.outline = 'none'; cb && cb() }
        }, 180)
    },

    resizeCanvas() {
        // Max canvas size = viewport minus top UI (~80px) and bottom UI (~120px), capped at 560px
        const maxSize = Math.min(560, window.innerWidth - 20, window.innerHeight - 200)
        tile = Math.floor(maxSize / Math.max(Cols, Rows))
        this.canvas.width  = Cols * tile
        this.canvas.height = Rows * tile
    },

    // Draws a coloured overlay over tiles outside the safe zone (newCols x newRows)
    drawDangerOverlay(newCols, newRows, color) {
        this.ctx.save()
        this.ctx.fillStyle = color
        // right strip
        if (newCols < Cols) {
            this.ctx.fillRect(newCols * tile, 0, (Cols - newCols) * tile, this.canvas.height)
        }
        // bottom strip
        if (newRows < Rows) {
            this.ctx.fillRect(0, newRows * tile, this.canvas.width, (Rows - newRows) * tile)
        }
        this.ctx.restore()
    },

    // Draws a coloured overlay showing tiles that WILL be added (expanding)
    drawGainOverlay(oldCols, oldRows, newCols, newRows, color) {
        this.ctx.save()
        this.ctx.fillStyle = color
        if (newCols > oldCols) {
            this.ctx.fillRect(oldCols * tile, 0, (newCols - oldCols) * tile, oldRows * tile)
        }
        if (newRows > oldRows) {
            this.ctx.fillRect(0, oldRows * tile, newCols * tile, (newRows - oldRows) * tile)
        }
        this.ctx.restore()
    },

    // Draws an animated teleport destination: pulsing glow tile + direction arrow + ring
    // alpha: 0-1 pulse value  |  dir: 'UP'|'DOWN'|'LEFT'|'RIGHT'
    drawTeleportTarget(tx, ty, alpha, dir) {
        const cx = tx * tile + tile / 2
        const cy = ty * tile + tile / 2
        const r  = tile / 2 - 1
        this.ctx.save()

        // --- outer bloom (large soft glow behind everything) ---
        const bloom = this.ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 2.8)
        bloom.addColorStop(0,   `rgba(200,80,255,${alpha * 0.55})`)
        bloom.addColorStop(0.5, `rgba(160,40,230,${alpha * 0.22})`)
        bloom.addColorStop(1,   `rgba(120,0,200,0)`)
        this.ctx.fillStyle = bloom
        this.ctx.beginPath()
        this.ctx.arc(cx, cy, r * 2.8, 0, Math.PI * 2)
        this.ctx.fill()

        // --- filled tile solid highlight ---
        this.ctx.fillStyle = `rgba(210,100,255,${alpha * 0.45})`
        this.ctx.fillRect(tx * tile, ty * tile, tile, tile)

        // --- pulsing outer ring ---
        this.ctx.strokeStyle = `rgba(230,140,255,${alpha})`
        this.ctx.lineWidth = 2.5
        this.ctx.shadowColor = `rgba(200,80,255,${alpha})`
        this.ctx.shadowBlur  = 10 * alpha
        this.ctx.beginPath()
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2)
        this.ctx.stroke()

        // --- second inner ring (creates depth) ---
        this.ctx.strokeStyle = `rgba(255,220,255,${alpha * 0.6})`
        this.ctx.lineWidth = 1
        this.ctx.shadowBlur = 0
        this.ctx.beginPath()
        this.ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2)
        this.ctx.stroke()

        // --- direction arrow ---
        if (dir) {
            const aw = tile * 0.28   // half-width of arrowhead
            const al = tile * 0.38   // length of arrow shaft + head
            this.ctx.fillStyle    = `rgba(255,255,255,${alpha})`
            this.ctx.strokeStyle  = `rgba(200,80,255,${alpha})`
            this.ctx.lineWidth    = 1
            this.ctx.shadowColor  = `rgba(220,120,255,${alpha})`
            this.ctx.shadowBlur   = 8 * alpha
            this.ctx.save()
            this.ctx.translate(cx, cy)
            if      (dir === 'UP')    this.ctx.rotate(-Math.PI / 2)
            else if (dir === 'DOWN')  this.ctx.rotate( Math.PI / 2)
            else if (dir === 'LEFT')  this.ctx.rotate( Math.PI)
            // RIGHT is 0 — no rotation needed
            // Arrow points right in local space
            this.ctx.beginPath()
            this.ctx.moveTo( al,      0)       // tip
            this.ctx.lineTo( al * 0.2, -aw)    // back-left
            this.ctx.lineTo( al * 0.2,  aw)    // back-right
            this.ctx.closePath()
            this.ctx.fill()
            this.ctx.stroke()
            // shaft
            this.ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.7})`
            this.ctx.lineWidth = 2
            this.ctx.shadowBlur = 4 * alpha
            this.ctx.beginPath()
            this.ctx.moveTo(-al * 0.5, 0)
            this.ctx.lineTo( al * 0.15, 0)
            this.ctx.stroke()
            this.ctx.restore()
        }

        // --- centre dot ---
        this.ctx.shadowBlur = 0
        this.ctx.fillStyle = `rgba(255,255,255,${alpha})`
        this.ctx.beginPath()
        this.ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.restore()
    }
}
