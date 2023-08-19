import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const ShopUpdatePassword = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);

  const [password, setPassword] = useState("");

  return (
    <div className="w-full  bg-white  rounded-[4px] p-3 ">
      <h5 className="text-[30px] font-Poppins text-center">Update Password</h5>
      {/* create product form */}
      <form>
        <br />
        <div className="flex justify-center items-center flex-col">
          <label className="pb-2 ">
            New Password <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={password}
            className="mt-2 w-[50%] appearance-none block  px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password..."
          />

          <button
            type="submit"
            className="group relative mt-5  h-[40px] flex justify-center py-2 px-20 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
        <div></div>
      </form>
    </div>
  );
};

export default ShopUpdatePassword;
