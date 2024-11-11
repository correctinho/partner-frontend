'use client'

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "../../../(admin-routes)/dashboard/ecommerce/products/add/addProduct.module.css";
import { toast } from "react-toastify";
import { CurrencyInput } from '../../Forms/Inputs/formsInput';
import { selectStyle } from "../../rightbar/ui/input";
import Select from 'react-select';
import { Tooltip } from "@nextui-org/tooltip";
import { CircleHelp, CirclePlus } from "lucide-react";
import CustomPaging from "../imageCarousel/imageCarousel";

const promotioOption = [
  { label: "Sim", value: true },
  { label: "Não", value: false }
];

type Category = {
  uuid: string,
  name: string,
  description: string
};

type AddProductPageProps = {
  categories: Category[];
};



const AddProductPage = ({ categories }: AddProductPageProps) => {
  const categoryOptions = categories.map(category => ({
    label: category.name,
    value: category.uuid
  }));

  const [selectedCategory, setSelectedCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [isMegaPromotion, setIsMegaPromotion] = useState(false);
  const [productDiscountValue, setProductDiscountValue] = useState<number | null>(null);
  const [productPromotionalPrice, setProductPromotionalPrice] = useState('');
  const [stock, setStock] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');

  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [eanImageUrls, setEanImageUrls] = useState<string | null>(null);
  const [eanCode, setEanCode] = useState('');
  const [combinedImagesUrls, setCombinedImagesUrls] = useState<string[]>([])
  const [uploadImage, setUploadImage] = useState<boolean>(true)


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Imagem muito grande");
        return
      } else if (file?.type === 'image/jpeg' || file?.type === 'image/png') {
        const newUrl = URL.createObjectURL(file);
        //setImageUploads(prev => [...prev, file]);
        setUploadedImageUrls(prev => {
          const filteredImages = prev.filter(url => url !== newUrl); // Remove duplicatas
          return [...filteredImages, newUrl];
        });
      } else {

        toast.error('Formato de imagem não suportado');
      }
    }
  };

  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const discountValue = parseFloat(e.target.value);
    setProductDiscountValue(discountValue);

    if (!productPrice) {
      toast.info("Por favor, defina o preço do produto primeiro");
      e.target.value = ''
      return;
    }

    const price = +productPrice;

    if (isMegaPromotion) {
      if (!isNaN(discountValue) && discountValue >= 25) {
        const discountedPrice = Math.floor(price - (price * (discountValue / 100)));
        setProductPromotionalPrice(discountedPrice.toString());
      }
    } else {
      if (!isNaN(discountValue) && discountValue < 25) {
        const discountedPrice = Math.floor(price - (price * (discountValue / 100)));
        setProductPromotionalPrice(discountedPrice.toString());
      }
    }
  };

  const handleFetchProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!eanCode) {
      toast.warning("Digite o código EAN, por favor");
      return;
    }
    try {
      const response = await fetch(`https://n8n.correct.com.br/webhook/b4abeb3f-bccd-4ebc-b0aa-97352896caae/${eanCode}`);

      if (!response.ok) {
        toast.error("Erro ao buscar produto");
        return;
      }

      const data = await response.json();
      if (data.length === 0) {
        toast.warn("Produto não encontrado");
        return;
      }
      const product = data[0];
      setBrand(product.brand);
      setProductTitle(product.name);

      if (product.image_url) {
        setEanImageUrls(product.image_url)
        // setEanImageUrls(prev => {
        //   const uniqueImages = new Set([product.image_url, ...prev]);
        //   return Array.from(uniqueImages);
        // });
      }

      setHeight(product.height);
      setWidth(product.width);
      setWeight(product.gross_weight);
    } catch (error) {
      console.error('Ocorreu um erro:', error);
    }
  };


  useEffect(() => {
    let combineImages: string[] = []
    if (eanImageUrls) {
      combineImages = [eanImageUrls, ...uploadedImageUrls];
    } else {
      combineImages = [...uploadedImageUrls]
    }
    setCombinedImagesUrls(combineImages)

  }, [eanImageUrls, uploadedImageUrls])

  useEffect(() => {
    if (combinedImagesUrls.length >= 4) {
      setUploadImage(false)
    } else {
      setUploadImage(true)
    }
  }, [combinedImagesUrls])
  const handleRemoveImage = (indexToRemove: number) => {

    setCombinedImagesUrls(prevImages => {
      const removedImage = prevImages[indexToRemove]

      const updatedImages = prevImages.filter((_, index) => index !== indexToRemove);

      if (uploadedImageUrls.includes(removedImage)) {
        setUploadedImageUrls(prevUploadedImages =>
          prevUploadedImages.filter(image => image !== removedImage)
        );
      }
      if (eanImageUrls === removedImage) setEanImageUrls(null)



      return updatedImages
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (combinedImagesUrls.length === 0) {
      toast.warn("Adicione pelo menos uma imagem do seu produto.")
      return
    }
    if (!selectedCategory || !brand || !productTitle || !productPrice || !productDiscountValue || !stock || !description) {
      toast.warning("Preencha todos os campos obrigatórios *")
      return
    }

    //cal api
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleFetchProduct} className={styles.fetchProductForm}>
        <div className={styles.eanCode}>
          <label htmlFor="title">Código EAN (Opcional)</label>
          <input type="text" placeholder="Digite o código EAN do produto" value={eanCode} onChange={(e) => setEanCode(e.target.value)} required />
        </div>
        <button type="submit">Buscar</button>
      </form>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.productBox}>
          {combinedImagesUrls.length > 0 ?
            <CustomPaging images={combinedImagesUrls} onRemoveImage={handleRemoveImage} />
            :
            <div className={styles.notFoundImage}></div>
          }
          <p>Recomendado: 250x250 px</p>
          {uploadImage ?
            <div className={styles.imageUploadContainer}>
              <label htmlFor="file-upload">Adicionar imagem <CirclePlus className={styles.addImageIcon} /></label>
              <input
                id="file-upload"
                type="file"
                placeholder="Selecione uma imagem"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            :
            <span>Limite de imagens alcançado</span>

          }
        </div>

        <div className={styles.fields}>
          <div className={styles.grid1}>
            <div className={styles.fieldBox}>
              <label htmlFor="title">Categoria <span style={{ color: 'red' }}>*</span></label>
              <Select
                placeholder="Selecione uma categoria"
                options={categoryOptions}
                styles={selectStyle}
                name="category"
                onChange={e => setSelectedCategory(e?.value ? e.value : '')}
              />
            </div>
          </div>
          <div className={styles.grid1}>
            <div className={styles.fieldBox}>
              <label htmlFor="title">Marca <span style={{ color: 'red' }}>*</span></label>
              <input type="text" placeholder="Marca do produto" name="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
          </div>
          <div className={styles.grid1}>
            <div className={styles.fieldBox}>
              <label htmlFor="title">Nome do produto <span style={{ color: 'red' }}>*</span></label>
              <input type="text" placeholder="Amaciante 2L..." name="title" value={productTitle} onChange={(e) => setProductTitle(e.target.value)} />
            </div>
          </div>
          <div className={styles.grid1}>
            <div className={styles.fieldBox}>
              <label htmlFor="product_price">Preço do produto <span style={{ color: 'red' }}>*</span></label>
              <CurrencyInput
                name="value"
                value={productPrice}
                onValueChange={(value) => {
                  setProductPrice(value)
                }
                }
              />
            </div>
            <div className={styles.fieldBox}>
              <label htmlFor="promotion_type" className={styles.toolTipLabel}>É Mega Promoção? <span style={{ color: 'red' }}>*</span>
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
                value={promotioOption.find(option => option.value === isMegaPromotion)}
                onChange={(selectedOption) => setIsMegaPromotion(selectedOption ? selectedOption.value : false)}
              />
            </div>

            {isMegaPromotion ? (
              <div className={styles.fieldBox}>
                <label htmlFor="mega_promotion_discount">Desconto da Mega Promoção % <span style={{ color: 'red' }}>*</span></label>
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
                      e.target.value = "100";
                    }
                    handleDiscountChange(e);
                  }}
                />
              </div>
            ) : (
              <div className={styles.fieldBox}>
                <label htmlFor="mega_promotion_discount">Desconto da Promoção % <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="number"
                  placeholder="%"
                  min="0"
                  max="25"
                  name="promotion_discount"
                  onChange={handleDiscountChange}
                  onBlur={(e) => {
                    const discountValue = Number(e.target.value);
                    if (discountValue >= 25) {
                      e.target.value = "24";
                      toast.info("Desconto não pode ser maior ou igual a 25%");
                    }
                    if (discountValue < 0) {
                      e.target.value = "";
                    }
                    handleDiscountChange(e);
                  }}
                />
              </div>
            )}
            <div className={styles.fieldBox}>
              <label htmlFor="product_price">Preço do produto com desconto <span style={{ color: 'red' }}>*</span></label>
              <CurrencyInput
                name="promotional_price"
                readOnly
                value={productPromotionalPrice}
              />
            </div>
          </div>
          <div className={styles.fieldBox}>
            <label htmlFor="stock">Quantidade disponível (Estoque) <span style={{ color: 'red' }}>*</span></label>
            <input type="number" placeholder="Digite um número" name="stock" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
          </div>
          <div className={styles.fieldBox}>
            <label htmlFor="weight">Peso (Opcional) </label>
            <div className={styles.measureSelectBox}>
              <input type="number" placeholder="Digite um número" name="weight" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
              <Select
                placeholder="Selecione uma unidade de medida"
                options={[
                  { label: "g", value: 'g' },
                  { label: "kg", value: 'kg' }
                ]}
                styles={selectStyle}
                name="measuring_type"
                defaultValue={{ label: "g", value: 'g' }}
              />
            </div>
          </div>
          <div className={styles.fieldBox}>
            <label htmlFor="height">Altura (Opcional)</label>
            <div className={styles.measureSelectBox}>
              <input type="number" placeholder="Digite um número" name="height" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
              <Select
                placeholder="Selecione uma unidade de medida"
                options={[
                  { label: "cm", value: 'cm' },
                  { label: "m", value: 'm' }
                ]}
                styles={selectStyle}
                name="measuring_type"
                defaultValue={{ label: "cm", value: 'cm' }}
              />
            </div>
          </div>
          <div className={styles.fieldBox}>
            <label htmlFor="width">Comprimento (Opcional)</label>
            <div className={styles.measureSelectBox}>
              <input type="number" placeholder="Digite um número" name="width" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
              <Select
                placeholder="Selecione uma unidade de medida"
                options={[
                  { label: "cm", value: 'cm' },
                  { label: "m", value: 'm' }
                ]}
                styles={selectStyle}
                name="measuring_type"
                defaultValue={{ label: "cm", value: 'cm' }}
              />
            </div>
          </div>
          <div className={styles.fieldBox}>
            <label htmlFor="stock">Descrição do produto <span style={{ color: 'red' }}>*</span></label>
            <textarea name="description" id="description" value={description} cols={30} rows={10} maxLength={200} placeholder="Descreva o seu produto. Quanto mais detalhes, melhor serão as chances de vender mais!" onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>

          <button type="submit">Criar produto</button>
          <p><span style={{ color: 'red' }}>*</span>:  Campos obrigatórios</p>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
