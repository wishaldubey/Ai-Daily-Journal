// types/next.d.ts
import 'next';

declare module 'next' {
  type Params = Record<string, string | string[]>;
  
  type PageProps = {
    params?: Params;
    searchParams?: Params;
  };
}
