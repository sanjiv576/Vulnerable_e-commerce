import React, { useState } from 'react'
import { ResponsiveAppBarHomepage } from '../AppBar/ResponsiveAppBarHomepage'
import { MySnackbar } from '../MySnackbar';
import userServices from '../../services/userService';
import sound from '../../assets/sound.wav';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import productServices from '../../services/productService';
import { AdminAppBar } from '../AppBar/AdminAppBar';

export const AddProduct = () => {
    const [imageName, setImageName] = useState('productDefaultImage.png');
    const [file, setFile] = useState(null);
    const [user, setUser] = useState({});
    // this product id is used after the product is created to upload image
    const [productId, setProductId] = useState('');

    // fields for products
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productStock, setProductStock] = useState(0);


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

    const handleUpload = (e) => {
        e.preventDefault();

        if (productId === '') {
            play();
            setSnack({
                type: 'error',
                message: 'Please, add product first. Then only you can upload image.',
            });
            setOpen(true);
            return;
        }


        if (!file) {
            play();
            setSnack({
                type: 'error',
                message: 'Please, select a file',
            });
            setOpen(true);
            return;
        }

        const confirmation = window.confirm('Are you sure you want to change your profile picture?');
        if (confirmation) {
            console.log(`File: ${file}`);
            userServices.uploadProductImage(productId, file)
                .then(res => {

                    // update user picture
                    setUser({ ...user, picture: res.data.filename });

                    play();
                    setSnack({
                        type: 'success',
                        message: 'Product picture added successfully',
                    });
                    setOpen(true);

                    setFile(null);

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

    }

    const handleAddProduct = (e) => {
        e.preventDefault();

        console.log(`Product name: ${productName}`);
        console.log(`Product price: ${productPrice}`);
        console.log(`Product description: ${productDescription}`);
        console.log(`Product category: ${productCategory}`);
        console.log(`Product stock: ${productStock}`);


        if (productPrice <= 0 || productStock <= 0) {
            play();
            setSnack({
                type: 'error',
                message: 'Price and stock must be greater than 0',
            });
            setOpen(true);

        }
        else if (productCategory === '' || productDescription === '' || productName === '') {
            play();
            setSnack({
                type: 'error',
                message: 'All fields are required',
            });
            setOpen(true);

        }
        else {
            const product = {
                name: productName,
                price: productPrice,
                description: productDescription,
                category: productCategory,
                totalStockNumber: productStock,
            };

            productServices.addProduct(product)
                .then(res => {

                    // store the product id in the state
                    setProductId(res.data.id);

                    play();
                    setSnack({
                        type: 'success',
                        message: 'Product added successfully',
                    });
                    setOpen(true);

                    setProductName('');
                    setProductPrice(0);
                    setProductDescription('');
                    setProductCategory('');
                    setProductStock(0);
                    return;
                })
                .catch(err => {
                    play();
                    setSnack({
                        type: 'error',
                        message: err.response.data.error,
                    });
                    setOpen(true);
                })
        }
    };

    return (
        <div>
            {/* <ResponsiveAppBarHomepage purchaseProductLength={0} /> */}
            <AdminAppBar/>
            <div className="gb-darkzero w-screen m-10">
                <div className="w-[80] mx-auto" align="center" >
                    <div className='mx-auto pt-10'>

                        <div style={{
                            border: '1px solid green',
                            boxShadow: "0 0 50px rgb(26, 176, 23) ",

                        }}
                            className="rounded-lg mt-3 text-white bg-indigo-500 p-5 m-auto lg:w-[500px] md:w-[400px] sm:w-[300px]"
                            align="center"
                        >
                            <div className="text-3xl font-bold">
                                Add Product
                            </div>

                            <div className="product-fields mt-5">
                                <form action="">
                                    <div className="mt-5">
                                        <div className="mt-3 mb-2" align="left">
                                            Name:
                                        </div>
                                        <input
                                            type="text"

                                            placeholder="Enter product name here ..."
                                            onChange={(e) => setProductName(e.target.value)}
                                            value={productName}
                                            className='input input-bordered input-accent w-full'
                                            required
                                        />
                                    </div>
                                    <div className="mt-5">
                                        <div className="mt-3 mb-2" align="left">
                                            Price:
                                        </div>
                                        <input
                                            type="number"

                                            placeholder="Enter product name here ..."
                                            onChange={(e) => setProductPrice(e.target.value)}
                                            value={productPrice}
                                            className='input input-bordered input-accent w-full'
                                            required
                                        />
                                    </div>
                                    <div className="mt-5">
                                        <div className="mt-3 mb-2" align="left">
                                            Stock Quantity:
                                        </div>
                                        <input
                                            type="number"

                                            placeholder="Enter stock quantity here ..."
                                            onChange={(e) => setProductStock(e.target.value)}
                                            value={productStock}
                                            className='input input-bordered input-accent w-full'
                                            required
                                        />
                                    </div>
                                    <div className="mt-5">
                                        <div className="mt-3 mb-2" align="left">
                                            Category:
                                        </div>
                                        <select className="select w-full max-w-xs"
                                            onChange={(e) => setProductCategory(e.target.value)}
                                            value={productCategory}
                                            required
                                        >
                                            <option disabled selected>Choose product category</option>
                                            <option value='electronics'>electronics</option>
                                            <option value='clothes'>clothes</option>
                                            <option value='mobile'>mobile</option>
                                            <option value='book'>book</option>
                                            <option value='watch'>watch</option>
                                            <option value='tv'>tv</option>
                                            <option value='utensil'>utensil</option>
                                            <option value='others'>others</option>
                                        </select>
                                    </div>
                                    <div className="mt-5">
                                        <div className="mt-3 mb-2" align="left">
                                            Description:
                                        </div>
                                        <textarea
                                            className="textarea textarea-info  textarea-lg w-full"
                                            placeholder="Write product description here ..."
                                            onChange={(e) => setProductDescription(e.target.value)}
                                            value={productDescription}
                                            required
                                        ></textarea>
                                    </div>

                                    <input
                                        type="submit"
                                        value='Add Product'
                                        className='btn btn-primary w-full mt-4 mb-4'
                                        onClick={handleAddProduct}
                                    />
                                </form>
                            </div>



                            <div className="avatar">
                                <div className="w-60 rounded m-10">
                                    <img src={`https://localhost:3005/product/${imageName}`} />
                                </div>
                            </div>

                            <div className="">
                                <form>
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        required />

                                    <Button variant='contained' onClick={handleUpload} startIcon={<CloudUploadIcon />} className="btn btn-secondary" >Upload Product Pic</Button>

                                </form>

                            </div>

                            <MySnackbar open={open} handleClose={handleClose} type={snack.type} message={snack.message} />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
