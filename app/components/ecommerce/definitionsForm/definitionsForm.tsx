'use client'
import { useState } from 'react';
import styles from './definitionsForm.module.css'
import Select from 'react-select'
import { salesTypeOptions, correctDeliveryOptions, distanceDelivery, freightByDistance } from '@/app/utils/formsOptions/ecommerce/ecommerce-options';
import { additionalDistances, ecommerceDefinitionsDefaultValues, EcommerceDefinitionsTypes } from '@/app/utils/formsOptions/ecommerce/ecommerce-types';

import makeAnimated from 'react-select/animated';
import { selectStyle } from '../../rightbar/ui/input';
import { FaTrashCan } from 'react-icons/fa6';
import { IoIosAddCircle } from 'react-icons/io';

const animatedComponents = makeAnimated();


export const DefinitionsForm = () => {
    const [definitionValues, setDefinitionValues] = useState<EcommerceDefinitionsTypes>(ecommerceDefinitionsDefaultValues)
    const [charCount, setCharCount] = useState(0);
    const [additionalDistances, setAdditionalDistances] = useState<additionalDistances[]>(definitionValues.additionalDistances)

    const handleInputChange = (event: any) => {
        const inputValue = event.target.value;
        setDefinitionValues({ ...definitionValues, title: inputValue });
        setCharCount(inputValue.length);
    };



    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <div className={`${styles.inputBox} ${styles.fullWidth}`}>
                    <label>Apresentação e Diferencial oferecido ao Correct Club para divulgação aos seus clientes </label>
                    <input

                        placeholder="Entrega gratuita..."
                        name="title"
                        value={definitionValues.title}
                        onChange={handleInputChange}
                        maxLength={80}
                        required
                    />
                    <p>{charCount}/{80} caracteres</p>

                </div>
                <div className={styles.grid1}>
                    <div className={styles.inputBox}>
                        <label htmlFor="">Tipo de venda?</label>
                        <Select
                            placeholder="Selecione uma ou mais opções"
                            options={salesTypeOptions}
                            styles={selectStyle}
                            value={salesTypeOptions.find(option => option.value === definitionValues.salesType)}
                            onChange={(selectedOption) => setDefinitionValues({ ...definitionValues, salesType: selectedOption ? selectedOption.value : "" })}
                        />
                    </div>


                </div>

                <button className={styles.fullWidth} type="submit">Ajustar definições</button>
            </form>

        </div>
    )
}

export default DefinitionsForm
