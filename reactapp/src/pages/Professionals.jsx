import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'
import { Professional } from '../widgets'

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
                    <Professional key={pro.id} professional={pro} />
                ))}
            </div>
        </>
    )
}

export default Professionals
