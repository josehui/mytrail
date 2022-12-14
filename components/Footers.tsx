import { createStyles, Anchor, Group, ActionIcon, Text } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons';
import { IconMyTrail } from './Icons/MytrailIcon';

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: '4vh',
    marginLeft: 5,
    marginRight: 10,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    // position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
  },
}));

const links = [
  {
    link: '/terms',
    label: 'Terms and Conditions',
  },
  {
    link: '/privacy',
    label: 'Privacy',
  },
  {
    link: '/contact',
    label: 'Contact',
  },
];

const Footer = () => {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Anchor<'a'>
      color="dimmed"
      key={link.label}
      href={link.link}
      sx={{ lineHeight: 1 }}
      // onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Group spacing={0}>
          <IconMyTrail />
          <Text weight={800} size="md">
            MyTrail
          </Text>
        </Group>
        <Group className={classes.links}>{items}</Group>
        <Group spacing="xs" position="right" noWrap ml={7}>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandGithub size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
};

export default Footer;
