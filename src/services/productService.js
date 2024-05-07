

import axios from "axios";
const baseUrl = 'http://localhost:3005/products';
const getToken = () => `bearer ${window.localStorage.getItem('token')}`;

const getAllProudcts = () => {
    return axios.get(`${baseUrl}`);
};


const getSingleProductById = (id) => {
    return axios.get(`${baseUrl}/${id}`);
}

const getAllReviews = (id) => {
    return axios.get(`${baseUrl}/reviews/${id}`);

}

const addReview = (productId, review) => {
    return axios.post(`${baseUrl}/reviews/${productId}`, review, {
        headers: {
            Authorization: getToken()
        }
    });
};

const deleteReview = (productId, reviewId) => {
    return axios.delete(`http://localhost:3005/${productId}/${reviewId}`, {
        headers: {
            Authorization: getToken()
        }
    })
};

const updateReview = (productId, reviewId, updatedReview) => {
    return axios.put(`http://localhost:3005/${productId}/${reviewId}`, updatedReview, {
        headers: { Authorization: getToken() }
    })
};

const purchaseProduct = (products) => {
    return axios.post('http://localhost:3005/purchase', products, {
        headers: {
            Authorization: getToken()
        }

    });
};

// add product by admin only
const addProduct = (product) => {
    return axios.post(`http://localhost:3005/admin/product`, product, {
        headers: {
            Authorization: getToken()
        }
    });
};

const editProduct = (productId, updatedProduct) => {
    return axios.put(`http://localhost:3005/admin/product/${productId}`, updatedProduct, {
        headers: { Authorization: getToken() }
    })
};

const deleteProduct = (productId) => {
    return axios.delete(`http://localhost:3005/admin/product/${productId}`, {
        headers: {
            Authorization: getToken()
        }
    })
};

const productServices = {
    getAllProudcts,
    getSingleProductById,
    getAllReviews,
    purchaseProduct,
    addReview,
    updateReview,
    deleteReview,
    addProduct,
    editProduct,
    deleteProduct,
}

export default productServices;