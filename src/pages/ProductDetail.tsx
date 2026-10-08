import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/useCart";

function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const product = products.find(
    (product) => product.name.toLowerCase() === slug
  );

  if (!product) {
    return (
      <section>
        <h1>PRODUCTO NO ENCONTRADO</h1>

        <Link to="/productos">
          VOLVER A PRODUCTOS
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div>
        <div>
          IMAGEN DEL PRODUCTO
        </div>

        <div>
          {product.isNew && <span>NEW</span>}

          <p>{product.category.toUpperCase()}</p>

          <h1>{product.name}</h1>

          <p>{product.price} USD</p>

          <p>{product.description}</p>

          <button onClick={() => addToCart(product)}>
            AGREGAR AL CARRITO
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;