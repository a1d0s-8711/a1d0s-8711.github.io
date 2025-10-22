// script.js

// --- Глобальные переменные ---
let animationFrameId = null;
let lastState = null;
let particles = [];
let maxParticles = 200;
let lastParticleUpdate = 0;
const particleUpdateInterval = 1000;
let lastCalculatedDayOfYear = -1;
let lastCalculatedProgress = 0;
let lastLightningCheckTime = 0;
let currentWeather = 'default';

// --- Кэшированные DOM-элементы ---
const elements = {
    clock: document.getElementById('clock'),
    date: document.getElementById('date'),
    seasonIcon: document.getElementById('season-icon'),
    seasonName: document.getElementById('season-name'),
    timePeriod: document.getElementById('time-period'),
    dayOfYear: document.getElementById('day-of-year'),
    description: document.getElementById('description'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),
    nextSeason: document.getElementById('next-season'),
    sky: document.getElementById('sky'),
    ground: document.getElementById('ground'),
    celestialBody: document.getElementById('celestial-body'),
    starsContainer: document.getElementById('stars-container'),
    cloudsContainer: document.getElementById('clouds-container'),
    lightningContainer: document.getElementById('lightning-container'),
    garden: document.getElementById('garden'),
    particlesContainer: document.getElementById('particles-container'),
    rainContainer: document.getElementById('rain-container'),
    snowContainer: document.getElementById('snow-container'),
    settingsPanel: document.getElementById('settingsPanel'),
    settingsToggle: document.getElementById('settingsToggle'),
    settingsContent: document.getElementById('settingsContent'),
    animationSpeed: document.getElementById('animationSpeed'),
    particleIntensity: document.getElementById('particleIntensity'),
    weatherType: document.getElementById('weatherType'),
    soundToggle: document.getElementById('soundToggle'),
    house: document.querySelector('.house'),
    tree: document.querySelectorAll('.tree')
};

