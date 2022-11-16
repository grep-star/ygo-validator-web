import { useState, React } from 'react'
import { HISTORICAL, WAVE_MOTION } from '../Constants'
import cardSets from '../specs/card_sets.json'
import { selectStyle } from './Formatting'
import Select from 'react-select'

const opts = cardSets.filter(cardSet => cardSet.center_valid).map(cardSet => (
    { value: cardSet.set_name, label: `${cardSet.set_name} (${cardSet.set_code})` }
))

function Customization(props) {
    const handleChange = (event) => {
        props.updateCenter(event.value)
    }

    switch (props.mode) {
        case WAVE_MOTION:
            return (
                <>
                    <div style={{ display: 'inline-block', width: '500px', marginRight: '0.5em' }}>
                        <Select options={opts} onChange={handleChange} styles={selectStyle} placeholder="Select a center set" />
                    </div>
                    <div>
                        <input type="checkbox" checked={props.allowSpeedDuel} onChange={props.updateSpeedDuel} id="speed-duel" />
                        <label htmlFor="speed-duel">Allow Speed Duel sets?</label>
                        <input type="checkbox" checked={props.deckbuildAsCore} onChange={props.updateDeckbuild} id="deckbuild" style={{marginLeft: '1em'}} />
                        <label htmlFor="deckbuild">Handle deck build sets as core sets?</label>
                    </div>
                </>
            )
        case HISTORICAL:
            return (
                <>
                    <input type="checkbox" checked={props.traditional} onChange={props.updateTraditional} id="traditional" />
                    <label htmlFor="traditional">Traditional?</label>
                </>
            )
        default:
            return null
    }
}

export { Customization }