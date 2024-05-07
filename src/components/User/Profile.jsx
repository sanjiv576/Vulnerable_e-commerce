import React, { useEffect, useState } from 'react'
import { ResponsiveAppBarHomepage } from '../AppBar/ResponsiveAppBarHomepage';
import { usePurchase } from '../../utils/purchaseContext';
import userServices from '../../services/userService';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MailLockIcon from '@mui/icons-material/MailLock';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PasswordIcon from '@mui/icons-material/Password';
import { MySnackbar } from '../MySnackbar';
import sound from '../../assets/sound.wav';
import { useNavigate } from 'react-router-dom';
import { allLetter } from '../../lib/input-validation';

export const Profile = () => {

    const purchase = usePurchase();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [newName, setNewName] = useState('');
    const [file, setFile] = useState(null);
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
        userServices.getUser()
            .then(res => setUser(res.data))
            .catch(err => window.alert(err.response.data.error));
    }, []);


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
            userServices.uploadProfileImage(file)
                .then(res => {

                    // update user picture
                    setUser({ ...user, picture: res.data.filename });

                    play();
                    setSnack({
                        type: 'success',
                        message: 'Profile picture changed successfully',
                    });
                    setOpen(true);

                    setFile(null);

                })
                .catch(err => {
                    play();
                    setSnack({
                        type: 'error',
                        message: 'Failed to upload images. Only support jpg, jpeg, png format.',
                    });
                    setOpen(true);
                });
        }

    }


    const handleChangeName = (e) => {
        e.preventDefault();
        if (!allLetter(newName)) {
            play();
            setSnack({
                type: 'error',
                message: 'Please, enter a valid name',
            });
            setOpen(true);
            return;
        }

        const confirmation = window.confirm('Are you sure you want to change your name?');
        if (confirmation) {

            userServices.changeName({ fullName: newName })
                .then(res => {

                    // update user name in the state
                    setUser({ ...user, fullName: newName });

                    console.log(`Response from server while changing name : ${res.data.fullName}`)

                    play();
                    setSnack({
                        type: 'success',
                        message: 'Name changed successfully',
                    });
                    setOpen(true);

                    // reset the input
                    setNewName('');

                    // close the modal
                    window.name_modal.close();
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

    const handleDeleteAccount = (e) => {
        e.preventDefault();

        const confirmation = window.confirm('Are you sure you want to delete your account?');
        if (confirmation) {
            userServices.deleteAccount()
                .then(res => {
                    play();
                    setSnack({
                        type: 'success',
                        message: 'Account deleted successfully',
                    });
                    setOpen(true);

                    navigate('/login');
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
            <ResponsiveAppBarHomepage purchaseProductLength={purchase.purchase.length} />
            <div className="avatar">
                <div className="w-60 rounded m-10">
                    <img src={`https://localhost:3005/profile/${user.picture}`} />
                </div>
            </div>

            <div className="">
                <form>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        required />

                    <Button variant='contained' onClick={handleUpload} startIcon={<CloudUploadIcon />} className="btn btn-secondary" >Upload Picture Pic</Button>

                </form>

            </div>
            <div className="user-details-section m-4">
                <h3 className='text-2xl font-bold m-2'>Full Name: {user.fullName}</h3>
                <h3 className='text-2xl font-bold m-2'>Email: {user.email}</h3>

            </div>

            <div className="change-info-section m-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">

                <Button variant='contained' onClick={() => document.getElementById('name_modal').showModal()} startIcon={<MailLockIcon />} className="btn mb-4" >Change full name</Button>

                <Button variant='contained' onClick={() => navigate('/changePassword')} startIcon={<PasswordIcon />} className="btn btn-secondary" >Change password</Button>
                <Button variant='contained' onClick={handleDeleteAccount} startIcon={<PersonRemoveIcon />} className="btn btn-secondary" >Delete Account</Button>

            </div>

            <MySnackbar open={open} handleClose={handleClose} type={snack.type} message={snack.message} />
            \
            {/* <button className="btn" onClick={() => document.getElementById('name_modal').showModal()}>open modal</button> */}
            <dialog id="name_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">

                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg m-2" align="left">New full name:</h3>
                    <form action="" onSubmit={handleChangeName}>
                        <input
                            type="text"
                            className="border border-gray-300 p-2 mb-4 rounded-lg w-full"
                            onChange={(e) => setNewName(e.target.value)}
                            value={newName}
                            required />

                        <input type="submit" value="Change name" className='btn btn-primary w-wide' />

                    </form>
                </div>
            </dialog>
        </div>
    )
}
