import { ValueTransformer } from 'typeorm';

export const stringArrayTransformer: ValueTransformer = {
  to(value: string[] | null | undefined): string {
    return value?.join(',') ?? '';
  },
  from(value: string | null | undefined): string[] {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  },
};
