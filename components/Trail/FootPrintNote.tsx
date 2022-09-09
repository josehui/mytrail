import { Text } from '@mantine/core';
import { IconMapPin, IconDeviceWatch } from '@tabler/icons';
import { FootPrintCardProps } from './FootPrintCard';

const FootPrintNote = (props: FootPrintCardProps) => {
  const { location, remarks, createdAt } = props;
  // const localDateTime = new Date();
  const localDate = new Date(createdAt).toLocaleString('sv', { timeZoneName: 'longOffset' });
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
