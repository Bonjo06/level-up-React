import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "./CarruselProducts.css";

function ProductCarousel({ featured }) {
  return (
    <div className="container my-5">
      <h2 className="fw-bold text-center mb-4 text-light">🔥 Productos destacados</h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 2500 }}
        pagination={{ clickable: true }}
        loop={true}
        spaceBetween={30}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
      >
        {featured.map((item) => (
          <SwiperSlide key={item.titulo}>
            <div className="card bg-dark text-white border-0 h-100 shadow-lg">
              <img
                src={item.imagen}
                className="card-img-top"
                alt={item.titulo}
                style={{ height: "230px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.titulo}</h5>
                <p className="card-text">{item.precio}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductCarousel;
