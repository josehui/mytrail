import { Text } from '@mantine/core';
import { IconMapPin, IconDeviceWatch } from '@tabler/icons';
import { FootPrintCardProps } from './FootPrintCard';

const FootPrintNote = (props: FootPrintCardProps) => {
  const { location, remarks, createdAt } = props;
  // const localDateTime = new Date();
  // eslint-disable-next-line newline-per-chained-call
  const localDate = new Date(createdAt).toLocaleTimeString('sv', { timeZoneName: 'longOffset' });
  return (
    <>
      <Text size="sm" color="dimmed">
        <IconMapPin size="15" />
        {location.lat}, {location.lng}
      </Text>
      <Text color="dimmed" size="sm">
        <IconDeviceWatch size="15" />
        {localDate}
      </Text>
      <Text size="sm" mt={4}>
        {remarks}
      </Text>
    </>
  );
};

export default FootPrintNote;
