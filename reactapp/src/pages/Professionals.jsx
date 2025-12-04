import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'

function Professionals() {
    usePageTitle('Professionals')

    const [professionals, setProfessionals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
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

        fetchProfessionals()
    }, [])

    if (loading) return <p>Loading professionals...</p>
    if (error) return <p className="text-danger">{error}</p>

    return (
        <>
            <h2>Meet our Support Staff</h2>
            <div className="row">
                {professionals.map((pro) => (
                    <div key={pro.id} className="col-md-4 text-center mb-4">
                        <img
                            src={`http://localhost:5000/static/images/${pro.image_filename}`}
                            style={{width: '225px', height: '225px', objectFit: 'cover', borderRadius: '50%'}}
                            alt={pro.name}
                            className="img-fluid mb-3"
                        />
                        <h3>{pro.name}</h3>
                        {pro.title && <p className="text-muted">{pro.title}</p>}
                    </div>
                ))}
            </div>
        </>
    )
}

export default Professionals
