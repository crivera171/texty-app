import axios from 'axios';
import { RNS3 } from 'react-native-aws3';
import { Credentials } from 'aws-sdk';
import Config from 'react-native-config';

import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { MIGRATE_ENDPOINT_URL } from 'State/Constants';
import ReactNativeBlobUtil from 'react-native-blob-util'

const s3 = new AWS.S3({
  region: Config.S3_REGION,
  credentials: {
    accessKeyId: Config.AWS_ACCESS_KEY,
    secretAccessKey: Config.AWS_SECRET_KEY,
  },
});

const credentials = {
  region: Config.S3_REGION,
  accessKey: Config.AWS_ACCESS_KEY,
  secretKey: Config.AWS_SECRET_KEY,
  successActionStatus: 201,
};

const MediaService = {

  getSignedUrl: function (id, bucket, ext, type, raw) {
    const fileId = id;
    const signedUrlExpireSeconds = 60 * 15;
    const key = raw ? `raw/${fileId}.${ext}` : `${fileId}.${ext}`;
    return s3.getSignedUrlPromise('putObject', {
      Bucket: bucket,
      Key: key,
      ContentType: type,
      Expires: signedUrlExpireSeconds,
    });
  },

  upload: async function (media, fileUri, bucket, ext, type) {
    const options = {
      ...credentials,
      bucket: bucket,
    };

    try {
      const response = await RNS3.put({
        uri: fileUri,
        name: `${media.file_hash}.${ext}`,
        type: type,
      }, options);

      if (response.status === 201) {
        console.log('Upload Success: ', response.body);
        return response.body;
      } else {
        console.log('Failed to upload image to S3: ', response);
      }
    } catch (err) {
      console.log(err);
    }
  },

  uploadVideo: async function (media, fileUri, ext, type, raw) {
    const options = {
      ...credentials,
      bucket: Config.VIDEO_BUCKET,
    };

    const name = raw ? `raw/${media.file_hash}.${ext}` : `${media.file_hash}.${ext}`;
    try {
      const response = await RNS3.put({
        uri: fileUri,
        name: name,
        type: type,
      }, {
        metadata: {
           callbackurl: MIGRATE_ENDPOINT_URL,
        },
        ...options
      });

      if (response.status === 201) {
        return {
          postResponse: {
            ...response.body.postResponse,
            skip_notification: true
          }
        };
      } else {
        console.log('Failed to upload video to S3: ', response);
      }
    } catch (err) {
      console.log(err);
    }
  },

  chunkedUpload: async function (media, fileUri, ext, type, raw) {
    const signedUrl = await MediaService.getSignedUrl(media.file_hash, Config.VIDEO_BUCKET, ext, type, raw);
    try {
        const response = await ReactNativeBlobUtil.fetch('PUT', signedUrl, {
          'Content-Type' : 'application/octet-stream',
        }, ReactNativeBlobUtil.wrap(fileUri))
        .catch((error) => {
          console.log('[error] ReactNativeBlobUtil.fetch failed : ', error)
        })

        //console.log('[success] ReactNativeBlobUtil.fetch succeeded', response)
        return {
          postResponse: {
            ...response,
            skip_notification: true
          }
        };

      } catch (e) {
        console.log(e);
    }
  },


};

export { MediaService };
