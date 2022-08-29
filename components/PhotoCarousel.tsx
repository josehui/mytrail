import React from 'react';
import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';
import { EmblaCarouselType } from 'embla-carousel-react';

const PhotoCarousel = ({
  images,
  setEmbla,
}: {
  images: string[];
  setEmbla: (embla: EmblaCarouselType) => void;
}) => (
  <Carousel
    withIndicators
    slideSize="100%"
    slideGap="md"
    align="start"
    sx={{ maxHeight: '70vh' }}
    loop
    getEmblaApi={setEmbla}
  >
    {images.map((photo, idx) => (
      <Carousel.Slide>
        <Image
          key={idx}
          src={photo}
          fit="contain"
          radius="xs"
          // sx={{ maxWidth: '20%', width: 'auto', height: 'auto', maxHeight: '8rem' }}
        />
      </Carousel.Slide>
    ))}
  </Carousel>
);

export default PhotoCarousel;
