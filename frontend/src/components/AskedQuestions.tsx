import "./askedQuestions.css"
import { QuestionCategories } from "./questions";

function AskedQuestions({askedQuestions}: {askedQuestions: string[]}) {
    askedQuestions = askedQuestions.reverse();

    function questionInfo(question: string, index: number) {
        let category = question.split("-")[0]
        let name = question.split("-").join(" ")
        
        return <tr key={question}>
            <td>{index}</td>
            <td>{name}</td>
            <td>{QuestionCategories[category].card}</td>
        </tr>
    }

    return (
        <div className="div">
            <h1>Asked Questions</h1>
            <table className="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Question</th>
                    <th>Card Draws</th>
                </tr>
            </thead>
            <tbody>
                {askedQuestions.map((e, i) => {
                    return questionInfo(e, askedQuestions.length-i)
                })}
            </tbody>
            </table>
        </div>
    )
}

export default AskedQuestions;