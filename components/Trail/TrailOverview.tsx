import React, { useEffect, useState } from 'react';
import useSWR, { Fetcher } from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Container, Button, Group, Modal, Title, Grid, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons';
import Trailline from './Trailline';
import { FootPrintCardProps } from './FootPrintCard';
import FootPrintForm from './FootPrintForm';
import Map from './Map';
import { UTCToLocal, LocalToUTC } from '../../lib/timeUtil';

const fetcher: Fetcher<FootPrintCardProps[], string> = (id, params = '') =>
  fetch(`${id}${params}`).then((res) => res.json());
type TrailProps = {
  linkId?: string;
  authorName?: string;
};
const Trail: React.FC<TrailProps> = (props) => {
  const wideScreen = useMediaQuery('(min-width: 1000px)');
  const { linkId, authorName } = props;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [targetDate, setTargetDate] = useState<Date>();
  const UTCDate = targetDate?.toISOString();
  const queryParams = `?date=${UTCDate}&id=${linkId}`;
  const { data: footprints } = useSWR(targetDate ? ['/api/footprint', queryParams] : null, fetcher);
  const footprintCount = footprints?.length ? footprints.length : 0;
  const [openForm, setOpenForm] = useState<boolean>(false);
  const setDateParam = (date: Date) => {
    const localISOTime = UTCToLocal(date);
    const localISOTimeString = localISOTime.toISOString().slice(0, 10);
    router.query.date = localISOTimeString;
    router.push(router);
  };

  useEffect(() => {
    if (!router.isReady) return;
    const dateFromPath = router.query.date
      ? LocalToUTC(new Date(router.query.date as string))
      : new Date();
    dateFromPath.setHours(0, 0, 0, 0);
    setTargetDate(dateFromPath);
  }, [router.isReady, router.query]);

  return (
    <>
      <Container size="sm" mb={30} mt={10}>
        <Modal
          centered
          opened={openForm}
          onClose={() => setOpenForm(false)}
          title="Add a footprint"
        >
          {' '}
          <FootPrintForm setOpenForm={setOpenForm} queryParams={queryParams} />
        </Modal>
        <Group position="apart">
          {session && !linkId && (
            <Button
              component="a"
              sx={{ height: 30 }}
              variant="gradient"
              gradient={{ from: 'teal', to: 'blue', deg: 60 }}
              onClick={() => setOpenForm(true)}
            >
              <IconPlus size={15} strokeWidth={5} />
              &nbsp;Footprint
            </Button>
          )}
          {linkId && status !== 'loading' && <Title order={2}>{authorName} Trail</Title>}
          <DatePicker
            placeholder="Pick date"
            required
            size="xs"
            px={0}
            value={targetDate}
            onChange={setDateParam}
            clearable={false}
            dayStyle={(date) =>
              date.toDateString() === new Date().toDateString() &&
              date.toDateString() !== targetDate?.toDateString()
                ? { color: '#228be6' }
                : {}
            }
          />
        </Group>
        {!footprints?.length && (
          <Text mt={15} align="center">
            No footprint yet for the day!
          </Text>
        )}
      </Container>
      {wideScreen && (
        <Grid mx={10}>
          <Grid.Col sm={12} md={5} lg={5}>
            {footprints && footprintCount > 0 && <Trailline footprints={footprints} />}
          </Grid.Col>
          <Grid.Col sm={12} md={7} lg={7}>
            {footprints && footprintCount > 0 && <Map footprints={footprints} />}
          </Grid.Col>
        </Grid>
      )}
      {!wideScreen && (
        <Grid mx={10}>
          <Grid.Col sm={12} md={7} lg={7}>
            {footprints && footprintCount > 0 && <Map footprints={footprints} />}
          </Grid.Col>
          <Grid.Col sm={12} md={5} lg={5}>
            {footprints && footprintCount > 0 && <Trailline footprints={footprints} />}
          </Grid.Col>
        </Grid>
      )}
    </>
  );
};

export default Trail;
