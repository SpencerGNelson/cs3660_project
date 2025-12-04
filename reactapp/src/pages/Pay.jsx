import { usePageTitle } from '../hooks/usePageTitle'

function Pay() {
    usePageTitle('Pay')

    return (
        <>
            <h2>Pay Your Bill</h2>
            <form>
                <div>
                    <input autoComplete="off" type="text" name="accountnumber" placeholder="Account Number" />
                </div>
                <div>
                    <input autoComplete="off" type="text" name="cardholder" placeholder="Cardholder Name" />
                </div>
                <div>
                    <input autoComplete="off" type="text" name="zip" placeholder="Cardholder Zip" />
                </div>
                <div>
                    <input autoComplete="off" type="text" name="cardnumber" placeholder="Card Number" />
                </div>
                <div>
                    <input autoComplete="off" type="text" name="expmonth" placeholder="Exp Month" style={{width: '80px'}} /> /
                    <input autoComplete="off" type="text" name="expyear" placeholder="Exp Year" style={{width: '80px'}} />
                </div>
                <div>
                    <input autoComplete="off" type="text" name="cvv" placeholder="CVV Code" />
                </div>
                <div>
                    <input type="submit" />
                </div>
            </form>
        </>
    )
}

export default Pay
