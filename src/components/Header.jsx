import React, { useEffect, useState } from 'react'
import { BsBagFill,BsSearch } from "react-icons/bs";
import { MdAdd,MdLogout ,MdOutlineCancel,MdOutlineMyLocation,MdOutlineArrowBack} from "react-icons/md";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {auth, firestore} from '../firebase';
import { useDispatch,useSelector } from 'react-redux';
import {setsignInShow, setUser} from '../reducer';
import { REACT_APP_ADMIN } from '../config';
import { signOut } from 'firebase/auth';
import { setCartShow } from '../reducer';
import { collection, onSnapshot, query} from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';
import {IoLocationSharp} from 'react-icons/io5';
import {RiArrowDropDownLine} from 'react-icons/ri';
import Map from './Map';
const Header = () => {
  const [showLocation,setShowLocation]=useState(false);
  const [showMap,setShowMap]=useState(false);
  const [userLocation,setUserLocation]=useState("");
  const [showPopUp,setShowPopUp]=useState(false);
  const navigate=useNavigate();
  const cartShow=useSelector((state)=>state.cartShow);
  const [totalCartItems,setTotalCartItems]=useState(0);
  const dispatch=useDispatch();
  const [showMenu,setShowMenu] =useState(false);
  const user=useSelector(state=>state.user);
  const login=async()=>{
    if(user) {
       setShowMenu(!showMenu);
       return;
     }else dispatch(setsignInShow(true));
  }
  
  const fetchCartData= ()=>{
    const q = query(collection(firestore, `cart@${user.email}`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
          items.push(doc.data().name);
      });
      setTotalCartItems(items.length);
    });
    return  unsubscribe;
  }

  useEffect(()=>{
      if(user){
         return fetchCartData();
      }else setTotalCartItems(0);
  },[user])

  const logOut=()=>{
    localStorage.removeItem('user');
    signOut(auth);
    dispatch(setUser(null));
    navigate("/");
  }
  
  
  const saveLocation=(location)=>{

      localStorage.setItem('location',location);
      setShowLocation(false);
       setShowMap(false);
       setShowPopUp(false);
  }
 
  useEffect(()=>{
    const location=localStorage.getItem('location');
    if(!location) setShowPopUp(true);
    else setUserLocation(location);
  },[showMap])

  return (
    <>
    {showLocation&&<div className='fixed bg-gray-900/20 w-screen h-screen z-50 flex justify-center items-center'>
             <motion.div 
             initial={{scale:0}}
             animate={{scale:1}}
             transition={{duration:0.3}}
             className='w-full h-full md:w-[40%] md:h-[95%] bg-white rounded-xl flex flex-col '>
                <div className='flex justify-between w-full px-4 pt-4 pb-2'>
                 <div className='flex items-center gap-2 '>
                 <MdOutlineArrowBack className='text-2xl cursor-pointer' onClick={()=>setShowMap(false)}/>
                  <p className='text-xl font-bold'>Add Your Location</p>
                 </div>
                  <MdOutlineCancel onClick={()=>{setShowLocation(false); setShowMap(false)}}
                  className='text-2xl cursor-pointer'/>
                </div>
                {!showMap&&<><div className='flex mt-4 focus-within:border-green-500 
                border-gray-600 border-[1px] items-center px-2 p-1 rounded-lg mx-4 '>
                  <BsSearch className='text-xl'/>
                  <input type='text' 
                   placeholder='Search for area , location name '
                  className='outline-none border-none p-2 text-sm flex-1'/>
                </div>
                <div onClick={()=>setShowMap(true)} className='flex items-center gap-2 mt-4 ml-4 cursor-pointer'>
                 <MdOutlineMyLocation className='text-green-500 text-xl'/>
                 <p className='text-[17px] md:text-[15px] font-bold' >Use current location</p>
                </div></>}
                {showMap&&<div className='mt-4 w-full h-full md:px-2'>
                  <Map saveLocation={saveLocation}/>
                </div>}
                {!showMap&&<div className='flex  flex-1 '>
                  <img src='/images/locaton.svg' className='h-full md:h-[440px]'/>
                  </div>}
             </motion.div>
    </div>}
    <div className='fixed z-40 w-screen scrollbar-hide p-3 px-4  md:px-16 md:p-4 bg-primary drop-shadow-lg'>
      {/* desktop /tablet*/}
      <div className='w-full h-full hidden md:flex items-center justify-between'>
        <div className='flex gap-8 items-center'>
          <Link to={"/"} className='flex items-center gap-2'>
           <img src='/images/logo.png' alt='hero' className='w-8'/>
           <p className='text-headingColor text-xl font-bold'>Fruity</p>
        </Link>
        <div className=' relative'>
          <div className='ml-8 flex items-center cursor-pointer' onClick={()=>setShowLocation(true)}>
          <IoLocationSharp className='text-green-600 text-2xl'/>
           <p className='ml-1 text-[15px] font-bold truncate max-w-[150px]'>{userLocation?userLocation:"Set Location"}</p>
           <RiArrowDropDownLine className='text-4xl text-green-500'/>
          </div>
           {!showLocation&&showPopUp&&<motion.div 
           initial={{opacity:0}}
           animate={{opacity:1}}
           transition={{duration:2}}
           className='absolute left-0 top-10 flex flex-col 
           w-[220px] bg-gray-500 text-white p-2 shadow-lg gap-1'>
            <div className='w-4 h-4 bg-gray-500 -mt-4 rotate-45 self-center'></div>
            <p className='text-md font-bold'>Set your delivery location</p>
            <p className='text-sm'>This helps us deliver your order from the nearest store</p>
            <p onClick={()=>setShowLocation(true)}
            className='text-green-500/100 self-end cursor-pointer font-bold'>Set Location</p>
           </motion.div>}
        </div>
        </div>
        <div className='flex items-center gap-8'>
          <motion.ul
          initial={{opacity:0,x:200}} 
          animate={{opacity:1,x:0}} 
          exit={{opacity:0,x:200}} 
          className='flex items-center ml-auto gap-8'>
            <li className='cursor-pointer text-textColor hover:text-purple-700 duration-100 transition-all ease-in-out text-base'>Home</li>
            <li className='cursor-pointer text-textColor hover:text-purple-700 duration-100 transition-all ease-in-out text-base'>Menu</li>
            <li className='cursor-pointer text-textColor hover:text-purple-700 duration-100 transition-all ease-in-out text-base'>Services</li>
          <li className='cursor-pointer text-textColor hover:text-purple-700 duration-100 transition-all ease-in-out text-base'>About Us</li>
          </motion.ul>
          <div onClick={()=>{
            if(user){
              dispatch(setCartShow(!cartShow))
            }else dispatch(setsignInShow(true));
          }} 
          className='relative flex justify-center items-center cursor-pointer'>
            <BsBagFill className='text-xl text-textColor'/>
          {user&&<p className='w-5 h-5 rounded-full bg-cartNumBg text-white text-xs flex justify-center items-center
            absolute -top-4 -right-3 '>{totalCartItems}</p>}
         </div>

         <div className='relative'>
         <motion.img whileTap={{scale:0.6}} src={user?user.photoURL:'/images/avatar1.png'} alt='avatar' className='w-9 cursor-pointer 
         drop-shadow-sm shadow-md shadow-gray-400 rounded-full object-contain' onClick={login}/>
         {showMenu&&<motion.div  
         initial={{opacity:0,scale:0.2}}
         animate={{opacity:1,scale:1}}
         exit={{opacity:0,scale:0.6}}
         onClick={()=>setShowMenu(false)}
         className='absolute bg-gray-100 border-2 
         shadow-xl space-y-2 text-sm w-40 rounded-lg px-4 py-2 top-10 right-0'>
          { REACT_APP_ADMIN===user?.email&& <Link to={'/create'} className='cursor-pointer flex p-2 hover:text-purple-700
            duration-100 transition-all ease-in-out '> Add Item <MdAdd className='ml-auto text-textColor text-xl'/></Link>}
           <p onClick={logOut} className='cursor-pointer flex p-2 hover:text-purple-700 duration-100 
            transition-all ease-in-out'>LogOut <MdLogout className='ml-auto bg-white text-textColor text-xl'/></p>
         </motion.div>}
         </div>
        </div>
      </div>
      {/*  Mobile view */}
      
      <div className='w-full h-full flex md:hidden items-center justify-between '>

       <div onClick={()=>{
        if(user){
          dispatch(setCartShow(!cartShow))
        }else dispatch(setsignInShow(true));
       }} 
       className='relative flex justify-center items-center cursor-pointer'>
            <BsBagFill className='text-xl text-textColor'/>
            {user&&<p className='w-5 h-5 rounded-full bg-cartNumBg text-white text-xs flex justify-center items-center
            absolute -top-4 -right-3 '>{totalCartItems}</p>}
         </div>

        <Link to={"/"} className='flex items-center gap-2'>
           <img src='/images/logo.png' alt='hero' className='w-8'/>
           <p className='text-headingColor text-xl font-bold'>Fruity</p>
        </Link>
        
        <div className='relative flex items-center'>
        <IoLocationSharp className='text-green-600 text-2xl absolute -left-14 '  onClick={()=>setShowLocation(true)}/>
        {!showLocation&&showPopUp&&<motion.div 
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration:2}}
        className='absolute -left-[135px] top-10 flex flex-col 
           w-[180px] bg-gray-500 text-white p-2 shadow-lg gap-1'>
            <div className='w-4 h-4 bg-gray-500 -mt-4 rotate-45 self-center'></div>
            <p className='text-xs font-bold'>Set your delivery location</p>
            <p className='text-xs'>This helps us deliver your order from the nearest store</p>
            <p onClick={()=>setShowLocation(true)}
            className='text-green-500/100 self-end cursor-pointer font-bold text-xs'>Set Location</p>
           </motion.div>}
         <motion.img whileTap={{scale:0.6}} src={user?user.photoURL:'/images/avatar1.png'} alt='avatar' className='w-8 cursor-pointer 
         drop-shadow-sm shadow-md shadow-gray-400 rounded-full' onClick={login}/>
         {showMenu&&<motion.div 
         initial={{opacity:0,scale:0.2}}
         animate={{opacity:1,scale:1}}
         exit={{opacity:0,scale:0.6}}
         onClick={()=>setShowMenu(false)}
         className='absolute bg-gray-100  shadow-gray-400 
         shadow-lg space-y-2 text-sm w-40 rounded-lg border-2 border-gray-200  top-10 right-0'>
          { REACT_APP_ADMIN===user?.email&& <Link to={'/create'} className='cursor-pointer flex p-2 pb-0 hover:text-purple-700
            duration-100 transition-all ease-in-out '> Add Item <MdAdd className='ml-auto text-textColor text-xl'/></Link>}
          <ul
          className='flex flex-col '>
            <li className='cursor-pointer p-2 text-textColor hover:text-purple-700 duration-100 transition-all ease-in-out text-base'>Home</li>
            <li className='cursor-pointer p-2  text-textColor hover:text-purple-700 duration-100 transition-all ease-in-out text-base'>Menu</li>
            <li className='cursor-pointer p-2 text-textColor hover:text-purple-700 duration-100 transition-all ease-in-out text-base'>Services</li>
            <li className='cursor-pointer p-2 text-textColor hover:text-purple-700 duration-100 transition-all ease-in-out text-base'>About Us</li>
          </ul>

           <p onClick={logOut}
           className='cursor-pointer flex  bg-slate-200 gap-4 hover:bg-slate-300 md:bg-white justify-center md:justify-start shadow-lg  p-2  hover:text-purple-700 duration-100 
            transition-all ease-in-out rounded-md'>LogOut <MdLogout className='bg-white  text-textColor text-xl'/></p>
         </motion.div>}
         </div>
      </div>
    </div>
    </>
  )
}

export default Header