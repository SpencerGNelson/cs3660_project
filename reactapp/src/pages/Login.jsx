import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { AuthContext } from '../contexts/AuthContext'
import { Form, TextInput, Submit } from '../widgets'
import axiosInstance from '../axiosInstance'
import { getErrorMessage } from '../utils/errorMessages'

function Login() {
    usePageTitle('Login')
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const formData = new FormData(e.target)
        const username = formData.get('username')
        const password = formData.get('password')

        try {
            const response = await axiosInstance.post('/api/login', {
                username,
                password
            })

            // Login successful - save token and user info
            const { token, id, username: userUsername, name, level } = response.data
            login(token, id, userUsername, name, level)

            // Redirect to home page
            navigate('/')
        } catch (err) {
            // Handle error codes from Flask
            const errorCode = err.response?.data
            if (errorCode) {
                setError(getErrorMessage(errorCode))
            } else {
                setError('Login failed. Please try again.')
            }
        }
    }

    return (
        <>
            <h2>Sign In</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Form onSubmit={handleSubmit}>
                <div>
                    <TextInput name="username" placeholder="Username" />
                </div>
                <div>
                    <TextInput name="password" placeholder="Password" password />
                </div>
                <div>
                    <Submit />
                </div>
            </Form>
        </>
    )
}

export default Login
