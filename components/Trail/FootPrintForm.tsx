import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  Button,
  Group,
  Box,
  Textarea,
  useMantineTheme,
  Loader,
  Image,
  SimpleGrid,
} from '@mantine/core';
import { useSWRConfig } from 'swr';
import { useForm } from '@mantine/form';
import {
  IconUpload,
  IconX,
  IconCameraPlus,
  IconClock,
  IconMapPin,
  IconMapSearch,
} from '@tabler/icons';
import { Dropzone, DropzoneProps } from '@mantine/dropzone';
import { handleFetchError } from '../../lib/error-handling';

interface ImageProps {
  dropZoneProps?: Partial<DropzoneProps>;
  setImages: (files: File[]) => void;
}

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
const ImageUpload = (props: ImageProps) => {
  const { setImages } = props;
  const theme = useMantineTheme();
  const [files, setFiles] = useState<File[]>([]);
  const imagePreviews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  return (
    <>
      <Dropzone
        onDrop={(blobs) => {
          setFiles(blobs);
          setImages(blobs);
        }}
        onReject={(blobs) => console.log('rejected files', blobs)}
        maxSize={20 * 1024 ** 2}
        accept={{
          'image/*': [],
        }}
        {...props.dropZoneProps}
      >
        <Group position="center" spacing="xl" style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              size={50}
              stroke={1.5}
              color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              size={50}
              stroke={1.5}
              color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconCameraPlus size={40} stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="md" inline>
              Take or upload photos
            </Text>
          </div>
        </Group>
      </Dropzone>
      <SimpleGrid
        cols={4}
        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        mt={imagePreviews.length > 0 ? 'xl' : 0}
      >
        {imagePreviews}
      </SimpleGrid>
    </>
  );
};

const FootPrintForm = (props: FormProps) => {
  const { setOpenForm, queryParams } = props;
  const [images, setImages] = useState<File[] | null>();
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [isLocationEditable, setLocationEditable] = useState<boolean>(false);
  const { mutate } = useSWRConfig();
  const form = useForm({
    initialValues: {
      location: '',
      address: '',
      remarks: 'I am fine, thanks',
      timestamp: new Date().toISOString(),
      images: [],
    },

    // validate: {
    //   email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    // },
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
      }
      setLoadingLocation(false);
    };
    if (currentLocation) {
      fetchAddress();
    }
  }, [currentLocation]);

  const submitData = async (formData: FormDataProps) => {
    const filesFormData = new FormData();
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
      mutate(['/api/footprint', queryParams]);
    } catch (error) {
      console.error(error);
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
          validationError="Invalid location data"
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
        <ImageUpload setImages={setImages} />

        <Group position="right" mt="md">
          <Button type="submit" disabled={loadingLocation}>
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default FootPrintForm;
