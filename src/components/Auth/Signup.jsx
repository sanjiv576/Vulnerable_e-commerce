import { Chip, Grid, Avatar, IconButton, InputAdornment, OutlinedInput, } from '@mui/material'
import React, { useState } from 'react'
import PasswordIcon from '@mui/icons-material/Password';
import sound from '../../assets/sound.wav';
import { MySnackbar } from '../MySnackbar';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MailLockIcon from '@mui/icons-material/MailLock';
import { useNavigate } from 'react-router-dom';
import { ResponsiveAppBarLandingPage } from '../AppBar/ResponsiveAppBarLandingPage';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { allLetter, isEmail } from '../../lib/input-validation';
import userServices from '../../services/userService';

const Signup = () => {

    const navigate = useNavigate();

    const [snack, setSnack] = useState({
        type: '',
        message: '',
    });
    // for open and close snackbar
    const [open, setOpen] = React.useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState({
        isLengthValid: false,
        isUppercaseValid: false,
        isLowercaseValid: false,
        isSpecialCharValid: false,
        isNumberValid: false,

    });

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');


    // for closing snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const play = () => new Audio(sound).play();

    const handleSignup = (e) => {
        e.preventDefault();

        if (!validatePassword(newPassword).isLengthValid ||
            !validatePassword(newPassword).isLowercaseValid ||
            !validatePassword(newPassword).isUppercaseValid ||
            !validatePassword(newPassword).isNumberValid ||
            !validatePassword(newPassword).isSpecialCharValid) {
            play();
            setSnack({
                type: 'error',
                message: 'Please, follow password guidelines.',
            });
            setOpen(true);
            return;
        }
        else if (!allLetter(fullName)) {
            play();
            setSnack({
                type: 'error',
                message: 'Please, enter valid name.Length must be greater than 5 and less than 25',
            });
            setOpen(true);
            return;
        }

        else if (!isEmail(email)) {
            play();
            setSnack({
                type: 'error',
                message: 'Please, enter valid email.',
            });
            setOpen(true);
            return;
        }

        else if (newPassword !== confirmPassword) {
            play();
            setSnack({
                type: 'error',
                message: 'Password and confirm password must be same',
            });
            setOpen(true);
            return;
        }
        else {


            // new user data
            const newUser = {
                fullName: fullName,
                email: email,
                password: newPassword,
            }

            userServices.register(newUser)
                .then(res => {
                    console.log(res.data);
                    play();
                    setSnack({
                        type: 'success',
                        message: 'Signup successfully.',
                    });
                    setOpen(true);

                    // reset all fields
                    setFullName('');
                    setEmail('');
                    setNewPassword('');
                    setConfirmPassword('');
                    
                    navigate('/login');

                })
                .catch(err => {
                    console.log(err);
                    play();
                    setSnack({
                        type: 'error',
                        message: err.response.data.error,
                    });
                    setOpen(true);

                })
        }

    };

    //  password validation and rules 
    const validatePassword = (password) => {
        const isLengthValid = password.length >= 8 && password.length <=12;
        const isUppercaseValid = /[A-Z]/.test(password);
        const isLowercaseValid = /[a-z]/.test(password);
        const isNumberValid = /\d/.test(password);
        const isSpecialCharValid = /[!@#$%^&*()_+[\]{};':"<>?~]/.test(password);

        return {
            isLengthValid,
            isUppercaseValid,
            isLowercaseValid,
            isNumberValid,
            isSpecialCharValid,
        };
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        const passwordValidations = validatePassword(password);
        setNewPassword(password);
        setIsPasswordValid(passwordValidations);
    };


    return (
        <div>
            <ResponsiveAppBarLandingPage />
            <div className="gb-darkzero  p-4 lg:p-12 w-screen">
                <div className="w-[90] mx-auto" align="center" >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <div className='mx-auto pt-10'>

                                <div style={{
                                    border: '1px solid green',
                                    boxShadow: "0 0 50px rgb(26, 176, 23) ",

                                }}
                                    className="rounded-lg mt-3 text-white bg-indigo-500 p-5 m-auto lg:w-[500px] md:w-[400px] sm:w-[300px]"
                                    align="center"
                                >
                                    <div className="text-3xl font-bold">
                                        Create your account
                                    </div>

                                    <div className="mt-5">

                                        <form action="" onSubmit={handleSignup}>
                                            <div>
                                                <div className="mt-3 mb-2" align="left">
                                                    Full Name:
                                                </div>
                                                <OutlinedInput
                                                    placeholder='Enter full name here...'
                                                    className='input input-bordered input-accent w-full'
                                                    style={{ color: 'white' }}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    startAdornment={<InputAdornment position="start"><PersonIcon style={{ color: 'white' }} /></InputAdornment>}
                                                    type="text"

                                                    variant="outlined"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <div className="mt-3 mb-2" align="left">
                                                    Email:
                                                </div>
                                                <OutlinedInput
                                                    placeholder='Enter email here...'
                                                    className='input input-bordered input-accent w-full'
                                                    style={{ color: 'white' }}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    startAdornment={<InputAdornment position="start"><MailLockIcon style={{ color: 'white' }} /></InputAdornment>}
                                                    type="email"

                                                    variant="outlined"
                                                    required
                                                />
                                            </div>

                                            <div className="">
                                                <div className="mt-3 mb-2" align="left">
                                                    New Password:
                                                </div>
                                                <OutlinedInput
                                                    placeholder='Enter new password here...'
                                                    className='input input-bordered input-accent w-full'
                                                    style={{ color: 'white' }}
                                                    // onChange={(e) => setNewPassword(e.target.value)}
                                                    // onChange={(e) => passwordEntry(e)}
                                                    onChange={handlePasswordChange}
                                                    startAdornment={<InputAdornment position="start"><PasswordIcon style={{ color: 'white' }} /></InputAdornment>}
                                                    type={isNewPasswordVisible ? 'text' : 'password'}
                                                    endAdornment={
                                                        <IconButton onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
                                                            {isNewPasswordVisible ? <VisibilityOffIcon style={{ color: 'white' }} /> :
                                                                <VisibilityIcon style={{ color: 'white' }} />}
                                                        </IconButton>
                                                    }
                                                    variant="outlined"
                                                    required
                                                />
                                            </div>

                                            <div className="">
                                                <div className="mt-3 mb-2" align="left">
                                                    Confirm Password:
                                                </div>
                                                <OutlinedInput 
                                                    placeholder='Enter again password here...'
                                                    className='input input-bordered input-accent w-full'
                                                    style={{ color: 'white' }}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    startAdornment={<InputAdornment position="start"><PasswordIcon style={{ color: 'white' }} /></InputAdornment>}
                                                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                                                    endAdornment={
                                                        <IconButton onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                                            {isConfirmPasswordVisible ? <VisibilityOffIcon style={{ color: 'white' }} /> :
                                                                <VisibilityIcon style={{ color: 'white' }} />}
                                                        </IconButton>
                                                    }
                                                    variant="outlined"
                                                    required
                                                />
                                                <input type="submit" value='Signup' className='m-12 btn-primary btn btn-wide' />
                                            </div>
                                        </form>



                                        <label htmlFor="" className='p-4'>
                                            Already have an account ?
                                        </label>
                                        <Chip
                                            Avatar={<Avatar>L</Avatar>}
                                            color="success"
                                            label="LOGIN YOUR ACCOUNT"
                                            onClick={() => navigate('/login')}

                                        ></Chip>
                                        <MySnackbar open={open} handleClose={handleClose} type={snack.type} message={snack.message} />
                                    </div>
                                </div>

                            </div>


                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div className='mx-auto pt-10'>

                                <div style={{
                                    border: '1px solid green',
                                    boxShadow: "0 0 50px rgb(26, 176, 23) ",

                                }}
                                    className="rounded-lg mt-3 text-white bg-indigo-500 p-5 m-auto lg:w-[500px] md:w-[400px] sm:w-[300px]"
                                    align="center"
                                >
                                    <h3 className='text-2xl font-bold' style={{ textDecoration: 'underline' }}>Password Guidelines</h3>
                                    <div className="password-validation-section m-4" align="left">
                                        <label htmlFor="passwordLength">
                                            {
                                                isPasswordValid.isLengthValid ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />
                                            }
                                            Password must be at least 8 characters.
                                        </label>
                                        <br />

                                        <label htmlFor="containsUpperCase">
                                            {
                                                isPasswordValid.isUppercaseValid ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />
                                            }
                                            Password must contain at least one uppercase letter.
                                        </label>
                                        <br />
                                        <label htmlFor="containsLowerCase">
                                            {
                                                isPasswordValid.isLowercaseValid ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />
                                            }
                                            Password must contain at least one lowercase letter.
                                        </label>
                                        <br />
                                        <label htmlFor="containsNumber">
                                            {
                                                isPasswordValid.isNumberValid ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />
                                            }
                                            Password must contain at least one number.
                                        </label>
                                        <br />
                                        <label htmlFor="containsSpecialCharacter">
                                            {
                                                isPasswordValid.isSpecialCharValid ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />
                                            }
                                            Password must contain at least one special character.
                                        </label>
                                    </div>

                                    <h4 className='text-2xl' align="left">Password Feedback:</h4>

                                    {
                                        validatePassword(newPassword).isLengthValid &&
                                            validatePassword(newPassword).isLowercaseValid &&
                                            validatePassword(newPassword).isUppercaseValid &&
                                            validatePassword(newPassword).isNumberValid &&
                                            validatePassword(newPassword).isSpecialCharValid
                                            ? <h4 className='text-success font-bold'>Good to Signup!</h4> : <h4 className='text-warning font-bold'>Weak password. Follow password guidelines.</h4>
                                    }
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                </div>
            </div>

        </div>
    )
}

export default Signup;