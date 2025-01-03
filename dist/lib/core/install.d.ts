import { Driver, OS } from '../utils';
declare const versions: readonly [8, 11, 17, 18, 19, 20, 21];
/**
 * @description Install the driver of specified version
 * @param {Driver} driver Only support 'jre' or 'jdk'
 * @param {typeof versions[number]} version Version of JRE or JDK to be installed
 * @param {OS} os Operating system compatible with the JRE or JDK
 */
export default function (driver: Driver, version: typeof versions[number], os?: OS): Promise<void>;
export {};
