import cardSets from '../specs/card_sets.json'
import { identifyCardsInSet, sortSetsOnDate } from './Cards'

const sortedSets = sortSetsOnDate(cardSets)

class UnlimitedEraSpec {
    constructor(cardMap, firstSetCode, lastSetCode) {
        this.cardMap = cardMap
        this.firstSetCode = firstSetCode
        this.lastSetCode = lastSetCode
    }

    static compileFormat(firstSetName, lastSetName) {
        const firstSet = sortedSets.find(set => set.set_name === firstSetName)
        const lastSet = sortedSets.find(set => set.set_name === lastSetName)
        const startDate = firstSet.tcg_date
        const endDate = lastSet.tcg_date

        const cardMap = new Map()
        sortedSets
                .filter(set => set.tcg_date >= startDate && set.tcg_date <= endDate)
                .forEach(set => {
                    identifyCardsInSet(set.set_name).forEach(card => {
                        cardMap.set(card, 3)
                    })
            })
        return new UnlimitedEraSpec(cardMap, firstSet.set_code, lastSet.set_code)
    }
}

export { UnlimitedEraSpec }