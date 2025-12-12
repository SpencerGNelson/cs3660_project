import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { Form, TextInput, Submit } from './index'
import { getErrorMessage } from '../utils/errorMessages'

function AddService({ onSuccess }) {

    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        servicename: '',
        category_name: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccess(null)
        setError(null)

        try {
            const response = await axiosInstance.post('/api/add_service', formData)
            setSuccess(response.data.success)
            setFormData({ servicename: '', category_name: '' })
            if (onSuccess) onSuccess()
        } catch (err) {
            // Handle error codes from Flask
            const errorCode = err.response?.data?.error || err.response?.data
            if (errorCode) {
                setError(getErrorMessage(errorCode))
            } else {
                setError('An error occurred. Please try again.')
            }
        }
    }

    return (
        <>
            <h3>Add Service</h3>

            {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {success}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
            )}

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
            )}
            
            <Form onSubmit={handleSubmit}>
                <div>
                    Service Name<br />
                    <TextInput name="servicename" placeholder="Name" value={formData.servicename} onChange={handleChange} />
                </div>
                <div>
                    Category<br />
                    <TextInput name="category_name" placeholder="Name" value={formData.category_name} onChange={handleChange} />
                </div>
                <div>
                    <Submit />
                </div>
            </Form>
        </>
    )
}

export default AddService
