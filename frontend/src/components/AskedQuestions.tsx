import "./askedQuestions.css"
import { questionCategories } from "./questions";

function AskedQuestions({askedQuestions}: {askedQuestions: string[]}) {
    askedQuestions = askedQuestions.reverse();

    function questionInfo(question: string) {
        let category = question.split("-")[0]
        let name = question.split("-").slice(1).join(" ")
        
        return <tr key={question}>
            <td className="leftColumn">
                {category}           
            </td>
            <td className="midColumn">
                {name}
            </td>
            <td>
                {questionCategories[category].card}
            </td>
        </tr>
    }

    return (
        <div className="div">
            <h1>Asked Questions</h1>
            <table className="table">
                <tr>
                    <th>Category</th>
                    <th>Question</th>
                    <th>Card Draws</th>
                </tr>

                {askedQuestions.map((e) => {
                    return questionInfo(e)
                })}
            </table>
        </div>
    )
}

export default AskedQuestions;