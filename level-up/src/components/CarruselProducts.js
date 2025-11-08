import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";

// CSS de Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

// Tu CSS personalizado
import "./CarruselProducts.css";

function ProductCarousel({ featured, onProductClick }) {
  return (
    <div className="container-fluid px-0">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        navigation={true}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        autoplay={{ delay: 3500 }}
        pagination={{ clickable: true }}
        loop={true}
        slidesPerView={1}
        spaceBetween={30}
      >
        {featured.map((item) => (
          <SwiperSlide key={item.titulo} className="custom-slide">
            {/* IMAGEN DE FONDO (BORROSA) */}
            <img
              src={item.imagen}
              className="slide-image-background"
              alt=""
            />

            {/* IMAGEN PRINCIPAL (NÍTIDA) */}
            <img
              src={item.imagen}
              className="slide-image-foreground"
              alt={item.titulo}
            />

            {/* Gradiente */}
            <div className="slide-overlay-gradient"></div>

            {/* Contenido */}
            <div className="slide-content-wrapper">
              <div className="slide-text">
                <h3 className="card-title fw-bold">{item.titulo}</h3>
                <p className="card-text-small d-none d-md-block">
                  {item.descripcion.substring(0, 80)}...
                </p>
                <div className="d-flex align-items-center gap-3 mt-3">
                  <p className="fw-bold fs-5 mb-0">{item.precio}</p>
                  <button
                    className="btn btn-light"
                    onClick={() => onProductClick(item)}
                  >
                    Más información
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductCarousel;
