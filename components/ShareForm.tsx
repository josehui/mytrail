import {
  Button,
  createStyles,
  Box,
  Text,
  Divider,
  CopyButton,
  Group,
  CloseButton,
} from '@mantine/core';
import { useState } from 'react';
import useSWR, { Fetcher, useSWRConfig } from 'swr';
import { handleFetchError } from '../lib/error-handling';

type linkProps = {
  id: string;
  userId: string;
  expires: string;
};
const fetcher: Fetcher<linkProps[], string> = async (id) => {
  const res = await fetch(id);
  await handleFetchError(res);
  return res.json();
};

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: 'block',
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    lineHeight: 1.2,
    fontSize: theme.fontSizes.sm,
    padding: theme.spacing.xs,
    borderTopRightRadius: theme.radius.sm,
    borderBottomRightRadius: theme.radius.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}));

export default function ShareForm() {
  const { data: links } = useSWR('/api/links', fetcher);
  const { mutate } = useSWRConfig();
  const { classes } = useStyles();
  const hostname = window.location.hostname;
  const [generated, setGenerated] = useState<boolean>(false);

  const genLink = async () => {
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
      });
      await handleFetchError(res);
      mutate('/api/links');
      setGenerated(true);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const res = await fetch(`/api/links?id=${id}`, {
        method: 'DELETE',
      });
      await handleFetchError(res);
      mutate('/api/links');
    } catch (error) {
      console.error(error);
    }
  };

  const items = links?.map((item) => (
    <Group align="stretch">
      <CopyButton value={`${hostname}/l/${item.id}`}>
        {({ copied, copy }) => (
          <Box<'a'>
            component="a"
            href={`/l/${item.id}`}
            onClick={(event) => {
              event.preventDefault();
              copy();
            }}
            key={item.id}
            className={classes.link}
            sx={{ width: '85%' }}
          >
            {copied ? 'Copied link' : `https://${hostname}/l/${item.id}`}
          </Box>
        )}
      </CopyButton>
      <CloseButton
        onClick={() => {
          deleteLink(item.id);
        }}
      />
    </Group>
  ));
  return (
    <>
      <Button
        component="a"
        sx={{ height: 30 }}
        mb={30}
        variant="light"
        // gradient={{ from: 'teal', to: 'blue', deg: 60 }}
        onClick={() => {
          if (!generated) {
            genLink();
          }
        }}
        disabled={generated}
      >
        {generated ? 'Link Generated!' : 'Generate link'}
      </Button>
      <Text>Existing links</Text>
      <Divider />
      {items}
    </>
  );
}
