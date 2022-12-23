'use client'
import {BsCloudUpload} from 'react-icons/bs';
import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import Skeleton from './components/skeleton';
import Banner from './components/banner';



export default function Main() {

    // Create a ref that we add to the element for which we want to detect outside clicks
    const ref = useRef();

    const [keepImage, setKeepImage] = useState(null);
    const [CreateURL, setCreateURL] = useState(null);
    const [Data,setData] = useState();
    const [isActive, setIsActive] = useState(false);
  
    useOnClickOutside(ref, () => setIsActive(false));

    
    /*const uploadToClient = async (event) => {
        if (event.target.files && event.target.files[0]) {
          const i = event.target.files[0];
          setKeepImage(i)
          setCreateURL(URL.createObjectURL(i));

        }*/

    const uploadToClient = async (event) => {
        const file = event.target.files[0];
        setCreateURL(file);
        const Reader = new FileReader();
        Reader.onload = function (e){
            setKeepImage(e.target.result)
        }
        Reader.readAsDataURL(file)
    
    }

    const HandleBackend = async (e) => {
        e.preventDefault()
        const form = new FormData();
        form.append("image", CreateURL);
        try{
            const responseData = await axios({
                url: "https://api.trace.moe/search",
                method: "POST",
                data: form,
                headers: {
                    'Content-Type': `multipart/form-data`,
                },
            })
            .then((res) => {setData(res?.data)})
            .catch((err) => {console.error(err)});
        }catch(err){
            console.log("error:", err)
        }
    }

    // Hook
    function useOnClickOutside(ref, handler) {
    useEffect(
      () => {
        const listener = (event) => {
          // Do nothing if clicking ref's element or descendent elements
          if (!ref.current || ref.current.contains(event.target)) {
            return ;
          }
          handler(event);
          
          
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        
        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
          
        };
      },
      [ref, handler]
    );
  }



    return (
        <>
            <div className={`${!isActive ? "left-[-490px]" : "left-0"} bg-slate-900 duration-700 fixed top-0 w-[400px] h-screen z-50 overflow-y-auto`}>
                <div className='grid grid-cols-1 place-items-center p-5 gap-5' ref={ref}>
                {Data ? ( Data?.result.map((item,index) => (
                    <div className='bg-black/[.5] w-[300px] h-[470px] rounded-t-lg rounded-b-lg relative' key={index} >
                        <img src={item.image} alt='prueba' className=' w-full h-[250px] absolute top-0  rounded-t-lg' />
                        <div className=' S z-40 translate-y-[250px] text-white text-xl grid grid-cols-1'>
                            <span className=' p-3 break-words overflow-hidden text-base'>Name: {item.filename} </span>
                            <span className='p-3'>Episode: {item.episode} </span>
                            <span className='p-3'>Similarity: {Math.round(item.similarity*100).toFixed(2)}% </span>
                        </div>
                    </div>
                ))) : <Skeleton />}
                </div>
                
            </div>
    
           <Banner />
            <div className='flex flex-col justify-center items-center'>
                <div className="flex flex-col h-screen max-w-2xl items-center justify-center w-full p-10">
                    <img src={keepImage} className=' relative p-10' ></img>
                    <form onSubmit={HandleBackend}>
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-[300px] h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <BsCloudUpload className=' text-7xl text-green-400' />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={uploadToClient} />
                        </label>
                        <div className='grid place-items-center'>
                            <input type="submit" className='translate-y-12 cursor-pointer bg-green-500 p-3 w-28 rounded-md hover:bg-green-500/[.6]' onClick={ () => setIsActive(true)} />
                        </div>
                    </form>
                    
                </div>
            </div>
            
        </>
    )
}