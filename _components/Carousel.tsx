import RNCarousel from 'react-native-snap-carousel';
import React from 'react';

import Layout from '../constants/Layout';
interface CarouselProp {
  onSnapToItem?: any;
  data: string[];
  renderItem: any;
  webRenderItem?: any;
}

export const Carousel = ({ onSnapToItem, data, renderItem }: CarouselProp) => {
  return (
    <RNCarousel
      onSnapToItem={onSnapToItem}
      data={data}
      renderItem={renderItem}
      sliderWidth={Layout.window.width}
      itemWidth={Layout.window.width * 0.8}
      layout={'default'}
    />
  );
};
