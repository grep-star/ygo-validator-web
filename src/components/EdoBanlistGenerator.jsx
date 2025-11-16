import { WAVE_MOTION, ERA } from '../Constants'

function EdoBanlistGenerator(props) {
    const generateBanlist = (id, cardMap) => {
        const content = [
            `#[${id}]`,
            `!${id}`,
            '$whitelist'
        ]
        for (const [card, numPermitted] of cardMap.entries()) {
            card.ids.forEach(id => {
                content.push(`${id} ${numPermitted} -- ${card.name}`)
            })
        }
        const tempElement = document.createElement('a')
        const file = new Blob([content.join('\n')], {type: 'text/plain', endings: 'native'})
        tempElement.href = URL.createObjectURL(file)
        tempElement.download = `${id}.lflist.conf`
        document.body.appendChild(tempElement)
        tempElement.click()
    }

    const generateWaveMotionBanlist = () => {
        generateBanlist(`WaveMotion_${props.waveMotionSpec.setCode}`, props.waveMotionSpec.cardMap)
    }

    const generateEraBanlist = () => {
        generateBanlist(`UnlimitedEra_${props.eraSpec.firstSetCode}_to_${props.eraSpec.lastSetCode}`, props.eraSpec.cardMap)
    }

    return (
        [WAVE_MOTION, ERA].includes(props.mode) ? <button onClick={props.mode === WAVE_MOTION ? generateWaveMotionBanlist : generateEraBanlist}>Generate Banlist File</button> : null
    )
}

export { EdoBanlistGenerator }