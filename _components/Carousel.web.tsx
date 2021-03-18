import * as React from 'react';
import { View } from 'react-native';
import { Carousel as AntdCarousel } from 'antd';

import 'antd/dist/antd.min.css';

interface carouselProp {
  data: string[];
  renderItem: any;
}

const contentStyle: any = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

export const Carousel = ({ data, renderItem }: carouselProp) => {
  return (
    <AntdCarousel>
      {data.map((prop) => {
        return <div>{renderItem(prop)}</div>;
      })}
    </AntdCarousel>
  );
};
