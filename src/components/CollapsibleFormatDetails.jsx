import { useState } from 'react'
import { React } from 'react'
import useCollapse from 'react-collapsed'
import { HISTORICAL, WAVE_MOTION } from '../Constants'
import { lookupCardByName } from '../models/Cards'
import { RenderableDiv, separator, TitledColumn } from './Formatting'

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
            <TitledColumn objects={mapSets(setsAllowed['3'], true)} title={'Unlimited'} />
            <TitledColumn objects={mapSets(setsAllowed['2'])} title={'Semi-Limited'} />
            <TitledColumn objects={mapSets(setsAllowed['1'])} title={'Limited'} />
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
        new RenderableDiv(cardName, lookupCardByName(cardName).mapToDomClass(), yugipediaLink(cardName))
    ))
}

function mapSets(sets, addLegend = false) {
    const formatClassName = (classType) => (
        `set-${classType}`
    )
    const renderables = sets.map(set => (
        new RenderableDiv(set.set_name, formatClassName(set.set_type), yugipediaLink(set.set_name))
    ))
    if (addLegend) {
        renderables.push(separator)
        renderables.push(new RenderableDiv("Legend:", null))
        renderables.push(new RenderableDiv("Core Sets", formatClassName('core')))
        renderables.push(new RenderableDiv("Side Sets", formatClassName('side')))
        renderables.push(new RenderableDiv("Deck Build Packs", formatClassName('deckbuild')))
        renderables.push(new RenderableDiv("Decks", formatClassName('deck')))
        renderables.push(new RenderableDiv("Promos/Other", formatClassName('promo')))
    }
    return renderables
}

function yugipediaLink(page) {
    return `https://yugipedia.com/wiki/${page.split(' ').join('_')}`
}

export { CollapsibleFormatDetails }