// --- Конфигурация (Цвета, иконки, звуки) ---
const config = {
    seasons: {
        winter: {
            name: 'Зима',
            icon: '❄️',
            months: [11, 0, 1],
            particle: 'snowflake',
            particleCount: 120,
            treeColor: '#1a4d2e',
            times: {
                night: {
                    skyGradient: 'linear-gradient(to bottom, #0a1128 0%, #1c2541 50%, #2a4494 100%)',
                    groundGradient: 'linear-gradient(to bottom, #c5d9e8 0%, #e8f1f5 100%)',
                    celestial: 'moon',
                    celestialPos: { top: '15%', right: '20%' },
                    desc: 'Морозная зимняя ночь со звездами',
                    showStars: true,
                    houseColor: '#8B4513',
                    roofColor: '#654321',
                    windowColor: '#87CEEB',
                    // Добавляем тень для ночи
                    shadow: '0 10px 20px rgba(0, 0, 0, 0.6)'
                },
                morning: {
                    skyGradient: 'linear-gradient(to bottom, #87CEEB 0%, #B0D4E3 50%, #E0F2F7 100%)',
                    groundGradient: 'linear-gradient(to bottom, #E8F4F8 0%, #F0F8FF 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '20%', left: '15%' },
                    desc: 'Свежее морозное утро',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 15px 25px rgba(0, 0, 0, 0.4)'
                },
                day: {
                    skyGradient: 'linear-gradient(to bottom, #4A90E2 0%, #87CEEB 50%, #B4D7E9 100%)',
                    groundGradient: 'linear-gradient(to bottom, #F0F8FF 0%, #FFFFFF 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
                    desc: 'Ясный солнечный зимний день',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 15px 25px rgba(0, 0, 0, 0.3)' // Легче днём
                },
                evening: {
                    skyGradient: 'linear-gradient(to bottom, #FF6B9D 0%, #C06C84 50%, #6C5B7B 100%)',
                    groundGradient: 'linear-gradient(to bottom, #D4E5F2 0%, #E8F4F8 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '50%', right: '10%' },
                    desc: 'Розовый зимний закат',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 12px 22px rgba(0, 0, 0, 0.5)'
                }
            }
        },
        spring: {
            name: 'Весна',
            icon: '🌸',
            months: [2, 3, 4],
            particle: 'blossom',
            particleCount: 70,
            treeColor: '#90EE90',
            times: {
                night: {
                    skyGradient: 'linear-gradient(to bottom, #1a1a3e 0%, #2a4365 50%, #4a5568 100%)',
                    groundGradient: 'linear-gradient(to bottom, #2d5016 0%, #4a7c59 100%)',
                    celestial: 'moon',
                    celestialPos: { top: '15%', right: '20%' },
                    desc: 'Теплая весенняя ночь',
                    showStars: true,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 10px 20px rgba(0, 0, 0, 0.6)'
                },
                morning: {
                    skyGradient: 'linear-gradient(to bottom, #ffeaa7 0%, #fdcb6e 50%, #ff7675 100%)',
                    groundGradient: 'linear-gradient(to bottom, #55efc4 0%, #a8e6cf 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '20%', left: '15%' },
                    desc: 'Нежное весеннее утро с росой',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 15px 25px rgba(0, 0, 0, 0.4)'
                },
                day: {
                    skyGradient: 'linear-gradient(to bottom, #74b9ff 0%, #a29bfe 50%, #fd79a8 100%)',
                    groundGradient: 'linear-gradient(to bottom, #6ab04c 0%, #badc58 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
                    desc: 'Цветущий весенний день',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 15px 25px rgba(0, 0, 0, 0.3)'
                },
                evening: {
                    skyGradient: 'linear-gradient(to bottom, #fd79a8 0%, #fdcb6e 50%, #e17055 100%)',
                    groundGradient: 'linear-gradient(to bottom, #4a7c59 0%, #6ab04c 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '50%', right: '10%' },
                    desc: 'Романтичный весенний закат',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 12px 22px rgba(0, 0, 0, 0.5)'
                }
            }
        },
        summer: {
            name: 'Лето',
            icon: '☀️',
            months: [5, 6, 7],
            particle: 'raindrop', // Используется для молнии
            particleCount: 0,
            treeColor: '#228B22',
            times: {
                night: {
                    skyGradient: 'linear-gradient(to bottom, #0c0032 0%, #190061 50%, #240090 100%)',
                    groundGradient: 'linear-gradient(to bottom, #1a472a 0%, #2d5016 100%)',
                    celestial: 'moon',
                    celestialPos: { top: '15%', right: '20%' },
                    desc: 'Теплая летняя ночь',
                    showStars: true,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 8px 15px rgba(0, 0, 0, 0.6)' // Тень чуть легче
                },
                morning: {
                    skyGradient: 'linear-gradient(to bottom, #ffeaa7 0%, #74b9ff 50%, #81ecec 100%)',
                    groundGradient: 'linear-gradient(to bottom, #6ab04c 0%, #badc58 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '20%', left: '15%' },
                    desc: 'Свежее летнее утро',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 12px 20px rgba(0, 0, 0, 0.4)'
                },
                day: {
                    skyGradient: 'linear-gradient(to bottom, #00b4db 0%, #0083b0 50%, #74b9ff 100%)',
                    groundGradient: 'linear-gradient(to bottom, #7cb342 0%, #8bc34a 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
                    desc: 'Жаркий солнечный летний день',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 10px 15px rgba(0, 0, 0, 0.25)' // Самая лёгкая тень днём
                },
                evening: {
                    skyGradient: 'linear-gradient(to bottom, #ff6b6b 0%, #feca57 50%, #ee5a6f 100%)',
                    groundGradient: 'linear-gradient(to bottom, #6ab04c 0%, #7cb342 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '50%', right: '10%' },
                    desc: 'Яркий летний закат',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 12px 22px rgba(0, 0, 0, 0.5)'
                }
            }
        },
        autumn: {
            name: 'Осень',
            icon: '🍂',
            months: [8, 9, 10],
            particle: 'leaf',
            particleCount: 80,
            treeColor: '#FF8C00',
            times: {
                night: {
                    skyGradient: 'linear-gradient(to bottom, #2c3e50 0%, #34495e 50%, #4a5568 100%)',
                    groundGradient: 'linear-gradient(to bottom, #5d4037 0%, #6d4c41 100%)',
                    celestial: 'moon',
                    celestialPos: { top: '15%', right: '20%' },
                    desc: 'Прохладная осенняя ночь',
                    showStars: true,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 10px 20px rgba(0, 0, 0, 0.6)'
                },
                morning: {
                    skyGradient: 'linear-gradient(to bottom, #fa709a 0%, #fee140 50%, #ffa751 100%)',
                    groundGradient: 'linear-gradient(to bottom, #d4a574 0%, #cd853f 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '20%', left: '15%' },
                    desc: 'Туманное осеннее утро',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 15px 25px rgba(0, 0, 0, 0.45)' // Осенние тени чуть темнее
                },
                day: {
                    skyGradient: 'linear-gradient(to bottom, #f9d423 0%, #ff4e50 50%, #fc913a 100%)',
                    groundGradient: 'linear-gradient(to bottom, #cd853f 0%, #d2691e 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
                    desc: 'Золотой осенний день',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 12px 20px rgba(0, 0, 0, 0.35)'
                },
                evening: {
                    skyGradient: 'linear-gradient(to bottom, #ee9ca7 0%, #ffdde1 50%, #ff6b6b 100%)',
                    groundGradient: 'linear-gradient(to bottom, #8b4513 0%, #a0522d 100%)',
                    celestial: 'sun',
                    celestialPos: { top: '50%', right: '10%' },
                    desc: 'Багряный осенний закат',
                    showStars: false,
                    houseColor: '#A0522D',
                    roofColor: '#8B4513',
                    windowColor: '#87CEEB',
                    shadow: '0 14px 24px rgba(0, 0, 0, 0.6)' // Тень вечером
                }
            }
        }
    },
    sounds: {
        rain: 'sounds/rain.mp3',
        thunder: 'sounds/thunder.mp3',
        birds: 'sounds/birds.mp3',
        wind: 'sounds/wind.mp3'
    }
};

