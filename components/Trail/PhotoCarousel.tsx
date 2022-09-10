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
    // slideSize="100%"
    slideGap="md"
    align="start"
    sx={{ maxHeight: '70vh' }}
    loop
    getEmblaApi={setEmbla}
    breakpoints={[
      { maxWidth: 'md', slideSize: '50%' },
      { maxWidth: 'sm', slideSize: '100%', slideGap: 0 },
    ]}
  >
    {images.map((photo, idx) => (
      <Carousel.Slide key={`ca-${idx}`}>
        <Image
          src={photo}
          height={500}
          fit="contain"
          // radius="xs"
          sx={{ maxHeight: '80%', maxWidth: '100%' }}
        />
      </Carousel.Slide>
    ))}
  </Carousel>
);

export default PhotoCarousel;
