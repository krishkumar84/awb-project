import React, { useEffect, useState } from 'react';
import axios from 'axios';
import newRequest from "../utils/newRequest";
import Navbar from '../components/Navbar';
import { Link, useNavigate } from "react-router-dom";
function Admin() {
 // const navigate = useNavigate(); 
    const currentuser = JSON.parse(localStorage.getItem("currentUser"));
  //  useEffect(() => {    
  //   if(!currentuser) navigate("/login");
  //   if(currentuser?.isAdmin) {navigate("/admin");}else{navigate("/");}
  //   } , [currentuser, navigate]);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      console.log("File selected:", file);
      const formData = new FormData();
      formData.append('file', file);
      console.log("FormData:", formData);

      try {
        await axios.post('http://localhost:3000/admin/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('File uploaded successfully!');
      } catch (error) {
        console.error(error);
      }

    } catch (error) {
      console.log(error)
      console.error(error);
      alert('Error uploading file. Please try again.');
    }
  };
    return (
        <div className="relative w-full">
            <Navbar />
          <div className="relative isolate z-0 bg-white px-6 pt-14 lg:px-8">
            <div className="relative mx-auto max-w-2xl py-24">
              <div className="absolute inset-x-0 -top-[4rem] -z-10 transform-gpu overflow-hidden blur-3xl md:-top-[10rem]">
                <svg
                  className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
                  viewBox="0 0 1155 678"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
                    fillOpacity=".3"
                    d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
                  />
                  <defs>
                    <linearGradient
                      id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                      x1="1155.49"
                      x2="-78.208"
                      y1=".177"
                      y2="474.645"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#9089FC" />
                      <stop offset={1} stopColor="#FF80B5" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Admin upload csv files
                </h1>
                {/* <p className="mt-6 text-lg leading-8 text-gray-600">
                  Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat
                  commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.
                </p> */}
                <div className="mt-10 flex items-center justify-center gap-x-2">
                <input className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black" type="file" onChange={handleFileChange} />
                  {/* <button
                    type="button"
                    className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    View Docs
                  </button> */}
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
}

export default Admin
