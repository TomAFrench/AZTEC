const inputAmountType = {
    type: 'integer',
    size: {
        gt: 0,
    },
};

inputAmountType.isRequired = {
    ...inputAmountType,
    required: true,
};

inputAmountType.withSize = size => ({
    ...inputAmountType,
    size,
    isRequired: {
        ...inputAmountType,
        size,
        required: true,
    },
});

export default inputAmountType;
