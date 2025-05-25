export interface question {
    name: string,
    id:   string,
    icon: string
};

export const questions: { [key: string]: question } = {
    "matching-subway": {
        name: "Same Subway Station",
        id: "matching-subway",
        icon: ""
    },
    "matching-light_rail": {
        name: "Same Light Rail Stop",
        id: "matching-light_rail",
        icon: ""
    },
    "matching-McDonald's": {
        name: "Same McDonald's",
        id: "matching-McDonald's",
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
    
    "tentacles-McDonald's": {
        name: "McDonald's",
        id: "tentacles-McDonald's",
        icon: ""
    },
    "tentacles-Wendy's": {
        name: "Wendy's",
        id: "tentacles-Wendy's",
        icon: ""
    },
    "tentacles-burger": {
        name: "Burger Restaurant",
        id: "tentacles-burger",
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