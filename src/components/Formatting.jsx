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
                <hr className="solid" style={{ marginRight: '1em' }} />
                {objs.map(item => (
                    <div key={item.content} className={item.className}>{item.content}</div>
                ))}
            </div>) : null
    )
}

class RenderableDiv {
    constructor(content, className) {
        this.content = content
        this.className = className
    }
}

export { selectStyle, TitledColumn, RenderableDiv }