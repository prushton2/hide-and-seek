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
    try {
        await axios.post(`${backend_url}/ask?q=${question}`, JSON.stringify({
            key: localStorage.getItem("key")
        }));
    } catch (e) {
        console.error("Error occurred while making the request:", e);
    }
}

export async function update(geoloc: Vector2): Promise<UpdateResponse> {
    let response = await axios.post(`${backend_url}/update`, JSON.stringify({
        "key": localStorage.getItem("key"),
        "pos": geoloc
    }))

    return (await response.data) as UpdateResponse;
}

export async function getLocations(): Promise<{[key: string]: Vector2[]}> {
    let response = await axios.get(`${backend_url}/getLocations`)
    // console.log(await response.data)
    return (await response.data) as {[key: string]: Vector2[]};
}

export async function leave(): Promise<null> {
    await axios.post(`${backend_url}/leave`, JSON.stringify({
        "key": localStorage.getItem("key")
    }))

    return null
}