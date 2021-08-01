import { AnyAction } from 'redux';

/**
 * Create actionCreator, with explicit type and payload of an action.
 * Infer type of the action by using ReturnType.
 */
function createActionCreator<T extends string>(
  type: T,
  reducers: any[],
): ActionCreator<Action<T, undefined>>;
// eslint-disable-next-line @typescript-eslint/ban-types
function createActionCreator<T extends string, P extends object>(
  type: T,
  reducers: any[],
): ActionCreator<Action<T, P>>;
// eslint-disable-next-line @typescript-eslint/ban-types
function createActionCreator<T extends string, P extends object | undefined = undefined>(
  type: T,
  reducers: any[],
) {
  return (payload?: P) => {
    if (typeof payload !== 'undefined') {
      return {
        type,
        payload,
        reducers,
      };
    }
    return { type, reducers };
  };
}

// https://github.com/reactjs/redux/blob/master/index.d.ts#L19
interface BaseReduxAction<T = any> {
  readonly type: T;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface Action<T, P, S = {}, K extends keyof S = keyof S> extends BaseReduxAction<T> {
  readonly payload: P;
  reducers: Array<{
    branch: K;
    reducer: (state: S[K], action: AnyAction) => S[K];
  }>;
}

// Infer action payload type, if it exists
// Return never, if it is not exists.
// Return type of the payload, if it is not undefined
type PayloadType<A extends { payload: any } | BaseReduxAction> = A extends { payload: infer T }
  ? T extends undefined | null
    ? never
    : T
  : never;
// Remove payload from type A, if it exists where
type WithoutPayload<A> = A extends { payload: any } ? Omit<A, 'payload'> : () => A;

// Select type of ActionCreator, which depends on payload existence
type ActionCreator<A extends BaseReduxAction<string>> = PayloadType<A> extends null | undefined
  ? () => WithoutPayload<A>
  : (payload: PayloadType<A>) => A;

/**
 * @example
 *
 * Create CommonActionConstructor, which allows to add a reducer to a new Action
 *
 * ```ts
 * type State = { name: string; }
 * type Payload = { name: string; }
 * export const doSomething = CreateCommonActionConstructor<State, Payload>('doSomething')
 *  .attachReducer('appContext', (state, action) => ({
 *    ...state,
 *    name: action.payload.name,
 *  }))
 *  .createActionCreator();
 * ```
 *
 * // You can disptch doSomething later:
 * dispatch(doSomething({ name: 'new name' }));
 */
export class CreateCommonActionConstructor<
  State,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Payload extends object | undefined = undefined,
> {
  private type: string;
  // Its ok to have any here, cause reducer is typed in attachReducer args
  private mutableReducers: any[] = [];

  constructor(type: string) {
    this.type = type;
  }

  public attachReducer<K extends keyof State = keyof State>(
    branch: K,
    reducer: (state: State[K], action: Action<string, Payload, State>) => State[K],
  ) {
    this.mutableReducers.push({
      branch,
      reducer,
    });

    return this;
  }

  public createActionCreator() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return createActionCreator<string, Payload extends object ? Payload : {}>(
      this.type,
      this.mutableReducers,
    );
  }
}
