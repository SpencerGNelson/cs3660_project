import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'
import { Professional, AddProfessional, AuthorizedContent, ToggleButton } from '../widgets'

function Professionals() {
    usePageTitle('Professionals')

    const [professionals, setProfessionals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProfessionals = async () => {
        try {
            setLoading(true)
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

    if (loading) return <p>Loading professionals...</p>
    if (error) return <p className="text-danger">{error}</p>

    return (
        <>
            <h2>Meet our Support Staff</h2>
            <div className="row">
                {professionals.map((pro) => (
                    <Professional key={pro.id} professional={pro} onUpdate={fetchProfessionals} />
                ))}
            </div>
            <AuthorizedContent minLevel={2}>
                <ToggleButton buttonText="Add Professional Form">
                    <AddProfessional onSuccess={fetchProfessionals} />
                </ToggleButton>
            </AuthorizedContent>
        </>
    )
}

export default Professionals
