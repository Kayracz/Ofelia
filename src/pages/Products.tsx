import { Link, useSearchParams } from "react-router-dom";
import { products } from "../data/products";

function Products() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("categoria");
  const isNew = searchParams.get("new");

  const filteredProducts = products.filter((product) => {
    if (category && product.category !== category) {
      return false;
    }

    if (isNew === "true" && !product.isNew) {
      return false;
    }

    return true;
  });

  return (
    <section>
      <div>
        <h1>PRODUCTOS</h1>

       <nav>
        <Link to="/productos">TODOS</Link>
        <Link to="/productos?new=true">NEW IN</Link>
        <Link to="/productos?categoria=panolletas">
          PAÑOLETAS
        </Link>
        <Link to="/productos?categoria=flecos">
          FLECOS
        </Link>
        <Link to="/productos?categoria=twillys">
          TWILLYS
        </Link>
      </nav>
      </div>

      <div>
        {filteredProducts.map((product) => (
          <article key={product.id}>
            <Link to={`/productos/${product.name.toLowerCase()}`}>
              <div>
                IMAGEN
              </div>

              <h2>{product.name}</h2>

              <p>{product.price} USD</p>

              {product.isNew && <span>NEW</span>}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Products;