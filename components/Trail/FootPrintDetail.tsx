import { useState } from 'react';
import {
  Text,
  Center,
  Container,
  createStyles,
  Group,
  Grid,
  Table,
  Image,
  Modal,
} from '@mantine/core';
import NextImage from 'next/image';
import Map from './Map';
import { FootPrintCardProps } from './FootPrintCard';

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: 30,
    paddingBottom: 50,
  },

  supTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 800,
    fontSize: theme.fontSizes.sm,
    color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    letterSpacing: 0.5,
  },

  description: {
    textAlign: 'center',
    margin: theme.spacing.xs,
  },

  highlight: {
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    padding: 5,
    paddingTop: 0,
    borderRadius: theme.radius.sm,
    display: 'inline-block',
    color: theme.colorScheme === 'dark' ? theme.white : 'inherit',
  },
}));

export interface FootPrintDetailProps extends FootPrintCardProps {
  author?: {
    name?: string;
    email?: string;
  };
}
const FootPrintDetail = (props: FootPrintDetailProps) => {
  const { classes } = useStyles();
  const { location, address, remarks, createdAt, images, author } = props;
  const TRANSITION_DURATION = 200;
  const [openPhotos, setOpenPhotos] = useState(false);
  const [openFullPhoto, setOpenFullPhoto] = useState(false);
  const [fullPhoto, setFullPhoto] = useState<string | undefined>();

  return (
    <Grid mx={10}>
      <Grid.Col sm={12} md={6}>
        <Container size={700} className={classes.wrapper}>
          <Text className={classes.supTitle}>
            Footprint on {new Date(createdAt).toDateString()}
          </Text>
          <Container size={660} p={0}>
            <Text color="dimmed" className={classes.description}>
              by {author?.name || author?.email || 'unknown'}
            </Text>
          </Container>
          <Table sx={{ textAlign: 'left' }}>
            <tbody>
              <tr>
                <th>Address:</th>
                <td>{address}</td>
              </tr>
              <tr>
                <th>Location:</th>
                <td>
                  {location.lat}, {location.lng}
                </td>
              </tr>
              <tr>
                <th>Timestamp:</th>
                <td>{new Date(createdAt).toString()}</td>
              </tr>
              <tr>
                <th>Remarks:</th>
                <td>{remarks}</td>
              </tr>
              <tr>
                <th>Photos:</th>
                {!images.length && <td>No photo available</td>}
              </tr>
              <tr />
            </tbody>
          </Table>
          <Modal
            centered
            opened={openPhotos}
            onClose={() => setOpenPhotos(false)}
            size="100vw"
            transitionDuration={TRANSITION_DURATION}
            sx={{ zIndex: 1001 }}
          >
            <Grid grow>
              {images.map((image, idx) => (
                <Grid.Col sm={12} md={6} lg={4}>
                  <Image
                    key={idx}
                    src={image}
                    fit="contain"
                    sx={{ maxWidth: '100%', cursor: 'pointer', ':hover': { opacity: 0.8 } }}
                    onClick={() => {
                      setFullPhoto(image);
                      setOpenFullPhoto(true);
                    }}
                  />
                </Grid.Col>
              ))}
              <Modal
                centered
                opened={openFullPhoto}
                onClose={() => setOpenFullPhoto(false)}
                size="100vw"
                transitionDuration={TRANSITION_DURATION}
                fullScreen
                sx={{ zIndex: 1001 }}
              >
                <Center>
                  <img src={fullPhoto} style={{ maxHeight: '80vh', maxWidth: '100%' }} />
                </Center>
              </Modal>
            </Grid>
          </Modal>
          <Group position="left">
            {images.map((image, idx) => (
              <Image
                key={idx}
                src={image}
                sx={{ maxWidth: '21%', cursor: 'pointer', ':hover': { opacity: 0.8 } }}
                onClick={() => setOpenPhotos(true)}
              />
            ))}
          </Group>
        </Container>
      </Grid.Col>
      <Grid.Col sm={12} md={6}>
        <Map footprints={[props]} />
      </Grid.Col>
    </Grid>
  );
};

export default FootPrintDetail;
