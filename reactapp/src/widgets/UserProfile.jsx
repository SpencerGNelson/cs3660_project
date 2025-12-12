import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import DeleteButton from './DeleteButton'
import Editable from './Editable'
import { getErrorMessage } from '../utils/errorMessages'

function UserProfile({ user, onUpdate, isLevel3 }) {
    const { id: currentUserId } = useContext(AuthContext)
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmation: ''
    })
    const [passwordError, setPasswordError] = useState(null)
    const [passwordSuccess, setPasswordSuccess] = useState(null)

    const isOwnProfile = currentUserId === user.id

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

            // Only include old password if not level 3 or if editing own profile
            if (!isLevel3 || isOwnProfile) {
                formData.append('old_password', passwordData.oldPassword)
            }

            const response = await fetch(`/user/${user.id}`, {
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
                // Handle error codes from Flask
                setPasswordError(getErrorMessage(result))
            }
        } catch (err) {
            setPasswordError('An error occurred while updating password')
        }
    }

    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                        <h5 className="card-title">
                            {isLevel3 ? (
                                <Editable
                                    text={user.name}
                                    route={`/user/${user.id}`}
                                    fieldName="name"
                                    onSuccess={onUpdate}
                                />
                            ) : (
                                user.name
                            )}
                        </h5>
                        <p className="card-text">
                            <strong>Username:</strong>{' '}
                            {isLevel3 ? (
                                <Editable
                                    text={user.username}
                                    route={`/user/${user.id}`}
                                    fieldName="username"
                                    onSuccess={onUpdate}
                                />
                            ) : (
                                user.username
                            )}
                        </p>
                        <p className="card-text">
                            <strong>Level:</strong>{' '}
                            {isLevel3 ? (
                                <Editable
                                    text={String(user.level)}
                                    route={`/user/${user.id}`}
                                    fieldName="level"
                                    onSuccess={onUpdate}
                                />
                            ) : (
                                user.level
                            )}
                        </p>
                        <p className="card-text">
                            <small className="text-muted">User ID: {user.id}</small>
                        </p>

                        {/* Password Change Section */}
                        <div className="mt-3">
                            {!showPasswordForm ? (
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => setShowPasswordForm(true)}
                                >
                                    Change Password
                                </button>
                            ) : (
                                <div className="border p-3 rounded">
                                    <h6>Change Password</h6>
                                    <form onSubmit={handlePasswordChange}>
                                        {(!isLevel3 || isOwnProfile) && (
                                            <div className="mb-2">
                                                <label className="form-label">Old Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control form-control-sm"
                                                    value={passwordData.oldPassword}
                                                    onChange={(e) => setPasswordData({
                                                        ...passwordData,
                                                        oldPassword: e.target.value
                                                    })}
                                                    required
                                                />
                                            </div>
                                        )}
                                        <div className="mb-2">
                                            <label className="form-label">New Password</label>
                                            <input
                                                type="password"
                                                className="form-control form-control-sm"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({
                                                    ...passwordData,
                                                    newPassword: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Confirm Password</label>
                                            <input
                                                type="password"
                                                className="form-control form-control-sm"
                                                value={passwordData.confirmation}
                                                onChange={(e) => setPasswordData({
                                                    ...passwordData,
                                                    confirmation: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        {passwordError && (
                                            <div className="alert alert-danger py-1 px-2 small">{passwordError}</div>
                                        )}
                                        {passwordSuccess && (
                                            <div className="alert alert-success py-1 px-2 small">{passwordSuccess}</div>
                                        )}
                                        <button type="submit" className="btn btn-sm btn-primary me-2">
                                            Update Password
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-secondary"
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
                    {isLevel3 && (
                        <DeleteButton
                            route={`/user/${user.id}`}
                            onSuccess={onUpdate}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfile
