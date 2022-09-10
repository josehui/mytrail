import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Container,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { GoogleIcon, FacebookIcon } from './Icons/SocialIcons';
import { handleFetchError } from '../lib/error-handling';

// @ts-ignore
const AuthenticationForm = ({ csrfToken, providers, signIn }) => {
  const [type, toggle] = useToggle(['Continue', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      // password: '',
      terms: true,
      csrfToken,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      // password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const submitEmail = async (formData: any) => {
    try {
      // eslint-disable-next-line no-param-reassign
      showNotification({
        id: 'email-submitted',
        autoClose: 5000,
        title: 'Email submitted',
        message: 'Please wait while your sign-in link is generated',
        color: 'blue',
        loading: true,
      });
      const res = await fetch('/api/auth/signin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await handleFetchError(res, 'Error saving settings');
      showNotification({
        id: 'link-generated',
        autoClose: 5000,
        title: 'Sign-in link sent',
        message: 'Please check your inbox for sign-in link',
        color: 'green',
        loading: false,
      });
    } catch (error) {
      showNotification({
        id: 'email-error',
        autoClose: 5000,
        title: 'Error getting sign-in link',
        message: 'Please check if email is correct',
        color: 'red',
        loading: false,
      });
    }
  };

  return (
    <Container size="xs" pt="xl">
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" weight={500}>
          Welcome to MyTrail, {type} with
        </Text>

        <Group grow mb="md" mt="md">
          {providers.google && (
            <Button
              leftIcon={<GoogleIcon />}
              radius="xl"
              color="gray"
              onClick={() => signIn(providers.google.id)}
            >
              Google
            </Button>
          )}
          {providers.facebook && (
            <Button
              leftIcon={<FacebookIcon />}
              radius="xl"
              color="gray"
              onClick={() => signIn(providers.facebook.id)}
            >
              Facebook
            </Button>
          )}
        </Group>

        <Divider label="Or sign in with email" labelPosition="center" my="lg" />

        <form
          onSubmit={form.onSubmit(async (values) => {
            submitEmail(values);
          })}
        >
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
            />

            {/* <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
            /> */}

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>
          <Group position="right" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
              hidden
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit">{upperFirst(type)}</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default AuthenticationForm;
