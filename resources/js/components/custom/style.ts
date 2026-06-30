import { StylesConfig } from 'react-select';

export const customSelectStyles: StylesConfig<any, false> = {
    control: (provided, state) => ({
        ...provided,
        minHeight: '40px',
        height: '40px',
        borderRadius: '0.375rem',
        borderColor: state.isFocused
            ? 'hsl(var(--ring))'
            : 'hsl(var(--input))',
        boxShadow: state.isFocused
            ? '0 0 0 2px hsl(var(--ring))'
            : 'none',
        backgroundColor: 'hsl(var(--background))',
        '&:hover': {
            borderColor: 'hsl(var(--ring))',
        },
    }),

    valueContainer: (provided) => ({
        ...provided,
        padding: '0 8px',
        height: '40px',
    }),

    input: (provided) => ({
        ...provided,
        margin: 0,
        padding: 0,
    }),

    placeholder: (provided) => ({
        ...provided,
        color: 'hsl(var(--muted-foreground))',
        fontSize: '0.875rem',
    }),

    singleValue: (provided) => ({
        ...provided,
        fontSize: '0.875rem',
    }),

    menu: (provided) => ({
        ...provided,
        borderRadius: '0.375rem',
        overflow: 'hidden',
        zIndex: 50,
    }),

    menuList: (provided) => ({
        ...provided,
        padding: 0,
    }),

    option: (provided, state) => ({
        ...provided,
        fontSize: '0.875rem',
        backgroundColor: state.isSelected
            ? 'hsl(var(--accent))'
            : state.isFocused
            ? 'hsl(var(--muted))'
            : 'white',
        color: 'black',
        padding: '8px 12px',
    }),

    indicatorSeparator: () => ({
        display: 'none',
    }),
};
