import { useState, useRef } from 'react'
import { appSettings } from '../setup'
import axiosInstance from '../axiosInstance'

function Image({ src, backend = false, alt = "", className = "", style = {}, editable = false, route = "", fieldName = "image_file", onSuccess }) {
    const [imageSrc, setImageSrc] = useState(() => {
        if (!src) return ''
        if (backend) {
            return `${appSettings.apiBaseUrl}/static/images/${src}`
        } else if (src.startsWith('/')) {
            return `${appSettings.apiBaseUrl}${src}`
        } else {
            return src
        }
    })

    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const fileInputRef = useRef(null)

    const handleImageClick = () => {
        if (editable && !isPending && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setIsPending(true)
        setError(null)
        setSuccess(null)

        try {
            const formData = new FormData()
            formData.append('name', fieldName)
            formData.append('image_file', file)

            const response = await axiosInstance.put(route, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (response.data === 'ok') {
                // Force image reload by adding timestamp
                const timestamp = new Date().getTime()
                if (src) {
                    if (backend) {
                        setImageSrc(`${appSettings.apiBaseUrl}/static/images/${src}?t=${timestamp}`)
                    } else if (src.startsWith('/')) {
                        setImageSrc(`${appSettings.apiBaseUrl}${src}?t=${timestamp}`)
                    } else {
                        setImageSrc(`${src}?t=${timestamp}`)
                    }
                }

                setSuccess('Image updated successfully!')
                if (onSuccess) onSuccess()

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000)
            } else {
                setError(response.data || 'Update failed')
            }
        } catch (err) {
            setError(err.response?.data || 'An error occurred')
        } finally {
            setIsPending(false)
            // Reset file input
            e.target.value = ''
        }
    }

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
                src={imageSrc}
                alt={alt}
                className={className}
                style={{
                    ...style,
                    cursor: editable && !isPending ? 'pointer' : 'default',
                    opacity: isPending ? 0.5 : 1
                }}
                onClick={handleImageClick}
            />

            {editable && (
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            )}

            {isPending && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '8px',
                    borderRadius: '4px'
                }}>
                    Uploading...
                </div>
            )}

            {success && (
                <div style={{ color: 'green', marginTop: '4px' }}>
                    {success}
                </div>
            )}

            {error && (
                <div style={{ color: 'red', marginTop: '4px' }}>
                    {error}
                </div>
            )}
        </div>
    )
}

export default Image
