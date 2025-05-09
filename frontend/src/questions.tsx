export interface question {
    name: string,
    id:   string,
    icon: string
};

export const questions: { [key: string]: question[] } = {
    "Matching": [
        {
            name: "Same Train Station",
            id: "matching-trainstation",
            icon: ""
        },
        {
            name: "Same Airport",
            id: "matching-airport",
            icon: ""
        },
        {
            name: "Same Hospital",
            id: "matching-hospital",
            icon: ""
        },
        {
            name: "Same Coastline",
            id: "matching-coastline",
            icon: ""
        }
    ],
    "Measuring": [
        {
            name: "Hospital",
            id: "measure-hospital",
            icon: ""
        }
    ],
    "Thermometer": [
        {
            name: "4 min",
            id: "thermometer-4min",
            icon: ""
        }
    ],
    "Radar": [],
    "Tentacles": [],
    "Photos": []
};