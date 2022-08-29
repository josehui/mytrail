import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

const containerName = 'tutorial-container';
const sasToken = process.env.AZURE_STORAGESASTOKEN;
const storageAccountName = process.env.AZURE_STORAGERESOURCENAME;
// </snippet_package>

// <snippet_isStorageConfigured>
// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = () => !(!storageAccountName || !sasToken);
// </snippet_isStorageConfigured>

// <snippet_getBlobsInContainer>
// return list of blobs in container to display
// const getBlobsInContainer = async (containerClient: ContainerClient) => {
//   const returnedBlobUrls: string[] = [];

//   // get list of blobs in container
//   // eslint-disable-next-line
//   for await (const blob of containerClient.listBlobsFlat()) {
//     // if image is public, just construct URL
//     returnedBlobUrls.push(
//       `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
//     );
//   }

//   return returnedBlobUrls;
// };
// </snippet_getBlobsInContainer>

// <snippet_createBlobInContainer>
const createBlobInContainer = async (
  containerClient: ContainerClient,
  data: Buffer,
  mimeType: string,
  fileName: string
) => {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(fileName);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: mimeType } };

  // upload file
  await blobClient.uploadData(data, options);
};
// </snippet_createBlobInContainer>

// <snippet_uploadFileToBlob>
const uploadFileToBlob = async (
  data: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> => {
  if (!data) return '';

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  // get Container - full public read access
  const containerClient: ContainerClient = blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: 'container',
  });

  // upload file
  await createBlobInContainer(containerClient, data, mimeType, fileName);

  // get list of blobs in container
  return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${fileName}`;
};
// </snippet_uploadFileToBlob>

export default uploadFileToBlob;
