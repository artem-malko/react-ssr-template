import { colorize } from 'lib/console';
import { stub } from 'sinon';

/**
 * Creates a sinon wrapper for any function inside any object
 *
 * Let's imagine, we have a service Entity, which is a simple object:
 *
 * @example
 * const createEntityService = () => ({
 *   getEntity: () => {},
 * })
 *
 * And we need to wrap all methods from EntityService with sinon methods for the testing purpose
 * @example
 * const createStubbedEntity = () => {
 *   const stubMethod = createMethodStubber('entity');
 *
 *   return {
 *     getEntity: stubMethod<Entity['getEntity']>('getEntity'),
 *     mocks: {
 *       entity: { name: 'test' },
 *     }
 *   }
 * }
 */
/* istanbul ignore next */
export function createMethodStubber(entityName: string) {
  return <Method extends (...args: any) => any>(methodName: string) => {
    const stubedMethod = stub<Parameters<Method>, ReturnType<Method>>();

    // Add fake call to prevent passing test, which use API and did not stub it
    stubedMethod.callsFake(() => {
      // eslint-disable-next-line no-console
      console.log('\n');
      // eslint-disable-next-line no-console
      console.log(colorize('Method is not mocked, but used in test!', 'red'));
      // eslint-disable-next-line no-console
      console.log(`Entity: ${colorize(entityName, 'cyan')}`);
      // eslint-disable-next-line no-console
      console.log(`Method: ${colorize(methodName, 'cyan')}`);
      // eslint-disable-next-line no-console
      console.log('\n');
      throw new Error(`Method "${methodName}" is not mocked, but used in test`);
    });

    return stubedMethod;
  };
}
