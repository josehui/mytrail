import Link from 'next/link';
import { useState } from 'react';
import { createStyles, Card, Image, Text, Group, Modal, Tooltip } from '@mantine/core';
import { useAnimationOffsetEffect } from '@mantine/carousel';
import { IconMapPin, IconDeviceWatch } from '@tabler/icons';
import { EmblaCarouselType } from 'embla-carousel-react';
import PhotoCarousel from './PhotoCarousel';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    maxWidth: '80vw',
  },

  footer: {
    // display: 'flex',
    // justifyContent: 'left',
    // gap: '1rem',
    // maxHeight: '4rem',
    padding: '10px',
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
}));

export interface FootPrintCardProps {
  // eslint-disable-next-line react/no-unused-prop-types
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  remarks: string;
  createdAt: string;
  images: string[];
}

export default function FootPrintCard(props: FootPrintCardProps) {
  const { location, address, remarks, createdAt, images, id } = props;
  const [openGallery, setOpenGallery] = useState(false);
  const TRANSITION_DURATION = 200;
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

  // type error from library
  // @ts-ignore
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  const imagePreviews = images
    .slice(0, 5)
    .map((photo, idx) => (
      <Image
        key={idx}
        src={photo}
        fit="contain"
        radius="xs"
        sx={{ maxWidth: '20%', width: 'auto', height: 'auto', maxHeight: '8rem' }}
      />
    ));
  const { classes } = useStyles();
  // eslint-disable-next-line newline-per-chained-call
  const localDate = new Date(createdAt).toString().split(' ').slice(4, 6).join(' ');

  return (
    <Card withBorder p="lg" className={classes.card}>
      <Card.Section>
        <Image src={images?.[0]} alt={remarks} height={100} />
      </Card.Section>

      <Group position="apart" mt="xl">
        <Link href={`/fp/${id}`} passHref>
          <Text variant="link" component="a" weight={500}>
            {/* Ficus Garden, 11 Lok King St, Fo Tan, Hong Kong */}
            {address}
          </Text>
        </Link>
        <Group position="apart">
          <Text size="xs" color="dimmed">
            <IconMapPin size="15" />
            {location.lat}, {location.lng}
          </Text>
          <Text size="xs" color="dimmed">
            <IconDeviceWatch size="15" />
            {localDate}
          </Text>
        </Group>
      </Group>
      <Text ml={5} mt="sm" mb="md" color="dimmed" size="xs">
        I am fine, thanks
      </Text>
      <Card.Section className={classes.footer}>
        <Modal
          centered
          opened={openGallery}
          onClose={() => setOpenGallery(false)}
          title={address}
          size="lg"
          transitionDuration={TRANSITION_DURATION}
        >
          <PhotoCarousel images={images} setEmbla={setEmbla} />
        </Modal>
        <Tooltip label="Open photo gallery">
          <Group onClick={() => setOpenGallery(true)} spacing="md" sx={{ cursor: 'pointer' }}>
            {imagePreviews}
          </Group>
        </Tooltip>
      </Card.Section>
    </Card>
  );
}