// --- Вспомогательные функции ---
const utils = {
    adjustBrightness: (hex, percent) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    },
    getDaysInMonth: (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    },
    calculateSeasonProgress: (month, day, year) => {
        let currentSeasonName = '';
        let seasonMonths = [];
        for (let season in config.seasons) {
            if (config.seasons[season].months.includes(month)) {
                currentSeasonName = season;
                seasonMonths = [...config.seasons[season].months].sort((a, b) => a - b);
                break;
            }
        }
        if (!currentSeasonName) return 0;

        let seasonStartMonth = seasonMonths[0];
        let seasonEndMonth = seasonMonths[seasonMonths.length - 1];
        let seasonStartDay = new Date(year, seasonStartMonth, 1);
        let seasonEndDay = new Date(year, seasonEndMonth, utils.getDaysInMonth(seasonEndMonth, year));

        if (seasonStartMonth > seasonEndMonth) {
            seasonEndDay.setFullYear(year + 1);
        }

        let currentDay = new Date(year, month, day);
        let seasonTotalDays = Math.ceil((seasonEndDay - seasonStartDay) / (1000 * 60 * 60 * 24)) + 1;
        let daysPassed = Math.ceil((currentDay - seasonStartDay) / (1000 * 60 * 60 * 24)) + 1;

        let progress = Math.min(100, Math.max(0, (daysPassed / seasonTotalDays) * 100));
        return Math.round(progress);
    }
};

