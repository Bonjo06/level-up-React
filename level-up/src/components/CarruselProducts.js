import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// 1. Importa Navigation
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";

// CSS de Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation"; // 2. Añade el CSS de Navigation

// Tu CSS personalizado
import "./CarruselProducts.css";

function ProductCarousel({ featured, onProductClick }) {
  return (
    // 3. Cambia "container" por "container-fluid px-0"
    <div className="container-fluid px-0">
      
      

      <Swiper
        // 4. Añade Navigation a los módulos
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        navigation={true} // 5. Activa las flechas
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
            
            {/* 1. IMAGEN DE FONDO (BORROSA) */}
            <img
              src={item.imagen}
              className="slide-image-background"
              alt="" // Es decorativa, no necesita alt
            />

            {/* 2. IMAGEN PRINCIPAL (NÍTIDA) */}
            <img
              src={item.imagen}
              className="slide-image-foreground" // Renombramos la clase
              alt={item.titulo}
            />

            {/* 3. El resto (gradiente, texto y botón) quedan igual */}
            <div className="slide-overlay-gradient"></div>
            <div className="slide-content-wrapper">
              <div className="slide-text">
                <h3 className="card-title fw-bold">{item.titulo}</h3>
                <p className="card-text-small d-none d-md-block">
                  {item.descripcion.substring(0, 80)}...
                </p>
                <p className="fw-bold fs-5 mt-2">{item.precio}</p>
              </div>
              <button
                className="btn btn-light"
                onClick={() => onProductClick(item)}
              >
                Más información
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductCarousel;
