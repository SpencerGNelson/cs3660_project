function File({ name, onChange, accept, required }) {
    return (
        <input
            type="file"
            name={name}
            onChange={onChange}
            accept={accept}
            required={required}
        />
    )
}

export default File
