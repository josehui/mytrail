import { useState } from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Button,
  Group,
  Textarea,
  NumberInput,
  Modal,
  SimpleGrid,
  Container,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import NotificationSetting from './NotificationSetting';
import { handleFetchError } from '../lib/error-handling';

export interface settingFormProps {
  reminderFreq: number;
  sosTime: number;
  emailList: string[] | string;
  emailMessage: string;
  defaultMessage: string;
}

const defaultSetting = {
  emailList: [],
  reminderFreq: 180,
  sosTime: 24,
  emailMessage: 'Hello, please send help',
  defaultMessage: 'I am fine, thanks',
};
const UserSettings = (props: settingFormProps) => {
  const form = useForm({
    initialValues: {
      emailList: props.emailList,
      reminderFreq: props.reminderFreq,
      sosTime: props.sosTime,
      emailMessage: props.emailMessage,
      defaultMessage: props.defaultMessage,
    },
  });
  const [openNotificationSetting, setOpenNotificationSetting] = useState<boolean>(false);

  const submitSettings = async (formData: settingFormProps) => {
    try {
      // eslint-disable-next-line no-param-reassign
      formData.emailList = formData.emailList.toString().replace(/\s/g, '').split(',');
      form.setFieldValue('emailList', formData.emailList);
      const res = await fetch('/api/account/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await handleFetchError(res, 'Error saving settings');
      showNotification({
        id: 'setting-saved',
        autoClose: 5000,
        title: 'Settings saved',
        message: '',
        color: 'green',
        loading: false,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <SimpleGrid cols={2} spacing="xs" breakpoints={[{ maxWidth: 600, cols: 1, spacing: 'sm' }]}>
        <Container size="sm">
          <NumberInput
            label="Reminder Frequency (in minutes)"
            description="From 30 to 600 minutes. A reminder will be sent if no new footprint recevied for the configured time"
            placeholder=""
            mt="md"
            max={600}
            min={30}
            required
            {...form.getInputProps('reminderFreq')}
          />
          <Modal
            centered
            opened={openNotificationSetting}
            onClose={() => {
              setOpenNotificationSetting(false);
            }}
            title="Notification Setting"
          >
            <NotificationSetting />
          </Modal>
          <Button mt="md" variant="light" onClick={() => setOpenNotificationSetting(true)}>
            Notification Setting
          </Button>
          <Textarea
            mt="md"
            label="Default Remarks"
            placeholder="My power powerful"
            autosize
            description="Set default remarks for new footprint"
            {...form.getInputProps('defaultMessage')}
          />
          <TextInput
            mt="md"
            label="Webhook"
            disabled
            description="Trigger a custom webhook when the SOS message is sent"
            placeholder="Under development"
          />
        </Container>
        <Container size="sm">
          <NumberInput
            label="Time before SOS (in hours)"
            description="From 12 to 120 hours. A SOS message will be sent if no new footprint recevied for the configured time"
            placeholder=""
            mt="md"
            max={120}
            min={12}
            required
            {...form.getInputProps('sosTime')}
          />
          <Textarea
            mt="md"
            label="SOS Email List"
            placeholder="someoneyoutrust@gmail.com, someoneyoulove@gmail.com"
            required
            autosize
            description="Separate each email by a comma (,) "
            {...form.getInputProps('emailList')}
          />
          <Textarea
            mt="md"
            label="SOS Email Message"
            placeholder="Send help!!"
            autosize
            description="Your last footprint and location are included automatically"
            {...form.getInputProps('emailMessage')}
          />
        </Container>
      </SimpleGrid>
      <Group position="center" mt="xl">
        <Button variant="outline" onClick={() => form.setValues(defaultSetting)}>
          Reset
        </Button>
        <Button onClick={() => submitSettings(form.values)}>Save</Button>
      </Group>
    </>
  );
};

export default UserSettings;
