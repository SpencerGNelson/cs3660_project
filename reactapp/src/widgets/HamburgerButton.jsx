function HamburgerButton({ target }) {
    return (
        <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target={`#${target}`}
            aria-label="Toggle controls"
            aria-controls={target}
            aria-expanded="false"
        >
            <span className="navbar-toggler-icon"></span>
        </button>
    )
}

export default HamburgerButton
