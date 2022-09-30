import { React } from 'react'
import Select from 'react-select'
import { selectStyle } from './Formatting'

const FORMAT_CATEGORY = 'format-category'

function FormatCategorySelector(props) {
    const handleChange = (event) => {
        props.updateAppState(event.value)
    }

    const opts = props.formatKeys.map(format => (
        {value: format, label: format}   
    ))

    return (
        <>
            <div style={{ display: 'inline-block', width: '300px', marginRight: '1em', marginBottom: '1em' }}>
                <Select id={FORMAT_CATEGORY} options={opts} onChange={handleChange} styles={selectStyle} placeholder="Select a format" />
            </div>
        </>
    )
}

export { FORMAT_CATEGORY, FormatCategorySelector }