// --- Модуль Управления Частицами ---
const ParticleManager = (() => {
    let rainDrops = [];
    let snowFlakes = [];
    const maxRain = 100;
    const maxSnow = 150;

    const createRainDrops = (count) => {
        elements.rainContainer.innerHTML = '';
        rainDrops = [];
        for (let i = 0; i < count; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop-weather';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) / parseFloat(elements.animationSpeed.value) + 's';
            drop.style.opacity = 0.6 * parseFloat(elements.particleIntensity.value);
            elements.rainContainer.appendChild(drop);
            rainDrops.push(drop);
        }
    };

    const createSnowFlakes = (count) => {
        elements.snowContainer.innerHTML = '';
        snowFlakes = [];
        for (let i = 0; i < count; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake-weather';
            flake.style.left = Math.random() * 100 + '%';
            flake.style.animationDuration = (Math.random() * 2 + 1) / parseFloat(elements.animationSpeed.value) + 's';
            flake.style.opacity = 0.9 * parseFloat(elements.particleIntensity.value);
            elements.snowContainer.appendChild(flake);
            snowFlakes.push(flake);
        }
    };

    const updateRain = () => {
        if (currentWeather === 'rain' || currentWeather === 'storm') {
            elements.rainContainer.style.display = 'block';
            const rainCount = Math.floor(80 * parseFloat(elements.particleIntensity.value));
            if (rainDrops.length !== rainCount) {
                createRainDrops(rainCount);
            }
        } else {
            elements.rainContainer.style.display = 'none';
        }
    };

    const updateSnow = () => {
        if (currentWeather === 'snow') {
            elements.snowContainer.style.display = 'block';
            const snowCount = Math.floor(120 * parseFloat(elements.particleIntensity.value));
            if (snowFlakes.length !== snowCount) {
                createSnowFlakes(snowCount);
            }
        } else {
            elements.snowContainer.style.display = 'none';
        }
    };

    return {
        initializeParticles: () => {
            for (let i = 0; i < maxParticles; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.display = 'none';
                elements.particlesContainer.appendChild(particle);
                particles.push({
                    element: particle,
                    active: false,
                    type: '',
                    x: 0,
                    y: 0,
                    size: 1,
                    duration: 5,
                    delay: 0
                });
            }
        },
        updateParticles: (particleType, count) => {
            const now = Date.now();
            if (now - lastParticleUpdate < particleUpdateInterval) {
                return;
            }
            lastParticleUpdate = now;

            particles.forEach(p => p.active = false);

            for (let i = 0; i < Math.min(count, maxParticles); i++) {
                const p = particles[i];
                p.active = true;
                p.type = particleType;
                p.x = Math.random() * window.innerWidth;
                p.y = -50;
                p.size = 0.5 + Math.random() * 1.5;
                p.duration = 5 + Math.random() * 10;
                p.delay = Math.random() * 5;

                p.element.className = `particle ${particleType}`;
                p.element.style.left = p.x + 'px';
                p.element.style.top = p.y + 'px';
                p.element.style.animationDuration = (p.duration / parseFloat(elements.animationSpeed.value)) + 's';
                p.element.style.animationDelay = p.delay + 's';
                p.element.style.transform = `scale(${p.size})`;
                p.element.style.display = 'block';
                p.element.style.opacity = parseFloat(elements.particleIntensity.value);

                if (particleType === 'leaf') {
                    // Используем разные цвета для листьев
                    const colors = ['#b8860b', '#cd853f', '#daa520', '#f0e68c', '#ffd700'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    p.element.style.background = `radial-gradient(circle, ${randomColor} 0%, ${utils.adjustBrightness(randomColor, -20)} 100%)`;
                    p.element.textContent = ''; // Убираем иконку
                } else if (particleType === 'blossom') {
                    const colors = ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493', '#DB7093'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    p.element.style.background = `radial-gradient(circle, ${randomColor} 0%, ${utils.adjustBrightness(randomColor, -20)} 100%)`;
                    p.element.textContent = '';
                }
            }
            for (let i = count; i < particles.length; i++) {
                particles[i].element.style.display = 'none';
            }
        },
        updateWeatherParticles: () => {
            updateRain();
            updateSnow();
        }
    };
})();

// --- Модуль Управления Сценой ---
const SceneManager = (() => {
    const updateTreeColors = (seasonName) => {
        const pineLayers = document.querySelectorAll('.pine-layer');
        const baseColors = {
            winter: ['#1a5f1a', '#267326', '#2d8b2d', '#32a032', '#3cb371'],
            spring: ['#32cd32', '#3cb371', '#90ee90', '#98fb98', '#adff2f'],
            summer: ['#228b22', '#2e8b57', '#3cb371', '#66cdaa', '#8fbc8f'],
            autumn: ['#b8860b', '#cd853f', '#daa520', '#f0e68c', '#ffd700']
        };
        const colors = baseColors[seasonName.toLowerCase()];
        if (colors) {
            pineLayers.forEach((layer, index) => {
                if (colors[index]) {
                    const darkerColor = utils.adjustBrightness(colors[index], -20);
                    layer.style.background = `linear-gradient(to bottom, ${colors[index]}, ${darkerColor})`;
                }
            });
        }
    };

    const updateScene = (season, timeOfDay, timeConfig) => {
        // Устанавливаем CSS-переменные для плавного перехода
        document.documentElement.style.setProperty('--sky-color', timeConfig.skyGradient);
        // --- ИСПРАВЛЕНИЕ: Добавляем установку --ground-color ---
        document.documentElement.style.setProperty('--ground-color', timeConfig.groundGradient);
        // --- /ИСПРАВЛЕНИЕ ---
        document.documentElement.style.setProperty('--house-color', timeConfig.houseColor);
        document.documentElement.style.setProperty('--roof-color', timeConfig.roofColor);
        document.documentElement.style.setProperty('--window-color', timeConfig.windowColor);
        // --- Улучшение: Устанавливаем динамическую тень ---
        document.documentElement.style.setProperty('--dynamic-shadow', timeConfig.shadow);
        // --- /Улучшение ---

        // Управление звёздами
        elements.starsContainer.style.opacity = timeConfig.showStars ? '1' : '0';
        if (timeConfig.showStars && elements.starsContainer.children.length === 0) {
            SceneInitializer.createStars();
        }

        // Небесное тело
        elements.celestialBody.className = timeConfig.celestial;
        for (let prop in timeConfig.celestialPos) {
            elements.celestialBody.style[prop] = timeConfig.celestialPos[prop];
        }

        // Окна
        const windowGlowOpacity = (timeOfDay === 'night' || timeOfDay === 'evening') ? '1' : '0';
        document.documentElement.style.setProperty('--window-glow-opacity', windowGlowOpacity);
    };

    return {
        updateTreeColors,
        updateScene
    };
})();

// --- Модуль Управления Погодой ---
const WeatherManager = (() => {
    let audioContext = null;
    let rainSound = null;
    let thunderSound = null;
    let isSoundEnabled = false;

    const loadSound = (url) => {
        if (typeof Audio !== 'undefined') {
            return new Audio(url);
        }
        return null;
    };

    const playSound = (sound) => {
        if (sound && isSoundEnabled) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Ошибка воспроизведения звука:", e));
        }
    };

    const stopSound = (sound) => {
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    };

    const updateWeather = (seasonName, timeOfDay) => {
        elements.rainContainer.style.display = 'none';
        elements.snowContainer.style.display = 'none';

        if (currentWeather === 'rain') {
            elements.rainContainer.style.display = 'block';
        } else if (currentWeather === 'snow') {
            elements.snowContainer.style.display = 'block';
        } else if (currentWeather === 'storm') {
            elements.rainContainer.style.display = 'block';
        }

        if (isSoundEnabled) {
            if (currentWeather === 'rain' || currentWeather === 'storm') {
                if (!rainSound) rainSound = loadSound(config.sounds.rain);
                playSound(rainSound);
            } else {
                stopSound(rainSound);
            }
            if (currentWeather === 'storm') {
                if (!thunderSound) thunderSound = loadSound(config.sounds.thunder);
            }
        } else {
            stopSound(rainSound);
            stopSound(thunderSound);
        }
    };

    return {
        setWeather: (type) => {
            currentWeather = type;
        },
        setSoundEnabled: (enabled) => {
            isSoundEnabled = enabled;
        },
        updateWeather
    };
})();

