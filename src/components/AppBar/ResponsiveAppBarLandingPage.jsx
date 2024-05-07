import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import './ResponsiveAppBarLandingPage.css'

export const ResponsiveAppBarLandingPage = () => {

    return (
        <div>
            <div className="navbar bg-base-10">
                <div className="navbar-start">

                    <NavLink to={'/'}>
                        <img className='app-img' src="/images/logo.png" alt="App logo" />
                    </NavLink>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li> <Link to={'/'}>Home</Link> </li>


                        <li> <NavLink to={'/contact'}>Contact</NavLink> </li>
                        <li> <NavLink to={'/about'}>About</NavLink> </li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <NavLink to={'/login'} className="btn btn-outline btn-accent m-2">LOGIN</NavLink>
                    <NavLink to={'/signup'} className="btn btn-outline btn-info m-2">SIGNUP</NavLink>


                </div>
            </div>
        </div>
    )
}
