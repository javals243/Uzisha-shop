/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";

const AllOrdersReport = () => {
  const { seller } = useSelector((state) => state.seller);

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
  console.log("Orders", orders);
  const data = orders && orders.find((item) => item._id === seller._id);
  return (
    <div>
      <h2>Seller Orders</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="shopId">Shop ID: {seller._id}</label>
        <input
          type="text"
          id="shopId"
          value={shopId}
          onChange={(e) => setShopId(e.target.value)}
        />
        <br />
        <label htmlFor="fromDate">From Date:</label>
        <input
          type="date"
          id="fromDate"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <br />
        <label htmlFor="toDate">To Date:</label>
        <input
          type="date"
          id="toDate"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <br />
        <button type="submit">Search</button>
      </form>
      <>
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
      </>
    </div>
  );
};

export default AllOrdersReport;
