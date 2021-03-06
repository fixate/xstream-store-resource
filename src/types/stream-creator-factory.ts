export enum RequestState {
  Idle,
  Requesting,
  Success,
  Failure,
}

export enum RequestEffect {
  Idle,
  Getting,
  Finding,
  Creating,
  Patching,
  Updating,
  Removing,
}

export interface Error {
  [key: string]: any;
}
export interface Resource {
  [key: string]: any;
}
export interface ResourceState<R = {[key: string]: any}> {
  response: R | null;
  lastError: Error;
  requestEffect: RequestEffect;
  requestState: RequestState;
}
