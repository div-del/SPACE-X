// ── Planet Data ──────────────────────────────────────────────────
export interface Planet {
    name: string;
    emoji: string;
    type: string;
    diameter: number;     // km
    mass: string;         // relative to Earth
    distanceFromSun: string; // AU or km
    moons: number;
    temperature: string;  // avg surface temp
    dayLength: string;
    yearLength: string;
    funFact: string;
    description: string;
    gradient: string;     // CSS gradient
    color: string;        // primary color
}

export const planets: Planet[] = [
    {
        name: "Mercury",
        emoji: "☿️",
        type: "Terrestrial",
        diameter: 4879,
        mass: "0.055 Earths",
        distanceFromSun: "0.39 AU",
        moons: 0,
        temperature: "167°C avg",
        dayLength: "59 Earth days",
        yearLength: "88 Earth days",
        funFact: "Mercury has no atmosphere, so the temperature swings from -180°C to 430°C!",
        description: "The smallest planet and closest to the Sun. Despite being nearest to the Sun, it's not the hottest — that title goes to Venus.",
        gradient: "linear-gradient(135deg, #8B7355, #C4A882, #6B5B3E)",
        color: "#C4A882",
    },
    {
        name: "Venus",
        emoji: "♀️",
        type: "Terrestrial",
        diameter: 12104,
        mass: "0.815 Earths",
        distanceFromSun: "0.72 AU",
        moons: 0,
        temperature: "464°C avg",
        dayLength: "243 Earth days",
        yearLength: "225 Earth days",
        funFact: "A day on Venus is longer than a year on Venus! It rotates backwards too.",
        description: "The hottest planet due to a runaway greenhouse effect. Its thick atmosphere traps heat, making it hotter than Mercury.",
        gradient: "linear-gradient(135deg, #E8A317, #FFCC33, #CC8800)",
        color: "#E8A317",
    },
    {
        name: "Earth",
        emoji: "🌍",
        type: "Terrestrial",
        diameter: 12742,
        mass: "1.0 Earths",
        distanceFromSun: "1.0 AU",
        moons: 1,
        temperature: "15°C avg",
        dayLength: "24 hours",
        yearLength: "365.25 days",
        funFact: "Earth is the only planet not named after a Greek or Roman god.",
        description: "Our home planet — the only known world to harbor life. 71% of its surface is covered by water.",
        gradient: "linear-gradient(135deg, #1E90FF, #00CC66, #1E90FF)",
        color: "#1E90FF",
    },
    {
        name: "Mars",
        emoji: "🔴",
        type: "Terrestrial",
        diameter: 6779,
        mass: "0.107 Earths",
        distanceFromSun: "1.52 AU",
        moons: 2,
        temperature: "-65°C avg",
        dayLength: "24h 37m",
        yearLength: "687 Earth days",
        funFact: "Mars has the tallest volcano in the solar system — Olympus Mons at 21.9 km high!",
        description: "The Red Planet, colored by iron oxide (rust) on its surface. Mars is the most explored planet after Earth.",
        gradient: "linear-gradient(135deg, #CC3300, #FF4500, #8B0000)",
        color: "#FF4500",
    },
    {
        name: "Jupiter",
        emoji: "🟤",
        type: "Gas Giant",
        diameter: 139820,
        mass: "317.8 Earths",
        distanceFromSun: "5.20 AU",
        moons: 95,
        temperature: "-110°C avg",
        dayLength: "9h 56m",
        yearLength: "11.86 Earth years",
        funFact: "Jupiter's Great Red Spot is a storm bigger than Earth that has raged for 350+ years!",
        description: "The largest planet, with a mass 2.5x all other planets combined. Its magnetic field is 20,000 times stronger than Earth's.",
        gradient: "linear-gradient(135deg, #CD853F, #DEB887, #8B6914)",
        color: "#CD853F",
    },
    {
        name: "Saturn",
        emoji: "🪐",
        type: "Gas Giant",
        diameter: 116460,
        mass: "95.2 Earths",
        distanceFromSun: "9.54 AU",
        moons: 146,
        temperature: "-140°C avg",
        dayLength: "10h 42m",
        yearLength: "29.46 Earth years",
        funFact: "Saturn is so light it would float in water — if you could find a bathtub big enough!",
        description: "Famous for its stunning ring system made of ice and rock. Saturn has the most moons of any planet.",
        gradient: "linear-gradient(135deg, #DAA520, #F0E68C, #B8860B)",
        color: "#DAA520",
    },
    {
        name: "Uranus",
        emoji: "🔵",
        type: "Ice Giant",
        diameter: 50724,
        mass: "14.5 Earths",
        distanceFromSun: "19.19 AU",
        moons: 28,
        temperature: "-195°C avg",
        dayLength: "17h 14m",
        yearLength: "84 Earth years",
        funFact: "Uranus rotates on its side — it's tilted 98 degrees! It basically rolls around the Sun.",
        description: "The coldest planet in our solar system. It's tilted so far on its axis that it essentially orbits the Sun on its side.",
        gradient: "linear-gradient(135deg, #4169E1, #87CEEB, #00CED1)",
        color: "#87CEEB",
    },
    {
        name: "Neptune",
        emoji: "🔷",
        type: "Ice Giant",
        diameter: 49244,
        mass: "17.1 Earths",
        distanceFromSun: "30.07 AU",
        moons: 16,
        temperature: "-200°C avg",
        dayLength: "16h 6m",
        yearLength: "164.8 Earth years",
        funFact: "Neptune has the fastest winds in the solar system — up to 2,100 km/h!",
        description: "The most distant planet, with supersonic winds and a vivid blue color from methane in its atmosphere.",
        gradient: "linear-gradient(135deg, #000080, #0000CD, #1E90FF)",
        color: "#0000CD",
    },
];

