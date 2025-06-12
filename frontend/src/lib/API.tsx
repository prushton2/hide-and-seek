import axios from 'axios';
import type { UpdateResponse, JoinResponse, PlayerInfo, Vector2 } from '../lib/interface'; 

let backend_url = "http://localhost:3333"

export async function join(code: string, team: string): Promise<JoinResponse> {
    let response = await axios.post(`${backend_url}/join`, JSON.stringify({
        team: team,
        code: code
    }));
    return (await response.data) as JoinResponse;
}

export async function playerInfo(key: string): Promise<PlayerInfo> {
    let response = await axios.post(`${backend_url}/playerInfo`, JSON.stringify({
        key: key
    }));
    return (await response.data) as PlayerInfo;
}

export async function ask(question: string) {
    let res;
    try {
        res = await axios.post(`${backend_url}/ask?q=${question}`, JSON.stringify({
            key: localStorage.getItem("key")
        }));
    } catch (e) {
        console.error("Error occurred while making the request:", e);
    }
}

export async function update(): Promise<UpdateResponse> {
    let response = await axios.post(`${backend_url}/update`, JSON.stringify({
        "key": localStorage.getItem("key"),
        "pos": {"X": 0, "Y": 0}
    }))

    return (await response.data) as UpdateResponse;
}

export async function getLocations(): Promise<Map<string, Vector2[]>> {
    let response = await axios.get(`${backend_url}/getLocations`)

    return (await response.data) as Map<string, Vector2[]>;
}