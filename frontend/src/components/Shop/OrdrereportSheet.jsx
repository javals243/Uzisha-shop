import React from "react";
import "./style.css";

const OrdrereportSheet = React.forwardRef(({ good }, ref) => {
  console.log("Report are ", good);

  return (
    <div className="wrapper">
      <div className="good-sheet" ref={ref}>
        <div className="header">
          <span className="title">invoice</span>

          <span className="kws">BSHOP online Shop</span>
        </div>

        <div className=" mt-10 uppercase">
          Customer name :{" "}
          <span className="text-lg font-bold">{good.user.name}</span>
        </div>

        <div className="table-container mt-10">
          <table>
            <tr>
              <th>Products</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
            {good &&
              good?.cart.map((item, index) => (
                <tr>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{item.discountPrice}</td>
                </tr>
              ))}
          </table>
          <h5 className="pt-3 text-[18px]">
            Transport cost : <strong>US${good?.shipping}</strong>
          </h5>
          <div className="border-t w-full text-right">
            <h5 className="pt-3 text-[18px]">
              Total Price: <strong>US${good?.totalPrice}</strong>
            </h5>
          </div>
          <h5 className="py-10 text-[18px]">
            Note: There is a transport price incorporated depending on the
            location
          </h5>
        </div>
      </div>
    </div>
  );
});

export default OrdrereportSheet;
