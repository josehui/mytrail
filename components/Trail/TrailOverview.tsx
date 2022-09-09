import React, { useEffect, useState } from 'react';
import useSWR, { Fetcher } from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Container, Button, Group, Modal, Title, Grid, Text } from '@mantine/core';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
import { IconPlus, IconGps } from '@tabler/icons';
import Trailline from './Trailline';
import type { FootPrintCardProps } from './FootPrintCard';
import FootPrintForm from './FootPrintForm';
import Map from './Map';
import { UTCToLocal, LocalToUTC } from '../../lib/timeUtil';
import { handleFetchError } from '../../lib/error-handling';
import TrailDrawer from './TrailDrawer';

const fetcher: Fetcher<FootPrintCardProps[], string> = async (id, params = '') => {
  const res = await fetch(`${id}${params}`);
  await handleFetchError(res);
  return res.json();
};
type TrailProps = {
  linkId?: string;
  authorName?: string;
};
const Trail: React.FC<TrailProps> = (props) => {
  const wideScreen = useMediaQuery('(min-width: 1000px)');
  const { linkId, authorName } = props;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [targetDates, setTargetDates] = useState<DateRangePickerValue>([
    new Date(2022, 8, 9),
    new Date(2022, 8, 10),
  ]);
  const UTCDates = targetDates.map((date) => date?.toISOString());
  const queryParams = `?sd=${UTCDates?.[0]}&ed=${UTCDates?.[1]}&id=${linkId}`;
  const { data: footprints } = useSWR(
    targetDates ? ['/api/footprint', queryParams] : null,
    fetcher
  );
  const footprintCount = footprints?.length ? footprints.length : 0;
  const [openForm, setOpenForm] = useState<boolean>(router.query.fp === 'true');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const setDatesParam = (dates: DateRangePickerValue) => {
    const dateQueries = dates.map((date) => UTCToLocal(date)?.toISOString().slice(0, 10));
    const [localISOTimeStringSD, localISOTimeStringED] = dateQueries;
    router.query.sd = localISOTimeStringSD;
    router.query.ed = localISOTimeStringED;
    router.push(router);
  };

  useEffect(() => {
    if (!router.isReady) return;
    const SDFromPath = router.query.sd
      ? LocalToUTC(new Date(router.query.sd as string))
      : new Date();
    const EDFromPath = router.query.ed
      ? LocalToUTC(new Date(router.query.ed as string))
      : new Date(SDFromPath.getTime() + 86400000);
    SDFromPath?.setHours(0, 0, 0, 0);
    EDFromPath?.setHours(0, 0, 0, 0);
    setTargetDates([SDFromPath, EDFromPath]);
  }, [router.isReady, router.query]);

  return (
    <>
      <Container size="sm" mb={30} mt={10}>
        <Modal
          centered
          opened={openForm}
          onClose={() => {
            setOpenForm(false);
            router.replace('/mytrail', undefined, { shallow: true });
          }}
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

          <DateRangePicker
            placeholder="Pick date"
            required
            size="xs"
            px={0}
            value={targetDates}
            onChange={setDatesParam}
            clearable={false}
            dayStyle={(date) =>
              date.toDateString() === new Date().toDateString() ? { color: '#228be6' } : {}
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
        <Grid mx={-20}>
          <Grid.Col sm={12} md={7} lg={7}>
            {footprints && footprintCount > 0 && (
              <Map {...{ footprints, setOpenDrawer, openDrawer, withDrawer: true }} />
            )}
          </Grid.Col>
          <Grid.Col sm={12} md={5} lg={5} mt="70vh">
            <TrailDrawer {...{ openDrawer, setOpenDrawer }}>
              {footprints && footprintCount > 0 && <Trailline footprints={footprints} />}
            </TrailDrawer>
            {footprints && footprintCount > 0 && (
              <Group position="center">
                <Button rightIcon={<IconGps />} color="dark" onClick={() => setOpenDrawer(true)}>
                  Open Trail
                </Button>
              </Group>
            )}
          </Grid.Col>
        </Grid>
      )}
    </>
  );
};

export default Trail;
