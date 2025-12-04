import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'

function Services() {
    usePageTitle('Services')

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    if (loading) return <p>Loading services...</p>
    if (error) return <p className="text-danger">{error}</p>

    return (
        <div className="container my-4">
            <h2 className="mb-4">Services</h2>

            {!categories || categories.length === 0 ? (
                <p className="text-muted">No services found in the database.</p>
            ) : (
                <div className="row g-4">
                    {categories.map((cat) => (
                        <div key={cat.id} className="col-md-6 col-lg-4">
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
        </div>
    )
}

export default Services
