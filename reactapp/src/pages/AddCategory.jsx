import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'
import { Category, Form, TextInput, File, Submit } from '../widgets'

function AddCategory() {
    usePageTitle('Add Category')

    const [categories, setCategories] = useState([])
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        image_file: null
    })

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/api/get_categories')
            setCategories(response.data)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching categories:', err)
            setError('Failed to load categories')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
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
        submitData.append('image_file', formData.image_file)

        try {
            const response = await axiosInstance.post('/api/add_category', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setSuccess(response.data.success)
            setFormData({ name: '', image_file: null })
            await fetchCategories()
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.')
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <>
            <h2>Add Category</h2>

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
                <p className="text-muted">No categories found in the database.</p>
            ) : (
                <div className="row g-4 mb-5" id="categoriesList">
                    {categories.map((cat) => (
                        <Category key={cat.id} category={cat} serviceList={false} />
                    ))}
                </div>
            )}
            <hr />
            Add Category
            <hr />
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
