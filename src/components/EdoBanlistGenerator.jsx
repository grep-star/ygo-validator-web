import { WAVE_MOTION } from '../Constants'

function EdoBanlistGenerator(props) {
    const generateBanlist = () => {
        const id = `WaveMotion_${props.waveMotionSpec.setCode}`
        const content = [
            `#[${id}]`,
            `!${id}`,
            '$whitelist'
        ]
        for (const [card, numPermitted] of props.waveMotionSpec.cardMap.entries()) {
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

    return (
        props.mode === WAVE_MOTION ? <button onClick={generateBanlist}>Generate EDOPro Banlist</button> : null
    )
}

export { EdoBanlistGenerator }