// ── Space Facts ──────────────────────────────────────────────────
export const spaceFacts: string[] = [
    "A teaspoon of a neutron star would weigh about 6 billion tons.",
    "There are more stars in the universe than grains of sand on all Earth's beaches.",
    "Light takes 8 minutes and 20 seconds to travel from the Sun to Earth.",
    "The footprints on the Moon will last for 100 million years — there's no wind to blow them away.",
    "One million Earths could fit inside the Sun.",
    "Space is completely silent — there's no medium for sound waves to travel through.",
    "A day on Venus is longer than a year on Venus.",
    "The largest known star, UY Scuti, could fit 5 billion Suns inside it.",
    "There's a giant cloud of alcohol in space (Sagittarius B2) spanning 288 billion miles.",
    "Olympus Mons on Mars is 3x the height of Mount Everest.",
    "The International Space Station orbits Earth every 90 minutes at 28,000 km/h.",
    "A year on Mercury is just 88 Earth days long.",
    "Saturn would float in water because its average density is less than water.",
    "The Milky Way galaxy is on a collision course with Andromeda — in about 4 billion years.",
    "Astronauts grow up to 2 inches taller in space due to spinal decompression.",
    "There are more trees on Earth than stars in the Milky Way.",
    "The Sun makes up 99.86% of all mass in the Solar System.",
    "Black holes can distort time — near one, time slows down dramatically.",
    "Jupiter's moon Europa has more water than all of Earth's oceans combined.",
    "The Great Red Spot on Jupiter is a storm that has lasted over 350 years.",
    "If you could fly a plane to Pluto, the trip would take more than 800 years.",
    "Neutron stars can spin 600 times per second.",
    "There's a planet made of diamonds — 55 Cancri e, twice the size of Earth.",
    "The Voyager 1 spacecraft is over 14 billion miles from Earth — and still sending data.",
    "Mars sunsets are blue because dust particles scatter red light forward.",
    "GPS satellites have to account for Einstein's relativity to stay accurate.",
    "There's a supermassive black hole at the center of our galaxy called Sagittarius A*.",
    "The observable universe is 93 billion light-years in diameter.",
    "Astronauts' hearts actually change shape in space — they become more spherical.",
    "The coldest place in space isn't empty space — it's the Boomerang Nebula at -272°C.",
    "Venus spins backwards compared to most other planets.",
    "A full NASA spacesuit costs approximately $12 million.",
    "In space, astronauts can't cry properly — tears don't fall, they form floating blobs.",
    "The Sun will eventually expand and engulf Earth in about 5 billion years.",
    "There are rogue planets drifting through space without orbiting any star.",
];

// ── AI Chatbot Knowledge Base ─────────────────────────────────────
export interface ChatAnswer {
    keywords: string[];
    answer: string;
}

