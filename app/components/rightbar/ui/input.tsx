  
  export const selectStyle = {
    control: (base: any, state: any) => ({
        ...base,
        width: '100%',
        boxShadow: 'none',
        borderRadius: '5px',
        padding: '20px',
        backgroundColor: 'var(--bg)',
        border: '2px solid #2e374a',

    }),
    option: () => ({
        backgroundColor: 'var(--bg)',
        padding: '1rem',
        border: '2px solid #2e374a',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'var(--bgSoft)'
        }
    }),
    singleValue: (provided: any, state: any) => {
        const color = '#fffff'
        return { ...provided, color }
    },
    multiValue: (base: any) => ({
        ...base,
        backgroundColor: '#2e374a',
        borderRadius: '5px',
        color: '#ffffff',
        width:"100%",
        padding: '3px 6px'
    }),
    multiValueLabel: (base: any) => ({
        ...base,
        color: '#ffffff'
    }),
    multiValueRemove: (base: any) => ({
        ...base,
        color: '#ffffff',
        ':hover': {
            backgroundColor: '#ffffff',
            color: '#2e374a'
        }
    }),
}

