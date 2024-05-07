import React, { useEffect, useState } from 'react'
import userServices from '../../services/userService';
import { ResponsiveAppBarHomepage } from '../AppBar/ResponsiveAppBarHomepage';
import { usePurchase } from '../../utils/purchaseContext';

export const PurchaseHistory = () => {
    const purchase = usePurchase();
    const [purchaseProducts, setPurchaseProducts] = useState([]);

    useEffect(() => {
        userServices.getAllPurchaseProducts()
            .then(res => setPurchaseProducts(res.data))
            .catch(err => window.alert(err.response.data.error));
    }, []);

    console.log(purchaseProducts.length);
    console.log(purchaseProducts)
    return (
        <div>
            <ResponsiveAppBarHomepage purchaseProductLength={purchase.purchase.length} />

            <div className='m-12'>
                <h1 className='text-3xl m-10 font-bold'>Purchase History</h1>

                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>

                                <th className='text-info text-2xl'>Name</th>
                                <th className='text-info text-2xl'>Purchase Date</th>
                                <th className='text-info text-2xl'>Quantity</th>
                                <th className='text-info text-2xl'>Price per piece</th>
                                <th className='text-info text-2xl'>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                purchaseProducts.map((item, index) => (
                                    <tr key={item.id}>

                                        <td>
                                            <div className="flex items-center space-x-3">

                                                <div>
                                                    <div className="font-bold" style={{ color: 'white' }}>{item.name}</div>
                                                    {/* <div className="text-sm opacity-50">{item.category}</div> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.purchaseDate}</td>
                                        <td>
                                            {item.quantity}

                                        </td>
                                        <td>{item.price}</td>
                                        <td>{item.totalPrice}</td>

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
                                <th></th>

                            </tr>
                        </tfoot>

                    </table>
                </div>

            </div>
        </div>
    )
}
