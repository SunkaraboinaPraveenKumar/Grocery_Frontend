const { default: axios } = require("axios");

const axiosClient= axios.create({
    baseURL:`http://192.168.10.141:1337/api`
})

const getCategory=()=>axiosClient.get("/categories?populate=*");

const getSlider=()=>axiosClient.get('/sliders?populate=*').then(resp=>{
    return resp.data.data
})

const getCategoryList=()=>axiosClient.get("/categories?populate=*").then(resp=>{
    return resp.data.data
})

const getAllProducts=()=>axiosClient.get("/products?populate=*").then(resp=>{
    return resp.data.data
})

const getAllProductsCart = async () => {
    try {
        const response = await axiosClient.get('/products?populate=*');
        return response.data.data; // Assuming the response structure
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
};

const getProductsByCategory=(category)=>axiosClient.get("/products?filters[categories][name][$in]="+category+"&populate=*").then(resp=>{
    return resp.data.data
})

const registerUser=(username,email,password)=>axiosClient.post("/auth/local/register",{
    username:username,
    email:email,
    password:password
});

const signIn=(email,password)=>axiosClient.post("auth/local",{
    identifier:email,
    password:password
});

const addToCart=(data)=>axiosClient.post("/user-carts",data);

const getCartItems=(userid)=>axiosClient.get("/user-carts?filters[userid][$eq]="+userid+'&populate[products][images]=*').then(resp=>{
    return resp?.data?.data
})

const deleteCartItem=(id)=>axiosClient.delete('/user-carts/'+(id-1))



export default {
    getCategory,
    getSlider,
    getCategoryList,
    getAllProducts,
    getProductsByCategory,
    registerUser,
    signIn,
    addToCart,
    getCartItems,
    getAllProductsCart,
    deleteCartItem
}