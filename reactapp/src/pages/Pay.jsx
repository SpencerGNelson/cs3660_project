import { usePageTitle } from '../hooks/usePageTitle'
import { Form, TextInput, Submit } from '../widgets'

function Pay() {
    usePageTitle('Pay')

    return (
        <>
            <h2>Pay Your Bill</h2>
            <Form>
                <div>
                    <TextInput name="accountnumber" placeholder="Account Number" />
                </div>
                <div>
                    <TextInput name="cardholder" placeholder="Cardholder Name" />
                </div>
                <div>
                    <TextInput name="zip" placeholder="Cardholder Zip" />
                </div>
                <div>
                    <TextInput name="cardnumber" placeholder="Card Number" />
                </div>
                <div>
                    <TextInput name="expmonth" placeholder="Exp Month" /> /
                    <TextInput name="expyear" placeholder="Exp Year" />
                </div>
                <div>
                    <TextInput name="cvv" placeholder="CVV Code" />
                </div>
                <div>
                    <Submit />
                </div>
            </Form>
        </>
    )
}

export default Pay
