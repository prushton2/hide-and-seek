export interface question {
    name: string,
    id:   string,
    icon: string
};

export const questions: { [key: string]: question } = {
    "matching-trainstation": {
        name: "Same Train Station",
        id: "matching-trainstation",
        icon: ""
    },
    "matching-hospital": {
        name: "Same Hospital",
        id: "matching-hospital",
        icon: ""
    },
    "matching-coastline": {
        name: "Same Coastline",
        id: "matching-coastline",
        icon: ""
    },
    "measure-hospital": {
        name: "Hospital",
        id: "measure-hospital",
        icon: ""
    },
    "thermometer-4min": {
        name: "4 min",
        id: "thermometer-4min",
        icon: ""
    },
    "tentacles-mcdonalds": {
        name: "McDonalds",
        id: "tentacles-mcdonalds",
        icon: ""
    }
};