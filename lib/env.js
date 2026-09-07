const REQUIRED_SERVER_ENV = {
  MONGODB_URI: 'MongoDB connection string for the active 2026 recruitment database.',
  JWT_SECRET: 'Strong secret used to sign admin session JWTs.'
};

function readEnv(name) {
  return process.env[name];
}

export function getRequiredServerEnv(name) {
  const value = readEnv(name);

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function validateServerEnv(names = Object.keys(REQUIRED_SERVER_ENV)) {
  const missing = names.filter((name) => !readEnv(name));

  if (missing.length > 0) {
    throw new Error(`Missing required server environment variable(s): ${missing.join(', ')}`);
  }
}

export { REQUIRED_SERVER_ENV };
