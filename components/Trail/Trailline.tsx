import Link from 'next/link';
import React from 'react';
import { Timeline, Text, Center, Container } from '@mantine/core';
import { IconCalendar, IconCalendarEvent } from '@tabler/icons';
import FootPrintCard, { FootPrintCardProps } from './FootPrintCard';
import FootPrintNote from './FootPrintNote';

export type TraillineProps = {
  footprints: FootPrintCardProps[];
  openDrawer?: boolean;
};

const TitleAsLink = ({ title, id }: { title: string; id: string }) => (
  <Link href={`/fp/${id}`} passHref>
    <Text variant="link" component="a">
      {title}
    </Text>
  </Link>
);
const Trailine: React.FC<TraillineProps> = (props) => {
  const footprintCount = props.footprints.length;
  return (
    <Container size="xs">
      <Center>
        <Timeline active={footprintCount} bulletSize={24} lineWidth={2}>
          {props?.footprints?.map((fp, idx) => {
            const CardData = {
              id: fp.id,
              images: fp.images,
              location: fp.location,
              address: fp.address,
              createdAt: fp.createdAt,
              remarks: fp.remarks,
            };
            if (!fp.images.length) {
              return (
                <Timeline.Item
                  key={fp.id}
                  title={<TitleAsLink title={fp.address} id={fp.id} />}
                  bullet={<IconCalendar size={12} />}
                  id={idx.toString()}
                >
                  <FootPrintNote {...CardData} />
                </Timeline.Item>
              );
            }
            return (
              <Timeline.Item
                key={fp.id}
                bullet={<IconCalendarEvent size={12} id={idx.toString()} />}
              >
                <FootPrintCard {...CardData} />
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Center>
    </Container>
  );
};

export default Trailine;
