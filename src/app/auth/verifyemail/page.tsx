'use client';
import { use, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { set } from 'mongoose';

export default function VerifyEmailPage () {
   

//const router = useRouter()


   const[token, setToken] = useState("")
    const[verified, setVerified] = useState(false)
const[error, setError] = useState(false)

const verifyUserEmail = async () => {
    try {
        await axios.post("/api/auth/verifyemail", {token})
setVerified(true);
setError(false);
    } catch (error:any) {
        setError(true)
        console.log( error.response.data);
    }



}

useEffect(() => {
    setError(false);
const urlToken = window.location.search.split("=")[1]
setToken(urlToken ||"")
  //const {query} = router;
  //const urlTokentwo = query.token


},[])
   useEffect(() => {
    setError(false);
if(token.length > 0){
    verifyUserEmail()}
},
 [token] )

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <h1 className='text-4xl'>Verify Email</h1>
            <h2 className='p-2 bg-otange-500 text-black'>Please check your email to verify your account.
                {token ? '${token}' : "No token found"}
            </h2>

            {verified && (<div>
                <h2>verified</h2>
                <a href="/auth/login" className='text-blue-500'>Login</a>
            </div>
         ) }
         {error && (<div>
            <h2 className='text-red-500'>Error in verifying email</h2>
            
            </div>)}    
        </div>
    );
};

