import React, { useEffect, useState } from 'react'
import { usePurchase } from '../../utils/purchaseContext';
import { useNavigate } from 'react-router-dom';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { Button } from '@mui/material';
import productServices from '../../services/productService';
import keys from '../../services/khaltiSecrets';
import KhaltiCheckout from "khalti-checkout-web";

export const PurchaseCart = () => {
    const purchase = usePurchase();
    const navigate = useNavigate();
    const [purchaseProduct, setPurchaseProduct] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    const [pay, setPay] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();

        window.alert(`You paid: ${pay}`);
        setPay(0)
    }


    useEffect(() => {
        // fetch all purchase products from the context api
        setPurchaseProduct(
            {
                items: purchase.purchase,
                // totalPrice: purchase.purchase.reduce((total, item) => total + (item.price * item.quantity), 0),
                payment: "pending",
            }
        );

        // calculate total price
        setTotalPrice(purchase.purchase.reduce((total, item) => total + (item.price * item.quantity), 0));
    }, []);


    // add Vulnerability
    const handlePurchase = (e) => {
        e.preventDefault();

        // set the payment status to success and also from the server
        setPurchaseProduct({
            ...purchaseProduct,
            payment: 'success',
        });
        // call the purchase product from server API
        handlePayAndPurchase();
    }


    // pay with khalti gateway
    const handleKhaltiPayment = (e) => {
        e.preventDefault();
        let config = {
            // "publicKey": "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
            "publicKey": keys.publicTestKey,
            "productIdentity": "1234567890",
            "productName": "Samaan Kinam E-commerce",
            "productUrl": "http://localhost:3005/",
            "eventHandler": {
                onSuccess(payload) {
                    // hit merchant api for initiating verfication
                    console.log(payload);

                    // set the payment status to success and also from the server
                    setPurchaseProduct({
                        ...purchaseProduct,
                        payment: 'success',
                    });
                    // call the purchase product from server API
                    handlePayAndPurchase();
                },
                // onError handler is optional
                onError(error) {
                    // handle errors
                    console.log(error);
                    window.alert('Payment failed!');
                },
                onClose() {
                    console.log('widget is closing');
                }
            },
            "paymentPreference": ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
        };

        let checkout = new KhaltiCheckout(config);

        // checkout.show({ amount: totalPrice * 100 });

        // because of test mode, the maximum amount is 200 
        checkout.show({ amount: 200 * 100 });


    }

    // send the purchase product data to the server
    const handlePayAndPurchase = () => {
        // e.preventDefault();

        console.log(purchaseProduct);

        // navigate to the payment page

        productServices.purchaseProduct(purchaseProduct)
            .then(res => {
                window.alert('Purchase successfully!');

                // clear the purchase context
                purchase.setPurchase([]); // empty the purchase context
                setPurchaseProduct({});
                setTotalPrice(0);

                navigate('/home');
            })
            .catch(err => window.alert(err.response.data.error));
    };
    return (
        <div className='m-12'>
            <h1 className='text-3xl m-10 font-bold'>Purchase Cart Products</h1>

            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>

                            <th className='text-info text-2xl'>Name</th>
                            <th className='text-info text-2xl'>Quantity</th>
                            <th className='text-info text-2xl'>Price per piece</th>
                            <th className='text-info text-2xl'>Price</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            purchaseProduct.items?.map((item, index) => (
                                <tr key={item.id}>

                                    <td>
                                        <div className="flex items-center space-x-3">
                                            {/* <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={`http://localhost:3005/product/${item.picture}`} alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div> */}
                                            <div>
                                                <div className="font-bold">{item.name}</div>
                                                {/* <div className="text-sm opacity-50">{item.category}</div> */}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {item.quantity}

                                    </td>
                                    <td>{item.price}</td>
                                    <td>{item.price * item.quantity}</td>

                                </tr>
                            ))
                        }

                    </tbody>
                    {/* foot */}
                    <tfoot>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th className='text-info text-2xl font-bold'>Total Price: Rs {totalPrice}</th>

                        </tr>
                    </tfoot>

                </table>
            </div>
            {
                purchase.purchase.length > 0 ? (
                    <>
                        <div className="text-info">Note: Rs {totalPrice}/- is equivalent to Rs 200 because of Khalti test-mode payment limitation.</div>
                        <Button className='w-wide' onClick={handlePurchase} variant="contained" startIcon={<ShoppingCartCheckoutIcon />}>
                            Purchase Now
                        </Button>
                    </>
                )
                    : (
                        <div className="text-warning">No product in the purchase cart</div>
                    )
            }

            <form onSubmit={handleSubmit}>

                <input type="text"
                value={pay}
                onChange={(e) => setPay(e.target.value)}
                 placeholder='Enter price' />

                <input type="submit" />

            </form>


        </div>
    )
}
