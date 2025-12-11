import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import Image from './Image'
import DeleteButton from './DeleteButton'
import Editable from './Editable'

function Professional({ professional, onUpdate }) {
    const { level } = useContext(AuthContext)
    const isAuthorized = level >= 2

    return (
        <div className="col-md-4 text-center mb-4">
            <Image
                src={professional.image_filename}
                backend={true}
                alt={professional.name}
                style={{width: '225px', height: '225px', objectFit: 'cover', borderRadius: '50%'}}
                className="img-fluid mb-3"
                editable={isAuthorized}
                route={`/professional/${professional.id}`}
                fieldName="image_file"
                onSuccess={onUpdate}
            />
            <h3>
                {isAuthorized ? (
                    <Editable
                        text={professional.name}
                        route={`/professional/${professional.id}`}
                        fieldName="name"
                        onSuccess={onUpdate}
                    />
                ) : (
                    professional.name
                )}
            </h3>
            {professional.title && (
                <p className="text-muted">
                    {isAuthorized ? (
                        <Editable
                            text={professional.title}
                            route={`/professional/${professional.id}`}
                            fieldName="title"
                            onSuccess={onUpdate}
                        />
                    ) : (
                        professional.title
                    )}
                </p>
            )}
            {isAuthorized && (
                <DeleteButton
                    route={`/professional/${professional.id}`}
                    onSuccess={onUpdate}
                />
            )}
        </div>
    )
}

export default Professional
