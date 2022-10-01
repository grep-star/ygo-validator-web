import cardSets from '../specs/card_sets.json'
import { identifyCardsInSet } from './Cards'

const coreSets = cardSets.filter(set => set.set_type === 'core')
const noncoreSets = cardSets.filter(set => !coreSets.includes(set))

function filterSpeedDuel(sets) {
    return sets.filter(set => !set.set_name.includes("Speed Duel"))
}

class WaveMotionSpec {
    constructor(setClassifications, cardMap, setCode) {
        this.setClassifications = setClassifications
        this.cardMap = cardMap
        this.setCode = setCode
    }

    static compileFormat(centerSetName, allowSpeedDuel) {
        const centerSet = cardSets.find(set => set.set_name === centerSetName)
        const candidateCoreSets = allowSpeedDuel ? coreSets : filterSpeedDuel(coreSets)
        const candidateNoncoreSets = allowSpeedDuel ? noncoreSets : filterSpeedDuel(noncoreSets)
        const previousCoreSets = candidateCoreSets.filter(set => set.tcg_date <= centerSet.tcg_date && set.set_name != centerSetName)
        const followingCoreSets = candidateCoreSets.filter(set => set.tcg_date > centerSet.tcg_date)
        const earliestCoreSet = previousCoreSets[previousCoreSets.length - 2]
        const secondCoreSet = previousCoreSets[previousCoreSets.length - 1]
        const thirdCoreSet = followingCoreSets[0]
        const latestCoreSet = followingCoreSets[1]

        const setsAllowed = {
            3: [centerSet],
            2: [secondCoreSet, thirdCoreSet],
            1: [earliestCoreSet, latestCoreSet]
        }

        const startDate = earliestCoreSet.tcg_date
        const endDate = latestCoreSet.tcg_date
        candidateNoncoreSets.forEach(set => {
            if (set.tcg_date && set.tcg_date >= startDate && set.tcg_date <= endDate && set.set_name !== centerSetName) {
                setsAllowed[set?.set_type === 'deck' ? 2 : 1].push(set)
            }
        })

        const cardMap = new Map()
        for (const [numAllowed, listOfSets] of Object.entries(setsAllowed)) {
            listOfSets.forEach(set => {
                identifyCardsInSet(set.set_name).forEach(card => {
                    cardMap.set(card, Math.max(numAllowed, cardMap.get(card) || 0))
                })
            })
        }
        return new WaveMotionSpec(setsAllowed, cardMap, centerSet.set_code)
    }
}

export { WaveMotionSpec }