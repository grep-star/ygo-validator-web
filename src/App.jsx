import { useState } from 'react'
import './App.css'
import { FormatCategorySelector } from './components/FormatCategorySelector'
import { WaveMotionSpec } from './models/WaveMotionSpec'
import { CollapsibleFormatDetails } from './components/CollapsibleFormatDetails'
import { DeckValidator } from './components/DeckValidation'
import { EnumeratedCardValidator, HistoricalFormatValidator } from './models/DeckValidators'
import { FormatCategory } from './models/FormatCategory'
import { goatFormat } from './models/HistoricalFormatSpec'
import { HISTORICAL, WAVE_MOTION } from './Constants'
import { Customization } from './components/Customization'
import { EdoBanlistGenerator } from './components/EdoBanlistGenerator'
import { ValidationResult } from './components/ValidationResult'

function App() {
    const [mode, setMode] = useState()
    const [customizationViable, setCustomizationViable] = useState(false)
    const [validator, setValidator] = useState()
    const [traditional, setTraditional] = useState(false)
    const [speedDuelAllowed, setSpeedDuelAllowed] = useState(false)
    const [waveMotionCenter, setWaveMotionCenter] = useState(null)
    const [waveMotionSpec, setWaveMotionSpec] = useState(null)
    const [historicalFormat, setHistoricalFormat] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    const updateFormatCategory = (category) => {
        setValidationResult(null)
        const formatCategory = availableFormats[category]
        setMode(formatCategory.mode)
        setValidator(formatCategory.defaultValidator)
        setCustomizationViable(!formatCategory.customizationRequired)
        setHistoricalFormat(formatCategory.formatSpec)
    }

    const setupWaveMotion = (center, allowSpeedDuel) => {
        setValidationResult(null)
        const compiled = WaveMotionSpec.compileFormat(center, allowSpeedDuel)
        setWaveMotionSpec(compiled)
        setCustomizationViable(true)
        setWaveMotionCenter(center)
        setSpeedDuelAllowed(allowSpeedDuel)
        setValidator(new EnumeratedCardValidator(compiled.cardMap))
    }

    const updateWaveMotionSet = (centerSet) => {
        setupWaveMotion(centerSet, speedDuelAllowed)
    }

    const updateSpeedDuel = () => {
        const updatedState = !speedDuelAllowed
        setSpeedDuelAllowed(updatedState)
        setupWaveMotion(waveMotionCenter, updatedState)
    }

    const updateTraditional = () => {
        setValidationResult(null)
        const updatedState = !traditional
        setTraditional(updatedState)
        if (validator != null) {
            validator.traditional = updatedState
        }
    }

    const availableFormats = {
        'WaveMotion': new FormatCategory(
            WAVE_MOTION,
            null,
            null,
            true
        ),
        'GOAT': new FormatCategory(
            HISTORICAL,
            goatFormat,
            new HistoricalFormatValidator(goatFormat),
            false
        )
    }

    return (
        <div className="App">
            <FormatCategorySelector
                updateAppState={updateFormatCategory}
                formatKeys={Object.keys(availableFormats)}
            />
            <Customization
                mode={mode}
                allowSpeedDuel={speedDuelAllowed}
                updateSpeedDuel={updateSpeedDuel}
                updateCenter={updateWaveMotionSet}
                traditional={traditional}
                updateTraditional={updateTraditional}
            />
            {customizationViable ? <CollapsibleFormatDetails mode={mode} waveMotionSpec={waveMotionSpec} formatSpec={historicalFormat} traditional={traditional} /> : null}
            <div className="flex-grid">
                {customizationViable ? <DeckValidator validator={validator} setValidationResult={setValidationResult} /> : null}
                {customizationViable ? <EdoBanlistGenerator mode={mode} waveMotionSpec={waveMotionSpec} /> : null}
            </div>
            {validationResult != null ? <ValidationResult result={validationResult} /> : null}
        </div>
    )
}

export default App
