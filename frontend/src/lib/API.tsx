import axios from 'axios';
import type { UpdateResponse } from '../lib/interface'; 

let backend_url = "http://localhost:3333"

export async function ask(question: string) {
    let res
    try {
        res = await axios.post(`${backend_url}/ask?q=${question}`, JSON.stringify({
            id: localStorage.getItem("code")+"",
        }));
    } catch (e) {
        console.error("Error occurred while making the request:", e);
    }
}

export async function update(): Promise<UpdateResponse> {
    let response = await axios.post(`${backend_url}/update`, JSON.stringify({
        "id": localStorage.getItem("code"),
        "team": localStorage.getItem("team"),
        "no": parseInt(localStorage.getItem("no") as any as string),
        "pos": {"X": 0, "Y": 0}
    }))

    return (await response.data) as UpdateResponse;
}