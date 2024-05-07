import React, { useEffect, useState } from 'react'
import { ResponsiveAppBarHomepage } from '../AppBar/ResponsiveAppBarHomepage'
import { MySnackbar } from '../MySnackbar';
import userServices from '../../services/userService';
import sound from '../../assets/sound.wav';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate, useParams } from 'react-router-dom';
import productServices from '../../services/productService';

export const EditProduct = () => {
    const { productId } = useParams();

    const [imageName, setImageName] = useState('productDefaultImage.png');
    const [file, setFile] = useState(null);
    const [user, setUser] = useState({});
    const [product, setProduct] = useState({});
    const navigate = useNavigate();

    // fields for products
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productStock, setProductStock] = useState(0);


    useEffect(() => {

        // get product data from the server
        productServices.getSingleProductById(productId)
            .then(res => {

                console.log(`Found product for editing : ${res.data}`)

                // store the product data in the product state 
                setProduct(res.data);

                const response = res.data;
                setImageName(response.picture);


                // store the product data in the respective states
                setProductName(response.name);
                setProductPrice(response.price);
                setProductDescription(response.description);
                setProductCategory(response.category);
                setProductStock(response.totalStockNumber);
            })
            .catch(err => window.alert(err.response.data.error));

    }, []);


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
            userServices.uploadProductImage(file)
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

    const handleEditProduct = (e) => {
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
            return;
        }
        else if (productCategory === '' || productDescription === '' || productName === '') {
            play();
            setSnack({
                type: 'error',
                message: 'All fields are required',
            });
            setOpen(true);
            return;
        }
        else {

            const updatedProduct = {
                name: productName,
                price: productPrice,
                description: productDescription,
                category: productCategory,
                totalStockNumber: productStock,
            };
            console.log('-------------------');

            const confirmation = window.confirm('Are you sure you want to edit this product?');
            if (confirmation) {
                productServices.editProduct(productId, updatedProduct)
                    .then(res => {
                        console.log(`Product updated successfully: ${res.data}`);

                        play();
                        setSnack({
                            type: 'success',
                            message: 'Product updated successfully',
                        });
                        setOpen(true);

                        // reset the fields
                        setProductName('');
                        setProductPrice(0);
                        setProductDescription('');
                        setProductCategory('');
                        setProductStock(0);

                        // redirect to products page
                        navigate('/viewAllProducts');
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

    };


    return (
        <div>
            <ResponsiveAppBarHomepage purchaseProductLength={0} />
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
                                Edit Product
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
                                        value='Edit Product'
                                        className='btn btn-primary w-full mt-4 mb-4'
                                        onClick={handleEditProduct}
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
                                        disabled
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        required />

                                    <Button variant='contained'
                                        style={{ color: 'white' }} disabled onClick={handleUpload}
                                        startIcon={<CloudUploadIcon style={{ color: 'white' }} />}
                                        className="btn btn-secondary" >Upload Product Pic</Button>

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
