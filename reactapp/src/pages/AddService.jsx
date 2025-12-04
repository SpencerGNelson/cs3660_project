import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'
import { Category, Form, TextInput, Submit } from '../widgets'

function AddService() {
    usePageTitle('Add Service')

    const [categories, setCategories] = useState([])
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        servicename: '',
        category_name: ''
    })

    const fetchServices = async () => {
        try {
            const response = await axiosInstance.get('/api/get_services')
            setCategories(response.data)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching services:', err)
            setError('Failed to load services')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

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
            await fetchServices()
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.')
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <>
            <h2>Add Service</h2>

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

            {!categories || categories.length === 0 ? (
                <p className="text-muted">No services found in the database.</p>
            ) : (
                <div className="row g-4" id="servicesList">
                    {categories.map((cat) => (
                        <Category key={cat.id} category={cat} serviceList={true} />
                    ))}
                </div>
            )}
            <hr />
            Add a New Service Below
            <hr />
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
