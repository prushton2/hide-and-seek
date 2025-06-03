import { useState, type JSX } from "react";
import { ask } from "./API";

export function Questions({callback}: {callback: (question: string) => void}) {
    const [state, setState] = useState<string>("showCategories"); // state (showCategories, showQuestions, showQuestion)
    const [info, setInfo] = useState<string[]>([])                  // info about the state (question being shown, category being shown, etc)

    function renderCategories() {
        let arr: JSX.Element[] = []
        
        Object.entries(questionCategories).forEach((category: [string, Category]) => {
            arr.push(
                <button key={category[0]}
                    className="questionCategory" 
                    onClick={() => {setState("showQuestions"); setInfo([category[0]])}}>
                    {category[1].name}
                </button>
            )
        })
        return arr
    }

    function renderQuestions() {
        
        let arr: JSX.Element[] = Object.entries(questionsMap)
            .filter((e: [string, Question]) => e[0].startsWith(info[0]))
            .map((question: [string, Question]) => {
                return <button key={question[1].id} className="question" onClick={(e) => {setState("showQuestion"); setInfo([question[0], info[0]])}}>
                    {question[1].name}
                </button>
            })

        arr.unshift(
            <button key="back" className="question" onClick={() => { setState("showCategories"); setInfo([]); }}>
                <div className="questionName">Back</div>
            </button>
        );
            
        return <>
            {questionCategories[info[0]].desc}
            <div className="questionContainer">    
                {arr}
            </div>
        </>
    }

    function renderQuestion() {
        let description = questionCategories[info[1]].desc

        questionsMap[info[0]].replaceString.forEach((e) => {
            description = description.replace("__", e)
        })

        return <div>
            <button onClick={(e) => { setState("showQuestions"); setInfo([info[1]]) }}>Back</button>
            <h2>{questionCategories[info[1]].name}: {questionsMap[info[0]].name}</h2>
            {description}
            <br />
            <br />
            <br />
            <button
                onClick={async(e) => { await ask(info[0]); callback(info[0]); setState("showCategories"); setInfo([]) }}
            >Ask</button>
        </div>
    }

    switch(state) {
        case "showCategories":
            return renderCategories()
        case "showQuestions":
            return renderQuestions()
        case "showQuestion":
            return renderQuestion()
    }
    return <></>
}

export interface Question {
    name: string,
    id:   string,
    icon: string
    replaceString: string[]
};

export interface Category {
    name: string
    desc: string
}

const questionCategories: { [key: string]: Category } = {
    "matching": {
        name: "Matching",
        desc: "Is your nearest __ the same as mine?"
    },
    "measure": {
        name: "Measuring",
        desc: "Are you closer or farther from your nearest __ than me?"
    },
    "thermometer": {
        name: "Thermometer",
        desc: "Ive traveled __, am I closer or farther to you?"
    },
    "tentacles": {
        name: "Tentacles",
        desc: "Out of all the __ within __ of me, which one are you closest to?"
    },
    "radar": {
        name: "Radar",
        desc: "Are you within __ of me?"
    }
}

const questionsMap: { [key: string]: Question } = {

    // Matching
    
    "matching-subway": {
        name: "Subway Station",
        id: "matching-subway",
        icon: "",
        replaceString: ["subway station"]
    },
    "matching-light_rail": {
        name: "Light Rail Stop",
        id: "matching-light_rail",
        icon: "",
        replaceString: ["light rail station"]
    },
    "matching-raisingcanes": {
        name: "Raising Cane's",
        id: "matching-raisingcanes",
        icon: "",
        replaceString: ["Raising Cane's"]
    },
    "matching-hospital": {
        name: "Hospital",
        id: "matching-hospital",
        icon: "",
        replaceString: ["hospital"]
    },

    // Measure

    "measure-subway": {
        name: "Subway Station",
        id: "measure-subway",
        icon: "",
        replaceString: ["subway station"]
    },
    "measure-raisingcanes": {
        name: "Raising Cane's",
        id: "measure-raisingcanes",
        icon: "",
        replaceString: ["Raising Cane's"]
    },
    "measure-hospital": {
        name: "Hospital",
        id: "measure-hospital",
        icon: "",
        replaceString: ["hospital"]
    },
    "measure-airport": {
        name: "Airport",
        id: "measure-airport",
        icon: "",
        replaceString: ["airport"]
    },
    
    // Thermometer

    "thermometer-4min": {
        name: "4 min",
        id: "thermometer-4min",
        icon: "",
        replaceString: ["for 4 minutes"]
    },

    // Tentacles
    
    "tentacles-mcdonalds": {
        name: "McDonald's",
        id: "tentacles-mcdonalds",
        icon: "",
        replaceString: ["McDonald's", "1 mile"]
    },
    "tentacles-Wendy's": {
        name: "Wendy's",
        id: "tentacles-wendys",
        icon: "",
        replaceString: ["Wendy's", "1 mile"]
    },
    "tentacles-burger": {
        name: "Burger Restaurant",
        id: "tentacles-burger",
        icon: "",
        replaceString: ["burger restaurants", "1 mile"]
    },
    
    // Radar

    "radar-0.5mi": {
        name: "Half Mile Radar",
        id: "radar-0.5mi",
        icon: "",
        replaceString: ["half a mile"]
    },
    "radar-1mi": {
        name: "1 Mile Radar",
        id: "radar-1mi",
        icon: "",
        replaceString: ["1 mile"]
    },
    "radar-2mi": {
        name: "2 Mile Radar",
        id: "radar-2mi",
        icon: "",
        replaceString: ["2 miles"]
    },
    "radar-3mi": {
        name: "3 Mile Radar",
        id: "radar-3mi",
        icon: "",
        replaceString: ["3 miles"]
    }
};