import Image from "next/image";
import React from "react";
import Slider from "react-slick";
import styles from './imageCarousel.module.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Trash2 } from "lucide-react";

interface CustomPagingProps {
  images: string[];
  onRemoveImage: (index: number) => void;
}

const CustomPaging: React.FC<CustomPagingProps> = ({ images, onRemoveImage }) => {
  const settings = {
    customPaging: function (i: number) {
      return (
        <a className={`${styles.dots}`}>
          <Image
            src={images[i]}
            width={50}
            height={50}
            alt={`Thumbnail ${i + 1}`}
          />
        </a>
      );
    },
    dots: true,
    dotsClass: `${styles.dotsClass}`,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    useCss: false,
  };

  return (
    <div>
      <Slider {...settings} className={styles.slider}>
        {images.map((image, index) => (
          <div key={index} className={`${styles.thumbnailBox}`}>
            <Trash2
              className={`${styles.trashIcon}`}
              onClick={() => onRemoveImage(index)}
            />
            <Image
              src={image}
              width={200}
              height={200}
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CustomPaging;
