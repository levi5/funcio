import { left, right } from ".";
import { IEither } from "../../@Types";

const asyncTry = <T extends PromiseConstructor>(result: IEither.TryResponse<T>) => {
  try {
    return result
      .then((value) => right(value))
      .catch((error) => left(error));
  } catch (error) {
    return left(error);
  }
}

export const _try = <T>(fn: () => IEither.TryResponse<T>) => {
  try {
    const result = fn();
    if (!(result instanceof Promise)) return right(result)
    return asyncTry(result)
  } catch (error) {
    return left(error);
  }
}

