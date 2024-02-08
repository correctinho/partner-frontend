export const classificationOptions = [
    "Microempresa – No máximo 19 colaboradores", 
    "Pequena Empresa – De 20 a 99 funcionários", 
    "Média Empresa – De 100 a no máximo 499 funcionários", 
    "Grande Empresa – A partir de 500 funcionários"
].map(option => ({ value: option, label: option }));


export const stateOptions = [
    { value: '', label: 'Selecione' },
    { value: 'AC', label: 'AC' },
    { value: 'AL', label: 'AL' },
    { value: 'AP', label: 'AP' },
    { value: 'AM', label: 'AM' },
    { value: 'BA', label: 'BA' },
    { value: 'CE', label: 'CE' },
    { value: 'ES', label: 'ES' },
    { value: 'GO', label: 'GO' },
    { value: 'MA', label: 'MA' },
    { value: 'MT', label: 'MT' },
    { value: 'MS', label: 'MS' },
    { value: 'MG', label: 'MG' },
    { value: 'PA', label: 'PA' },
    { value: 'PB', label: 'PB' },
    { value: 'PR', label: 'PR' },
    { value: 'PE', label: 'PE' },
    { value: 'PI', label: 'PI' },
    { value: 'RJ', label: 'RJ' },
    { value: 'RN', label: 'RN' },
    { value: 'RS', label: 'RS' },
    { value: 'RO', label: 'RO' },
    { value: 'RR', label: 'RR' },
    { value: 'SC', label: 'SC' },
    { value: 'SP', label: 'SP' },
    { value: 'SE', label: 'SE' },
    { value: 'TO', label: 'TO' },
    { value: 'DF', label: 'DF' },
];

export const deliveryOptions= [
    "Sim",
    "Não"
].map(option => ({ value: option, label: option }));

export const salesTypeOptions = [
    "Somente Presencial",
    "Somente Delivery / Ecommerce",
    "Ambos"
].map(option => ({ value: option, label: option }));

export const correctDelivery = [
    "Sim, quero que cuide de TODAS as entregas",
    "Não, eu faço TODAS as entregas",
    "Sim, quero que cuide de determinadas entregas"
].map(option => ({ value: option, label: option }));

export const distanceDelivery = [
    "A partir de 1km",
    "A partir de 5km",
    "A partir de 10km",
    "A partir de 15km",
    "A partir de 20km",
    "A partir de 50km",
    "A partir de 100km",
].map(option => ({ value: option, label: option }));