import './Category.css'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Category = () => {

    const categoryConfig = [
    { label: 'HS', required: 11, color: '#1e78d0' },  // Strong modern blue
    { label: 'BS', required: 23, color: '#329f80' },  // Calm minty green
    { label: 'ES', required: 25, color: '#d18d2b' },  // Warm amber
    { label: 'PC', required: 58, color: '#9c5dc4' },  // Modern purple
    { label: 'PE', required: 16, color: '#3b4956' },  // Steely navy/gray
    { label: 'OE', required: 12, color: '#da5a64' },  // Desaturated coral
    { label: 'EEC', required: 16, color: '#4fa2ca' }, // Sky teal
    { label: 'MC', required: 3, color: '#808be0' }    // Calm indigo
];



    const settings = {
        accessibility: true,
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    };

    return (
        <div className='category-container'>
            <Slider  {...settings}>
                {
                    categoryConfig.map((item, index) => {
                        return (
                            <div key={index} className='individual-wrapper' >
                                <div className='individual-container' style={{backgroundColor:item.color}}>
                                    <h1 className='individual-container-title'>{item.label}</h1>
                                    <h2 className='individual-container-number'>{item.required}</h2>

                                </div>
                            </div>
                        )
                    })
                }
            </Slider>
        </div>
    )
}

export default Category