// --- Модуль Инициализации Сцены ---
const SceneInitializer = (() => {
    const createStars = () => {
        elements.starsContainer.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 60 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            elements.starsContainer.appendChild(star);
        }
    };

    const createClouds = () => {
        elements.cloudsContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            const size = 60 + Math.random() * 40;
            cloud.style.width = size + 'px';
            cloud.style.height = size * 0.6 + 'px';
            cloud.style.top = Math.random() * 40 + 10 + '%';
            cloud.style.left = Math.random() * 100 + '%';
            cloud.style.animationDuration = (40 + Math.random() * 40) / parseFloat(elements.animationSpeed.value) + 's';
            cloud.style.animationDelay = Math.random() * 10 + 's';
            const before = document.createElement('div');
            before.style.width = size * 0.6 + 'px';
            before.style.height = size * 0.5 + 'px';
            before.style.left = '-' + size * 0.3 + 'px';
            before.style.top = size * 0.1 + 'px';
            cloud.appendChild(before);
            const after = document.createElement('div');
            after.style.width = size * 0.5 + 'px';
            after.style.height = size * 0.4 + 'px';
            after.style.right = '-' + size * 0.2 + 'px';
            after.style.top = size * 0.15 + 'px';
            cloud.appendChild(after);
            elements.cloudsContainer.appendChild(cloud);
        }
    };

    const createGarden = (seasonName) => {
        elements.garden.innerHTML = '';
        if (seasonName === 'Весна') {
            for (let i = 0; i < 5; i++) {
                const flower = document.createElement('div');
                flower.className = 'flower';
                flower.style.animationDelay = (i * 0.3) + 's';
                flower.innerHTML = `
                        <div class="flower-stem"></div>
                        <div class="flower-bloom" style="background: ${['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493', '#DB7093'][i]}"></div>
                    `;
                elements.garden.appendChild(flower);
            }
        } else if (seasonName === 'Лето') {
            for (let i = 0; i < 3; i++) {
                const bush = document.createElement('div');
                bush.className = 'bush';
                bush.style.animationDelay = (i * 0.5) + 's';
                elements.garden.appendChild(bush);
            }
            for (let i = 0; i < 3; i++) {
                const flower = document.createElement('div');
                flower.className = 'flower';
                flower.style.animationDelay = (i * 0.4) + 's';
                flower.innerHTML = `
                        <div class="flower-stem"></div>
                        <div class="flower-bloom" style="background: ${['#FFD700', '#FFA500', '#FF8C00'][i]}"></div>
                    `;
                elements.garden.appendChild(flower);
            }
        } else if (seasonName === 'Осень') {
            for (let i = 0; i < 4; i++) {
                const bush = document.createElement('div');
                bush.className = 'bush';
                // Используем осенние цвета для кустов
                bush.style.background = `radial-gradient(circle, ${['#b8860b', '#cd853f', '#daa520', '#f0e68c'][i]} 0%, ${utils.adjustBrightness(['#b8860b', '#cd853f', '#daa520', '#f0e68c'][i], -20)} 100%)`;
                bush.style.animationDelay = (i * 0.4) + 's';
                elements.garden.appendChild(bush);
            }
        } else if (seasonName === 'Зима') {
            for (let i = 0; i < 2; i++) {
                const bush = document.createElement('div');
                bush.className = 'bush';
                bush.style.background = 'radial-gradient(circle, #E0E0E0 0%, #B0B0B0 100%)';
                bush.style.animationDelay = (i * 0.6) + 's';
                elements.garden.appendChild(bush);
            }
        }
    };

    return {
        createStars,
        createClouds,
        createGarden
    };
})();

