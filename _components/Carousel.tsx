import RNCarousel from 'react-native-snap-carousel';
import React from 'react';
import { AppContext } from '../appcontext';

import Layout from '../constants/Layout';
interface CarouselProp {
  onSnapToItem?: any;
  data: string[];
  renderItem: any;
  webRenderItem?: any;
}

export const Carousel = ({ onSnapToItem, data, renderItem }: CarouselProp) => {
  const appCtx = React.useContext(AppContext);
  return (
    <RNCarousel
      onSnapToItem={onSnapToItem}
      data={appCtx.handCard}
      renderItem={renderItem}
      sliderWidth={Layout.window.width}
      itemWidth={Layout.window.width * 0.8}
      layout={'default'}
    />
  );
};
