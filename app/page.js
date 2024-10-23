import Image from "next/image";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Slider from "./_components/Slider";
import GlobalApi from "./_utils/GlobalApi";
import Footer from "./_components/Footer";

export default  async function Home() {
  const sliderList=await GlobalApi.getSlider();
  const categoryList=await GlobalApi.getCategoryList();
  const productList=await GlobalApi.getAllProducts();
  return (
    <div className="p-5 md:p-10 px-16">
      {/* Sliders */}
      <Slider sliderList={sliderList}/>
      {/* Category List */}
      <CategoryList categoryList={categoryList}/>

      {/* Product List */}
      <ProductList productList={productList}/>


      {/* Banner */}
      <Image src={"/banner.png"} alt="banner" height={300} width={1000} className="w-full h-[400px] object-contain"/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
