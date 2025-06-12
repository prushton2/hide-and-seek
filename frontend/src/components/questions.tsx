import { useState, type JSX } from "react";
import { ask } from "../lib/API";

export function Questions({askedQuestions, callback}: {askedQuestions: string[], callback: (question: string) => void}) {
    const [state, setState] = useState<string>("showCategories"); // state (showCategories, showQuestions, showQuestion)
    const [category, setCategory] = useState<string>("")          // info about the state (question being shown, category being shown, etc)
    const [question, setQuestion] = useState<string>("")                

    function renderCategories() {
        let arr: JSX.Element[] = []
        
        Object.entries(questionCategories).forEach((category: [string, Category]) => {
            arr.push(
                <button key={category[0]}
                    className="questionCategory" 
                    onClick={() => {setState("showQuestions"); setCategory(category[0])}}>
                    {category[1].name}
                </button>
            )
        })
        return arr
    }

    function renderQuestions() {
        
        let arr: JSX.Element[] = Object.entries(questionsMap)
            .filter((e: [string, Question]) => e[0].startsWith(category))
            .map((q: [string, Question]) => {
                return <button key={q[1].id} className="question" style={{backgroundColor: askedQuestions.indexOf(q[0]) >= 0 ? "#545454" : "#141414" }} onClick={(e) => {setState("showQuestion"); setQuestion(q[0])}}>
                    {q[1].name}
                </button>
            })

        arr.unshift(
            <button key="back" className="question" onClick={() => { setState("showCategories"); setCategory(""); setQuestion("") }}>
                <div className="questionName">Back</div>
            </button>
        );
            
        return <>
            {questionCategories[category].desc}
            <div className="questionContainer">    
                {arr}
            </div>
        </>
    }

    function renderQuestion() {
        let description = questionCategories[category].desc

        questionsMap[question].replaceString.forEach((e) => {
            description = description.replace("__", e)
        })

        return <div>
            <button onClick={(e) => { setState("showQuestions"); setQuestion("") }}>Back</button>
            <h2>{questionCategories[category].name}: {questionsMap[question].name}</h2>
            {description}
            <br />
            <br />
            <br />
            {askedQuestions.indexOf(question) == -1 ?
                <button onClick={async() => { await ask(question); callback(question); setState("showCategories"); setQuestion("") }}>Ask</button>
                : <label>Question Asked</label>
            }
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
    card: string
}

export const questionCategories: { [key: string]: Category } = {
    "matching": {
        name: "Matching",
        desc: "Is your nearest __ the same as mine?",
        card: "Draw 3 Pick 1"
    },
    "measure": {
        name: "Measuring",
        desc: "Are you closer or farther from your nearest __ than me?",
        card: "Draw 3 Pick 1"
    },
    // "thermometer": {
    //     name: "Thermometer",
    //     desc: "Ive traveled __, am I closer or farther to you?",
    //     card: "Draw 2 Pick 1"
    // },
    "radar": {
        name: "Radar",
        desc: "Are you within __ of me?",
        card: "Draw 2 Pick 1"
    },
    "tentacles": {
        name: "Tentacles",
        desc: "Out of all the __ within __ of me, which one are you closest to?",
        card: "Draw 4 Pick 2"
    }
}

export const questionsMap: { [key: string]: Question } = {

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
    "matching-museum": {
        name: "Museum",
        id: "matching-museum",
        icon: "",
        replaceString: ["museum"]
    },
    "matching-ferry": {
        name: "Ferry",
        id: "matching-ferry",
        icon: "",
        replaceString: ["ferry terminal"]
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
    "measure-museum": {
        name: "Museum",
        id: "measure-museum",
        icon: "",
        replaceString: ["museum"]
    },
    "measure-ferry": {
        name: "Ferry",
        id: "measure-ferry",
        icon: "",
        replaceString: ["ferry terminal"]
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