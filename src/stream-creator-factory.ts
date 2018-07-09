// create action creators using name
// create a stream
//  accepting an endpoint
//  and a base effect creator
//  and methods to subscribe to
//  and an additional custom effect creator that can react to actions, and is added to the effect creator
//  building an effect creator for only those methods
//  returning an object with the stream, effect creator, and request enums
//  return action creators and types

enum RequestStates {
  IDLE,
  REQUESTING,
  SUCCESS,
  FAILURE,
}

enum RequestMethods {
  IDLE,
  GETTING,
  FINDING,
  CREATING,
  PATCHING,
  UPDATING,
  REMOVING,
}

interface IResource {
  [key: string]: any;
}

interface IResourceState {
  item: IResource;
  items: [IResource];
  lastError: ErrorEvent;
  requestMethod: RequestMethods;
  requestState: RequestStates;
}
