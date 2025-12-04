import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'
import { Form, TextInput, Submit } from '../widgets'

function Register() {
    usePageTitle('Register')

    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmation: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        try {
            const response = await axiosInstance.post('/api/register', formData)
            setSuccess(response.data.success)
            setFormData({ name: '', username: '', password: '', confirmation: '' })
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.')
        }
    }

    return (
        <>
            <h2>Register</h2>

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

            <Form onSubmit={handleSubmit}>
                <div>
                    <TextInput name="name" placeholder="Client Name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                    <TextInput name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                </div>
                <div>
                    <TextInput name="password" placeholder="Password" password value={formData.password} onChange={handleChange} />
                </div>
                <div>
                    <TextInput name="confirmation" placeholder="Confirm Password" password value={formData.confirmation} onChange={handleChange} />
                </div>
                <div>
                    <Submit />
                </div>
            </Form>
        </>
    )
}

export default Register
