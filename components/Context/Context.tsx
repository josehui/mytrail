import { createContext } from 'react';
import type { settingFormProps } from '../UserSettings';

export const settingsContext = createContext<settingFormProps | null>(null);
