import Image from './Image'

function Professional({ professional }) {
    return (
        <div className="col-md-4 text-center mb-4">
            <Image
                src={professional.image_filename}
                backend={true}
                alt={professional.name}
                style={{width: '225px', height: '225px', objectFit: 'cover', borderRadius: '50%'}}
                className="img-fluid mb-3"
            />
            <h3>{professional.name}</h3>
            {professional.title && <p className="text-muted">{professional.title}</p>}
        </div>
    )
}

export default Professional
