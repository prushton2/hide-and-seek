import axios from 'axios';

let backend_url = "http://localhost:3333"

interface updateResponse {
    id: string,
    askedQuestions: string[],
    shapes: {X: number, Y: number}[][]
    hiderspos: {X: number, Y: number}[]
    hiderpos: {X: number, Y: number}
    seekerspos: {X: number, Y: number}[]
    seekerpos: {X: number, Y: number}
}


export function ask(question: string) {
    let res
    try {
        res = axios.post(`${backend_url}/ask?q=${question}`, {
            id: localStorage.getItem("code"),
            pos: {
                X: 0,
                Y: 0
            }
        });
    } catch (e) {
        console.error("Error occurred while making the request:", e);
    }
}

export async function update(): Promise<updateResponse> {
    let response = await axios.post(`${backend_url}/update`, JSON.stringify({
        "id": localStorage.getItem("code"),
        "team": localStorage.getItem("team"),
        "no": parseInt(localStorage.getItem("no") as any as string),
        "pos": {"X": 0, "Y": 0}
    }))

    return (await response.data) as updateResponse;
}