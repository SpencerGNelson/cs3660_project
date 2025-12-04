import { useState } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'

function Register() {
    usePageTitle('Register')

    const [error, setError] = useState(null)

    return (
        <>
            <h2>Register</h2>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
            )}

            <form method="POST" action="/register">
                <div>
                    <input autoComplete="off" type="text" name="name" placeholder="Client Name" />
                </div>
                <div>
                    <input autoComplete="off" type="text" name="username" placeholder="Username" />
                </div>
                <div>
                    <input autoComplete="off" type="password" name="password" placeholder="Password" />
                </div>
                <div>
                    <input autoComplete="off" type="password" name="confirmation" placeholder="Confirm Password" />
                </div>
                <div>
                    <input type="submit" />
                </div>
            </form>
        </>
    )
}

export default Register
