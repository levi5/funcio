export enum MaybeType {
  Just = "just",
  Nothing = "nothing"
}

export interface IJust<T> {
  tag: MaybeType.Just
  value: T
  isJust(): boolean
}

export interface INothing {
  tag: MaybeType.Nothing
  isNothing(): boolean
}

export type IMaybe<T> = {
  just: IJust<T>
  nothing: INothing
}