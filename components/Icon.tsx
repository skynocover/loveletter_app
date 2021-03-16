import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { AntDesign, Feather, FontAwesome, Ionicons, SimpleLineIcons } from '@expo/vector-icons';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const Icon = ({
  name = 'SimpleLineIcons/info',
  size = 14,
  color = 'black',
  style,
}: IconProps) => {
  const namePart = name.split('/');
  const componentName = namePart[0];
  const iconName = namePart[1] as any;

  switch (componentName) {
    case 'AntDesign':
      return <AntDesign name={iconName} size={size} color={color} style={style} />;
    case 'Feather':
      return <Feather name={iconName} size={size} color={color} style={style} />;
    case 'FontAwesome':
      return <FontAwesome name={iconName} size={size} color={color} style={style} />;
    case 'Ionicons':
      return <Ionicons name={iconName} size={size} color={color} style={style} />;
    case 'SimpleLineIcons':
      return <SimpleLineIcons name={iconName} size={size} color={color} style={style} />;
    default:
      return <FontAwesome name={iconName} size={size} color={color} style={style} />;
  }
};
