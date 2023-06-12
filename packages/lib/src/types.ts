import {Provider} from './constants';

export type ProviderKey = keyof typeof Provider;
export type ProviderType = (typeof Provider)[Provider];
export type ValueOfProvider = `${Provider}`;
