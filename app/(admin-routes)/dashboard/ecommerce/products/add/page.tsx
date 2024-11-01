import AddProductPage from "@/app/components/Ecommerce/AddProductsForm/addProductsForm";
import { fetchCategories } from "@/app/lib/actions";

export default async function AddProduct() {
  const categories = await fetchCategories()
  return (
    <>
      <AddProductPage categories={categories!.data}/>
      </>
      )
}
