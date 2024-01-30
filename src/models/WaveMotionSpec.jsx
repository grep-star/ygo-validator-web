import cardSets from '../specs/card_sets.json'
import { identifyCardsInSet, sortSetsOnDate } from './Cards'

const coreSets = sortSetsOnDate(cardSets.filter(set => set.set_type === 'core'))
const noncoreSets = cardSets.filter(set => !coreSets.includes(set))
const tcgStart = coreSets[0].tcg_date

function filterSpeedDuel(sets) {
    return sets.filter(set => !set.set_name.includes("Speed Duel"))
}

class WaveMotionSpec {
    constructor(setClassifications, cardMap, setCode) {
        this.setClassifications = setClassifications
        this.cardMap = cardMap
        this.setCode = setCode
    }

    static compileFormat(centerSetName, allowSpeedDuel, deckbuildAsCore) {
        const centerSet = cardSets.find(set => set.set_name === centerSetName)
        let candidateCoreSets = allowSpeedDuel ? coreSets : filterSpeedDuel(coreSets)
        let candidateNoncoreSets = allowSpeedDuel ? noncoreSets : filterSpeedDuel(noncoreSets)
        if (deckbuildAsCore) {
            const deckbuild = candidateNoncoreSets.filter(set => set.set_type === 'deckbuild')
            candidateCoreSets.push(...deckbuild)
            candidateNoncoreSets = candidateNoncoreSets.filter(set => !deckbuild.includes(set))
            candidateCoreSets = sortSetsOnDate(candidateCoreSets)
            candidateNoncoreSets = sortSetsOnDate(candidateNoncoreSets)
        }
        const previousCoreSets = candidateCoreSets.filter(set => set.tcg_date <= centerSet.tcg_date && set.set_name != centerSetName)
        const followingCoreSets = candidateCoreSets.filter(set => set.tcg_date > centerSet.tcg_date)
        const earliestCoreSet = previousCoreSets[previousCoreSets.length - 2]
        const secondCoreSet = previousCoreSets[previousCoreSets.length - 1]
        const thirdCoreSet = followingCoreSets[0]
        const latestCoreSet = followingCoreSets[1]
        const setsAt2 = [thirdCoreSet]
        if (secondCoreSet) {
            setsAt2.unshift(secondCoreSet)
        }
        const setsAt1 = [latestCoreSet]
        if (earliestCoreSet) {
            setsAt1.unshift(earliestCoreSet)
        }

        const setsAllowed = {
            3: [centerSet],
            2: setsAt2,
            1: setsAt1
        }

        const startDate = earliestCoreSet ? earliestCoreSet.tcg_date : tcgStart
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