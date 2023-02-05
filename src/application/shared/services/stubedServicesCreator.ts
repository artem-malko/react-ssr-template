import { createStubedHackerNewsService } from './hackerNews/stub';

export type StubedServices = ReturnType<typeof createStubedServices>;

/* istanbul ignore next */
export const createStubedServices = () => ({
  hackerNews: createStubedHackerNewsService(),
});
