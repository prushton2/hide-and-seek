interface question {
    name: string,
    id:   string,
    icon: string
};

export const questions: { [key: string]: question[] } = {
    "Matching": [],
    "Measuring": [],
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