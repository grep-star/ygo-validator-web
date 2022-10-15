const selectStyle = {
    option: (provided) => ({
        ...provided,
        color: 'black'
    }),
    container: base => ({
        ...base,
        flex: 1
      })
}

const separator = { render : function() { return <hr key="separator" className="solid" style={{ marginRight: '1em' }} /> }}

function TitledColumn(props) {
    const objs = props.objects || []
    if (props.items) {
        props.items.forEach(item => {
            objs.push(new RenderableDiv(item, null))
        })
    }
    return (
        objs.length > 0 ?
            (<div className='col'>
                <div><em>{props.title}</em></div>
                {separator.render()}
                {objs.map(item => (
                    item.render()
                ))}
            </div>) : null
    )
}

class RenderableDiv {
    constructor(content, className, link = null) {
        this.content = content
        this.className = className,
        this.link = link
    }

    render() {
        const innerContent = this.link ? (<a href={this.link} target="_blank">{this.content}</a>) : this.content
        return (<div key={this.content} className={this.className}>{innerContent}</div>)
    }
}

export { selectStyle, TitledColumn, RenderableDiv, separator }