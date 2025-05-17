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
    },
    "radar-0.5mi": {
        name: "Half Mile Radar",
        id: "radar-0.5mi",
        icon: ""
    },
    "radar-1mi": {
        name: "1 Mile Radar",
        id: "radar-1mi",
        icon: ""
    },
    "radar-2mi": {
        name: "2 Mile Radar",
        id: "radar-2mi",
        icon: ""
    },
    "radar-3mi": {
        name: "3 Mile Radar",
        id: "radar-3mi",
        icon: ""
    }
};