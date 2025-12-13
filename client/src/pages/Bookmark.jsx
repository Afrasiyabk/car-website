import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext';


const Bookmark = () => {

   const {setFooter}  = useAuth();
       useEffect(()=>{
       setFooter(true)
     },[])

  return (
    <div>
      <h1>Bookmark list</h1>
    </div>
  )
}

export default Bookmark
