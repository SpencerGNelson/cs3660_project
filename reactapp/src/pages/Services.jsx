import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'
import { Category, AddCategory, AddService, AuthorizedContent, ToggleButton } from '../widgets'

function Services() {
    usePageTitle('Services')

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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
                        <Category key={cat.id} category={cat} serviceList={true} onUpdate={fetchServices} />
                    ))}
                </div>
            )}
            <AuthorizedContent minLevel={2}>
                <ToggleButton buttonText="Add Category Form">
                    <AddCategory onSuccess={fetchServices} />
                </ToggleButton>
                
                <ToggleButton buttonText="Add Service Form">
                    <AddService onSuccess={fetchServices} />
                </ToggleButton>
            </AuthorizedContent>
        </div>
    )
}

export default Services
