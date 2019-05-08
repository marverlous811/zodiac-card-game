const zodiacCard = [
    {
        name: "aries",
        values: [5,6,7,8,9],
        minValue: 5,
    },
    {
        name: "taurus",
        values: [2,4,6,8],
        minValue: 2,
    },
    {
        name: "gemini",
        values: [1,1,4,4,7,7],
        minValue: 1,
    },
    {
        name: "cancer",
        values: [0,0,5,5,10,10],
        minValue: 0,
    },
    {
        name: "leo",
        values: [1,3,5,7,9],
        minValue: 1,
    },
    {
        name: "virgo",
        values: [1,2,3,4,5],
        minValue: 1,
    },
    {
        name: "libra",
        values: [1,2,3,4,6,7,8,9],
        minValue: 1,
    },
    {
        name: "scorpio",
        values: [-1,-1,1,1],
        minValue: -1,
    },
    {
        name: "sagittarius",
        values: [4,6,8,10],
        minValue: 4,
    },
    {
        name: "capricorn",
        values: [5,7,9,11],
        minValue: 5,
    },
    {
        name: "aquarius",
        values: [3,3,6,6,9,9],
        minValue: 3,
    },
    {
        name: "pisces",
        values: [4,4,6,6,8,8],
        minValue: 4,
    },
]

const planetCard = [
    {
        name: "mars",
        values: 1,
        listZodiac: ["aries"],
    },
    {
        name: "venus",
        values: 1,
        listZodiac: ["taurus", "libra"],
    },
    {
        name: "mercury",
        values: 1,
        listZodiac: ["virgo", "gemini"],
    },
    {
        name: "moon",
        values: 1,
        listZodiac: ["cancer"],
    },
    {
        name: "sun",
        values: 1,
        listZodiac: ["leo"],
    },
    {
        name: "pluto",
        values: 1,
        listZodiac: ["scorpio"],
    },
    {
        name: "jupiter",
        values: 1,
        listZodiac: ["sagittarius"],
    },
    {
        name: "saturn",
        values: 1,
        listZodiac: ["capricorn"],
    },
    {
        name: "uranus",
        values: 1,
        listZodiac: ["aquarius"],
    },
    {
        name: "neptune",
        values: 1,
        listZodiac: ["pisces"],
    },
    {
        name: "judgement",
        values: 1,
        listZodiac: ["*"],
    },
    {
        name: "the world",
        values: 1,
        listZodiac: ["*"],
    }
]

const CardData = {
    zodiacCard,
    planetCard
};

export default CardData;