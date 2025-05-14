import axios from 'axios';

let backend_url = "http://localhost:3333"

export function ask(question: string, parameters: {string: string}) {
    return axios.post(`${backend_url}/ask?q=${question}`, {
        parameters: parameters,
    });
}