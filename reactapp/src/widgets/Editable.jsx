import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { getErrorMessage } from '../utils/errorMessages'

function Editable({ text, route, fieldName, onSuccess }) {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(text)
    const [originalValue, setOriginalValue] = useState(text)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    const handleEdit = () => {
        setIsEditing(true)
        setValue(text)
        setError(null)
    }

    const handleBlur = async () => {
        setIsEditing(false)

        // If value hasn't changed, don't make a request
        if (value === originalValue) {
            return
        }

        setIsPending(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('name', fieldName)
            formData.append('value', value)

            const response = await axiosInstance.put(route, formData)

            if (response.data === 'ok') {
                setOriginalValue(value)
                if (onSuccess) onSuccess()
            } else {
                // Handle error codes from Flask
                const errorCode = response.data
                setError(getErrorMessage(errorCode))
                setValue(originalValue)
            }
        } catch (err) {
            // Handle HTTP errors (404, 500, etc.)
            const errorCode = err.response?.data
            setError(getErrorMessage(errorCode) || 'An error occurred')
            setValue(originalValue)
        } finally {
            setIsPending(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur()
        } else if (e.key === 'Escape') {
            setValue(originalValue)
            setIsEditing(false)
        }
    }

    return (
        <span style={{ display: 'inline-block' }}>
            {isEditing ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="form-control form-control-sm"
                    style={{ display: 'inline-block', width: 'auto' }}
                />
            ) : (
                <>
                    <span style={{ color: isPending ? '#999' : 'inherit' }}>
                        {value}
                    </span>
                    {!isPending && (
                        <button
                            onClick={handleEdit}
                            className="btn btn-link btn-sm"
                            style={{ padding: '0 4px', marginLeft: '4px' }}
                        >
                            ✏️
                        </button>
                    )}
                </>
            )}
            {error && <span style={{ color: 'red', marginLeft: '8px' }}>{error}</span>}
        </span>
    )
}

export default Editable
