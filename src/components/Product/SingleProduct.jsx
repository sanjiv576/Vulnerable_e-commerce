
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import dummyData from "../../data/data";

import { usePurchase } from "../../utils/purchaseContext";
import sound from '../../assets/sound.wav';
import { useState } from "react";
import productServices from "../../services/productService";
import { useAuth } from "../../utils/authContext";
import { ResponsiveAppBarLandingPage } from "../AppBar/ResponsiveAppBarLandingPage";
import { Alert, IconButton, Input, Snackbar } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { ResponsiveAppBarHomepage } from "../AppBar/ResponsiveAppBarHomepage";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useUser } from "../../utils/userContext";
import sanitizeInput from "../../utils/sanitizationInput";
import { Height } from "@mui/icons-material";


function SingleProduct() {
    const purchase = usePurchase();
    const auth = useAuth();
    const navigate = useNavigate();
    const user = useUser();

    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(0);

    const [isUserLogin, setIsUserLogin] = useState(false);
    const [reviews, setReviews] = useState([]);
    // review state for writing
    const [feedback, setFeedback] = useState('');
    const [snack, setSnack] = useState({
        type: '',
        message: '',
    });
    const [userId, setUserId] = useState('');
    const [edit, setEdit] = useState({
        isEdit: false,
        reviewId: '',
        text: '',
    });
    const [currentUserReviewId, setCurrentUserReviewId] = useState([]);
    const [deleteReviewId, setDeleteReviewId] = useState('');

    // for open and close snackbar
    const [open, setOpen] = React.useState(false);

    // for closing snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };



    useEffect(() => {
        // console.log(`Auth: ${auth.email}`)
        // if (auth.email) {
        //     setIsUserLogin(true);
        //     console.log(`User is login`);
        //     // get user id
        //     setUserId(user.user.id);
        //     console.log(`User id is : ${userId}`)
        // }
        if (window.localStorage.getItem('token')) {
            setIsUserLogin(true);
            console.log(`User is login`);
            // get user id
            setUserId(user.user.id);
            console.log(`User id is : ${userId}`)
        }
        else {
            console.log(`User is not login`);
        }
        productServices.getSingleProductById(productId)
            .then(res => {
                console.log(res.data)
                setProduct(res.data);
                const singleProduct = res.data;
                console.log(`Product id is : ${productId}`);
                console.log(`length of reviews from product: ${singleProduct.reviews.length}`);
                // setReviews(singleProduct.reviews);

                // get reviews

                productServices.getAllReviews(productId)
                    .then(res => {
                        console.log(`Reviews from api: ${res.data}`);

                        // iterate each response
                        res.data.forEach(review => {
                            console.log(`Review user id: ${review.userId}`);
                            console.log(`Review user name: ${review.userName}`);
                            console.log(`Review user picture: ${review.userPicture}`);
                            console.log(`Review: ${review.text}`);
                            console.log('-------------------')
                        });

                        setReviews(res.data);
                        console.log(`Review length: ${reviews.length}`)

                        reviews.forEach(review => {
                            console.log(`Review user name: ${review.userName}`);
                            console.log(`Review user picture: ${review.userPicture}`);
                            console.log(`Review: ${review.text}`);
                            console.log('-------------------')
                        });

                    })
                    .catch((err) => window.alert(err.response.data.error));



            })
            .catch((err) => window.alert(err.response.data.error));

    }, []);

    const handleIncrement = () => {
        setQuantity(quantity + 1);
        if (quantity >= 8) {
            setQuantity(8);
        }
    };

    const handleDecrement = () => {

        setQuantity(quantity - 1);

        if (quantity <= 0) {
            setQuantity(0);
        }
    };

    const play = () => new Audio(sound).play();

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (quantity === 0) return window.alert('Please, select quantity first');

        const purchaseProudct = {
            "name": product.name,
            "quantity": quantity,
            "price": product.price,
        }

        console.log(`Selected purchase product name is : ${purchaseProudct.name}`);
        console.log(`Selected purchase product quantity is : ${purchaseProudct.quantity}`);
        console.log(`Selected purchase product price is : ${purchaseProudct.price}`);

        // add in the purchaseContext
        purchase.setPurchase([...purchase.purchase, purchaseProudct]);

        console.log(`Length of purchaseContext is : ${purchase.purchase.length}`)


        // print the data that storeing in the purchaseContext
        // console.log(`Purchase product name is : ${purchase[0].name}`);

        play();
        setSnack({ type: 'success', message: 'Product added to cart successfully!' });
        setOpen(true);

        // reset the quantity
        setQuantity(0);
        return;


    };

    const handleReview = (e) => {
        e.preventDefault();

        if (isUserLogin) {
            if (feedback === '') {
                play();
                setSnack({ type: 'error', message: 'Please, write a review!' });
                setOpen(true);
                return;
            }

            const sanitizedReviewInput = feedback;
            const addedReview = {
                text: sanitizedReviewInput,
            }

            // add review to the servier
            productServices.addReview(productId, addedReview)
                .then(res => {

                    console.log(`Added review response from the server : ${res.data}`)
                    // also add the review in the reviews state

                    const newReview = {
                        _id: res.data._id,
                        text: res.data.text,
                        userId: res.data.userId,
                        userName: res.data.userName,
                        userPicture: res.data.userPicture,
                    };
                    setReviews([...reviews, newReview])

                    play();
                    setSnack({ type: 'success', message: 'Review added successfully!' });
                    setOpen(true);
                    setFeedback('');
                })
                .catch(err => {
                    play();
                    setSnack({ type: 'error', message: `${err.response.data.error} It does not support HTML tags.` });
                    setOpen(true);

                })



        }
        else {
            play();
            setSnack({ type: 'error', message: 'Please, login to write a review!' });
            setOpen(true);
        }
    };

    const handleEdit = () => {
        // console.log(`Review id for editing is : ${edit.reviewId}`);

        // console.log(`Update text is : ${edit.text}`);

        const editedReview = {
            text: edit.text,
        };

        // update review
        productServices.updateReview(productId, edit.reviewId, editedReview)
            .then(res => {
                // console.log(res.data);
                play();
                setSnack({ type: 'success', message: 'Review updated successfully!' });
                setOpen(true);

                // also update the review state

                const updatedReview = reviews.map(review => {
                    if (review._id == edit.reviewId) {
                        return {
                            ...review,
                            text: edit.text,
                        }
                    }
                    return review;
                });

                setReviews(updatedReview);

                // reset the edit state
                setEdit({ isEdit: false, reviewId: '', text: '' });
                setFeedback('');
            })
            .catch((err) => {
                play();
                setSnack({ type: 'error', message: err.response.data.error });
                setOpen(true);
            });

    };

    const handleDelete = (reviewId) => {
        console.log(`Review id for deleting is : ${reviewId}`);
        const confirmation = window.confirm('Are you sure to delete this review?');

        if (confirmation) {
            productServices.deleteReview(productId, reviewId)
                .then(res => {
                    play();
                    setSnack({ type: 'success', message: 'Review deleted successfully!' });
                    setOpen(true);

                    // also delete the review from the state
                    const updatedReview = reviews.filter(review => review._id !== reviewId);

                    setReviews(updatedReview);
                })
                .catch(err => {
                    play();
                    setSnack({ type: 'error', message: err.response.data.error });
                    setOpen(true);
                })
        }
    };


    const customPropsControlledByAttacker = {
        dangerouslySetInnerHTML: {

            "__html": "<img onerror='alert(\"Hacked\");' alt='invalid-image' src='https://assets-eu-01.kc-usercontent.com/77bbf83a-1306-0152-fea5-3b5eaf937634/1e6fd406-258e-48f5-9a12-0f910c7aacba/GettyImages-1386184656%20%281%29.jpg' />"
        }
    };






    const url = "javascript: alert(1);";

    return (
        <div>

            {
                isUserLogin ? (<>
                    <ResponsiveAppBarHomepage purchaseProductLength={purchase.purchase.length} />
                </>) : (<ResponsiveAppBarLandingPage />)
            }

            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row">
                    <img src={`http://localhost:3005/product/${product.picture}`} className="max-w-sm rounded-lg shadow-2xl" />
                    <div>
                        <h1 className="text-5xl font-bold">{product.name}</h1>
                        <p className="py-6">{product.description}</p>
                        <p className="py-3 text-warning">Category: {product.category}</p>
                        <p className="py-3 text-warning">Price: Rs {product.price}</p>
                        {
                            isUserLogin ? (
                                <>
                                    <button onClick={handleDecrement} className="btn btn-outline glass btn-ghost mr-4">-</button>
                                    Quantity: {quantity}
                                    <button onClick={handleIncrement} className="btn btn-outline glass btn-ghost ml-4">+</button>
                                    <br />
                                    <button className="btn btn-primary btn-wide font-bold mt-8 mb-8" onClick={handleAddToCart}>Add to Cart</button>

                                </>
                            ) : null
                        }

                    </div>
                </div>
            </div>
            <h2 className="text-4xl font-bold m-4">Reviews</h2>

            <div className="reviews-section m-10">
                <div className="send-review-section">
                    <Input
                        type="text"
                        // dangerouslySetInnerHTML={{ __html: edit.isEdit ? edit.text : feedback }}


                        placeholder="Write a review ..."
                        onChange={edit.isEdit ? (e) => setEdit({ ...edit, text: e.target.value }) : (e) => setFeedback(e.target.value)}
                        value={edit.isEdit ? edit.text : feedback}
                        className="input input-bordered text-2xl w-1/2"
                        style={{ color: 'white' }}
                        endAdornment={
                            edit.isEdit ? (
                                <span className="input-icon">
                                    <IconButton onClick={handleEdit} style={{ color: 'white' }}><EditIcon />
                                    </IconButton></span>
                            ) : (
                                <span className="input-icon">
                                    <IconButton onClick={handleReview} style={{ color: 'white' }}><SendIcon />
                                    </IconButton></span>
                            )
                        }
                    />
                </div>

                {/* <div {...customPropsControlledByAttacker} /> */}

                <div dangerouslySetInnerHTML={{ "__html": feedback }} />

                <div className="view-reviews">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review) => {
                            console.log('Review:', review);
                            return (
                                <div key={review._id}>
                                    <div className="chat chat-start mb-4">
                                        <div className="chat-image avatar">
                                            <div className="w-10 rounded-full">
                                                <img src={`http://localhost:3005/profile/${review.userPicture}`} className="max-w-sm rounded-lg shadow-2xl" />

                                            </div>
                                        </div>
                                        <div className="chat-header text-info">{review.userName}</div>
                                        <div className="chat-bubble">{review.text}
                                            {
                                                review.userId === userId && (
                                                    // currentUserReviewId.push(review._id),
                                                    // setDeleteReviewId(review._id),
                                                    <>
                                                        <div className="dropdown dropdown-bottom ml-3">
                                                            <label tabIndex={0} className="btn btn-outline btn-ghost btn-xs m-1">...</label>
                                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                                <li className="text-2xl">
                                                                    <IconButton className="" onClick={() => setEdit({ isEdit: true, reviewId: review._id, text: review.text })} style={{ color: 'white' }}><EditIcon /> Edit
                                                                    </IconButton>
                                                                </li>
                                                                <div className="divider"></div>
                                                                <li>
                                                                    {/* <IconButton className="" onClick={() => setDeleteReview({ isDelete: true, reviewId: review._id })} style={{ color: 'white' }}><DeleteIcon /> Delete */}
                                                                    <IconButton className="" onClick={() => handleDelete(review._id)} style={{ color: 'white' }}><DeleteIcon /> Delete
                                                                    </IconButton>
                                                                </li>
                                                            </ul>
                                                        </div>


                                                    </>
                                                )
                                            }
                                        </div>


                                    </div>
                                </div>

                            );
                        })
                    ) : (
                        <h3 className="text-warning text-2xl m-4">No Reviews</h3>
                    )}
                </div>

            </div>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snack.type} sx={{ width: '100%' }}>
                    {snack.message}
                </Alert>
            </Snackbar>


        </div>
    );
}

export default SingleProduct;




// XSS Vulnerability 
// Payload

{/*

<a href="javascript: alert('You are hacked!!');" >
<center>
    <img alt='-image-here'src='https://miro.medium.com/v2/da:true/resize:fit:1096/1*wOzHXuvB06Oo-bhOtgM3nw.gif' />
</center>
</a> 

*/}