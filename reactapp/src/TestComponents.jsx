import { DeleteButton, Editable, Image } from './widgets'

function TestComponents() {
    const handleSuccess = () => {
        console.log('Success callback triggered')
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Component Testing Page</h1>

            <h2>1. Editable Component Test</h2>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                <p>
                    Name: <Editable
                        text="Test Name"
                        route="/professional/1"
                        fieldName="name"
                        onSuccess={handleSuccess}
                    />
                </p>
            </div>

            <h2>2. DeleteButton Component Test</h2>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                <span>Delete this item</span>
                <DeleteButton
                    route="/professional/1"
                    onSuccess={handleSuccess}
                />
            </div>

            <h2>3. Image Component Test (Non-editable)</h2>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                <Image
                    src="test.jpg"
                    backend={false}
                    alt="Test Image"
                    style={{width: '100px', height: '100px'}}
                />
            </div>

            <h2>4. Image Component Test (Editable)</h2>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                <Image
                    src="professional1.jpg"
                    backend={true}
                    alt="Test Professional"
                    style={{width: '100px', height: '100px'}}
                    editable={true}
                    route="/professional/1"
                    onSuccess={handleSuccess}
                />
            </div>
        </div>
    )
}

export default TestComponents
