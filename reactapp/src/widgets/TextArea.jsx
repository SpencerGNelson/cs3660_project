function TextArea({ name, placeholder, value, onChange, rows = 5, autoComplete = "off", required }) {
    return (
        <textarea
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            autoComplete={autoComplete}
            required={required}
        />
    )
}

export default TextArea
