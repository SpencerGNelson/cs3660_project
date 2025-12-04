import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'

function AddProfessional() {
    usePageTitle('Add Professional')

    const [professionals, setProfessionals] = useState([])
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

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

    if (loading) return <p>Loading...</p>

    return (
        <>
            <h2>Add Service Provider</h2>

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

            <div className="row" id="professionalsList">
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
            <hr />
            Add a New Service Provider Below
            <hr />
            <form method="POST" action="/add_professional_submit" encType="multipart/form-data">
                <div>
                    Provider Name<br />
                    <input autoComplete="off" type="text" name="name" placeholder="Name" />
                </div>
                <div>
                    Provider Email<br />
                    <input autoComplete="off" type="text" name="email" placeholder="Email" />
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

export default AddProfessional
