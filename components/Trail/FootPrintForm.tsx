import React, { useState, useEffect, useContext } from 'react';
import { Text, TextInput, Button, Group, Box, Textarea, Loader } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useSWRConfig } from 'swr';
import { useForm } from '@mantine/form';
import { IconClock, IconMapPin, IconMapSearch, IconCheck } from '@tabler/icons';
import ImageUpload from './ImageUpload';
import { handleFetchError } from '../../lib/error-handling';
import { settingsContext } from '../Context/Context';

interface FormDataProps {
  location: string;
  address: string;
  remarks: string;
  images?: Array<string>;
  timestamp: string;
}

interface FormProps {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  queryParams: string;
}

const FootPrintForm = (props: FormProps) => {
  const userSettings = useContext(settingsContext);
  const { setOpenForm, queryParams } = props;
  const [images, setImages] = useState<File[] | null>();
  const [loadingImages, setLoadingImages] = useState<boolean>(false);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [isLocationEditable, setLocationEditable] = useState<boolean>(false);
  const { mutate } = useSWRConfig();
  const form = useForm({
    initialValues: {
      location: '',
      address: '',
      remarks: userSettings?.defaultMessage || 'I am fine, thanks',
      timestamp: new Date().toISOString(),
      images: [],
    },
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      form.setFieldValue('location', 'location not supported on device');
      setLocationEditable(true);
    } else {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setFieldValue(
            'location',
            JSON.stringify({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          );
          setLoadingLocation(false);
          setCurrentLocation(position);
          setLocationEditable(true);
        },
        () => {
          form.setFieldValue('location', 'Unable to retrieve your location');
          setLoadingLocation(false);
          setLocationEditable(true);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      setLoadingLocation(true);
      try {
        const params = new URLSearchParams({
          latlng: `${currentLocation?.coords.latitude},${currentLocation?.coords.longitude}`,
        });
        const res = await fetch(`/api/geodecode?${params}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        await handleFetchError(res);
        const addressData = await res.json();
        form.setFieldValue('address', addressData?.results?.[0]?.formatted_address);
      } catch (error) {
        console.error(error);
        showNotification({
          id: 'get-fp-error',
          autoClose: 5000,
          title: 'Error getting footprints',
          message: error as string,
          color: 'red',
          loading: false,
        });
      }
      setLoadingLocation(false);
    };
    if (currentLocation) {
      fetchAddress();
    }
  }, [currentLocation]);

  const submitData = async (formData: FormDataProps) => {
    showNotification({
      loading: true,
      id: 'post-fp',
      disallowClose: true,
      title: 'Footprint uploading',
      message: '',
      autoClose: false,
      color: 'blue',
    });
    const filesFormData = new FormData();
    console.log({ images });
    images?.forEach((file, idx) => filesFormData.append(idx.toString(), file));
    if (images) {
      try {
        const imageRes = await fetch('/api/blob', {
          method: 'POST',
          body: filesFormData,
        });
        const imageData = await imageRes.json();
        // eslint-disable-next-line no-param-reassign
        formData.images = imageData.images;
      } catch (error) {
        console.error(error);
      }
    }
    try {
      // eslint-disable-next-line no-param-reassign
      formData.timestamp = new Date(formData.timestamp).toISOString();
      const body = formData;
      const res = await fetch('/api/footprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await handleFetchError(res, 'Error creating footprint');
      updateNotification({
        id: 'post-fp',
        color: 'teal',
        title: 'Footprint uploaded',
        message: '',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      mutate(['/api/footprint', queryParams]);
    } catch (error) {
      console.error(error);
      updateNotification({
        id: 'post-fp',
        color: 'tred',
        title: 'Error adding footprint',
        message: 'Please check input format',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form
        onSubmit={form.onSubmit((values: FormDataProps) => {
          setOpenForm(false);
          submitData(values);
        })}
      >
        {loadingLocation && (
          <Group position="center">
            <Loader size="sm" />
            <Text>Loading geo data...</Text>
          </Group>
        )}
        <TextInput
          required
          disabled={!isLocationEditable}
          label="Location"
          description='Format: {"lat":37.386052,"lng":-122.083851}'
          icon={<IconMapPin size={16} />}
          {...form.getInputProps('location')}
        />
        <TextInput
          mt="md"
          required
          disabled={!isLocationEditable}
          label="Address"
          placeholder=""
          icon={<IconMapSearch size={16} />}
          {...form.getInputProps('address')}
        />
        <TextInput
          mt="md"
          required
          // disabled
          label="Timestamp"
          description="Use UTC timezone"
          placeholder=""
          icon={<IconClock size={16} />}
          {...form.getInputProps('timestamp')}
        />
        <Textarea
          my="md"
          placeholder="Your comment"
          label="Remarks"
          required
          {...form.getInputProps('remarks')}
        />
        <ImageUpload {...{ setImages, setLoadingImages }} />

        <Group position="right" mt="md">
          <Button type="submit" disabled={(loadingLocation || loadingImages) as boolean}>
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default FootPrintForm;
