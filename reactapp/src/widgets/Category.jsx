import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import DeleteButton from './DeleteButton'
import Editable from './Editable'

function Category({ category, serviceList, onUpdate }) {
    const { level } = useContext(AuthContext)
    const isAuthorized = level >= 2

    return (
        <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3 className="h5 mb-0">
                        {isAuthorized ? (
                            <Editable
                                text={category.name}
                                route={`/category/${category.id}`}
                                fieldName="name"
                                onSuccess={onUpdate}
                            />
                        ) : (
                            category.name
                        )}
                    </h3>
                    {isAuthorized && (
                        <DeleteButton
                            route={`/category/${category.id}`}
                            onSuccess={onUpdate}
                        />
                    )}
                </div>
                <div className="card-body p-0">
                    {serviceList && category.services && category.services.length > 0 ? (
                        <div className="list-group list-group-flush">
                            {category.services.map((svc) => (
                                <div key={svc.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {isAuthorized ? (
                                        <Editable
                                            text={svc.name}
                                            route={`/service/${svc.id}`}
                                            fieldName="servicename"
                                            onSuccess={onUpdate}
                                        />
                                    ) : (
                                        svc.name
                                    )}
                                    {isAuthorized && (
                                        <DeleteButton
                                            route={`/service/${svc.id}`}
                                            onSuccess={onUpdate}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : serviceList ? (
                        <div className="list-group-item text-muted fst-italic">
                            No services listed
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Category
