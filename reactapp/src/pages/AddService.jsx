import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'

function AddService() {
    usePageTitle('Add Service')

    const [categories, setCategories] = useState([])
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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

        fetchServices()
    }, [])

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
                        <div key={cat.id} className="col-md-6 col-lg-4" data-category={cat.name}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h3 className="h5 mb-0">{cat.name}</h3>
                                </div>
                                <div className="card-body p-0">
                                    {cat.services && cat.services.length > 0 ? (
                                        <div className="list-group list-group-flush">
                                            {cat.services.map((svc, idx) => (
                                                <div key={idx} className="list-group-item">{svc}</div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="list-group-item text-muted fst-italic">
                                            No services listed
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <hr />
            Add a New Service Below
            <hr />
            <form method="POST" action="/add_service_submit">
                <div>
                    Service Name<br />
                    <input autoComplete="off" type="text" name="servicename" id="servicename" placeholder="Name" />
                </div>
                <div>
                    Category<br />
                    <input autoComplete="off" type="text" name="category_name" id="category_name" placeholder="Name" />
                </div>
                <div>
                    <input type="submit" />
                </div>
            </form>
        </>
    )
}

export default AddService
