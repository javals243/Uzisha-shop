import React from "react";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "../../../styles/styles";
import style from "./Carousel.module.css";
import { Carousel } from "react-responsive-carousel";

const Hero = () => {
  return (
    // <div
    //   className={`relative min-h-[70vh] bg-[#D9D8D6] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
    //   // style={{
    //   //   backgroundImage:
    //   //     "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
    //   // }}
    // >
    //   <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
    //     <h1
    //       className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
    //     >
    //       Best Collection for <br /> second-hand clothing.
    //     </h1>
    //     <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
    //       Welcome to our multi-vendor e-commerce platform dedicated to the sale
    //       of second-hand clothing. We are delighted to offer you a unique online
    //       shopping experience, where you can find quality fashion items at
    //       affordable prices.
    //     </p>
    //     <Link to="/products" className="inline-block">
    //       <div className={`${styles.button} mt-5`}>
    //         <span className="text-[#fff] font-[Poppins] text-[18px]">
    //           Shop Now
    //         </span>
    //       </div>
    //     </Link>
    //   </div>
    // </div>
    <div
    // className={`relative min-h-[70vh] bg-[#D9D8D6] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
    >
      <div id="carousel">
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          // emulateTouch
          autoPlay
          useKeyboardArrows
          transitionTime={1000}
          // axis="vertical"
          // selectedItem={1}
          width="100%"
          className={style.img.carousel_slider}
        >
          <div className={style.slide_holder}>
            <img
              className={style.img}
              alt=""
              src={
                "https://media.istockphoto.com/id/1159428209/photo/young-girl-choosing-clothes-in-a-second-hand-market-in-summer-zero-waste-concept.jpg?s=612x612&w=0&k=20&c=CoMKifvMkg_C5acOcjBbGv1Mar-2kj9T7IIIL6HPX0E="
              }
            />
            <div className={style.text_container}>
              <h6>
                By buying on our platform, you're making an ethical choice and
                enjoying yourself at the same time!
              </h6>
            </div>
          </div>
          <div className={style.slide_holder}>
            <img
              className={style.img}
              alt=""
              src={
                "https://www.burnleyexpress.net/webimg/b25lY21zOmM3ZGViZmU5LTY0NzItNGM4ZS05ZTU4LTY1NWQ5OGI4ZGVlMjpkODQwOWM0My05YWEzLTQ3OTUtOGY4Ny01NzhlZmIyNmYzNjQ=.jpg?crop=3:2,smart&width=640&quality=65"
              }
            />
            <div className={style.text_container}>
              <h6>
                Welcome to our multi-seller e-commerce platform platform
                dedicated to the sale of second-hand clothing. We are delighted
                to offer you a unique online shopping experience where you can
                find quality fashion items at affordable prices. at affordable
                prices.
              </h6>
            </div>
          </div>
          <div className={style.slide_holder}>
            <img
              className={style.img}
              alt=""
              src={
                "https://reliked.com/cdn/shop/products/ef016feb-8b49-43d5-96ff-3327c11a5987_L0K9YD_500x@2x.png?v=1685114611"
              }
            />
            <div className={style.text_container}>
              <h6>
                Our platform brings together a variety of professional and
                private sellers with a passion for fashion and a concern for the
                environment. Each item is carefully selected and checked to
                guarantee its quality and authenticity.
              </h6>
            </div>
          </div>
          <div className={style.slide_holder}>
            <img
              className={style.img}
              alt=""
              src={
                "https://www.projectcece.com/static/_versions/blogs/a_second_hand_clothing_store_large.jpg"
              }
            />
            <div className={style.text_container}>
              <h6>
                You'll find a wide range of clothing for women, men and
                children, as well as fashion accessories such as handbags, shoes
                and jewellery.
              </h6>
            </div>
          </div>
          <div className={style.slide_holder}>
            <img
              className={style.img}
              alt=""
              src={
                "https://img2.tradewheel.com/uploads/images/products/8/7/cheap-high-quality-used-clothes-women-summer-dresses-old-clothes-second-hand-skirts1-0042495001627080023.jpg.webp"
              }
            />
            <div className={style.text_container}>
              <h6>
                We're proud to help reduce textile waste and promote a more
                sustainable way of life by giving clothes a second life.
              </h6>
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Hero;
