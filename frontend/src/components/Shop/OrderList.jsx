export const OrderList = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          <strong>Order ID:</strong> {order.id}
          <br />
          <strong>Customer:</strong> {order.customer.name}
          <br />
          <strong>Total:</strong> ${order.total}
          <br />
          <strong>Status:</strong> {order.status}
        </li>
      ))}
    </ul>
  );
};
