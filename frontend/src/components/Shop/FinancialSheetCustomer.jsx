import React from "react";
import "./style.css";
const reduceTotal = (acc, row) => {
  // Convert the total property to a number
  const total = Number(row.total.replace("$", ""));

  // Add the total to the accumulator
  return acc + total;
};
const reduceTotalPlatform = (acc, row) => {
  // Convert the total property to a number
  const total = Number(row.platform.replace("$", ""));

  // Add the total to the accumulator
  return acc + total;
};
const reduceTotalSeller = (acc, row) => {
  // Convert the total property to a number
  const total = Number(row.client.replace("$", ""));

  // Add the total to the accumulator
  return acc + total;
};
const Table = ({ rowsByShop }) => {
  const tableRows = Object.entries(rowsByShop).map(([shopName, rows]) => {
    // Reduce the total property of each row
    const total = rows.reduce(reduceTotal, 0);
    const totalClient = rows.reduce(reduceTotalSeller, 0);
    const totalPlatform = rows.reduce(reduceTotalPlatform, 0);

    return (
      <tr key={shopName}>
        <td>{shopName}</td>
        <td>${total}</td>
        <td>${totalClient}</td>
        <td>${totalPlatform}</td>
      </tr>
    );
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Shop Name</th>
          <th>Total</th>
          <th>Total Customer</th>
          <th>Total Platform</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  );
};
const FinancialSheetCustomer = React.forwardRef(({ good }, ref) => {
  const row = [];
  good &&
    good?.forEach((item) => {
      row.push({
        id: item?._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: item?.totalPrice + "$",
        client: (item?.totalPrice * 80) / 100,
        platform: (item.totalPrice * 20) / 100,
        status: item?.cart[0]?.shop?.name,
        idShop: item?.cart[0]?.shop?._id,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });

  const rowsByShop = good.reduce((acc, item) => {
    const shopName = item?.cart[0]?.shop?.name;
    if (!acc[shopName]) {
      acc[shopName] = [];
    }
    acc[shopName].push({
      itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
      total: item?.totalPrice + "$",
      client: (item?.totalPrice * 80) / 100 + "$",
      platform: (item.totalPrice * 20) / 100 + "$",
      status: shopName,
      idShop: item?.cart[0]?.shop?._id,
    });
    return acc;
  }, {});

  console.log("rows are good good", rowsByShop);
  return (
    <div className="wrapper">
      <div className="good-sheet" ref={ref}>
        <div className="header">
          <span className="title">Financial Report By Customer </span>

          <span className="kws">BSHOP online Shop</span>
        </div>

        <div className="table-container mt-10">
          <Table rowsByShop={rowsByShop} />
        </div>
      </div>
    </div>
  );
});

export default FinancialSheetCustomer;
