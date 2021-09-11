# AWS Javascript SDK v3 s3 browser

Sample browser side application implementing basic S3 object storage operations (put/get object) using Typescipt and AWS Javascript API V3

## running

For development purpose a [Minio](https://hub.docker.com/r/minio/minio/) server docker image might be used. First step is to run Minio docker image:
```
docker run --rm -p 9000:9000 -p 9001:9001 minio/minio server --console-address ":9001" /data
```
and then build & run application
```
npm run develop-local
```