import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

function NotFound() {
    usePageTitle('404 - Page Not Found')

    return (
        <div style={{
            textAlign: 'center',
            padding: '50px 20px',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h1 style={{ fontSize: '72px', margin: '0', color: '#dc3545' }}>404</h1>
            <h2 style={{ marginTop: '20px' }}>Page Not Found</h2>
            <p style={{
                fontSize: '18px',
                color: '#666',
                margin: '20px 0'
            }}>
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                to="/"
                style={{
                    display: 'inline-block',
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px'
                }}
            >
                Go Back Home
            </Link>
        </div>
    )
}

export default NotFound
