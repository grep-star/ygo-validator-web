class FormatCategory {
    constructor(mode, formatSpec, defaultValidator, customizationRequired) {
        this.mode = mode
        this.formatSpec = formatSpec
        this.defaultValidator = defaultValidator
        this.customizationRequired = customizationRequired
    }
}

export { FormatCategory }