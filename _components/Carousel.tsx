import Carousel from 'react-native-snap-carousel';
import React from 'react';
// export { default as Carousel } from 'react-native-snap-carousel';

interface CarouselProp {
  onSnapToItem?: any;
  data: string[];
  renderItem: any;
  webRenderItem?: any;
}

const CarouselWeb = ({ onSnapToItem, data, renderItem }: CarouselProp) => {
  return (
    <Carousel
      // ref={_carousel}
      onSnapToItem={onSnapToItem}
      data={data}
      renderItem={renderItem}
      sliderWidth={380}
      itemWidth={300}
      layout={'default'}
    />
  );
};

export { CarouselWeb as Carousel };
