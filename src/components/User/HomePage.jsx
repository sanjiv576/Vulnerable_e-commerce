// only for registered users
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePurchase } from "../../utils/purchaseContext";
import productServices from "../../services/productService";

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Button } from "@mui/material";
import { ResponsiveAppBarHomepage } from "../AppBar/ResponsiveAppBarHomepage";
import dummyProductData from "../../data/data";

function HomePage() {
    const purchase = usePurchase();
    const navigate = useNavigate();

    const [purchaseProduct, setPurchaseProduct] = useState({});
    const [products, setProducts] = useState([]);
    const [newReleasedProduct, setNewReleasedProduct] = useState({});
    const [hottestProduct, setHottestProduct] = useState({});
    const [userId, setUserId] = useState('');

    useEffect(() => {
        console.log(`Purchase context length from homepage is : ${purchase.purchase.length}`);


        // set the purchase product in the state by reading from the local storage
        setUserId(window.localStorage.getItem('userId'));

        setPurchaseProduct(
            {
                items: purchase.purchase,
                // totalPrice: purchase.purchase.reduce((total, item) => total + (item.price * item.quantity), 0),
                payment: "pending",
            }
        );

        // get the all products from the server
        productServices.getAllProudcts()
            .then(res => {

                if (res.data.length === 0) {

                    const dummyProduct = dummyProductData;
                    // dummy data of product
                    setProducts(dummyProduct);

                    // set the first and last product in the state
                    setNewReleasedProduct(dummyProduct[1]);
                    setHottestProduct(dummyProduct[dummyProduct.length - 1]);
                    return;
                }

                // set in the state
                setProducts(res.data);

                // iterate each product from the response
                res.data.forEach(product => {
                    console.log(`Product name from home: ${product.name}`);
                });

                // set the first and last product in the state
                setNewReleasedProduct(res.data[0]);
                setHottestProduct(res.data[res.data.length - 1]);
            })
            .catch(err => window.alert(err.response.data.error));
    }, []);


    const clearPurchaseContext = () => {
        purchase.setPurchase([]); // empty the purchase context
        setPurchaseProduct({});
        console.log('Puchase context cleared');
    };

    // this works fine
    const handlePurchaseCancellation = (e) => {
        e.preventDefault();

        // if(purchase.purchase.length === 0) return window.alert('Please, add to cart first');

        const confirmation = window.confirm('Are you sure you want to cancel the purchase?');
        if (confirmation) {
            console.log('Purchase cancelled');
            clearPurchaseContext();
            console.log(`After cancellation, purchase context length from homepage is : ${purchase.purchase.length}`);

        }
    };

    // this works fine
    const handlePurchase = (e) => {
        e.preventDefault();

        if (purchase.purchase.length === 0) {
            window.alert('Please, add to cart first');
        }
        else {
            console.log('Go to Khalti payement gateway. Then, only, POST to the server');

            // assume payment is successful

            const finalPurchaseProduct = { ...purchaseProduct, payment: "success" };

            finalPurchaseProduct.items.map((item) => {
                console.log(`Purchase product name is : ${item.name}`);
                console.log(`Purchase product quantity is : ${item.quantity}`);
                console.log(`Purchase product price is : ${item.price}`);
                console.log('-----------------------------------');
            });

            // call API end point here

            // clear the purchase context after successfull payment
            clearPurchaseContext();

        }

    };

    const handleView = () => { };
    return (
        <>
            <ResponsiveAppBarHomepage purchaseProductLength={purchase.purchase.length} />
            <div className="text-3xl p-2 font-bold">Welcome to Samaan Kinam E-commerce</div>
            <div className="carousel w-full h-90 carousel-section">
                <div id="item1" className="carousel-item w-full">
                    <img src="/images/4.png" className="w-full" />

                </div>
                <div id="item2" className="carousel-item w-full">
                    <img src="/images/3.png" className="w-full" />

                </div>
                <div id="item3" className="carousel-item w-full">
                    <img src="/images/5.png" className="w-full" />

                </div>
                <div id="item4" className="carousel-item w-full">
                    <img src="/images/2.png" className="w-full" />

                </div>
            </div>
            <div className="flex justify-center w-full py-2 gap-2">
                <a href="#item1" className="btn btn-xs btn-secondary">1</a>
                <a href="#item2" className="btn btn-xs btn-secondary">2</a>
                <a href="#item3" className="btn btn-xs btn-secondary">3</a>
                <a href="#item4" className="btn btn-xs btn-secondary">4</a>
            </div>


            <div className="carousel carousel-end rounded-box row-carousel mt-4">

                {
                    [...Array(1)].map((_, i) => {
                        return products.map((product) => {
                            return (

                                <div className="carousel-item mr-5" key={product.id + i}>
                                    <img src={`http://localhost:3005/product/${product.picture}`} alt="Drink" />
                                </div>

                            );
                        })
                    })
                }

            </div>

            <div className="card lg:card-side bg-base-100 shadow-xl single-row-card">
                <figure><img src={`http://localhost:3005/product/${newReleasedProduct.picture}`} /></figure>
                <div className="card-body">
                    <h2 className="card-title text-4xl font-bold mb-4">New released!</h2>
                    <p className="justify-center">{newReleasedProduct.description}</p>
                    <div className="card-actions justify-end">

                        <Button onClick={() => navigate(`/singleProduct/${newReleasedProduct.id}`)} variant="contained" startIcon={<AddShoppingCartIcon />}>
                            Add to cart
                        </Button>
                    </div>
                </div>

            </div>

            <h2 className="text-5xl font-bold m-4">All Products</h2>


            <div className="allProductsView">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                    {
                        [...Array(4)].map((_, i) => {

                            return products.map((product) => (
                                <div key={product.id} className="card bg-base-100 shadow-xl m-4">
                                    <figure>
                                        <img className="mt-4" src={`http://localhost:3005/product/${product.picture}`} alt="Product" />
                                    </figure>
                                    <div className="card-body">
                                        <h2>{product.name}</h2>
                                        <p>{product.description.substring(0, 99)}...</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1">
                                            {/* <Button className="mb-4" onClick={() => navigate(`/singleProduct/${product.id}`)} variant="contained" startIcon={<VisibilityIcon />}>
                                                View
                                            </Button> */}

                                            <br />

                                            <Button className="m-4" onClick={() => navigate(`/singleProduct/${product.id}`)} variant="contained" startIcon={<AddShoppingCartIcon />}>
                                                Add to cart
                                            </Button>
                                        </div>
                                        <div className="card-actions justify-end mt-2">
                                            <div className="badge badge-outline badge-info">{product.category}</div>
                                            <div className="badge badge-outline badge-info">Available</div>
                                            <div className="badge badge-outline badge-info">Rs {product.price}</div>
                                        </div>
                                    </div>
                                </div>
                            ))


                        })
                    }
                </div>
            </div>

            <div className="hero bg-base-200 mb-8">
                <div className="hero-content flex-col lg:flex-row-reverse">

                    <img id="right-card" src={`http://localhost:3005/product/${hottestProduct.picture}`} className="max-w-sm rounded-lg shadow-2xl" />
                    <div className="single-card-right">
                        <h1 className="text-4xl font-bold">Hottest!</h1>
                        <p className="py-6">{hottestProduct.description}</p>
                        <div className="card-actions justify-start">
                            <Button onClick={() => navigate(`/singleProduct/${hottestProduct.id}`)} variant="contained" startIcon={<AddShoppingCartIcon />}>
                                Add to cart
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

}

export default HomePage;