import { useState, React } from 'react'
import cardSets from '../specs/card_sets.json'
import Select from 'react-select'
import { selectStyle, TitledColumn } from './Formatting'

function WaveMotionCustomization(props) {
    const [renderOpts, setRenderOpts] = useState([])

    const handleChange = (event) => {
        props.updateCenter(event.value)
    }

    cardSets.forEach(cardSet => {
        if (cardSet.center_valid) {
            renderOpts[cardSet.set_name] = `${cardSet.set_name} (${cardSet.set_code})`
        }
    })

    const opts = cardSets.filter(cardSet => cardSet.center_valid).map(cardSet => (
        { value: cardSet.set_name, label: `${cardSet.set_name} (${cardSet.set_code})` }
    ))

    return (
        <>
            <div style={{ display: 'inline-block', width: '500px', marginLeft: '1em', marginBottom: '1em' }}>
                <Select options={opts} onChange={handleChange} styles={selectStyle} placeholder="Select a center set" />
            </div>
        </>
    )
}

function WaveMotionDetails(props) {
    console.log(props)
    const setsAllowed = props.waveMotionSpec?.setClassifications
    return (setsAllowed != null ?
        <div className="flex-grid">
            <TitledColumn items={mapSets(setsAllowed['3'])} title={'Unlimited'} />
            <TitledColumn items={mapSets(setsAllowed['2'])} title={'Semi-Limited'} />
            <TitledColumn items={mapSets(setsAllowed['1'])} title={'Limited'} />
        </div> : null
    )
}

function mapSets(sets) {
    return(sets.map(set => set.set_name))
}

export { WaveMotionCustomization, WaveMotionDetails }