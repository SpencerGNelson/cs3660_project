import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'
import { Professional, Form, TextInput, File, Submit } from '../widgets'

function AddProfessional() {
    usePageTitle('Add Professional')

    const [professionals, setProfessionals] = useState([])
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image_file: null
    })

    const fetchProfessionals = async () => {
        try {
            const response = await axiosInstance.get('/api/get_professionals')
            setProfessionals(response.data)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching professionals:', err)
            setError('Failed to load professionals')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfessionals()
    }, [])

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
        submitData.append('email', formData.email)
        submitData.append('image_file', formData.image_file)

        try {
            const response = await axiosInstance.post('/api/add_professional', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setSuccess(response.data.success)
            setFormData({ name: '', email: '', image_file: null })
            await fetchProfessionals()
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.')
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <>
            <h2>Add Service Provider</h2>

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

            <div className="row" id="professionalsList">
                {professionals.map((pro) => (
                    <Professional key={pro.id} professional={pro} />
                ))}
            </div>
            <hr />
            Add a New Service Provider Below
            <hr />
            <Form onSubmit={handleSubmit}>
                <div>
                    Provider Name<br />
                    <TextInput name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                    Provider Email<br />
                    <TextInput name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
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

export default AddProfessional
