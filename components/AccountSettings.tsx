import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Textarea, NumberInput } from '@mantine/core';
import { randomId } from '@mantine/hooks';

const AccountSettings = () => {
  const form = useForm({
    initialValues: {
      email: '',
      webhook: '',
      frequency: 180,
      SOStime: 24,
    },
  });

  return (
    <div style={{ maxWidth: 320, margin: 'auto' }}>
      <NumberInput
        label="Reminder Frequency (in minutes)"
        description="From 30 to 600 minutes"
        placeholder=""
        mt="md"
        max={600}
        min={30}
        required
        {...form.getInputProps('frequency')}
      />
      <NumberInput
        label="Time before SOS"
        description="From 12 to 120 hours. A SOS message will be sent if no new footprint recevied for the configured time"
        placeholder=""
        mt="md"
        max={120}
        min={12}
        required
        {...form.getInputProps('SOStime')}
      />
      <Textarea
        mt="md"
        label="SOS Email List"
        placeholder="someoneyoutrust@gmail.com, someoneyoulove@gmail.com"
        required
        autosize
        description="Separate each email by a comma (,) "
        {...form.getInputProps('email')}
      />
      <TextInput
        mt="md"
        label="Webhook"
        disabled
        description="Trigger a custom webhook when the SOS message is sent"
        placeholder="Under development"
        {...form.getInputProps('webhook')}
      />

      <Group position="center" mt="xl">
        <Button
          variant="outline"
          onClick={() =>
            form.setValues({
              webhook: randomId(),
              email: `${randomId()}@test.com`,
              frequency: 88,
              SOStime: 20,
            })
          }
        >
          Set random values
        </Button>
      </Group>
    </div>
  );
};

export default AccountSettings;
