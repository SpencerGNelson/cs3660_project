function TextInput({ name, placeholder, value, onChange, autoComplete = "off", password, required }) {
    return (
        <input
            type={password ? "password" : "text"}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            required={required}
        />
    )
}

export default TextInput
