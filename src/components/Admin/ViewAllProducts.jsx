import React, { useEffect, useState } from 'react'
import userServices from '../../services/userService';
import { ResponsiveAppBarHomepage } from '../AppBar/ResponsiveAppBarHomepage';
import { usePurchase } from '../../utils/purchaseContext';
import productServices from '../../services/productService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '@mui/material';
import { EditProduct } from './EditProduct';
import { useNavigate } from 'react-router-dom';
import { MySnackbar } from '../MySnackbar';
import sound from '../../assets/sound.wav';

export const ViewAllProducts = () => {
    const purchase = usePurchase();
    const [purchaseProducts, setPurchaseProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const navigate = useNavigate();


    const [snack, setSnack] = useState({
        type: '',
        message: '',
    });
    // for open and close snackbar
    const [open, setOpen] = React.useState(false);

    // for closing snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const play = () => new Audio(sound).play();

    useEffect(() => {

        productServices.getAllProudcts()
            .then(res => setAllProducts(res.data))
            .catch(err => window.alert(err.response.data.error));
    }, []);

    const handleProductDelete = (e, id) => {
        e.preventDefault();

        const confirm = window.confirm('Are you sure you want to delete this product?');
        if (confirm) {
            productServices.deleteProduct(id)
                .then(res => {

                    // delete product from the state as well
                    const otherProducts = allProducts.filter(item => item.id !== id);
                    setAllProducts(otherProducts);


                    play();
                    setSnack({
                        type: 'success',
                        message: 'Product deleted successfully.',
                    });
                    setOpen(true);
                })
                .catch(err => {
                    play();
                    setSnack({
                        type: 'error',
                        message: err.response.data.error,
                    });
                    setOpen(true);
                });
        }

    };
    return (
        <div>
            <ResponsiveAppBarHomepage purchaseProductLength={purchase.purchase.length} />

            <div className='m-12'>
                <h1 className='text-3xl m-10 font-bold'>All Products List</h1>

                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>

                                <th className='text-info text-2xl'>Name</th>
                                <th className='text-info text-2xl'>Price</th>
                                <th className='text-info text-2xl'>Category</th>
                                <th className='text-info text-2xl'>Stock</th>
                                <th className='text-info text-2xl'>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                allProducts.map((item, index) => (
                                    <tr key={item.id}>

                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={`http://localhost:3005/product/${item.picture}`} alt="Avatar Tailwind CSS Component" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold" style={{ color: 'white' }}>{item.name}</div>
                                                    {/* <div className="text-sm opacity-50">{item.category}</div> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.price}</td>
                                        <td>{item.category}</td>
                                        <td>{item.totalStockNumber}</td>
                                        <td>
                                            <IconButton onClick={() => navigate(`/editProduct/${item.id}`)} style={{ color: 'white' }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={(e) => handleProductDelete(e, item.id)} style={{ color: 'white' }}>
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        </td>

                                    </tr>
                                ))
                            }

                        </tbody>


                    </table>
                </div>

            </div>
            <MySnackbar open={open} handleClose={handleClose} type={snack.type} message={snack.message} />

        </div>
    )
}
