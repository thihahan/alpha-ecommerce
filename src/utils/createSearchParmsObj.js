export const createParmsObj = (searchParams) => {
    let newObj = {}
    searchParams.forEach((value, key) => {
        newObj[key] = value
    })
    return newObj
}