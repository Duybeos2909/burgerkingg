export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      error.status = 400;
      if (error.issues) {
        error.message = error.issues.map((issue) => `${issue.path.join('.') || source}: ${issue.message}`).join(', ');
      }
      next(error);
    }
  };
}
