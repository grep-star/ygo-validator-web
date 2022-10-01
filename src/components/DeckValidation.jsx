import { useRef } from 'react'
import { Decklist } from '../models/Cards'

function DeckValidator(props) {
    const fileReader = new FileReader()
    const hiddenInput = useRef(null)

    const updateParent = () => {
        props.setValidationResult(props.validator.validate(Decklist.parseFromFile(fileReader.result)))
    }

    const processUpload = (event) => {
        fileReader.onloadend = updateParent
        fileReader.readAsText(event.target.files[0])
    }

    return (
        <div>
            <button onClick={() => hiddenInput.current.click()} style={{ marginRight: '0.5em' }}>Validate Decklist</button>
            <input type="file" accept='.ydk' ref={hiddenInput} style={{display:'none'}} onChange={processUpload} />
            <br />
        </div>
    )
}

export { DeckValidator }