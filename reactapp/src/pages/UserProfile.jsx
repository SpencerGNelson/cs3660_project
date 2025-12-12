import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'
import Editable from '../widgets/Editable'
import { getErrorMessage } from '../utils/errorMessages'
import axiosInstance from '../axiosInstance'

function UserProfile() {
    usePageTitle('My Profile')

    const { id: currentUserId, username: contextUsername, name: contextName, level: contextLevel } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmation: ''
    })
    const [passwordError, setPasswordError] = useState(null)
    const [passwordSuccess, setPasswordSuccess] = useState(null)


    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setPasswordError(null)
        setPasswordSuccess(null)

        if (passwordData.newPassword !== passwordData.confirmation) {
            setPasswordError('Passwords do not match')
            return
        }

        try {
            const formData = new FormData()
            formData.append('name', 'password')
            formData.append('value', passwordData.newPassword)
            formData.append('confirmation', passwordData.confirmation)
            formData.append('old_password', passwordData.oldPassword)

            const response = await fetch(`/user/${currentUserId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                body: formData
            })

            const result = await response.text()

            if (result === 'ok') {
                setPasswordSuccess('Password updated successfully!')
                setPasswordData({ oldPassword: '', newPassword: '', confirmation: '' })
                setShowPasswordForm(false)
                setTimeout(() => setPasswordSuccess(null), 3000)
            } else {
                setPasswordError(getErrorMessage(result))
            }
        } catch (err) {
            setPasswordError('An error occurred while updating password')
        }
    }

    if (loading) return <p>Loading profile...</p>
    if (!currentUserId) return <p className="text-danger">Please log in to view your profile</p>

    return (
        <div className="container my-4">
            <h2>My Profile</h2>
            <div className="card">
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label"><strong>Name:</strong></label>
                        <div>
                            <Editable
                                text={contextName}
                                route={`/user/${currentUserId}`}
                                fieldName="name"
                                onSuccess={() => {}}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label"><strong>Username:</strong></label>
                        <div>
                            <Editable
                                text={contextUsername}
                                route={`/user/${currentUserId}`}
                                fieldName="username"
                                onSuccess={() => {}}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label"><strong>Level:</strong></label>
                        <div>
                            {contextLevel >= 3 ? (
                                <Editable
                                    text={String(contextLevel)}
                                    route={`/user/${currentUserId}`}
                                    fieldName="level"
                                    onSuccess={() => {}}
                                />
                            ) : (
                                <span>{contextLevel}</span>
                            )}
                        </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="mt-4">
                        <h5>Change Password</h5>
                        {!showPasswordForm ? (
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowPasswordForm(true)}
                            >
                                Change Password
                            </button>
                        ) : (
                            <div className="border p-3 rounded">
                                <form onSubmit={handlePasswordChange}>
                                    <div className="mb-3">
                                        <label className="form-label">Old Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({
                                                ...passwordData,
                                                oldPassword: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({
                                                ...passwordData,
                                                newPassword: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={passwordData.confirmation}
                                            onChange={(e) => setPasswordData({
                                                ...passwordData,
                                                confirmation: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    {passwordError && (
                                        <div className="alert alert-danger">{passwordError}</div>
                                    )}
                                    {passwordSuccess && (
                                        <div className="alert alert-success">{passwordSuccess}</div>
                                    )}
                                    <button type="submit" className="btn btn-primary me-2">
                                        Update Password
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowPasswordForm(false)
                                            setPasswordData({ oldPassword: '', newPassword: '', confirmation: '' })
                                            setPasswordError(null)
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
