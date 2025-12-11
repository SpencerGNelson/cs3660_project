import { useState, useEffect, useContext } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import { UserProfile } from '../widgets'
import { AuthContext } from '../contexts/AuthContext'
import axiosInstance from '../axiosInstance'

function Admin() {
    usePageTitle('User Management')

    const { level } = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/api/get_users')
            setUsers(response.data)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching users:', err)
            setError('Failed to load users')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    if (loading) return <p>Loading users...</p>
    if (error) return <p className="text-danger">{error}</p>

    return (
        <div className="container my-4">
            <h2>User Management</h2>
            <p className="text-muted">Manage all users in the system</p>

            <div className="row">
                <div className="col-12">
                    {users.length === 0 ? (
                        <p className="text-muted">No users found in the database.</p>
                    ) : (
                        users.map((user) => (
                            <UserProfile
                                key={user.id}
                                user={user}
                                onUpdate={fetchUsers}
                                isLevel3={level >= 3}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Admin
