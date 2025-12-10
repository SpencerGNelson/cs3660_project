import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { Form, TextInput, File, Submit } from './index'

function AddCategory( {onSuccess}) {

    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        image_file: null
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image_file: e.target.files[0]
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccess(null)
        setError(null)

        const submitData = new FormData()
        submitData.append('name', formData.name)
        submitData.append('image_file', formData.image_file)

        try {
            const response = await axiosInstance.post('/api/add_category', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setSuccess(response.data.success)
            setFormData({ name: '', image_file: null })
            if (onSuccess) onSuccess()
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.')
        }
    }

    return (
        <>
            <h3>Add Category</h3>

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
                    Category<br />
                    <TextInput name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                    Upload a Photo<br />
                    <File name="image_file" onChange={handleFileChange} />
                </div>
                <div>
                    <Submit />
                </div>
            </Form>
        </>
    )
}

export default AddCategory
