const FORMAT_CATEGORY = 'format-category'

class Automator {
    launch () {
        return browser.url('http://127.0.0.1:5173')
    }

    get formatCategory () {
        return $(`#${FORMAT_CATEGORY}`)
    }

    async getFormatCategoryOptions () {
        await this.clickSelect(this.formatCategory)
        return await this.readSelectOptions(this.formatCategory)
    }

    async clickFormatCategory(category) {
        this.clickSelectOption(this.formatCategory, category)
    }

    async readCurrentFormatCategory() {
        return await this.readCurrentSelectedOption(this.formatCategory)
    }

    async clickSelect(baseSelectFinder) {
        await baseSelectFinder.$('.//*[contains(@class, "IndicatorsContainer")]').click()
    }

    async readSelectOptions(baseSelectFinder) {
        return await baseSelectFinder.$$(".//*[contains(@id, 'option')]").map(element => element.getText())
    }

    async clickSelectOption(baseSelectFinder, optionText) {
        await baseSelectFinder.$(`.//*[contains(@id, 'option') and text()='${optionText}']`).click()
    }

    async readCurrentSelectedOption(baseSelectFinder) {
        return await baseSelectFinder.$(".//div[contains(@class, 'singleValue')]").getText()
    }
}

module.exports = new Automator()
