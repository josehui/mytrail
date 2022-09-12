import { createStyles, Title, Text, Button, Container } from '@mantine/core';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Dots } from './Dots';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: 120,
    paddingBottom: 80,

    '@media (max-width: 755px)': {
      paddingTop: 80,
      paddingBottom: 60,
    },
  },

  inner: {
    position: 'relative',
    zIndex: 1,
  },

  dots: {
    position: 'absolute',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],

    '@media (max-width: 755px)': {
      display: 'none',
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 28,
      textAlign: 'left',
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
  },

  description: {
    textAlign: 'center',

    '@media (max-width: 520px)': {
      textAlign: 'left',
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',

    '@media (max-width: 520px)': {
      flexDirection: 'column',
    },
  },

  control: {
    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md,
    },

    '@media (max-width: 520px)': {
      height: 42,
      fontSize: theme.fontSizes.md,

      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

const HeroSection = () => {
  const { classes } = useStyles();
  const { data: session, status } = useSession();

  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Travel{' '}
          <Text component="span" className={classes.highlight} inherit>
            trail
          </Text>{' '}
          tracker for everyone
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" color="dimmed" className={classes.description}>
            Track and share your travel trail. Automatically alert your family and friends when
            needed.
            <br />
            No installation. No ads. No bullshit.
          </Text>
        </Container>

        {!session && status !== 'loading' && (
          <div className={classes.controls}>
            {/* <Button className={classes.control} size="lg" variant="default" color="gray">
              View demo
            </Button> */}
            <Link href="/api/auth/signin" passHref>
              <Button radius="xl" className={classes.control} size="lg">
                Get started
              </Button>
            </Link>
          </div>
        )}
        {session && (
          <div className={classes.controls}>
            <Link href="/mytrail" passHref>
              <Button component="a" radius="xl" className={classes.control} size="lg">
                View your Trail
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
};
export default HeroSection;
