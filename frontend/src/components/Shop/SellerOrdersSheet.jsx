import React from "react";
import "./style.css";

const SellerOrdersSheet = React.forwardRef(({ good }, ref) => {
  console.log("Goods sheet  is are", good);

  console.log("rows are ", good);

  return (
    <div className="wrapper">
      <div className="good-sheet" ref={ref}>
        <div className="header">
          <span className="title">Seller Orders Report</span>

          <span className="kws">BSHOP online Shop</span>
        </div>

        <div className="table-container mt-10">
          <table>
            <tr>
              <th>ID sale</th>
              <th>Customer</th>
              <th>Price to be paid</th>
              <th>Items Qty</th>
              <th>Transport charges</th>
            </tr>

            {good?.map((row) => (
              <tr>
                <td>{row?._id.substr(0, 6)}</td>
                <td>{row?.user.name}</td>
                <td>{row?.totalPrice}</td>
                <td>{row?.cart?.reduce((acc, item) => acc + item.qty, 0)}</td>
                <td>{row?.shipping}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
});

export default SellerOrdersSheet;
