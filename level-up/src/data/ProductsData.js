const productsData = {

    //Juegos
    "Keys de Steam": [
        {
            titulo: "Baldur's Gate 3",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
            descripcion: "Un épico RPG basado en Dungeons & Dragons. Crea tu personaje, forma tu grupo y vive una aventura inmersiva llena de decisiones, combate táctico y narrativa profunda.",
            precio: "$45.990 clp",
            stock: "10 unidades"
        },
        {
            titulo: "Elden Ring",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
            descripcion: "De los creadores de Dark Souls, llega un mundo abierto lleno de desafíos, jefes colosales y misterios. Explora las Tierras Intermedias y forja tu propio destino.",
            precio: "$39.990 clp",
            stock: "8 unidades"
        },
        {
            titulo: "Stardew Valley",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
            descripcion: "Construye la granja de tus sueños en este encantador simulador de vida. Cultiva, cría animales, pesca, explora minas y crea la vida que siempre quisiste.",
            precio: "$7.990 clp",
            stock: "15 unidades"
        },
        {
            titulo: "Cyberpunk 2077",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
            descripcion: "Adéntrate en Night City, una metrópolis futurista repleta de tecnología, crimen y oportunidades. Personaliza tu personaje y toma decisiones que cambiarán la historia.",
            precio: "$17.990 clp",
            stock: "6 unidades"
        },
        {
            titulo: "Red Dead Redemption 2",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
            descripcion: "Vive el ocaso del Viejo Oeste como Arthur Morgan, miembro de la banda Van der Linde. Una historia épica de honor, lealtad y supervivencia en un mundo abierto impresionante.",
            precio: "$39.990 clp",
            stock: "12 unidades"
        },
        {
            titulo: "Hades",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
            descripcion: "Desafía al dios del inframundo en este roguelike de acción aclamado por la crítica. Combina poderosas habilidades y descubre la historia de los dioses griegos.",
            precio: "$9.990 clp",
            stock: "14 unidades"
        },
        {
            titulo: "The Witcher 3: Wild Hunt",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
            descripcion: "Embárcate como Geralt de Rivia en una aventura de mundo abierto repleta de monstruos, contratos y decisiones morales que moldean tu destino.",
            precio: "$19.990 clp",
            stock: "11 unidades"
        },
        {
            titulo: "Hollow Knight",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg",
            descripcion: "Explora las profundidades del reino de Hallownest en este metroidvania bellamente animado, con combate desafiante y atmósfera melancólica.",
            precio: "$6.990 clp",
            stock: "20 unidades"
        },
        {
            titulo: "Lies of P",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/header.jpg",
            descripcion: "Una reinterpretación oscura del cuento de Pinocho. Enfréntate a enemigos brutales y descubre los secretos de una ciudad retorcida en este soulslike steampunk.",
            precio: "$38.990 clp",
            stock: "9 unidades"
        },
        {
            titulo: "Resident Evil 4 Remake",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg",
            descripcion: "Revive el clásico de terror y acción con gráficos modernos, nuevos controles y una ambientación escalofriante. Una obra maestra reinventada.",
            precio: "$42.990 clp",
            stock: "7 unidades"
        },
        {
            titulo: "Lethal Company",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/header.jpg",
            descripcion: "Trabaja junto a tus compañeros recolectando chatarra en estaciones abandonadas… pero cuidado, algo acecha en la oscuridad. Un terror cooperativo impredecible.",
            precio: "$6.990 clp",
            stock: "18 unidades"
        },
        {
            titulo: "Horizon Zero Dawn",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg",
            descripcion: "Explora un mundo dominado por máquinas como Aloy, una cazadora en busca de su pasado. Combina sigilo, estrategia y exploración en paisajes asombrosos.",
            precio: "$29.990 clp",
            stock: "9 unidades"
        },
        {
            titulo: "Persona 3 Reload",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/2161700/header.jpg",
            descripcion: "Vive la historia definitiva de Persona 3 con gráficos y jugabilidad modernizados. Explora la Torre Tártaro, forja vínculos sociales y desentraña el misterio de la Hora Oscura en este RPG japonés aclamado.",
            precio: "$44.990 clp",
            stock: "15 unidades"
        },
        {
            titulo: "Persona 4 Golden",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1113000/header.jpg",
            descripcion: "Resuelve un misterioso caso de asesinatos en el pueblo rural de Inaba mientras equilibras tu vida estudiantil y exploras el Mundo TV. Un JRPG cautivador con personajes memorables y combate estratégico por turnos.",
            precio: "$12.990 clp",
            stock: "18 unidades"
        },
        {
            titulo: "Persona 5 Royal",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/header.jpg",
            descripcion: "Conviértete en un Ladrón Fantasma y cambia los corazones corruptos robando sus distorsionados deseos. La edición definitiva de Persona 5 con nuevos personajes, historia expandida, combate mejorado y más de 100 horas de contenido.",
            precio: "$47.990 clp",
            stock: "12 unidades"
        },
        {
            titulo: "Hatsune Miku: Project DIVA Mega Mix+",
            imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1761390/header.jpg",
            descripcion: "Un rítmico juego de música protagonizado por Hatsune Miku y otros Vocaloids. Combina pistas pegadizas, múltiples modos de juego y desafíos rítmicos para los fans del género.",
            precio: "$19.990 clp",
            stock: "10 unidades"
        }
    ],

    //Periféricos
    "Periféricos": [
        {
            titulo: "Mando inalambrico de Xbox Series X",
            imagen: "https://media.spdigital.cl/thumbnails/products/3rcpva8n_758c0a32_thumbnail_512.jpg",
            descripcion: "Mando inalambrico de Xbox Series X, posee bateria de hasta 40 horas. Compatible con dispositivos como Xbox Series X|S, Xbox One, PC con Windows 10, Android e iOS.",
            precio: "$69.990 clp",
            stock: "12 unidades"
        },
        {
            titulo: "HyperX Cloud Stinger 2",
            imagen: "https://http2.mlstatic.com/D_NQ_NP_850615-MCO53148326362_012023-O.webp",
            descripcion: "Los HyperX Cloud Stinger 2 son auriculares gaming ligeros y cómodos, diseñados para ofrecer un sonido nítido y envolvente gracias a sus controladores de 50 mm. Cuentan con micrófono flexible con cancelación de ruido y controles de volumen integrados, ideales para largas sesiones de juego en distintas plataformas.",
            precio: "$32.990 clp",
            stock: "15 unidades"
        },
        {
            titulo: "Mando Playstation 5",
            imagen: "https://coolboxpe.vtexassets.com/arquivos/ids/179115-1200-1200?v=637479844455200000&width=1200&height=1200&aspect=true",
            descripcion: "Control inalámbrico DualSense de PlayStation 5 con retroalimentación háptica y gatillos adaptativos. Ofrece una experiencia de juego inmersiva con audio 3D y batería de larga duración. Compatible con PS5, PC y dispositivos móviles.",
            precio: "$69.990 clp",
            stock: "11 unidades"
        },
        {
            titulo: "Teclado HyperX Alloy Rise",
            imagen: "https://media.spdigital.cl/thumbnails/products/ujr0_2mz_69ca3b94_thumbnail_512.jpg",
            descripcion: "Teclado mecánico gaming HyperX Alloy Rise con switches táctiles, iluminación RGB personalizable y construcción de aluminio resistente. Diseñado para gamers que buscan precisión y durabilidad en cada partida.",
            precio: "$129.990 clp",
            stock: "7 unidades"
        },
        {
            titulo: "Razer BlackWidow V4 Pro",
            imagen: "https://assets.razerzone.com/eeimages/support/products/1910/1910_blackwidow_v4_pro.png",
            descripcion: "Teclado mecánico gaming premium con switches Green táctiles, iluminación RGB Chroma, control de medios dedicado y reposamuñecas magnético. Incluye rueda de comandos y 8 macro teclas programables para máxima personalización.",
            precio: "$189.990 clp",
            stock: "6 unidades"
        },
        {
            titulo: "SteelSeries Arctis Nova Pro Wireless",
            imagen: "https://media.steelseriescdn.com/thumbs/catalog/items/61707/4aed35d6e88046bfaf84088c0e3c1d24.png.500x400_q100_crop-fit_optimize.png",
            descripcion: "Auriculares inalámbricos de alta fidelidad con sistema de doble batería intercambiable en caliente, conectividad 2.4GHz y Bluetooth simultánea, y controladores de altavoces premium de 40mm. Incluye base de estación con pantalla OLED.",
            precio: "$349.990 clp",
            stock: "5 unidades"
        },
        {
            titulo: "Logitech G Pro X 60 Lightspeed",
            imagen: "https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-60/gallery/pro-x-60-gallery-1-black.png",
            descripcion: "Teclado mecánico compacto 60% con tecnología LIGHTSPEED inalámbrica, switches GX Optical para respuesta ultrarrápida, y personalización total mediante KEYCONTROL. Batería de hasta 65 horas y construcción premium en aluminio.",
            precio: "$159.990 clp",
            stock: "8 unidades"
        }
    ],

    //Consolas
    "Consolas": [
        {
            titulo: "PlayStation 5",
            imagen: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSmEBw5qp0Jytqr7XYk4wQOVua90kuCNyaxzNnHP-tsEJ7sCBy_jkA9Hem1H4PWDSubCcW2RXahVDGCjVK3RxUDlVeIhsDzfwBDHsk2ifZ-LfC6tzqjONzR",
            descripcion: "La PlayStation 5 es la consola de nueva generación de Sony, diseñada para ofrecer gráficos de alta calidad en resolución 4K y tiempos de carga casi instantáneos gracias a su unidad SSD ultrarrápida. Incluye el control DualSense con retroalimentación háptica y gatillos adaptativos, que brindan una experiencia de juego más inmersiva. Ideal para quienes buscan potencia, innovación y un amplio catálogo de exclusivos.",
            precio: "$799.990 clp",
            stock: "10 unidades"
        },
        {
            titulo: "Nintendo Switch 2",
            imagen: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQEIjDJpKQ_ke_Ev5neR26RMqeC9RJAJ4JsMDEKrrOARQLrupU3KO7kLkHazCjBgBLjrFur1NfaDUTuMbSG7dFNClA2RZhlud7FoQp8lszFheorBWLhzfiIfw",
            descripcion: "La Nintendo Switch 2 es la consola de próxima generación de Nintendo, que promete llevar la experiencia de juego portátil y en casa a un nuevo nivel. Con un hardware mejorado, gráficos en 4K y una biblioteca de juegos ampliada, es ideal para los fanáticos de Nintendo que buscan lo último en innovación y jugabilidad.",
            precio: "$619.990 clp",
            stock: "5 unidades"
        },
        {
            titulo: "Xbox Series X",
            imagen: "https://i5.walmartimages.com/seo/Microsoft-Xbox-Series-X-1TB-Carbon-Black_9f8c06f5-7953-426d-9b68-ab914839cef4.5f15be430800ce4d7c3bb5694d4ab798.jpeg",
            descripcion: "La Xbox Series X es la consola más potente de Microsoft, diseñada para ofrecer juegos en 4K a 60fps con capacidad de hasta 120fps. Con su arquitectura Zen 2 y RDNA 2, SSD de alta velocidad y compatibilidad con juegos de generaciones anteriores, proporciona una experiencia de juego fluida y de alta calidad.",
            precio: "$849.990 clp",
            stock: "6 unidades"
        },
        {
            titulo: "PlayStation 5 Pro",
            imagen: "https://clsonyb2c.vtexassets.com/arquivos/ids/465172-800-800?v=638658958190900000&width=800&height=800&aspect=true",
            descripcion: "La PlayStation 5 Pro es la versión mejorada de la PS5, con una GPU 45% más potente, ray tracing mejorado y tecnología AI para upscaling. Diseñada para ofrecer gráficos en 4K a 60fps con mayor fidelidad visual y rendimiento optimizado en los juegos más exigentes.",
            precio: "$1.099.990 clp",
            stock: "13 unidades"
        },
        {
            titulo: "Xbox Series S",
            imagen: "https://assets.xboxservices.com/assets/bc/40/bc40fdf3-85a6-4c36-af92-dca2d36fc7e5.png",
            descripcion: "La Xbox Series S es la consola digital compacta de Microsoft, diseñada para juegos en 1440p hasta 120fps. Con 512GB de almacenamiento SSD, arquitectura de próxima generación y compatibilidad total con Xbox Game Pass, es perfecta para jugadores que buscan calidad a un precio accesible.",
            precio: "$449.990 clp",
            stock: "15 unidades"
        },
        {
            titulo: "Nintendo Switch OLED",
            imagen: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_600/ncom/en_US/switch/site-design-update/hardware/switch-oled/hero",
            descripcion: "Nintendo Switch OLED cuenta con una vibrante pantalla OLED de 7 pulgadas con colores intensos y contraste mejorado. Incluye base ajustable, 64GB de almacenamiento interno, audio mejorado y diseño refinado. Perfecta para jugar en casa o en movimiento con la mejor experiencia visual.",
            precio: "$479.990 clp",
            stock: "12 unidades"
        },
        {
            titulo: "Steam Deck OLED 512GB",
            imagen: "https://cdn.cloudflare.steamstatic.com/steamdeck/images/oled/hero.png",
            descripcion: "La Steam Deck OLED es una consola portátil con pantalla HDR OLED de 7.4 pulgadas, 90Hz y mayor vida de batería (3-12 horas). Equipada con 512GB de almacenamiento NVMe, WiFi 6E y AMD APU personalizado, permite jugar tu biblioteca completa de Steam en cualquier lugar.",
            precio: "$749.990 clp",
            stock: "7 unidades"
        },
        {
            titulo: "PlayStation 5 Digital Edition",
            imagen: "https://i5.walmartimages.com/seo/Sony-PlayStation-5-PS5-Digital-Edition-Video-Game-Console-White_c09ad4fc-e4b6-450f-b4bc-a0ef7a0b7c35.0a83200ec9e4e96fc44d63db2e66e07a.png",
            descripcion: "PlayStation 5 Digital Edition sin lector de discos, diseñada para quienes prefieren contenido 100% digital. Misma potencia que la PS5 estándar con SSD ultrarrápido, gráficos 4K, ray tracing y compatibilidad con control DualSense. Almacenamiento de 825GB expandible.",
            precio: "$699.990 clp",
            stock: "9 unidades"
        }
    ],

    //Computadores
    "Computadores Gamers": [
        {
            titulo: "Notebook ASUS ROG Strix G614PH-S5052W",
            imagen: "https://cl.store.asus.com/media/catalog/product/e/s/eshop_g614ph-s5052w_1.png?width=439&height=439&store=es_CL&image-type=image",
            descripcion: "Equipado con un procesador AMD Ryzen 9 8940HX y una tarjeta gráfica NVIDIA GeForce RTX 5050, ofrece un rendimiento excepcional en juegos AAA y tareas multitarea. Su pantalla de 16 pulgadas con resolución 2.5K y tasa de refresco de 240Hz garantiza imágenes nítidas y fluidas, mientras que los 16GB de RAM DDR5 y el SSD de 512GB aseguran arranques rápidos y capacidad de respuesta. El diseño robusto y las opciones de refrigeración avanzadas permiten largas sesiones de juego sin comprometer el rendimiento.",
            precio: "$1.899.990 clp",
            stock: "8 unidades"
        },
        {
            titulo: "MSI Katana 15 B13VGK",
            imagen: "https://media.solotodo.com/media/products/2111280",
            descripcion: "El MSI Katana 15 Gaming es un equipo diseñado para usuarios que buscan un rendimiento sólido tanto en videojuegos como en tareas exigentes. Cuenta con un procesador Intel Core i7 de 13ª generación y una tarjeta gráfica dedicada NVIDIA GeForce RTX 4060, que permiten ejecutar juegos modernos y aplicaciones de alto rendimiento con fluidez. Su pantalla de 15.6 pulgadas Full HD con tasa de refresco de 144 Hz ofrece una experiencia visual nítida y fluida, ideal para gaming y multimedia. Además, incorpora 16 GB de memoria RAM DDR5 y un rápido almacenamiento SSD de 1 TB, asegurando velocidad en la carga de programas y archivos.",
            precio: "$1.299.990 clp",
            stock: "9 unidades"
        },
        {
            titulo: "HP Omen 15-EK0008LA",
            imagen: "https://media.solotodo.com/media/products/1207678_picture_1596142669.jpg",
            descripcion: "Potente portátil gaming con Intel Core i7-10750H, 32 GB RAM, 512 GB SSD y NVIDIA RTX 2070 Max-Q (8 GB). Su pantalla IPS de 15.6 FHD a 144 Hz ofrece imágenes suaves y vibrantes, ideal para juegos exigentes.",
            precio: "$869.990 clp",
            stock: "5 unidades"
        },
        {
            titulo: "Lenovo Legion Pro 5 16IAX10",
            imagen: "https://media.solotodo.com/media/products/2047930_picture_1742839105.webp",
            descripcion: "El Lenovo Legion Pro 5 16IAX10 es una notebook orientada a usuarios que buscan un equipo con alto rendimiento para tareas exigentes como gaming, edición multimedia y trabajo profesional. Cuenta con un procesador Intel Core Ultra 7 255HX de última generación y una tarjeta gráfica dedicada NVIDIA GeForce RTX 5060 con 8 GB de memoria, lo que garantiza un desempeño fluido en aplicaciones y juegos modernos. Su pantalla OLED de 16 pulgadas con resolución 2560x1600 y tasa de refresco de 165 Hz ofrece una experiencia visual nítida y colores vibrantes, ideal para contenido multimedia y diseño.",
            precio: "$1.999.990 clp",
            stock: "4 unidades"
        }
    ],

    //Mouses
    "Mouse": [
        {
            titulo: "Logitech Pro X Superlight",
            imagen: "https://cdnx.jumpseller.com/smart-tech/image/59507620/D_NQ_NP_2X_798029-MLA45377518559_032021-F.webp?1737813083",
            descripcion: "El Logitech Pro X Superlight es un ratón inalámbrico diseñado para gamers profesionales. Con un peso de solo 63 gramos, ofrece una experiencia de juego ultraligera y cómoda. Su sensor HERO 25K proporciona una precisión y velocidad excepcionales, mientras que la conectividad LIGHTSPEED garantiza una respuesta instantánea. Además, su diseño ergonómico y personalizable permite largas sesiones de juego sin fatiga.",
            precio: "$87.990 clp",
            stock: "14 unidades"
        },
        {
            titulo: "Razer Viper V3 Pro - Black",
            imagen: "https://media.falabella.com/falabellaCL/17187832_1/w=1500,h=1500,fit=pad",
            descripcion: "El Razer Viper V3 Pro es un ratón gaming ultraligero de 54 g, con sensor óptico Focus Pro 35K de alta precisión y interruptores ópticos Gen-3 de larga duración. Su diseño ambidiestro y hasta 95 horas de batería lo hacen ideal para sesiones largas y competiciones exigentes.",
            precio: "$137.990 clp",
            stock: "10 unidades"
        },
        {
            titulo: "Logitech G703 Hero Wireless",
            imagen: "https://res.cloudinary.com/djx6viedj/image/upload/t_trimmed_square_512/6cjj8y6y3mzoftwpa8a626btevzn?_a=BACCd2Ev",
            descripcion: "El Logitech G703 Hero Wireless Gaming Mouse es un mouse inalámbrico diseñado para gamers que buscan un alto rendimiento, precisión y comodidad durante largas sesiones de juego. Equipado con el avanzado sensor óptico HERO 16K, ofrece un seguimiento preciso sin suavizado, aceleración ni filtros, con una resolución ajustable de hasta 16,000 DPI. Su tecnología inalámbrica LIGHTSPEED garantiza una conexión rápida y estable con una tasa de respuesta de 1 ms, ideal para juegos competitivos.",
            precio: "$79.990 clp",
            stock: "11 unidades"
        },
        {
            titulo: "Logitech Pro 2 Lightspeed - White",
            imagen: "https://progaming.cl/wp-content/uploads/2025/02/proyecto-nuevo-2025-02-11t141908670-3d331bc2-80c0-4e6d-936a-a9e7f3487a13.jpg",
            descripcion: "Domina el juego con el Logitech Pro 2 LIGHTSPEED. Este mouse inalámbrico ambidiestro cuenta con sensor HERO 2 de hasta 44 000 DPI, switches LIGHTFORCE híbridos óptico-mecánicos, conexión LIGHTSPEED de 1 ms y hasta 95 h de batería sin iluminación. Personalizable y ergonómico, incluye botones laterales magnéticos intercambiables, memoria integrada y RGB LIGHTSYNC. Ideal para los gamers competitivos más exigentes.",
            precio: "$94.990 clp",
            stock: "9 unidades"
        },
        {
            titulo: "Razer DeathAdder V3 Pro",
            imagen: "https://assets.razerzone.com/eeimages/support/products/1914/1914_deathadder_v3_pro.png",
            descripcion: "Mouse inalámbrico ergonómico con sensor Focus Pro 30K, switches ópticos Gen-3, y peso de 63g. Batería de hasta 90 horas, conectividad HyperSpeed Wireless y Bluetooth, con 5 botones programables mediante Razer Synapse. Diseño icónico para usuarios diestros.",
            precio: "$129.990 clp",
            stock: "12 unidades"
        },
        {
            titulo: "SteelSeries Aerox 5 Wireless",
            imagen: "https://media.steelseriescdn.com/thumbs/catalog/items/62607/2e7e5aacff9e4c52aa9be7f8e1c09b6f.png.500x400_q100_crop-fit_optimize.png",
            descripcion: "Mouse gaming inalámbrico ultra ligero de 74g con sensor TrueMove Air (18,000 CPI), 9 botones programables incluyendo botones laterales adicionales. Batería de 180 horas, carcasa resistente al agua IP54, iluminación RGB de 3 zonas y switches dorados de 80 millones de clics.",
            precio: "$99.990 clp",
            stock: "10 unidades"
        },
        {
            titulo: "Razer Basilisk V3 Pro",
            imagen: "https://assets.razerzone.com/eeimages/support/products/1871/1871_basilisk_v3_pro.png",
            descripcion: "Mouse ergonómico premium con sensor Focus Pro 30K, rueda de scroll inteligente HyperScroll Tilt, 11 botones programables Razer Chroma RGB con 13 zonas de iluminación. Conectividad triple (HyperSpeed, Bluetooth, USB-C) y hasta 90 horas de batería. Incluye base de carga inalámbrica.",
            precio: "$159.990 clp",
            stock: "6 unidades"
        },
        {
            titulo: "HyperX Pulsefire Haste 2 Wireless",
            imagen: "https://row.hyperx.com/cdn/shop/files/hyperx_pulsefire_haste_2_wireless_mouse_1_main_900x.jpg",
            descripcion: "Mouse gaming ultraligero de 61g con sensor 26K de alta precisión, switches TTC Golden Micro de 80M de clics, batería de hasta 100 horas y pies de PTFE 100% virgin. Conectividad wireless 2.4GHz y Bluetooth 5.2. Diseño honeycomb con grip tape incluido.",
            precio: "$79.990 clp",
            stock: "13 unidades"
        }
    ]
};

export default productsData;