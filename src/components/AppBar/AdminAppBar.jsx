import React, { useEffect, useState } from 'react'
import userServices from '../../services/userService';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../utils/userContext';

export const AdminAppBar = ({ purchaseProductLength }) => {
    // used for navigating to different pages according to user role
    const user = useUser();

    // used for fetching current user data
    const [loginUser, setLoginUser] = useState({});
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useState({
        id: '',
        role: ''
    })
    const [isPasswordNeedToBeChange, setIsPasswordNeedToBeChange] = useState(false);

    useEffect(() => {
        userServices.getUser()
            .then(res => {
                console.log(`Response from server: ${res.data}`)
                setLoginUser(res.data)
                console.log(`User full Name: ${res.data.fullName}`)


            })
            .catch(err => window.alert(err.response.data.error));


    }, []);


    const handleLogout = () => {
        // remove token from local storage
        window.localStorage.removeItem('token');

        // clear user data from state
        setLoginUser({});

        // clear purchase data from context api


        // redirect to home page
        navigate('/');
    };
    return (
        <div>
            <div className="navbar bg-base-100">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl">Hi, {loginUser.fullName}</a>
                </div>
                <div className="flex-none">
                  
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img src={`https://localhost:3005/profile/${loginUser.picture}`} />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">

                       
                            {
                                user.user.role === 'admin' ?
                                    <li><NavLink to={'/addProduct'} >Add Product</NavLink></li> : (<></>)

                            }

                            <li>
                                <NavLink to={'/profile'}>Profile</NavLink>

                            </li>
                      
                            {
                                user.user.role === 'admin' &&
                                     <li><NavLink to={'/viewAllProducts'}>View All Products</NavLink></li>
                            }

                            <li><a onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
