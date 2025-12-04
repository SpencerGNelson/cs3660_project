import { appSettings } from '../setup'

function Image({ src, backend = false, alt = "", className = "", style = {} }) {
    const imageSrc = backend ? `${appSettings.apiBaseUrl}/static/images/${src}` : src

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            style={style}
        />
    )
}

export default Image
