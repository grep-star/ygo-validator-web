import { useState } from 'react'
import './App.css'
import { FormatCategorySelector } from './components/FormatCategorySelector'
import { WaveMotionSpec } from './models/WaveMotionSpec'
import { CollapsibleFormatDetails } from './components/CollapsibleFormatDetails'
import { DeckValidator } from './components/DeckValidation'
import { EnumeratedCardValidator, HistoricalFormatValidator } from './models/DeckValidators'
import { FormatCategory } from './models/FormatCategory'
import { goatFormat, edisonFormat } from './models/HistoricalFormatSpec'
import { HISTORICAL, WAVE_MOTION, ERA } from './Constants'
import { Customization } from './components/Customization'
import { EdoBanlistGenerator } from './components/EdoBanlistGenerator'
import { ValidationResult } from './components/ValidationResult'
import { UnlimitedEraSpec } from './models/UnlimitedEraSpec'

function App() {
    const [mode, setMode] = useState()
    const [customizationViable, setCustomizationViable] = useState(false)
    const [validator, setValidator] = useState()
    const [traditional, setTraditional] = useState(false)
    const [speedDuelAllowed, setSpeedDuelAllowed] = useState(false)
    const [deckbuildAsCore, setDeckbuildAsCore] = useState(true)
    const [waveMotionCenter, setWaveMotionCenter] = useState(null)
    const [waveMotionSpec, setWaveMotionSpec] = useState(null)
    const [eraFirstSet, setEraFirstSet] = useState(null)
    const [eraLastSet, setEraLastSet] = useState(null)
    const [eraSpec, setEraSpec] = useState(null)
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

    const setupWaveMotion = (center, allowSpeedDuel, deckbuild) => {
        setValidationResult(null)
        const compiled = WaveMotionSpec.compileFormat(center, allowSpeedDuel, deckbuild)
        setWaveMotionSpec(compiled)
        setCustomizationViable(true)
        setWaveMotionCenter(center)
        setSpeedDuelAllowed(allowSpeedDuel)
        setDeckbuildAsCore(deckbuild)
        setValidator(new EnumeratedCardValidator(compiled.cardMap))
    }

    const updateWaveMotionSet = (centerSet) => {
        setupWaveMotion(centerSet, speedDuelAllowed, deckbuildAsCore)
    }

    const updateSpeedDuel = () => {
        const updatedState = !speedDuelAllowed
        setSpeedDuelAllowed(updatedState)
        setupWaveMotion(waveMotionCenter, updatedState, deckbuildAsCore)
    }

    const updateDeckbuildAsCore = () => {
        const updatedState = !deckbuildAsCore
        setDeckbuildAsCore(updatedState)
        setupWaveMotion(waveMotionCenter, speedDuelAllowed, updatedState)
    }

    const updateTraditional = () => {
        setValidationResult(null)
        const updatedState = !traditional
        setTraditional(updatedState)
        if (validator != null) {
            validator.traditional = updatedState
        }
    }

    const setupEraFormat = (firstSet, lastSet) => {
        setValidationResult(null)
        setEraFirstSet(firstSet)
        setEraLastSet(lastSet)
        if (firstSet !== null && lastSet !== null) {
            const compiled = UnlimitedEraSpec.compileFormat(firstSet, lastSet)
            setCustomizationViable(true)
            setValidator(new EnumeratedCardValidator(compiled.cardMap))
            setEraSpec(compiled)
        }
    }

    const updateEraFirstSet = (firstSet) => {
        setupEraFormat(firstSet, eraLastSet)
    }

    const updateEraLastSet = (lastSet) => {
        setupEraFormat(eraFirstSet, lastSet)
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
        ),
        'Edison': new FormatCategory(
            HISTORICAL,
            edisonFormat,
            new HistoricalFormatValidator(edisonFormat),
            false
        ),
        'Unlimited Era': new FormatCategory(
            ERA,
            null,
            null,
            true
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
                deckbuildAsCore={deckbuildAsCore}
                updateDeckbuild={updateDeckbuildAsCore}
                updateCenter={updateWaveMotionSet}
                traditional={traditional}
                updateTraditional={updateTraditional}
                updateEraFirstSet={updateEraFirstSet}
                updateEraLastSet={updateEraLastSet}
            />
            {customizationViable ? <CollapsibleFormatDetails mode={mode} waveMotionSpec={waveMotionSpec} formatSpec={historicalFormat} traditional={traditional} /> : null}
            <div className="flex-grid">
                {customizationViable ? <DeckValidator validator={validator} setValidationResult={setValidationResult} /> : null}
                {customizationViable ? <EdoBanlistGenerator mode={mode} waveMotionSpec={waveMotionSpec} eraSpec={eraSpec} /> : null}
            </div>
            {validationResult != null ? <ValidationResult result={validationResult} /> : null}
        </div>
    )
}

export default App
