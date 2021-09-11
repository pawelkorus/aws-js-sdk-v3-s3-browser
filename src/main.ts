import { S3Client, GetObjectCommand, PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3'
import { hostHeaderMiddlewareOptions } from "@aws-sdk/middleware-host-header"

(async () => {

const BUCKET_NAME = 'test'
const OBJECT_NAME = 'sampleObject'
const SAMPLE_CONTENT = 'some sample content'

let client:S3Client = new S3Client({
    endpoint: "http://localhost:9000",
    region: 'eu-central-1', 
    credentials: {
        accessKeyId: "minioadmin",
        secretAccessKey: "minioadmin"
    },
    forcePathStyle: true,
    tls: false
})

/**
 * In order to make this work host header needs to be set manually when making S3 request
 * to AWS S3 compatible services exposed on specific port (for example localhost:9000).
 * 
 * The problem here is that hostHeaderMiddleware doesn't add 'port' number when adding host
 * header to the request. As the port is not added by the middleware it will not be included 
 * when request signature is calculated. 
 * 
 * On the other hand when making HTTP request in browser environment Host header will be 
 * added to outgoing request by the browser and it will contain proper value consisting of 
 * hostaname and port. In effect receiving service will reject request as signature calculated 
 * on receiving side will be different due to differences in Host header values.
 */
client.middlewareStack.addRelativeTo((next, ctx) => (args:any) => {
    args.request.headers['host'] = args.request.hostname + ':' + args.request.port
    return next(args);
}, {
    relation: 'before',
    toMiddleware: hostHeaderMiddlewareOptions.name
})

const bucketRequest = new CreateBucketCommand({
    Bucket: BUCKET_NAME
})

try {
    await client.send(bucketRequest)
} catch(error) {
    const { httpStatusCode, requestId, cfId, extendedRequestId } = error.$metadata;
    if(409 == httpStatusCode) {
        console.log("Bucket already exists")
    } else {
        console.error(error)
    }
}

let putRequest = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: OBJECT_NAME,
    Body: SAMPLE_CONTENT
})

await client.send(putRequest)

let getRequest = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: OBJECT_NAME
})

const { Body } = await client.send(getRequest)
const bodyContent:String = await streamToString(Body as ReadableStream | Blob)

console.log("Received: \n\n")
console.log(bodyContent)


// https://github.com/aws/aws-sdk-js-v3/issues/1877
// reading Body in node js (Readable)
async function streamToString(body: ReadableStream | Blob):Promise<string> {
    const response = new Response(body)
    return response.text()
}

})()