export const spaceKnowledge: ChatAnswer[] = [
    {
        keywords: ["mars", "red"],
        answer: "Mars appears red because its surface is covered in iron oxide — essentially rust! Billions of years ago, iron minerals on the surface were oxidized by the thin atmosphere. Wind storms spread this rusty dust across the entire planet, giving it that distinctive reddish hue visible even from Earth. 🔴",
    },
    {
        keywords: ["light", "fast", "speed"],
        answer: "Light travels at approximately 299,792 km/s (186,282 miles per second) — the fastest speed possible in the universe! At this speed, light can circle Earth 7.5 times in just one second. It takes sunlight about 8 minutes and 20 seconds to reach Earth. ⚡",
    },
    {
        keywords: ["black hole"],
        answer: "A black hole is a region of spacetime where gravity is so strong that nothing — not even light — can escape once it crosses the \"event horizon.\" They form when massive stars collapse at the end of their lives. The supermassive black hole at our galaxy's center (Sagittarius A*) has the mass of 4 million Suns! Despite their fearsome reputation, you'd have to get very close to be in danger. 🕳️",
    },
    {
        keywords: ["sun", "star", "solar"],
        answer: "Our Sun is a G-type main-sequence star (yellow dwarf) about 4.6 billion years old. It's 1.4 million km in diameter and contains 99.86% of the Solar System's mass. At its core, temperatures reach 15 million°C, fusing 600 million tons of hydrogen into helium every second! It has about 5 billion years of fuel remaining. ☀️",
    },
    {
        keywords: ["moon", "luna"],
        answer: "Our Moon formed about 4.5 billion years ago, likely from debris when a Mars-sized object (Theia) collided with early Earth. It's 384,400 km away and slowly drifting farther (~3.8 cm/year). The Moon has no atmosphere, so footprints left by astronauts will last millions of years! It also causes Earth's tides. 🌙",
    },
    {
        keywords: ["jupiter", "biggest", "largest planet"],
        answer: "Jupiter is the largest planet in our solar system — 11x Earth's diameter and 317x its mass! It's a gas giant with no solid surface, made mostly of hydrogen and helium. Its Great Red Spot is a storm bigger than Earth that has raged for at least 350 years. Jupiter has 95 known moons, including Europa which may harbor life in its subsurface ocean! 🟤",
    },
    {
        keywords: ["saturn", "ring"],
        answer: "Saturn's iconic rings are made of billions of pieces of ice and rock, ranging from tiny grains to chunks as big as houses. The rings span 282,000 km in diameter but are incredibly thin — only about 10 meters thick! Saturn itself is a gas giant so light that it would float in water. It has 146 known moons — the most of any planet. 🪐",
    },
    {
        keywords: ["galaxy", "milky way"],
        answer: "The Milky Way is our spiral galaxy, containing 100-400 billion stars across a disk 100,000 light-years wide. Our Sun is located about 26,000 light-years from the center. The galaxy is rotating — our Solar System moves at 828,000 km/h! In about 4 billion years, the Milky Way will merge with the Andromeda galaxy. 🌌",
    },
    {
        keywords: ["astronaut", "space station", "iss"],
        answer: "The International Space Station (ISS) orbits Earth at 28,000 km/h, completing one orbit every 90 minutes. Astronauts experience 16 sunrises and sunsets daily! They grow up to 2 inches taller in microgravity. The ISS is the size of a football field and has been continuously inhabited since November 2000. 🛸",
    },
    {
        keywords: ["earth", "planet", "home"],
        answer: "Earth is the third planet from the Sun and the only known world to harbor life. It's 4.54 billion years old, with 71% of its surface covered by water. Our atmosphere is 78% nitrogen and 21% oxygen. Earth's magnetic field, generated by its molten iron core, protects us from harmful solar radiation. 🌍",
    },
    {
        keywords: ["star", "how", "born", "form"],
        answer: "Stars are born in giant clouds of gas and dust called nebulae. Gravity causes regions of the cloud to collapse and heat up. When the core reaches about 10 million°C, hydrogen fusion ignites and a star is born! Massive stars burn brighter but die faster (millions of years), while smaller stars can shine for trillions of years. ⭐",
    },
    {
        keywords: ["venus", "hottest"],
        answer: "Venus is the hottest planet at 464°C — hot enough to melt lead! Despite being farther from the Sun than Mercury, its thick CO₂ atmosphere creates a runaway greenhouse effect. A day on Venus (243 Earth days) is longer than its year (225 Earth days), and it spins backwards! ♀️",
    },
    {
        keywords: ["neptune", "uranus", "ice giant"],
        answer: "Neptune and Uranus are ice giants — different from gas giants like Jupiter and Saturn. They contain water, ammonia, and methane ices. Neptune has the fastest winds (2,100 km/h) while Uranus is the coldest planet (-224°C). Uranus uniquely rotates on its side, tilted 98°! 💎",
    },
    {
        keywords: ["comet", "asteroid", "meteor"],
        answer: "Comets are icy bodies that develop glowing tails when near the Sun. Asteroids are rocky leftovers from the Solar System's formation, mostly in the belt between Mars and Jupiter. Meteors are space rocks that burn up in Earth's atmosphere (\"shooting stars\"). If one reaches the ground, it's called a meteorite! ☄️",
    },
    {
        keywords: ["supernova", "explode", "explosion"],
        answer: "A supernova is the explosive death of a massive star — briefly outshining its entire galaxy! The explosion scatters heavy elements (carbon, iron, gold) into space, which eventually form new stars and planets. Every atom in your body heavier than hydrogen was forged in a star. We are literally made of stardust! 💥",
    },
    {
        keywords: ["dark matter", "dark energy"],
        answer: "About 95% of the universe is invisible! Dark matter (~27%) provides gravitational glue holding galaxies together, but doesn't emit light. Dark energy (~68%) is even more mysterious — it's driving the universe's accelerating expansion. Normal matter (stars, planets, us) is only ~5% of everything! 🌑",
    },
    {
        keywords: ["telescope", "hubble", "james webb", "jwst"],
        answer: "The James Webb Space Telescope (JWST), launched in 2021, is the most powerful space telescope ever built. Its 6.5m gold mirror sees in infrared, revealing the first galaxies formed after the Big Bang. Hubble, launched in 1990, revolutionized astronomy with stunning visible-light images. Together they've transformed our understanding of the cosmos! 🔭",
    },
    {
        keywords: ["alien", "life", "extraterrestrial"],
        answer: "Scientists haven't found confirmed alien life yet, but the search is intense! The most promising places in our Solar System are Mars (ancient microbial life), Europa (Jupiter's moon with a subsurface ocean), and Enceladus (Saturn's moon with water geysers). With billions of Earth-like planets in our galaxy, many scientists believe we're not alone! 👽",
    },
    {
        keywords: ["big bang", "universe", "origin", "beginning"],
        answer: "The Big Bang theory says the universe began ~13.8 billion years ago from an incredibly hot, dense state. In the first microseconds, fundamental particles formed. After 380,000 years, atoms appeared. The first stars ignited ~200 million years later. The universe is still expanding — and the expansion is accelerating! 💫",
    },
    {
        keywords: ["gravity", "weightless", "float"],
        answer: "Gravity is one of the four fundamental forces — it attracts objects with mass toward each other. In orbit, astronauts experience \"microgravity\" — they're actually falling around Earth, creating the sensation of weightlessness! Einstein's General Relativity describes gravity as the warping of spacetime by mass. 🍎",
    },
    {
        keywords: ["mercury", "smallest"],
        answer: "Mercury is the smallest planet (just slightly larger than our Moon) and the closest to the Sun. With virtually no atmosphere, temperatures swing wildly from -180°C at night to 430°C during the day. Despite being closest to the Sun, it's NOT the hottest — Venus holds that record due to its greenhouse effect! ☿️",
    },
    {
        keywords: ["pluto", "dwarf"],
        answer: "Pluto was reclassified as a \"dwarf planet\" in 2006 because it hasn't cleared its orbital neighborhood. NASA's New Horizons mission flew by in 2015, revealing a surprisingly complex world with mountains of water ice, nitrogen glaciers, and a thin atmosphere. Pluto's heart-shaped feature (Tombaugh Regio) captured public imagination! 💙",
    },
    {
        keywords: ["spacex", "elon", "rocket", "launch"],
        answer: "SpaceX, founded by Elon Musk in 2002, revolutionized spaceflight with reusable rockets. Falcon 9 regularly lands its boosters for reuse, dramatically cutting launch costs. Starship is the largest rocket ever built, designed to carry humans to Mars. SpaceX also operates Crew Dragon, ferrying astronauts to the ISS! 🚀",
    },
    {
        keywords: ["hello", "hi", "hey", "howdy"],
        answer: "Hello, space explorer! 🚀 I'm your Space AI assistant. Ask me anything about the cosmos — planets, stars, black holes, galaxies, space travel, and more! Here are some ideas:\n\n• Why is Mars red?\n• How fast is light?\n• What's inside a black hole?\n• How are stars born?",
    },
    {
        keywords: ["help", "what can you", "what do you"],
        answer: "I'm a space knowledge assistant! I can answer questions about:\n\n🪐 Planets & moons\n⭐ Stars & galaxies\n🕳️ Black holes & dark matter\n🚀 Space missions & exploration\n🔭 Telescopes & discoveries\n💫 The Big Bang & universe\n☄️ Comets, asteroids & meteors\n\nJust type your question and I'll share fascinating space facts!",
    },
];

