function ValidationResult(props) {
    return (
        props.result.success ?
            <div>"Looks good to me!"</div> :
            (
                props.result.errors.map(err => (
                    <div key={err}>{err}</div>
                ))
            )
    )
}

export { ValidationResult }