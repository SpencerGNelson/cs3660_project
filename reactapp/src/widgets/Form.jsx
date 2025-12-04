function Form({ children, onSubmit, action, method = "POST", encType }) {
    const handleSubmit = (e) => {
        if (onSubmit) {
            e.preventDefault()
            onSubmit(e)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            action={action}
            method={method}
            encType={encType}
        >
            {children}
        </form>
    )
}

export default Form