// --- Модуль Управления Интерфейсом ---
const UIManager = (() => {
    const toggleSettings = () => {
        elements.settingsContent.style.display = elements.settingsContent.style.display === 'block' ? 'none' : 'block';
    };

    const updateSettings = () => {
        document.documentElement.style.setProperty('--animation-speed-multiplier', elements.animationSpeed.value);
        document.documentElement.style.setProperty('--particle-intensity-multiplier', elements.particleIntensity.value);

        WeatherManager.setWeather(elements.weatherType.value);
        WeatherManager.setSoundEnabled(elements.soundToggle.checked);

        SceneInitializer.createClouds();
    };

    elements.settingsToggle.addEventListener('click', toggleSettings);
    elements.animationSpeed.addEventListener('input', updateSettings);
    elements.particleIntensity.addEventListener('input', updateSettings);
    elements.weatherType.addEventListener('change', updateSettings);
    elements.soundToggle.addEventListener('change', updateSettings);

    return {
        updateSettings
    };
})();

// --- Основной модуль обновления ---
const MainUpdater = (() => {
    const getCurrentSeason = (month) => {
        for (let season in config.seasons) {
            if (config.seasons[season].months.includes(month)) {
                return config.seasons[season];
            }
        }
        return config.seasons.autumn;
    };

    const getTimeOfDay = (hour) => {
        if (hour >= 0 && hour < 6) return 'night';
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'day';
        return 'evening';
    };

    const getTimeOfDayName = (timeOfDay) => {
        const names = {
            night: '🌙 Ночь',
            morning: '🌅 Утро',
            day: '☀️ День',
            evening: '🌆 Вечер'
        };
        return names[timeOfDay];
    };

    const getDayOfYear = (date) => {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    };

    const getNextSeason = (currentMonth) => {
        const seasonOrder = ['winter', 'spring', 'summer', 'autumn'];
        const currentSeasonKey = Object.keys(config.seasons).find(key => config.seasons[key].months.includes(currentMonth));
        if (currentSeasonKey) {
            const currentIndex = seasonOrder.indexOf(currentSeasonKey);
            const nextIndex = (currentIndex + 1) % seasonOrder.length;
            const nextSeasonKey = seasonOrder[nextIndex];
            return config.seasons[nextSeasonKey].name + ' ' + config.seasons[nextSeasonKey].icon;
        }
        return config.seasons.spring.name + ' ' + config.seasons.spring.icon;
    };

    const createLightning = () => {
        const lightning = document.createElement('div');
        lightning.className = 'lightning';
        lightning.style.left = (20 + Math.random() * 60) + '%';
        elements.lightningContainer.appendChild(lightning);
        const flash = document.createElement('div');
        flash.className = 'lightning-flash';
        document.body.appendChild(flash);

        if (WeatherManager.isSoundEnabled) {
            WeatherManager.playSound(WeatherManager.thunderSound);
        }

        setTimeout(() => {
            lightning.remove();
            flash.remove();
        }, 300);
    };

    const updateDateTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        elements.clock.textContent = `${hours}:${minutes}:${seconds}`;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        elements.date.textContent = now.toLocaleDateString('ru-RU', options);

        const currentSeason = getCurrentSeason(now.getMonth());
        const timeOfDay = getTimeOfDay(now.getHours());
        const timeConfig = currentSeason.times[timeOfDay];

        elements.seasonIcon.textContent = currentSeason.icon;
        elements.seasonName.textContent = currentSeason.name;
        elements.timePeriod.textContent = getTimeOfDayName(timeOfDay);
        elements.dayOfYear.textContent = getDayOfYear(now);
        elements.description.textContent = timeConfig.desc;

        const currentState = `${currentSeason.name}-${timeOfDay}`;
        if (lastState !== currentState) {
            SceneManager.updateScene(currentSeason, timeOfDay, timeConfig);
            if (currentWeather === 'default') {
                ParticleManager.updateParticles(currentSeason.particle, currentSeason.particleCount);
            }
            SceneInitializer.createGarden(currentSeason.name);
            SceneManager.updateTreeColors(currentSeason.name.toLowerCase());
            lastState = currentState;
        }

        if (currentWeather === 'storm') {
            const nowTimestamp = Date.now();
            if (nowTimestamp - lastLightningCheckTime >= 1000) {
                lastLightningCheckTime = nowTimestamp;
                if (Math.random() < 0.02) {
                    createLightning();
                }
            }
        }

        const currentDayOfYear = getDayOfYear(now);
        let progress;
        if (currentDayOfYear !== lastCalculatedDayOfYear) {
            lastCalculatedDayOfYear = currentDayOfYear;
            lastCalculatedProgress = utils.calculateSeasonProgress(now.getMonth(), now.getDate(), now.getFullYear());
        }
        progress = lastCalculatedProgress;

        elements.progressBar.style.width = progress + '%';
        elements.progressText.textContent = progress + '%';
        elements.nextSeason.textContent = 'Следующий: ' + getNextSeason(now.getMonth());

        WeatherManager.updateWeather(currentSeason.name, timeOfDay);
        ParticleManager.updateWeatherParticles();
    };

    return {
        updateDateTime
    };
})();

// --- Анимационный цикл ---
function animate() {
    MainUpdater.updateDateTime();
    animationFrameId = requestAnimationFrame(animate);
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
    SceneInitializer.createClouds();
    ParticleManager.initializeParticles();
    UIManager.updateSettings();
    MainUpdater.updateDateTime();
    animate();
});

// --- Обработка изменения размера окна ---
window.addEventListener('resize', () => {
    const now = new Date();
    const currentSeason = MainUpdater.getCurrentSeason(now.getMonth());
    if (currentWeather === 'default') {
        ParticleManager.updateParticles(currentSeason.particle, currentSeason.particleCount);
    }
});

// --- Обработка видимости вкладки ---
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    } else {
        if (!animationFrameId) {
            animate();
        }
    }
});
