import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'

function AddCategory() {
    usePageTitle('Add Category')

    const [categories, setCategories] = useState([])
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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

        fetchCategories()
    }, [])

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
                        <div key={cat.id} className="col-md-6 col-lg-4">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h3 className="h5 mb-0">{cat.name}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <hr />
            Add Category
            <hr />
            <form method="POST" action="/add_category_submit" encType="multipart/form-data">
                <div>
                    Category<br />
                    <input autoComplete="off" type="text" name="name" placeholder="Name" />
                </div>
                <div>
                    Upload a Photo<br />
                    <input autoComplete="off" type="file" name="image_file" placeholder="Picture" />
                </div>
                <div>
                    <input type="submit" />
                </div>
            </form>
        </>
    )
}

export default AddCategory
