'use client'

import { ChangeEvent, FormEvent, useState } from "react";
import styles from "../../../(admin-routes)/dashboard/ecommerce/products/add/addProduct.module.css"
import Image from "next/image";
import { toast } from "react-toastify";
import { CurrencyInput } from '../../Forms/Inputs/formsInput'
import { selectStyle } from "../../rightbar/ui/input";
import { ProductTypes, productsDefaultValues } from "@/app/utils/formsOptions/ecommerce/ecommerce-types";
import Select from 'react-select'
import { MdCategory } from "react-icons/md";
import { Tooltip } from "@nextui-org/tooltip";
import { CircleHelp } from "lucide-react";

const promotioOption = [
  {
    label: "Sim",
    value: true
  },
  {
    label: "Não",
    value: false
  },
]

type Category = {
  uuid: string,
  name: string,
  description: string
}

type AddProductPageProps = {
  categories: Category[];
};

const AddProductPage = ({ categories }: AddProductPageProps) => {
  const [productValues, setProductValues] = useState<ProductTypes>(productsDefaultValues);
  const [productPrice, setProductPrice] = useState('');
  const [productDiscountValue, setProductDiscountValue] = useState<number | null>(null);
  const [productPromotionalPrice, setProductPromotionalPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const categoryOptions = categories.map(category => ({
    label: category.name,
    value: category.uuid
  }));

  //console.log({ productPromotionalPrice })
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {

      return
    }

    const image = e.target.files[0]

    if (!image) {
      return
    }

    if (image.size > 3 * 1024 * 1024) {
      toast.error("Imagem muito grande")
      e.currentTarget.value = '';
    }

    if (image.type === 'image/jpeg' || image.type === 'image/png') {
      setImage(image)
      setImageUrl(URL.createObjectURL(e.target.files[0]))
    } else {
      alert('imagem não bate')
      e.currentTarget.value = ""
    }

  };

  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const discountValue = parseFloat(e.target.value);
    setProductDiscountValue(discountValue);

    if (!productPrice) {
      toast.info("Por favor, defina o preço do produto primeiro");
      return;
    }

    // const price = parseFloat(productPrice.replace(/[^0-9,-]+/g, "").replace(",", "."));
    const price = +productPrice

    if (!isNaN(discountValue) && discountValue >= 25) {
      const discountedPrice = Math.floor(price - (price * (discountValue / 100)));
      setProductPromotionalPrice(discountedPrice.toString());

    } else {
      //toast.info("O desconto mínimo é 25%.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.productBox}>
          {imageUrl ?
            <div className={styles.uploadedImage}>
              <Image src={imageUrl} layout="fill" objectFit="cover" alt="Product image" />
            </div>
            :
            <>
              <div className={styles.notFoundImage}></div>
            </>
          }
          <p>Recomendado: 250x250 px</p>

          <label htmlFor="file-upload" className={styles.fileUpload}>Subir imagem</label>
          <input
            id="file-upload"
            type="file"
            placeholder="Selecione uma imagem"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
        </div>

        <div className={styles.fields}>
          <div className={styles.grid1}>
            <div className={styles.fieldBox}>
              <label htmlFor="title">Categoria </label>
              <Select
                placeholder="Selecione uma categoria"
                options={categoryOptions}
                styles={selectStyle}
                name="category"

              />
              {/* <Select>
                <option value="">Selecione uma categoria</option>
                {categories?.map(category => (

                  <option value={category.uuid} key={category.uuid}>{category.name}</option>

                ))}
              </Select> */}
              {/* <Select
                placeholder="Selecione uma ou mais opções"
                options={promotioOption}
                styles={selectStyle}
                value={promotioOption.find(option => option.value === productValues.isMegaPromotion)}
                onChange={(selectedOption) => setProductValues({ ...productValues, isMegaPromotion: selectedOption ? selectedOption.value : false })}

              /> */}
            </div>
          </div>
          <div className={styles.grid1}>
            <div className={styles.fieldBox}>
              <label htmlFor="title">Nome do produto</label>
              <input type="text" placeholder="Amaciante 2L..." name="title" required />
            </div>
          </div>
          <div className={styles.grid1}>
            <div className={styles.fieldBox}>
              <label htmlFor="product_price">Preço do produto</label>
              <CurrencyInput
                name="value"
                value={productPrice} // Ensure two-way binding
                onValueChange={(value) => setProductPrice(value)}
              />

            </div>
            <div className={styles.fieldBox}>
              <label htmlFor="promotion_type" className={styles.toolTipLabel}>É Mega Promoção?
                <Tooltip content={
                  <div className={styles.tooltipBox}>
                    <div>
                      <p>Selecione SIM se deseja colocar um desconto de pelo menos 25%</p>
                    </div>

                  </div>
                }>
                  <CircleHelp className={styles.hintMark} />
                </Tooltip>
              </label>
              <Select
                placeholder="Selecione uma opção"
                options={promotioOption}
                styles={selectStyle}
                value={promotioOption.find(option => option.value === productValues.isMegaPromotion)}
                onChange={(selectedOption) => setProductValues({ ...productValues, isMegaPromotion: selectedOption ? selectedOption.value : false })}

              />
            </div>

            {productValues.isMegaPromotion && (
              <div className={styles.fieldBox}>
                <label htmlFor="mega_promotion_discount">Desconto da Mega Promoção %</label>
                <input
                  type="number"
                  placeholder="%"
                  min="25"
                  max="100"
                  name="mega_promotion_discount"
                  onChange={handleDiscountChange}
                  onBlur={(e) => {
                    const discountValue = Number(e.target.value);
                    if (discountValue < 25) {
                      e.target.value = "25";
                      toast.info("O desconto mínimo é 25%.");
                    }
                    if (discountValue > 100) {
                      e.target.value = "100"

                    }
                    handleDiscountChange(e)
                  }}
                />
              </div>
            )}
            <div className={styles.fieldBox}>
              <label htmlFor="product_price">Preço do produto com desconto</label>
              <CurrencyInput
                name="promotional_price"
                readOnly
                value={productPromotionalPrice}
                // value={productPrice} // Ensure two-way binding
                // onValueChange={(value) => setProductPrice(value)}
                //onChange={(e) => e.target.value = productPromotionalPrice}
              />

            </div>
          </div>
          <div className={styles.fieldBox}>
            <label htmlFor="stock">Quantidade disponível (Estoque)</label>
            <input type="number" placeholder="Digite um número" name="stock" required />
          </div>
          <div className={styles.fieldBox}>
            <label htmlFor="stock">Descrição do produto</label>
            <textarea name="" id="" cols={30} rows={10} maxLength={200} placeholder="Descreva o seu produto. Quanto mais detalhes, melhor serão as chances de vender mais!"></textarea>
          </div>

          <button type="submit">Criar produto</button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
