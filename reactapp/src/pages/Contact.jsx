import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { usePageTitle } from '../hooks/usePageTitle'
import { Form, TextInput, TextArea, Submit } from '../widgets'

function Contact() {
    usePageTitle('Contact')

    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccess(null)
        setError(null)

        try {
            const response = await axiosInstance.post('/api/contact', formData)
            setSuccess(response.data.success)
            setFormData({ name: '', phone: '', email: '', subject: '', message: '' })
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.')
        }
    }

    return (
        <>
            <h2>Contact Us</h2>

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
                    <TextInput name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                    <TextInput name="phone" placeholder="Your Phone Number" value={formData.phone} onChange={handleChange} />
                </div>
                <div>
                    <TextInput name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <TextInput name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} />
                </div>
                <div>
                    <TextArea name="message" placeholder="Your Message" rows={5} value={formData.message} onChange={handleChange} />
                </div>
                <div>
                    <Submit />
                </div>
            </Form>
        </>
    )
}

export default Contact
