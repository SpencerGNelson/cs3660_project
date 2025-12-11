import { useState } from 'react'
import axiosInstance from '../axiosInstance'

function DeleteButton({ route, onSuccess }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState(null)

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return
        }

        setIsDeleting(true)
        setError(null)

        try {
            const response = await axiosInstance.delete(route)

            if (response.data === 'ok') {
                if (onSuccess) onSuccess()
            } else {
                setError(response.data || 'Delete failed')
            }
        } catch (err) {
            setError(err.response?.data || 'An error occurred')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div style={{ display: 'inline-block' }}>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-danger btn-sm"
                style={{ marginLeft: '8px' }}
            >
                {isDeleting ? 'Deleting...' : '✕'}
            </button>
            {error && <span style={{ color: 'red', marginLeft: '8px' }}>{error}</span>}
        </div>
    )
}

export default DeleteButton
