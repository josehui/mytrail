import React, { useState } from 'react';
import { Text, Group, useMantineTheme, Image, SimpleGrid } from '@mantine/core';
import { Dropzone, DropzoneProps } from '@mantine/dropzone';
import { showNotification, hideNotification } from '@mantine/notifications';
import { IconUpload, IconX, IconCameraPlus } from '@tabler/icons';
import Resizer from 'react-image-file-resizer';

interface ImageProps {
  dropZoneProps?: Partial<DropzoneProps>;
  setImages: (files: File[]) => void;
  setLoadingImages: (flag: boolean) => void;
}

const resizeImage = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      700,
      700,
      'png',
      80,
      0,
      (uri) => {
        resolve(uri);
      },
      'file'
    );
  });

const ImageUpload = (props: ImageProps) => {
  const { setImages, setLoadingImages } = props;
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
        onDrop={async (blobs) => {
          setLoadingImages(true);
          showNotification({
            id: 'load-images',
            autoClose: false,
            title: 'Processing photos',
            message: '',
            color: 'blue',
            loading: true,
          });
          const resizeTasks = blobs.map((blob) => resizeImage(blob));
          const resizedBlobs = await Promise.all(resizeTasks);
          console.log('done');
          setImages(resizedBlobs as File[]);
          setFiles(resizedBlobs as File[]);
          setLoadingImages(false);
          hideNotification('load-images');
        }}
        onReject={() =>
          showNotification({
            id: 'files-error',
            autoClose: 5000,
            title: 'File types not supported',
            message: 'Please only select image files',
            color: 'red',
            loading: false,
          })
        }
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

export default ImageUpload;
