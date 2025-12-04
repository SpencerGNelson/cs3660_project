function Submit({ value = "Submit", disabled }) {
    return (
        <input
            type="submit"
            value={value}
            disabled={disabled}
        />
    )
}

export default Submit
