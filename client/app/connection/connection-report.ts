export enum ConnectionStatus {
  connecting,
  connected,
  okay,
  closed,
  error
}

export interface ConnectionReport {
  status: ConnectionStatus,
  message: string,
}
