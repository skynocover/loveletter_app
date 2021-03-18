import * as React from 'react';
import { View } from 'react-native';
import { Carousel as AntdCarousel } from 'antd';

import 'antd/dist/antd.min.css';

interface carouselProp {
  onSnapToItem?: any;
  data: string[];
  // renderItem: any;
  webRenderItem: any;
}

const contentStyle: any = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

export const Carousel = ({ onSnapToItem, data, webRenderItem }: carouselProp) => {
  return <AntdCarousel afterChange={onSnapToItem}>{webRenderItem(data)}</AntdCarousel>;
};
