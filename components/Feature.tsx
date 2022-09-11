import { createStyles, Text, SimpleGrid, Container, Center } from '@mantine/core';
import { IconShare, IconUpload, IconCoin, TablerIcon } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  feature: {
    position: 'relative',
    paddingTop: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
  },

  overlay: {
    position: 'absolute',
    height: 100,
    width: 160,
    top: 0,
    left: 0,
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    zIndex: 1,
  },

  content: {
    position: 'relative',
    zIndex: 2,
  },

  icon: {
    color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },
}));

interface FeatureProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: TablerIcon;
  title: string;
  description: string;
}

function Feature({ icon: Icon, title, description, className, ...others }: FeatureProps) {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.feature, className)} {...others}>
      <div className={classes.overlay} />

      <div className={classes.content}>
        <Icon size={38} className={classes.icon} stroke={1.5} />
        <Text weight={700} size="lg" mb="xs" mt={5} className={classes.title}>
          {title}
        </Text>
        <Text color="dimmed" size="sm">
          {description}
        </Text>
      </div>
    </div>
  );
}

const mockdata = [
  {
    icon: IconShare,
    title: 'One-click Share',
    description: `Get shareable link with a single click.
Save time needed for "reporting you are safe"`,
  },
  {
    icon: IconUpload,
    title: 'On-demand Upload/ Reminder',
    description: `You only upload your location/ receive reminder when you want to.
We dont track anything in the background.`,
  },
  {
    icon: IconCoin,
    title: 'Completely Free',
    description: `Report me if you find a payment button.
We also don't sell your data.`,
  },
];

const FeatureSection = () => {
  const items = mockdata.map((item) => <Feature {...item} key={item.title} />);

  return (
    <Container mt={30} mb={30} size="lg">
      <Center>
        <SimpleGrid
          cols={3}
          breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
          spacing={50}
          sx={{ whiteSpace: 'pre-wrap' }}
        >
          {items}
        </SimpleGrid>
      </Center>
    </Container>
  );
};

export default FeatureSection;