// ── Curated APOD Gallery (offline fallback) ─────────────────────
export interface ApodEntry {
    title: string;
    explanation: string;
    url: string;
    date: string;
    copyright?: string;
}

export const curatedApod: ApodEntry[] = [
    {
        title: "The Horsehead Nebula in Infrared",
        explanation: "The Horsehead Nebula, one of the most identifiable nebulae in the sky, is part of the Orion Molecular Cloud Complex. Located about 1,500 light-years away, this dark nebula is visible as the dark indentation in the red emission nebula. The brilliant infrared glow comes from the nebula's hydrogen gas being energized by the nearby bright star Sigma Orionis.",
        url: "https://apod.nasa.gov/apod/image/2401/Horsehead_Hubble_960.jpg",
        date: "2024-01-15",
        copyright: "NASA/ESA/Hubble Heritage Team",
    },
    {
        title: "Pillars of Creation",
        explanation: "These towering pillars of cosmic dust and gas, called the Pillars of Creation, sit at the heart of the Eagle Nebula (M16). Captured by the James Webb Space Telescope, this near-infrared view reveals newly formed stars hiding behind the opaque pillars in visible light. The pillars are about 5 light-years tall.",
        url: "https://apod.nasa.gov/apod/image/2210/stsci-pillarsofcreation_960.jpg",
        date: "2024-02-20",
        copyright: "NASA/ESA/CSA/STScI",
    },
    {
        title: "Saturn's Rings in Full Glory",
        explanation: "Saturn's magnificent ring system, captured by the Cassini spacecraft during one of its many orbits. The rings are made of countless pieces of ice and rock, ranging in size from tiny grains to chunks as big as houses. While spanning 282,000 km in diameter, the rings are incredibly thin — only about 10 meters thick.",
        url: "https://apod.nasa.gov/apod/image/2308/SaturnRings_Cassini_960.jpg",
        date: "2024-03-10",
        copyright: "NASA/JPL-Caltech/Space Science Institute",
    },
    {
        title: "Andromeda Galaxy",
        explanation: "The Andromeda Galaxy (M31) is the nearest large galaxy to the Milky Way, located about 2.5 million light-years away. Containing roughly one trillion stars, it's on a collision course with our galaxy — though this cosmic merger won't happen for about 4.5 billion years, resulting in a new 'Milkomeda' galaxy.",
        url: "https://apod.nasa.gov/apod/image/2401/M31_HubbleSpitzer_960.jpg",
        date: "2024-04-05",
        copyright: "NASA/JPL-Caltech",
    },
    {
        title: "Earth Rise from the Moon",
        explanation: "One of the most iconic photographs ever taken: 'Earthrise' captures our planet rising above the lunar horizon. First photographed by Apollo 8 astronaut William Anders on December 24, 1968, this image fundamentally changed humanity's perspective on our place in the cosmos and sparked the modern environmental movement.",
        url: "https://apod.nasa.gov/apod/image/1312/Earthrise_Apollo8_960.jpg",
        date: "2024-05-01",
        copyright: "NASA/Apollo 8 Crew",
    },
];
