import { appSettings } from '../setup'

function Image({ src, backend = false, alt = "", className = "", style = {} }) {
    // For backend images, use API base URL
    // For frontend images, prepend base path if src starts with /
    let imageSrc
    if (backend) {
        imageSrc = `${appSettings.apiBaseUrl}/static/images/${src}`
    } else if (src.startsWith('/')) {
        imageSrc = `${appSettings.apiBaseUrl}${src}`
    } else {
        imageSrc = src
    }

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
