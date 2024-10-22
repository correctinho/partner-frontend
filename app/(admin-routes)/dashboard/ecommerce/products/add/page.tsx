'use client'

import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./addProduct.module.css"
import Image from "next/image";
import { toast } from "react-toastify";
import { selectStyle } from "@/app/components/rightbar/ui/input";
import Select from 'react-select'
import { ProductTypes, productsDefaultValues } from "@/app/utils/formsOptions/ecommerce/ecommerce-types";

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

const AddProductPage = () => {
  const [productValues, setProductValues] = useState<ProductTypes>(productsDefaultValues)
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('')



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

  const handleInputChange = (event: any) => {
    const inputValue = event.target.value;
    setProductValues({ ...productValues, title: inputValue });
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

          <label htmlFor="file-upload" className={styles.fileUpload}>Upload</label>
          <input
            id="file-upload"
            type="file"
            placeholder="Selecione uma imagem"
            accept="image/png, iamge/jpeg"
            onChange={handleImageChange}
          />
        </div>
        <div className={styles.fields}>
          <div className={styles.grid1}>
            <div className={styles.fieldBox}>
              <label htmlFor="title">Nome do produto</label>
              <input type="text" placeholder="Amaciante 2L..." name="title" required />
            </div>
          </div>
          <div className={styles.grid1}>
            <div className={styles.fieldBox}>
              <label htmlFor="product_price">Preço do produto</label>
              <input
                type="number"
                placeholder="R$"
                name="product_price"
                required
                value={productValues.price ?  productValues.price * 100 : ''}
                onChange={(e) => {
                  const inputPrice = e.target.value;
                  const regex = /^[0-9]*([,.][0-9]{0,2})?$/; // Regex para validar números com no máximo duas casas decimais e separador decimal como vírgula ou ponto
                  if (regex.test(inputPrice)) { // Verifica se a entrada é um número válido
                    const formattedPrice = inputPrice.replace(',', '.'); // Substitui vírgulas por pontos para garantir que o parseFloat funcione corretamente
                    setProductValues({ ...productValues, price: parseFloat(formattedPrice) }); // Atualiza o estado
                  }
                }}
              />
            </div>
            <div className={styles.fieldBox}>
              <label htmlFor="promotion_type">É Mega Promoção?</label>
              <Select
                placeholder="Selecione uma ou mais opções"
                options={promotioOption}
                styles={selectStyle}
                value={promotioOption.find(option => option.value === productValues.isMegaPromotion)}
                onChange={(selectedOption) => setProductValues({ ...productValues, isMegaPromotion: selectedOption ? selectedOption.value : false })}

              />
            </div>

            {productValues.isMegaPromotion && (
              <div className={styles.fieldBox}>
                <label htmlFor="mega_promotion_price">Preço da Mega Promoção</label>
                <input
                  type="text"
                  placeholder="R$"
                  name="mega_promotion_price"
                  required
                  onChange={(e) => { setProductValues({ ...productValues, promotionPrice: Number(e.target.value) }) }}
                />
              </div>
            )}
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
