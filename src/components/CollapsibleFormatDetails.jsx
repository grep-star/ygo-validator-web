import { useState } from 'react'
import { React } from 'react'
import useCollapse from 'react-collapsed'
import { HISTORICAL, WAVE_MOTION } from '../Constants'
import { lookupCardByName } from '../models/Cards'
import { RenderableDiv, TitledColumn } from './Formatting'

function CollapsibleFormatDetails(props) {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()
    let renderedElement = null
    switch (props.mode) {
        case WAVE_MOTION:
            renderedElement = (<WaveMotionDetails waveMotionSpec={props.waveMotionSpec} />)
            break
        case HISTORICAL:
            renderedElement = (<HistoricalDetails formatSpec={props.formatSpec} traditional={props.traditional} />)
            break
        default:
            renderedElement = (null)
    }

    return (
        renderedElement != null ?
            <div>
                <button {...getToggleProps()} style={{ marginBottom: '1em' }}>
                    {(isExpanded ? 'Hide' : 'Show') + ' format details'}
                </button>
                <section {...getCollapseProps()}>
                    {renderedElement}
                </section>
            </div> : null
    )
}

function WaveMotionDetails(props) {
    const setsAllowed = props.waveMotionSpec?.setClassifications
    return (setsAllowed != null ?
        <div className="flex-grid">
            <TitledColumn items={mapSets(setsAllowed['3'])} title={'Unlimited'} />
            <TitledColumn items={mapSets(setsAllowed['2'])} title={'Semi-Limited'} />
            <TitledColumn items={mapSets(setsAllowed['1'])} title={'Limited'} />
        </div> : null
    )
}

function HistoricalDetails(props) {
    return (props.formatSpec ? <div>
        All cards through the set "{props.formatSpec.lastSet}" are permitted, with the following restrictions:
        <div className="flex-grid">
            <TitledColumn objects={mapCardNamesToRenderables(props.formatSpec.forbidden)} title={props.traditional ? 'Limited (normally forbidden, but limited in traditional)' : 'Forbidden'} />
            <TitledColumn objects={mapCardNamesToRenderables(props.formatSpec.limited)} title={'Limited'} />
            <TitledColumn objects={mapCardNamesToRenderables(props.formatSpec.semiLimited)} title={'Semi-Limited'} />
        </div>
    </div> : null)
}

function mapCardNamesToRenderables(cardNames) {
    return cardNames.map(cardName => (
        new RenderableDiv(cardName, lookupCardByName(cardName).mapToDomClass())
    ))
}

function mapSets(sets) {
    return(sets.map(set => set.set_name))
}

export { CollapsibleFormatDetails }