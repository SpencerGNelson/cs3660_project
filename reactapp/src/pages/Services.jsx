import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'
import { Category } from '../widgets'

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
                        <Category key={cat.id} category={cat} serviceList={true} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Services
