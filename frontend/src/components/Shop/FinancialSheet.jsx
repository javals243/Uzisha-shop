import React from "react";
import "./style.css";

const FinancialSheet = React.forwardRef(({ good }, ref) => {
  console.log("Goods is are", good);
  const row = [];
  good &&
    good?.forEach((item) => {
      row.push({
        id: item?._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: item?.totalPrice + " $",
        client: (item?.totalPrice * 80) / 100,
        platform: (item.totalPrice * 20) / 100,
        status: item?.cart[0]?.shop?.name,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });
  console.log("rows are ", row);
  return (
    <div className="wrapper">
      <div className="good-sheet" ref={ref}>
        <div className="header">
          <span className="title">Financial Report </span>

          <span className="kws">BSHOP online Shop</span>
        </div>

        <div className="table-container mt-10">
          <table>
            <tr>
              <th>Order ID</th>
              <th>Shop Name</th>
              <th>Items Qty</th>
              <th>Total</th>
              <th>For Seller</th>
              <th>For Platform</th>
              <th>CreatedAt</th>
            </tr>

            {row.map((row) => (
              <tr>
                <td>{row?.id.substr(0, 5)}</td>
                <td>{row?.status}</td>
                <td>{row?.itemsQty}</td>
                <td>{row?.total}</td>
                <td>{row?.client}</td>
                <td>{row?.platform}</td>
                <td>{row?.createdAt}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
});

export default FinancialSheet;
