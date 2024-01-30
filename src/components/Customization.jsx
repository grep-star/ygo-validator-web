import { useState, React } from 'react'
import { ERA, HISTORICAL, WAVE_MOTION } from '../Constants'
import cardSets from '../specs/card_sets.json'
import { selectStyle } from './Formatting'
import Select from 'react-select'
import { sortSetsOnDate } from '../models/Cards'

function mapSetForDisplay(cardSet) {
    return { value: cardSet.set_name, label: `${cardSet.set_name} (${cardSet.set_code})` }
}

const opts = cardSets.filter(cardSet => cardSet.center_valid).map(cardSet => (
    mapSetForDisplay(cardSet)
))

const eraSets = sortSetsOnDate(cardSets)
    .filter(cardSet => cardSet.tcg_date !== null)
    .map(cardSet => (
        mapSetForDisplay(cardSet)
    )
)

function Customization(props) {
    const handleChange = (event) => {
        props.updateCenter(event.value)
    }

    const changeEarliest = (event) => {
        props.updateEraFirstSet(event.value)
    }

    const changeLatest = (event) => {
        props.updateEraLastSet(event.value)
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
        case ERA:
            return (
                <div style={{ display: 'inline-block', width: '500px', marginRight: '0.5em' }}>
                        <Select options={eraSets} onChange={changeEarliest} styles={selectStyle} placeholder="Select the earliest set" />
                        <Select options={eraSets} onChange={changeLatest} styles={selectStyle} placeholder="Select the latest set" />
                </div>
            )
        default:
            return null
    }
}

export { Customization }