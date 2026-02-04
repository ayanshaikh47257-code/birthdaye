// ==========================================
// SHINZO BIRTHDAY PROTOCOL - ENHANCED VERSION
// ==========================================

const SYSTEM = {
    currentScreen: 'boot',
    currentQuestion: 0,
    audioInitialized: false,
    typeSoundInterval: null,
    bgMusic: null,
    peaceMusic: null,
    
    questions: [
        {
            id: 'Q.01',
            text: 'On what date your brother was born?',
            answers: ['19 june 2007', '19/6/2007', '19-6-2007', '19.6.2007', 'june 19 2007', '19 6 2007', '2007-06-19', '19/06/2007'],
            emoji: '🔓',
            specialWrong: null
        },
        {
            id: 'Q.02',
            text: 'What does a panda eats?',
            answers: ['bamboo', 'bamboos', 'the bamboo', 'green bamboo', 'bamboo shoots', 'bamboo leaves', 'bamboo'],
            emoji: '🐼',
            specialWrong: null
        },
        {
            id: 'Q.03',
            text: 'What is 19 + 11 + 43?',
            answers: ['73', 'seventy three', 'seventy-three', '73.0'],
            emoji: '🔢',
            specialWrong: null
        },
        {
            id: 'Q.04',
            text: 'Who is Shinzo favourite sibling?',
            answers: ['ayan', 'Ayan', 'AYAN', ' ayan', 'Ayan '],
            emoji: '❤️',
            specialWrong: {
                triggers: ['kashaf', 'Kashaf', 'KASHAF', 'kashaf ', 'Kashaf '],
                message: 'The most invalid answer',
                emoji: '❌'
            }
        }
    ],

    // AUDIO SYSTEM
    audio: {
        synth: null,
        bass: null,
        metal: null,
        noise: null,
        membrane: null,
        fm: null,
        
        async init() {
            if (SYSTEM.audioInitialized) return;
            await Tone.start();
            
            this.synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: "sawtooth" },
                envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 1 }
            }).toDestination();
            this.synth.volume.value = -10;

            this.bass = new Tone.MonoSynth({
                oscillator: { type: "square" },
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5 }
            }).toDestination();
            this.bass.volume.value = -12;

            this.metal = new Tone.MetalSynth({
                frequency: 200,
                envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
                harmonicity: 5.1,
                modulationIndex: 32
            }).toDestination();
            this.metal.volume.value = -15;

            this.noise = new Tone.NoiseSynth({
                noise: { type: 'brown' },
                envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
            }).toDestination();
            this.noise.volume.value = -20;

            this.membrane = new Tone.MembraneSynth().toDestination();
            this.membrane.volume.value = -6;

            this.fm = new Tone.FMSynth({
                harmonicity: 3,
                modulationIndex: 10,
                oscillator: { type: "sine" },
                envelope: { attack: 0.01, decay: 0.01, sustain: 1, release: 0.5 },
                modulation: { type: "square" },
                modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
            }).toDestination();
            this.fm.volume.value = -10;
            
            // Background ambient drone
            this.drone = new Tone.Oscillator(50, "sawtooth").toDestination();
            this.drone.volume.value = -25;
            
            SYSTEM.audioInitialized = true;
            SYSTEM.log('AUDIO', 'Audio subsystems online', 'success');
        },

        startBackgroundMusic() {
            if (!this.drone) return;
            this.drone.start();
            
            // Cyberpunk bassline
            const bassLoop = new Tone.Sequence((time, note) => {
                this.bass.triggerAttackRelease(note, "8n", time);
            }, ["C1", "C1", "G1", "C1", "F1", "C1", "G1", "C1"], "4n");
            
            bassLoop.start(0);
            Tone.Transport.start();
            Tone.Transport.bpm.value = 100;
        },

        startPeaceMusic() {
            // Stop cyber music
            if (this.drone) this.drone.stop();
            Tone.Transport.stop();
            
            // Peaceful ambient pad
            const peaceSynth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: "sine" },
                envelope: { attack: 2, decay: 1, sustain: 0.8, release: 3 }
            }).toDestination();
            peaceSynth.volume.value = -15;
            
            const peaceLoop = new Tone.Loop(time => {
                peaceSynth.triggerAttackRelease(["C4", "E4", "G4", "B4"], "2n", time);
                peaceSynth.triggerAttackRelease(["F4", "A4", "C5", "E5"], "2n", time + 2);
            }, "4n");
            
            peaceLoop.start(0);
            Tone.Transport.start();
            Tone.Transport.bpm.value = 60;
        },

        playTone(type) {
            if (!SYSTEM.audioInitialized) return;
            const now = Tone.now();
            
            switch(type) {
                case 'hover':
                    this.metal.triggerAttackRelease("C7", "64n", now, 0.1);
                    break;
                case 'click':
                    this.membrane.triggerAttackRelease("C2", "16n");
                    break;
                case 'type':
                    this.metal.triggerAttackRelease("G6", "128n", now, 0.05);
                    break;
                case 'scan':
                    const loop = new Tone.Loop(time => {
                        this.fm.triggerAttackRelease("C5", "32n", time);
                    }, "16n").start(0);
                    loop.iterations = 16;
                    Tone.Transport.start();
                    setTimeout(() => { loop.stop(); }, 2000);
                    break;
                case 'brute':
                    const seq = new Tone.Sequence((time, note) => {
                        this.metal.triggerAttackRelease(note, "64n", time, 0.2);
                    }, ["C6", "E6", "G6", "B6", "C7", "E7", "G7", null], "32n");
                    seq.start(0);
                    Tone.Transport.start();
                    setTimeout(() => { seq.stop(); }, 2000);
                    break;
                case 'success':
                    this.synth.triggerAttackRelease(["C4", "E4", "G4"], "8n", now);
                    this.synth.triggerAttackRelease(["C5", "E5", "G5"], "8n", now + 0.15);
                    this.synth.triggerAttackRelease(["C6", "E6", "G6"], "4n", now + 0.3);
                    break;
                case 'denied':
                    this.noise.triggerAttackRelease("8n");
                    this.membrane.triggerAttackRelease("A0", "4n");
                    break;
                case 'unlock':
                    this.bass.triggerAttackRelease("C3", "8n", now);
                    this.synth.triggerAttackRelease(["C5", "G5"], "4n", now + 0.1);
                    break;
            }
        }
    },

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(screenName + '-screen');
        if (target) {
            target.classList.remove('hidden');
            this.currentScreen = screenName;
            this.log('SCREEN', `Transition to ${screenName}`, 'success');
        }
    },

    log(type, message, level = 'normal') {
        const logContent = document.getElementById('log-content');
        if (!logContent) return;
        
        const entry = document.createElement('div');
        entry.className = `log-entry ${level}`;
        const time = new Date().toISOString().split('T')[1].split('.')[0];
        entry.textContent = `[${time}] [${type}] ${message}`;
        logContent.insertBefore(entry, logContent.firstChild);
        
        while (logContent.children.length > 20) {
            logContent.removeChild(logContent.lastChild);
        }
    },

    async startBoot() {
        this.log('BOOT', 'Initializing system...', 'success');
        
        const bootText = document.getElementById('boot-text');
        const bootBar = document.getElementById('boot-bar');
        const bootStatus = document.getElementById('boot-status');
        
        const lines = [
            "BIOS_DATE: 06/19/2007 00:00:00",
            "CPU: SHINZO_NEURAL_CHIP @ 9.19 THz",
            "MEMORY: 8192 PB OK",
            "LOADING KERNEL...",
            "MOUNTING /dev/encrypted...",
            "DECRYPTING_VOLUMES...",
            "LOADING SECURITY_PROTOCOLS...",
            "ESTABLISHING NEURAL_UPLINK...",
            "CHECKING BIOMETRICS...",
            "SYSTEM READY."
        ];
        
        for (let i = 0; i < lines.length; i++) {
            const line = document.createElement('div');
            line.textContent = `[${new Date().toLocaleTimeString()}] ${lines[i]}`;
            bootText.appendChild(line);
            bootText.scrollTop = bootText.scrollHeight;
            
            const progress = ((i + 1) / lines.length) * 100;
            bootBar.style.width = progress + '%';
            
            if (this.audioInitialized) this.audio.playTone('type');
            await this.sleep(100);
        }
        
        bootStatus.textContent = 'PRESS ANY KEY TO CONTINUE...';
        bootStatus.style.animation = 'blink 1s infinite';
        
        await new Promise(resolve => {
            const handler = () => {
                document.removeEventListener('click', handler);
                resolve();
            };
            document.addEventListener('click', handler);
        });
        
        this.showScreen('intro');
        this.typewriter('intro-message', 
            "WELCOME TO THE MAINFRAME, SHINZO.\n\n" +
            "SECURITY PROTOCOL: MAXIMUM\n" +
            "4 FIREWALLS DETECTED.\n" +
            "COMPLETE BIOMETRIC VERIFICATION TO PROCEED."
        );
        
        // Start background music
        this.audio.startBackgroundMusic();
    },

    typewriter(elementId, text) {
        const el = document.getElementById(elementId);
        if (!el) return;
        
        el.textContent = '';
        let i = 0;
        
        const type = async () => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                if (text.charAt(i) !== '\n' && this.audioInitialized) {
                    this.audio.playTone('type');
                }
                await this.sleep(30);
                type();
            }
        };
        type();
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    async startScan() {
        this.audio.playTone('click');
        this.showScreen('scan');
        this.audio.playTone('scan');
        
        const hashEl = document.getElementById('hash-text');
        const chars = '0123456789ABCDEF';
        const finalHash = '0x' + Array(64).fill(0).map(() => chars[Math.floor(Math.random() * 16)]).join('');
        
        let scramble = 0;
        const scrambleInterval = setInterval(() => {
            let temp = '0x';
            for (let i = 0; i < 64; i++) temp += chars[Math.floor(Math.random() * 16)];
            hashEl.textContent = temp;
            scramble++;
            if (scramble > 30) {
                clearInterval(scrambleInterval);
                hashEl.textContent = finalHash;
            }
        }, 50);
        
        const ring = document.getElementById('ring-fill');
        const percent = document.getElementById('ring-percent');
        
        for (let i = 0; i <= 100; i += 2) {
            ring.style.strokeDashoffset = 283 - (283 * i / 100);
            percent.textContent = i + '%';
            await this.sleep(40);
        }
        
        await this.sleep(500);
        this.startQuestions();
    },

    startQuestions() {
        this.showScreen('question');
        this.loadQuestion(0);
    },

    loadQuestion(index) {
        this.currentQuestion = index;
        const q = this.questions[index];
        
        for (let i = 1; i <= 4; i++) {
            const node = document.getElementById(`fw-${i}`);
            if (i <= index) {
                node.className = 'fw-node breached';
                node.textContent = `FW_0${i} [BREACHED]`;
            } else if (i === index + 1) {
                node.className = 'fw-node active';
                node.textContent = `FW_0${i} [ACTIVE]`;
            } else {
                node.className = 'fw-node locked';
                node.textContent = `FW_0${i} [LOCKED]`;
            }
        }
        
        const qText = document.getElementById('q-text');
        const qId = document.getElementById('q-id');
        
        qId.textContent = q.id;
        qText.setAttribute('data-text', q.text);
        qText.textContent = q.text;
        
        const input = document.getElementById('answer-input');
        input.value = '';
        input.focus();
        
        // Setup typing sound
        input.removeEventListener('input', this.handleTypeSound);
        input.addEventListener('input', () => {
            this.audio.playTone('type');
        });
        
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
        
        this.log('FIREWALL', `Question ${index + 1} loaded`, 'success');
    },

    async checkAnswer() {
        const input = document.getElementById('answer-input');
        const answer = input.value.trim().toLowerCase();
        
        if (!answer) return;
        
        const q = this.questions[this.currentQuestion];
        
        if (q.specialWrong && q.specialWrong.triggers.includes(answer)) {
            await this.showBruteForce(true, q.specialWrong.message, q.specialWrong.emoji);
            return;
        }
        
        const isCorrect = q.answers.some(a => a.toLowerCase().trim() === answer);
        await this.showBruteForce(!isCorrect, isCorrect ? 'ACCESS_GRANTED' : 'ACCESS_DENIED', isCorrect ? q.emoji : '❌');
    },

    async showBruteForce(isDenied, message, emoji) {
        const overlay = document.getElementById('brute-overlay');
        const stream = document.getElementById('code-stream');
        const bar = document.getElementById('brute-bar');
        const status = document.getElementById('brute-status');
        
        overlay.classList.remove('hidden');
        stream.innerHTML = '';
        this.audio.playTone('brute');
        
        const codes = [];
        for (let i = 0; i < 20; i++) {
            const hex = '0123456789ABCDEF';
            let code = '0x';
            for (let j = 0; j < 32; j++) code += hex[Math.floor(Math.random() * 16)];
            codes.push(code);
        }
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            bar.style.width = progress + '%';
            
            const line = document.createElement('div');
            line.textContent = `> ATTEMPT_${Math.floor(Math.random() * 9999)}: ${codes[Math.floor(Math.random() * codes.length)]}... ${progress < 100 ? (isDenied ? 'FAIL' : 'CHECKING') : (isDenied ? 'FAIL' : 'MATCH')}`;
            line.style.color = progress < 100 ? (isDenied ? '#ff0040' : '#00ff41') : (isDenied ? '#ff0040' : '#00ffff');
            stream.appendChild(line);
            stream.scrollTop = stream.scrollHeight;
            
            if (progress >= 100) {
                clearInterval(interval);
                status.textContent = isDenied ? 'BREACH_FAILED' : 'BREACH_SUCCESSFUL';
                setTimeout(() => this.showResult(isDenied, message, emoji), 800);
            }
        }, 100);
    },

    async showResult(isDenied, message, emoji) {
        document.getElementById('brute-overlay').classList.add('hidden');
        
        const overlay = document.getElementById('result-overlay');
        const text = document.getElementById('result-text');
        const emojiDiv = document.getElementById('result-emoji');
        
        overlay.classList.remove('hidden');
        text.textContent = message;
        text.className = 'result-text ' + (isDenied ? 'denied' : 'granted');
        emojiDiv.textContent = emoji;
        
        this.audio.playTone(isDenied ? 'denied' : 'success');
        
        if (isDenied) {
            this.log('SECURITY', message, 'error');
            document.querySelector('.question-box').style.animation = 'shake 0.5s';
            setTimeout(() => {
                document.querySelector('.question-box').style.animation = '';
            }, 500);
        } else {
            this.log('FIREWALL', `Level ${this.currentQuestion + 1} breached`, 'success');
        }
        
        await this.sleep(2500);
        overlay.classList.add('hidden');
        
        if (!isDenied) {
            if (this.currentQuestion < 3) {
                this.audio.playTone('unlock');
                this.loadQuestion(this.currentQuestion + 1);
            } else {
                this.startCelebration();
            }
        } else {
            document.getElementById('answer-input').value = '';
            document.getElementById('answer-input').focus();
        }
    },

    startCelebration() {
        this.showScreen('celebration');
        
        // Switch to peaceful music
        this.audio.startPeaceMusic();
        
        this.log('MAINFRAME', 'All firewalls breached! Celebration initiated!', 'success');
        
        // Start blessing text rotation
        this.rotateBlessings();
        
        // Start emoji rain
        this.startEmojiRain();
        
        const canvas = document.getElementById('celebration-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const balloons = [];
        const fireworks = [];
        const stars = [];
        
        // Create floating stars
        for (let i = 0; i < 50; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.1,
                brightness: Math.random()
            });
        }
        
        // Create balloons
        for (let i = 0; i < 25; i++) {
            balloons.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 300,
                size: 30 + Math.random() * 40,
                color: `hsla(${Math.random() * 360}, 80%, 60%, 0.8)`,
                speed: 1 + Math.random() * 2,
                wobble: Math.random() * Math.PI * 2
            });
        }
        
        const createFirework = () => {
            const x = Math.random() * canvas.width;
            const y = canvas.height / 2 + Math.random() * 300;
            const colors = ['#ff0040', '#00ff41', '#00ffff', '#ff00ff', '#ffff00', '#ff69b4', '#ffd700'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            for (let i = 0; i < 50; i++) {
                const angle = (Math.PI * 2 / 50) * i;
                const velocity = 3 + Math.random() * 5;
                fireworks.push({
                    x, y,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity,
                    life: 1,
                    decay: 0.01 + Math.random() * 0.02,
                    color,
                    size: 2 + Math.random() * 4
                });
            }
        };
        
        const animate = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Stars
            stars.forEach(star => {
                star.y -= star.speed;
                if (star.y < 0) star.y = canvas.height;
                star.brightness += (Math.random() - 0.5) * 0.1;
                star.brightness = Math.max(0.3, Math.min(1, star.brightness));
                
                ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Balloons
            balloons.forEach(b => {
                b.y -= b.speed;
                b.wobble += 0.05;
                const x = b.x + Math.sin(b.wobble) * 20;
                
                ctx.save();
                ctx.translate(x, b.y);
                ctx.fillStyle = b.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, b.size * 0.8, b.size, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                ctx.beginPath();
                ctx.moveTo(0, b.size);
                ctx.quadraticCurveTo(Math.sin(b.wobble) * 10, b.size + 40, 0, b.size + 80);
                ctx.stroke();
                ctx.restore();
                
                if (b.y < -100) {
                    b.y = canvas.height + 100;
                    b.x = Math.random() * canvas.width;
                }
            });
            
            // Fireworks
            if (Math.random() > 0.95) createFirework();
            
            for (let i = fireworks.length - 1; i >= 0; i--) {
                const f = fireworks[i];
                f.x += f.vx;
                f.y += f.vy;
                f.vy += 0.1;
                f.life -= f.decay;
                
                if (f.life <= 0) {
                    fireworks.splice(i, 1);
                    continue;
                }
                
                ctx.globalAlpha = f.life;
                ctx.fillStyle = f.color;
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Sparkle trail
                if (Math.random() > 0.5) {
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(f.x + (Math.random() - 0.5) * 10, f.y + (Math.random() - 0.5) * 10, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
            
            // Confetti
            if (Math.random() > 0.9) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: -10,
                    vx: (Math.random() - 0.5) * 5,
                    vy: Math.random() * 5 + 2,
                    color: `hsl(${Math.random() * 360}, 80%, 60%)`,
                    size: Math.random() * 10 + 2,
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.2,
                    shape: Math.random() > 0.5 ? 'rect' : 'circle'
                });
            }
            
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1;
                p.rotation += p.rotSpeed;
                
                if (p.y > canvas.height) {
                    particles.splice(i, 1);
                    continue;
                }
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                
                if (p.shape === 'rect') {
                    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
            
            requestAnimationFrame(animate);
        };
        animate();
    },

    rotateBlessings() {
        const blessings = [
            "May your code always compile... 🚀",
            "Wishing you infinite RAM and zero bugs... 💻",
            "May your algorithms always be optimal... ⚡",
            "Sending you terabytes of love... 💾❤️",
            "May your birthday be as epic as Ayan's love for you... 🎮",
            "Wishing you 100% uptime in happiness... 🌟",
            "May your frame rate never drop... 🎯",
            "Blessings from the Mainframe... 🕉️"
        ];
        
        let index = 0;
        const el = document.getElementById('blessing-text');
        
        setInterval(() => {
            index = (index + 1) % blessings.length;
            el.style.opacity = 0;
            setTimeout(() => {
                el.textContent = blessings[index];
                el.style.opacity = 1;
            }, 500);
        }, 4000);
    },

    startEmojiRain() {
        const container = document.getElementById('emoji-rain');
        const emojis = ['🎂', '🎁', '🎈', '🎉', '✨', '🌟', '💝', '🎊', '🕉️', '☮️', '💖', '🎮', '👾', '💻', '⚡'];
        
        setInterval(() => {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.animationDuration = (3 + Math.random() * 3) + 's';
            container.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 6000);
        }, 300);
    },

    initMatrix() {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()日カキクケコ';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(draw, 35);
    },

    initGeometry() {
        const container = document.getElementById('geo-canvas-container');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        container.appendChild(canvas);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const shapes = [];
        for (let i = 0; i < 10; i++) {
            shapes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 30 + Math.random() * 50,
                sides: 3 + Math.floor(Math.random() * 4),
                rot: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.02,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
        
        const drawShape = (s) => {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.rot);
            ctx.beginPath();
            for (let i = 0; i < s.sides; i++) {
                const angle = (i * 2 * Math.PI) / s.sides - Math.PI / 2;
                const x = s.size * Math.cos(angle);
                const y = s.size * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        };
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            shapes.forEach(s => {
                s.x += s.vx;
                s.y += s.vy;
                s.rot += s.rotSpeed;
                
                if (s.x < -100) s.x = canvas.width + 100;
                if (s.x > canvas.width + 100) s.x = -100;
                if (s.y < -100) s.y = canvas.height + 100;
                if (s.y > canvas.height + 100) s.y = -100;
                
                drawShape(s);
            });
            
            shapes.forEach((s1, i) => {
                shapes.slice(i + 1).forEach(s2 => {
                    const dx = s1.x - s2.x;
                    const dy = s1.y - s2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        ctx.strokeStyle = `rgba(0, 255, 65, ${0.2 * (1 - dist/200)})`;
                        ctx.beginPath();
                        ctx.moveTo(s1.x, s1.y);
                        ctx.lineTo(s2.x, s2.y);
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        };
        animate();
    },

    // NEW: Spinning Pentagon System
    initPentagons() {
        const canvas = document.getElementById('pentagon-canvas');
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        class SpinningPentagon {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = 40 + Math.random() * 80;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.03;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.color = `hsla(${120 + Math.random() * 60}, 100%, 50%, 0.4)`;
                this.pulse = 0;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
                this.pulse += 0.05;
                
                // Wrap around
                if (this.x < -150) this.x = canvas.width + 150;
                if (this.x > canvas.width + 150) this.x = -150;
                if (this.y < -150) this.y = canvas.height + 150;
                if (this.y > canvas.height + 150) this.y = -150;
            }
            
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                const pulseSize = this.size + Math.sin(this.pulse) * 10;
                
                // Draw pentagon
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    const x = pulseSize * Math.cos(angle);
                    const y = pulseSize * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                
                // Gradient fill
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, pulseSize);
                gradient.addColorStop(0, 'rgba(0, 255, 65, 0.2)');
                gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Stroke
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Inner pentagon
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    const x = (pulseSize * 0.5) * Math.cos(angle);
                    const y = (pulseSize * 0.5) * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.strokeStyle = `hsla(${180 + Math.random() * 40}, 100%, 70%, 0.6)`;
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Center glow
                ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(0, 0, 5, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }
        
        const pentagons = Array(8).fill(null).map(() => new SpinningPentagon());
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections between pentagons
            pentagons.forEach((p1, i) => {
                pentagons.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 250) {
                        ctx.strokeStyle = `rgba(0, 255, 65, ${0.2 * (1 - dist/250)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        
                        // Energy pulse along connection
                        if (Math.random() > 0.95) {
                            const pulseX = p1.x + (p2.x - p1.x) * 0.5;
                            const pulseY = p1.y + (p2.y - p1.y) * 0.5;
                            ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
                            ctx.beginPath();
                            ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                });
            });
            
            pentagons.forEach(p => {
                p.update();
                p.draw();
            });
            
            requestAnimationFrame(animate);
        };
        animate();
    }
};

// INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
    SYSTEM.initMatrix();
    SYSTEM.initGeometry();
    SYSTEM.initPentagons();
    
    document.addEventListener('click', async () => {
        if (!SYSTEM.audioInitialized) {
            await SYSTEM.audio.init();
        }
    }, { once: true });
    
    document.getElementById('start-btn')?.addEventListener('click', () => {
        SYSTEM.startScan();
    });
    
    document.getElementById('submit-btn')?.addEventListener('click', () => {
        SYSTEM.checkAnswer();
    });
    
    document.getElementById('answer-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') SYSTEM.checkAnswer();
    });
    
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('mouseenter', () => SYSTEM.audio.playTone('hover'));
    });
    
    SYSTEM.startBoot();
});