import { ReadableStream } from 'web-streams-polyfill';

if(typeof globalThis.ReadableStream === 'undefined') {
    globalThis.ReadableStream = ReadableStream as any;
}
