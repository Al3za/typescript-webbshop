import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cartProduct } from "@webbshop-app/shared";
import storeItems from "../data/items.json";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000";

export default function BuyedProduct() {
  const [cartProduct, setCartProduct] = useState<cartProduct[]>([]);
  const [adress, setAdress] = useState<string | undefined>("");
  const navigate = useNavigate();

  const GetCartProducts = async (): Promise<cartProduct[]> => {
    const getCartProd = await axios.get<cartProduct[]>("/BuyedItem");

    setAdress(getCartProd.data[0].adress);

    const MatchName = (getApiName: any) => {
      const test = getCartProd.data.filter((item: any) => {
        return item.productName === getApiName;
      });
      return test;
    };

    const ApiData = storeItems.map((itemName) => {
      return MatchName(itemName.name);
    });

    const arr = [];

    for (let i = 0; i < ApiData.length; i++) {
      if (ApiData[i].length > 0) {
        arr.push({
          productName: ApiData[i][0].productName,
          productPrice: ApiData[i][0].productPrice,
          antal: ApiData[i].length,
          adress: ApiData[i][0].adress,
        });
      } else {
        arr.push({ productName: "", productPrice: 0, antal: 0 });
      }
    }

    return arr as unknown as cartProduct[];
  };

  useEffect(() => {
    GetCartProducts().then(setCartProduct);
  }, []);

  let nr = 0;
  let sum = 0;
  return (
    <div>
      <h1>All your products </h1>
      {cartProduct.map((products) => {
        // eslint-disable-next-line no-lone-blocks
        {
          sum += products.antal ? products.antal * products.productPrice : 0;
        }
        if (products.productPrice > 0) {
          return (
            <div key={nr++}>
              <p>
                {products.productName} {""} {products.antal} {""}{" "}
                {products.productPrice}
                {""}
                {""} price per vara ={" "}
                {products.antal && products.antal * products.productPrice} kr
              </p>
            </div>
          );
        }
      })}
      shipping price = 25 kr <p>total price = {sum + 25} kr</p>
      <p>deliver Status = registrerad </p>
      <p>Leveransadress : {adress}</p>
      <p>
        <button onClick={(e) => navigate("/products")}>
          {" "}
          back to products{" "}
        </button>
      </p>
      <button onClick={(e) => navigate("/cart")}> back to cart </button>
    </div>
  );
}
