import React, { useEffect, useState } from 'react'
import { usePurchase } from '../../utils/purchaseContext';
import { useNavigate } from 'react-router-dom';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { Button } from '@mui/material';
import productServices from '../../services/productService';
import keys from '../../services/khaltiSecrets';
import KhaltiCheckout from "khalti-checkout-web";
import userServices from '../../services/userService';

export const PurchaseCart = () => {
    const purchase = usePurchase();
    const navigate = useNavigate();
    const [purchaseProduct, setPurchaseProduct] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [user, setUser] = useState({});
    const [pay, setPay] = useState(0);




    useEffect(() => {
        userServices.getUser()
            .then(res => {
                setUser(res.data)
                const userData = res.data;
                console.log(userData)
            })
            .catch(err => window.alert(err.response.data.error));


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


    // send the purchase product data to the server
    const handlePayAndPurchase = () => {
        // e.preventDefault();

        console.log(purchaseProduct);

        // navigate to the payment page
        const finalProducts = {
            items: purchaseProduct.items,
            payAmount: pay
        }

        productServices.purchaseProduct(finalProducts)
            .then(res => {
                window.alert('Purchase successfully!');

                // clear the purchase context
                purchase.setPurchase([]); // empty the purchase context
                setPurchaseProduct({});
                setTotalPrice(0);
                setPay(0);

                navigate('/home');
            })
            .catch(err => window.alert(err.response.data.error));
    };


    const payValidation = () => {
        if (user.amount >= totalPrice && pay == totalPrice) {
            console.log('U can pay');

            return true;
        }

        return false;

    }


    // add Vulnerability that price can be reduced
    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = payValidation();

        if (isValid) {
            const confirmation = window.confirm(`Are you sure want to buy at ${pay}?`);
            if (confirmation) {

                // call the purchase product from server API
                handlePayAndPurchase();

            }

        }

        else {
            window.alert(`Sorry, you cannot buy at Rs ${pay} or out of the balance.`);
        }

    }


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


                        <form>

                            <input type="text"
                                onChange={(e) => setPay(e.target.value)}
                                placeholder='Enter price'
                                className="input input-bordered input-primary w-full max-w-xs m-12"
                            />


                            <Button className='w-wide'
                                onClick={handleSubmit}
                                variant="contained"
                                startIcon={<ShoppingCartCheckoutIcon
                                />}>
                                Purchase Now
                            </Button>

                        </form>
                        <div className="text-info">Note: Enter price on the field and pay.</div>


                    </>
                )
                    : (
                        <div className="text-warning">No product in the purchase cart</div>
                    )
            }

            <div className="text-info">Your total amount is : Rs {user.amount}</div>

        </div>
    )
}
