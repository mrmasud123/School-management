import { PageProps as InertiaPageProps } from '@inertiajs/core';

declare module '@inertiajs/core' {
  export interface PageProps extends InertiaPageProps {
    user?: {
      id: number;
      name: string;
      email: string;
      password: string;
      roles: { id: number; name: string }[];
    };
    allRoles?: { id: number; name: string }[];
  }
}
