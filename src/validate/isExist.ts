export const isExistObject = (object: any) => {
    const values = Object.entries(object);
    const errors: {field: string, message: string}[] = []
    values.forEach(([field, value]) => {
        if(value === null || value === undefined || value === '' || value === 0){
            errors.push({
                field,
                message: `${field} is required`
            })
        }
    })
    return errors;
}