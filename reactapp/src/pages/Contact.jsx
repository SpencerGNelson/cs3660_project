import { useState } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'

function Contact() {
    usePageTitle('Contact')

    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

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

            <form method="POST" action="/contact">
                <div>
                    <input autoComplete="off" type="text" name="name" placeholder="Your Name" />
                </div>
                <div>
                    <input autoComplete="off" type="text" name="phone" placeholder="Your Phone Number" />
                </div>
                <div>
                    <input autoComplete="off" type="email" name="email" placeholder="Your Email" />
                </div>
                <div>
                    <input autoComplete="off" type="text" name="subject" placeholder="Subject" />
                </div>
                <div>
                    <textarea autoComplete="off" name="message" placeholder="Your Message" rows="5"></textarea>
                </div>
                <div>
                    <input type="submit" />
                </div>
            </form>
        </>
    )
}

export default Contact
