function Category({ category, serviceList }) {
    return (
        <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h3 className="h5 mb-0">{category.name}</h3>
                </div>
                <div className="card-body p-0">
                    {serviceList && category.services && category.services.length > 0 ? (
                        <div className="list-group list-group-flush">
                            {category.services.map((svc, idx) => (
                                <div key={idx} className="list-group-item">{svc}</div>
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
