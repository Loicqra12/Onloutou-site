export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

export class RequestIdempotencyConflictError extends HttpError {
  constructor() {
    super(
      409,
      "Une demande existe déjà pour cet identifiant client, avec un contenu différent. Utilisez une nouvelle soumission.",
    );
  }
}
