import {
  Paper,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  SimpleGrid,
  createStyles,
  Container,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { ContactIconsList } from '../components/Icons/Contacticons';
import Layout from '../components/Layout';
import { handleFetchError } from '../lib/error-handling';

const useStyles = createStyles((theme) => {
  const BREAKPOINT = theme.fn.smallerThan('sm');

  return {
    wrapper: {
      display: 'flex',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      borderRadius: theme.radius.lg,
      padding: 4,
      border: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2]
      }`,

      [BREAKPOINT]: {
        flexDirection: 'column',
      },
    },

    form: {
      boxSizing: 'border-box',
      flex: 1,
      padding: theme.spacing.xl,
      paddingLeft: theme.spacing.xl * 2,
      borderLeft: 0,

      [BREAKPOINT]: {
        padding: theme.spacing.md,
        paddingLeft: theme.spacing.md,
      },
    },

    fields: {
      marginTop: -12,
    },

    fieldInput: {
      flex: 1,

      '& + &': {
        marginLeft: theme.spacing.md,

        [BREAKPOINT]: {
          marginLeft: 0,
          marginTop: theme.spacing.md,
        },
      },
    },

    fieldsGroup: {
      display: 'flex',

      [BREAKPOINT]: {
        flexDirection: 'column',
      },
    },

    contacts: {
      boxSizing: 'border-box',
      position: 'relative',
      borderRadius: theme.radius.lg - 2,
      background: 'linear-gradient(to left bottom, #7bd5f5, #39aee5, #0086d3, #005cba, #1f2f98)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: theme.spacing.xl,
      flex: '0 0 280px',

      [BREAKPOINT]: {
        marginBottom: theme.spacing.sm,
        paddingLeft: theme.spacing.md,
      },
    },

    title: {
      marginBottom: theme.spacing.xl * 1.5,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,

      [BREAKPOINT]: {
        marginBottom: theme.spacing.xl,
      },
    },

    control: {
      [BREAKPOINT]: {
        flex: 1,
      },
    },
  };
});

interface contactFormProps {
  name?: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validate: {
      email: (value: string) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : 'Invalid email',
    },
  });

  const submitContactForm = async (formData: contactFormProps) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_CONTACT_FORM_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await handleFetchError(res, 'Error submitting contact form');
      showNotification({
        id: 'contact-submitted',
        autoClose: 5000,
        title: 'Your message is delivered',
        message: '',
        color: 'green',
        loading: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <Container size="md">
        <Paper shadow="md" radius="lg">
          <div className={classes.wrapper}>
            <div className={classes.contacts}>
              <Text size="lg" weight={700} className={classes.title} sx={{ color: '#fff' }}>
                Contact information
              </Text>

              <ContactIconsList variant="white" />
            </div>

            <form
              className={classes.form}
              onSubmit={form.onSubmit((values) => submitContactForm(values))}
            >
              <Text size="lg" weight={700} className={classes.title}>
                Get in touch
              </Text>

              <div className={classes.fields}>
                <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                  <TextInput
                    label="Your name"
                    placeholder="Your name"
                    {...form.getInputProps('name')}
                  />
                  <TextInput
                    label="Your email"
                    placeholder="hello@mytrail.live"
                    required
                    {...form.getInputProps('email')}
                  />
                </SimpleGrid>

                <TextInput
                  mt="md"
                  label="Subject"
                  placeholder="Subject"
                  required
                  {...form.getInputProps('subject')}
                />

                <Textarea
                  mt="md"
                  label="Your message"
                  placeholder="Please include all relevant information"
                  minRows={3}
                  {...form.getInputProps('message')}
                />

                <Group position="right" mt="md">
                  <Button type="submit" className={classes.control}>
                    Send message
                  </Button>
                </Group>
              </div>
            </form>
          </div>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ContactPage;
