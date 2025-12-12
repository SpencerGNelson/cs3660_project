// Utility function to convert error codes to user-friendly messages
export const getErrorMessage = (errorCode) => {
    const errorMessages = {
        'err_notfound': 'Resource not found (404)',
        'err_internal': 'Internal server error (500)',
        'err_login_failed': 'Invalid username or password',
        'err_login_required': 'Please log in to access this resource',
        'err_login_expired': 'Your session has expired. Please log in again',
        'err_login_invalid': 'Invalid authentication token',
        'err_access_denied': 'You do not have permission to perform this action',
        'err_db': 'Database error occurred',
        'err_unrecognized_name': 'Unrecognized field name',
        'err_file': 'File upload error',
        'err_wrong_password': 'Incorrect password',
        'err_password_mismatch': 'Passwords do not match'
    }

    return errorMessages[errorCode] || errorCode
}
