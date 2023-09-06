/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import ReactToPrint from "react-to-print";
import { Button } from "react-bootstrap";
import SellerOrders from "../sellerOrders/SellerOrders";

const AllOrdersReport = () => {
  const { seller } = useSelector((state) => state.seller);

  const componentRef = useRef();

  const pageStyle = `
   @media print {
      @page {
         size: a5 portrait;
      }
   
      .voucher {
         padding: 1rem 0.5rem;
      }
   }
   `;

  const [shopId, setShopId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [orders, setOrders] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${server}/order/get-seller-all-orders/${seller._id}`,
        {
          params: {
            fromDate,
            toDate,
          },
        }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const data = orders && orders.find((item) => item._id === seller._id);
  return (
    <div>
      <h2 className="font-bold text-[30px] m-5 text-center">Seller Orders</h2>
      <form onSubmit={handleSubmit} className="gap-5">
        {/* <input
          type="text"
          id="shopId"
          value={shopId}
          onChange={(e) => setShopId(e.target.value)}
        /> */}

        <label htmlFor="fromDate">From Date:</label>
        <input
          type="date"
          id="fromDate"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="mr-10"
        />

        <label htmlFor="toDate">To Date:</label>
        <input
          type="date"
          id="toDate"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="mr-10"
        />

        <button
          type="submit"
          className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
        >
          Search
        </button>
      </form>
      <div className="m-10">
        <SellerOrders good={orders}>SHOW ORDER DETAILS </SellerOrders>
      </div>

      <div className="wrapper">
        <div className="good-sheet">
          <div className="header">
            <span className="title">ORDER DETAILS</span>

            <span className="kws">BSHOP online Shop</span>
          </div>

          {orders.map((order) => (
            <>
              <div className=" mt-10 uppercase">
                Customer name :
                <span className="text-lg font-bold">{order.user.name}</span>
              </div>

              <div className="table-container mt-10">
                <table>
                  <tr>
                    <th>Products</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                  {order &&
                    order?.cart.map((item, index) => (
                      <tr>
                        <td>{item.name}</td>
                        <td>{item.qty}</td>
                        <td>{item.discountPrice}</td>
                      </tr>
                    ))}
                </table>
                <h5 className="pt-3 text-[18px]">
                  Transport cost : <strong>US${order?.shipping}</strong>
                </h5>
                <div className="border-t w-full text-right">
                  <h5 className="pt-3 text-[18px]">
                    Total Price: <strong>US${order?.totalPrice}</strong>
                  </h5>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllOrdersReport;
