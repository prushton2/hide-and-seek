import "./burger.css"
import "./switch.css"

import { useEffect, useState, type JSX } from "react"
import { slide as Slide} from 'react-burger-menu'

function Menu({options, onChange}: {options: {name: string, type: string, initialValue: any}[], onChange: (settings: Map<string, any>) => void}) {
    const [state, setState] = useState<Map<string, any>>()

    function updateState(key: string, value: any) {
        const newState = new Map(state);
        newState.set(key, value);
        setState(newState)
        onChange(newState)
    }

    useEffect(() => {
        setState(
            new Map(
                options.map((e) => {
                    return [e.name, state?.get(e.name) == undefined ? e.initialValue : state?.get(e.name)]
                })
            )
        )
    }, [options])
    
    function generateOptions(opt: {name: string, type: string, initialValue: any}[]) {
        let jsx: JSX.Element[] = []
        
        for (const option of opt) {

            switch(option.type) {
                case "switch":
                    if (typeof option.initialValue !== "boolean") {
                        console.warn(`Expected boolean for switch option "${option.name}", got ${typeof option.initialValue}`);
                        continue;
                    }

                    jsx.push(
                        <div className='bm-switch' key={option.name}>
                            <label className='bm-switch-label'>
                                {option.name}
                            </label>
                            <label className="switch">
                                <input type="checkbox" defaultChecked={option.initialValue} onChange={(e) => {updateState(option.name, e.target.checked)}}/>
                                <span className="switch-slider"></span>
                            </label>
                        </div>
                    )
                    break;
                case "slider":
                    jsx.push(<div className='bm-slider' key={option.name}>
                        <label className='bm-slider-label'>
                            {option.name}
                        </label><br />
                        <div className="slidecontainer">
                            <input type="range" min="1" max="128" defaultValue={option.initialValue} className="slider" onChange={(e) => {updateState(option.name, e.target.value)}} />
                        </div>
                        {state?.get(option.name)}
                    </div>)
                    break;
                case "header":
                    jsx.push(
                        <label className="bm-header" key={option.name}>{option.name}</label>
                    )

                    break;
                default:
                    console.warn(`Unknown option type: ${option.type} for key: ${option.name}`);
            }

        }
        return jsx;
    }

    return <Slide right>
        {generateOptions(options)}
    </Slide>
}


export default Menu;