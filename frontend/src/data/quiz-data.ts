export interface QuizQuestion {
    question: string;
    options: string[];
    correct: number; // index of correct answer
    explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
    {
        question: "Which planet is known as the 'Red Planet'?",
        options: ["Venus", "Mars", "Jupiter", "Mercury"],
        correct: 1,
        explanation: "Mars is called the Red Planet because iron oxide (rust) on its surface gives it a reddish appearance.",
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Saturn", "Neptune", "Jupiter", "Uranus"],
        correct: 2,
        explanation: "Jupiter is the largest planet, with a diameter of about 139,820 km — 11 times Earth's diameter!",
    },
    {
        question: "How long does it take sunlight to reach Earth?",
        options: ["1 minute", "8 minutes", "30 minutes", "1 hour"],
        correct: 1,
        explanation: "Light from the Sun takes approximately 8 minutes and 20 seconds to reach Earth.",
    },
    {
        question: "Which planet has the most moons?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correct: 1,
        explanation: "Saturn has 146 known moons as of 2024, surpassing Jupiter's 95 known moons.",
    },
    {
        question: "What is the hottest planet in our solar system?",
        options: ["Mercury", "Venus", "Mars", "Jupiter"],
        correct: 1,
        explanation: "Venus is the hottest at 464°C due to a runaway greenhouse effect, despite Mercury being closer to the Sun.",
    },
    {
        question: "What type of galaxy is the Milky Way?",
        options: ["Elliptical", "Irregular", "Spiral", "Lenticular"],
        correct: 2,
        explanation: "The Milky Way is a barred spiral galaxy about 100,000 light-years in diameter.",
    },
    {
        question: "What causes a solar eclipse?",
        options: [
            "Earth passes between the Sun and Moon",
            "The Moon passes between Earth and the Sun",
            "The Sun moves behind Jupiter",
            "Earth's shadow covers the Sun",
        ],
        correct: 1,
        explanation: "A solar eclipse occurs when the Moon passes between Earth and the Sun, blocking sunlight.",
    },
    {
        question: "How old is the universe (approximately)?",
        options: ["4.5 billion years", "10 billion years", "13.8 billion years", "20 billion years"],
        correct: 2,
        explanation: "The universe is approximately 13.8 billion years old, based on cosmic microwave background observations.",
    },
    {
        question: "Which planet rotates on its side?",
        options: ["Neptune", "Uranus", "Saturn", "Pluto"],
        correct: 1,
        explanation: "Uranus has an axial tilt of about 98 degrees, essentially rotating on its side!",
    },
    {
        question: "What is a light-year a measure of?",
        options: ["Time", "Distance", "Speed", "Brightness"],
        correct: 1,
        explanation: "A light-year is a unit of distance — about 9.46 trillion kilometers (the distance light travels in one year).",
    },
    {
        question: "Which spacecraft was the first to land on Mars?",
        options: ["Curiosity", "Viking 1", "Opportunity", "Perseverance"],
        correct: 1,
        explanation: "Viking 1 was the first spacecraft to successfully land on Mars on July 20, 1976.",
    },
    {
        question: "What is at the center of our galaxy?",
        options: ["A white dwarf", "A quasar", "A supermassive black hole", "A binary star system"],
        correct: 2,
        explanation: "Sagittarius A* is a supermassive black hole at the center of the Milky Way, with a mass of 4 million Suns.",
    },
    {
        question: "What percentage of the universe is dark energy?",
        options: ["5%", "27%", "50%", "68%"],
        correct: 3,
        explanation: "About 68% of the universe is dark energy, 27% is dark matter, and only ~5% is normal matter.",
    },
    {
        question: "How many Earth days is a year on Mercury?",
        options: ["88 days", "165 days", "365 days", "687 days"],
        correct: 0,
        explanation: "Mercury orbits the Sun in just 88 Earth days, making it the shortest year of any planet.",
    },
    {
        question: "Which moon of Jupiter is most likely to harbor life?",
        options: ["Io", "Ganymede", "Callisto", "Europa"],
        correct: 3,
        explanation: "Europa has a subsurface ocean beneath its icy crust, making it one of the most promising places to search for alien life.",
    },
    {
        question: "What is the smallest planet in our solar system?",
        options: ["Mars", "Venus", "Mercury", "Pluto"],
        correct: 2,
        explanation: "Mercury is the smallest planet. Pluto was reclassified as a dwarf planet in 2006.",
    },
    {
        question: "What is a supernova?",
        options: [
            "A type of comet",
            "The birth of a star",
            "The explosive death of a massive star",
            "A collision between asteroids",
        ],
        correct: 2,
        explanation: "A supernova is the spectacular explosion of a massive star at the end of its life, briefly outshining an entire galaxy.",
    },
    {
        question: "What are Saturn's rings primarily made of?",
        options: ["Gas and dust", "Rock and metal", "Ice and rock", "Liquid methane"],
        correct: 2,
        explanation: "Saturn's rings are composed mainly of pieces of ice and rock, ranging from tiny grains to house-sized chunks.",
    },
    {
        question: "How fast does the ISS orbit Earth?",
        options: ["8,000 km/h", "18,000 km/h", "28,000 km/h", "38,000 km/h"],
        correct: 2,
        explanation: "The ISS orbits at about 28,000 km/h (17,500 mph), completing one orbit every ~90 minutes.",
    },
    {
        question: "Which planet has the fastest winds in the solar system?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correct: 3,
        explanation: "Neptune has the fastest winds, reaching speeds of up to 2,100 km/h (1,300 mph)!",
    },
    {
        question: "What is the Oort Cloud?",
        options: [
            "A nebula near the Sun",
            "An asteroid belt between Mars and Jupiter",
            "A cloud of comets surrounding the outer solar system",
            "A cloud of gas on Jupiter",
        ],
        correct: 2,
        explanation: "The Oort Cloud is a theoretical shell of icy objects surrounding our solar system, extending up to 2 light-years from the Sun.",
    },
    {
        question: "What was the first human-made object to leave the solar system?",
        options: ["Apollo 11", "Voyager 1", "New Horizons", "Pioneer 10"],
        correct: 1,
        explanation: "Voyager 1, launched in 1977, entered interstellar space in August 2012 and continues sending data from over 14 billion miles away.",
    },
    {
        question: "What is the name of Mars's largest volcano?",
        options: ["Mount Olympus", "Olympus Mons", "Valles Marineris", "Tharsis Montes"],
        correct: 1,
        explanation: "Olympus Mons is the tallest volcano in the solar system at 21.9 km high — nearly 3 times the height of Mount Everest!",
    },
    {
        question: "How many planets in our solar system have rings?",
        options: ["1", "2", "3", "4"],
        correct: 3,
        explanation: "Four planets have rings: Jupiter, Saturn, Uranus, and Neptune. Saturn's are the most visible and spectacular.",
    },
    {
        question: "What color are Mars's sunsets?",
        options: ["Red", "Orange", "Blue", "Green"],
        correct: 2,
        explanation: "Mars sunsets appear blue! Fine dust in the atmosphere scatters red light forward and lets blue light through near the Sun.",
    },
    {
        question: "What is the nearest star to Earth (besides the Sun)?",
        options: ["Sirius", "Alpha Centauri", "Proxima Centauri", "Betelgeuse"],
        correct: 2,
        explanation: "Proxima Centauri is the closest star at 4.24 light-years away. It's part of the Alpha Centauri star system.",
    },
    {
        question: "Which space telescope was launched in 2021?",
        options: ["Hubble", "Kepler", "James Webb", "Spitzer"],
        correct: 2,
        explanation: "The James Webb Space Telescope (JWST) was launched on December 25, 2021, and is the most powerful space telescope ever built.",
    },
    {
        question: "What causes the Northern Lights (Aurora Borealis)?",
        options: [
            "Meteors burning up in the atmosphere",
            "Reflected sunlight from ice crystals",
            "Charged particles from the Sun interacting with Earth's atmosphere",
            "Light from distant galaxies",
        ],
        correct: 2,
        explanation: "The Northern Lights occur when charged particles from the Sun (solar wind) interact with gases in Earth's atmosphere, guided by Earth's magnetic field.",
    },
    {
        question: "What is the Great Red Spot on Jupiter?",
        options: [
            "A volcanic crater",
            "A massive storm",
            "An impact scar from a comet",
            "A region of iron oxide",
        ],
        correct: 1,
        explanation: "The Great Red Spot is a massive anticyclonic storm on Jupiter that has been raging for at least 350 years — and it's bigger than Earth!",
    },
    {
        question: "Which element makes up most of the Sun?",
        options: ["Oxygen", "Carbon", "Helium", "Hydrogen"],
        correct: 3,
        explanation: "The Sun is about 73% hydrogen and 25% helium. Through nuclear fusion, it converts hydrogen into helium, releasing enormous energy.",
    },
];
