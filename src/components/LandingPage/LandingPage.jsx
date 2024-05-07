import { Link, NavLink, useNavigate } from "react-router-dom";


import { useEffect, useState } from "react";
import './LandingPage.css';
import productServices from "../../services/productService";
import { ResponsiveAppBarLandingPage } from "../AppBar/ResponsiveAppBarLandingPage";
import { Button, IconButton } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dummyProductData from "../../data/data";


// for guest users
function LandingPage() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [newReleasedProduct, setNewReleasedProduct] = useState({});
    const [hottestProduct, setHottestProduct] = useState({});
    const [isLogin, setIsLogin] = useState(false);



    useEffect(() => {
        productServices.getAllProudcts()
            .then(res => {

                if (res.data.length === 0) {
                    const dummyProduct = dummyProductData;
                    setProducts(dummyProduct);

                    // set the first and last product in the state
                    setNewReleasedProduct(dummyProduct[1]);
                    setHottestProduct(dummyProduct[dummyProduct.length - 1]);
                    return;
                }

                // set in the state
                setProducts(res.data);

                console.log(typeof (res.data))
                console.log(res.data[0])

                // set the first and last product in the state
                setNewReleasedProduct(res.data[0]);
                setHottestProduct(res.data[res.data.length - 1]);

                // iterate each product from the response
                res.data.forEach(product => {
                    console.log(`Product name: ${product.name}`);
                });
            })
            .catch(err => window.alert(err.response.data.error));

    }, []);

    const handleAddToCart = () => {

        // const confirmation = window.confirm('Please, login to add to cart!');

        if (isLogin) {
            navigate('/sinlgeProduct');
        } else {

            window.alert('Not authorization. Please, login!');
            navigate('/login');
        }
    };


    return (
        <>
            <ResponsiveAppBarLandingPage />

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
                    [...Array(2)].map((_, i) => {
                        return products.map((product) => {
                            return (

                                <div className="carousel-item mr-5" key={product.id + i}>
                                    <img src={`https://localhost:3005/product/${product.picture}`} alt="Drink" />
                                </div>

                            );
                        })
                    })
                }

            </div>

            <div className="card lg:card-side bg-base-100 shadow-xl single-row-card">
                <figure><img src={`https://localhost:3005/product/${newReleasedProduct.picture}`} /></figure>
                <div className="card-body">
                    <h2 className="card-title text-4xl font-bold mb-4">New released!</h2>
                    <p className="justify-center">{newReleasedProduct.description}</p>
                    <div className="card-actions justify-end">

                        <Button onClick={handleAddToCart} variant="contained" startIcon={<AddShoppingCartIcon />}>
                            Add to cart
                        </Button>
                    </div>
                </div>

            </div>

            <h2 className="text-5xl font-bold m-4">All Products</h2>


            <div className="allProductsView">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        [...Array(4)].map((_, i) => {

                            return products.map((product) => (
                                <div key={product.id} className="card bg-base-100 shadow-xl m-4">
                                    <figure>
                                        <img className="mt-4" src={`https://localhost:3005/product/${product.picture}`} alt="Product" />
                                    </figure>
                                    <div className="card-body">
                                        <h2>{product.name}</h2>
                                        <p>{product.description.substring(0, 99)}...</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1">
                                            <Button className="mb-4" onClick={() => navigate(`/singleProduct/${product.id}`)} variant="contained" startIcon={<VisibilityIcon />}>
                                                View
                                            </Button>

                                            <br />

                                            <Button className="m-2" onClick={handleAddToCart} variant="contained" startIcon={<AddShoppingCartIcon />}>
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

                    <img id="right-card" src={`https://localhost:3005/product/${hottestProduct.picture}`} className="max-w-sm rounded-lg shadow-2xl" />
                    <div className="single-card-right">
                        <h1 className="text-4xl font-bold">Hottest!</h1>
                        <p className="py-6">{hottestProduct.description}</p>
                        <div className="card-actions justify-start">
                            <Button onClick={handleAddToCart} variant="contained" startIcon={<AddShoppingCartIcon />}>
                                Add to cart
                            </Button>
                        </div>
                    </div>
                </div>
            </div>



        </>
    );
}

export default LandingPage;