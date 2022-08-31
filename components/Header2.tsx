import { useState } from 'react';
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Button,
  Modal,
} from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  IconLogout,
  IconSettings,
  IconShare,
  IconSwitchHorizontal,
  IconChevronDown,
  IconGps,
} from '@tabler/icons';
import { ColorSchemeToggle } from './ColorSchemeToggle/ColorSchemeToggle';
import ShareForm from './ShareForm';
// import Image from 'next/image';
// import HeaderLogo from '../public/icon.png';

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]
    }`,
    marginBottom: 10,
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  tabs: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  tabsList: {
    borderBottom: '0 !important',
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    },

    '&[data-active]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
    },
  },
}));

interface UserProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
}
const UserMenu = ({ user }: UserProps) => {
  const { classes, theme, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [openShareForm, setOpenShareForm] = useState<boolean>(false);
  return (
    <Menu
      width={260}
      position="bottom-end"
      transition="pop-top-right"
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
    >
      <Modal
        opened={openShareForm}
        onClose={() => setOpenShareForm(false)}
        title="Share your trail"
        centered
      >
        <ShareForm />
      </Modal>
      <Menu.Target>
        <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
          <Group spacing={7}>
            <Avatar src={user.image} alt={user.name!} radius="xl" size={20} />
            <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
              {user.name}
            </Text>
            <IconChevronDown size={12} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>EmailL: {user?.email}</Menu.Label>
        <Link href="/mytrail" passHref>
          <Menu.Item icon={<IconGps size={14} color={theme.colors.blue[6]} stroke={1.5} />}>
            My trail
          </Menu.Item>
        </Link>
        <Menu.Item
          icon={<IconShare size={14} color={theme.colors.green[7]} stroke={1.5} />}
          onClick={() => setOpenShareForm(true)}
        >
          Share my trail
        </Menu.Item>

        <Menu.Label>Settings</Menu.Label>
        <Link href="/settings" passHref>
          <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>Account settings</Menu.Item>
        </Link>
        <Menu.Item icon={<IconSwitchHorizontal size={14} stroke={1.5} />}>Change account</Menu.Item>
        <Menu.Item icon={<IconLogout size={14} stroke={1.5} />} onClick={() => signOut()}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
export default function HeaderTabs() {
  const { classes } = useStyles();
  const { data: session, status } = useSession();

  return (
    <div className={classes.header}>
      <Container size="xl" className={classes.mainSection}>
        <Group position="apart">
          <Link href="/" passHref>
            <Text component="a" weight={800} size="md" sx={{ lineHeight: 1 }} mr={3}>
              MyTrail
            </Text>
          </Link>
          <Group>
            <ColorSchemeToggle />
            {!session && status !== 'loading' && (
              <Link href="/api/auth/signin" passHref>
                <Button radius="xl"> Sign in </Button>
              </Link>
            )}
            {session && <UserMenu user={session.user!} />}
          </Group>
        </Group>
      </Container>
    </div>
  );
}
