import { Image, useMantineColorScheme } from '@mantine/core';
import pngMyTrailLight from '../../public/mytrail-icon-light.png';
import pngMyTrailDark from '../../public/mytrail-icon-dark.png';

export const IconMyTrail = () => {
  const { colorScheme } = useMantineColorScheme();
  const iconPng = colorScheme === 'dark' ? pngMyTrailLight : pngMyTrailDark;
  return <Image src={iconPng.src} width={50} mr={-5} mt={2} py={-10} />;
};
