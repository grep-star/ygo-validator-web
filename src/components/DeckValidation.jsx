import { useFilePicker } from 'use-file-picker'
import { Decklist } from '../models/Cards'

function DeckValidator(props) {
    const [openFileSelector, { filesContent, loading }] = useFilePicker({
        accept: '.ydk',
        limitFilesConfig: { max: 1 }
    })

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <button onClick={() => openFileSelector()} style={{ marginBottom: '1em' }}>Validate Decklist</button>
            <br />
            {filesContent.map((file, index) => (
                <div>
                    <DeckValidationResult fileContent={file.content} validator={props.validator} />
                </div>
            ))}
        </div>
    )
}

function DeckValidationResult(props) {
    const deck = Decklist.parseFromFile(props.fileContent)
    const result = props.validator.validate(deck)
    console.log(result)
    return (
        result.length > 0 ?
            (
                result.map(err => (
                    <div key={err}>{err}</div>
                ))
            ) : <div>"Looks good to me!"</div>
    )
}

export { DeckValidator, DeckValidationResult }