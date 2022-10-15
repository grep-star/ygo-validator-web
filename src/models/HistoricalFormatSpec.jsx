import goatSpec from '../specs/goat.json'
import edisonSpec from '../specs/edison.json'

class HistoricalFormatSpec {
    constructor(name, spec) {
        this.name = name
        this.lastSet = spec.last_set
        this.forbidden = spec.forbidden
        this.limited = spec.limited
        this.semiLimited = spec.semi_limited
    }
}

const goatFormat = new HistoricalFormatSpec('GOAT', goatSpec)
const edisonFormat = new HistoricalFormatSpec('Edison', edisonSpec)

export { HistoricalFormatSpec, goatFormat, edisonFormat }