import { useState } from "react";

function ToggleButton({ buttonText, children }) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <>
            <button
                className="btn btn-primary mb-3"
                onClick={() => setIsVisible(!isVisible)}
            >
                {isVisible ? `Hide ${buttonText}` : `Show ${buttonText}`}
            </button>
            {isVisible && <div>{children}</div>}
        </>
    )
}

export default ToggleButton