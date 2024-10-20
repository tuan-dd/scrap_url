# POS

- _Framework:_ NestJS
- _Database ORM:_ Prisma
- _npm version:_ 10.5.2
- _node version:_ v20.13.1
- _yarn version:_ 1.22.22

## Source code structure
```
├── README.md
├── package.json
├── backend
│ ├── node-common (for common usage)
│ │ ├── bin (bash scripts for build and publish)
│ │ ├── src
│ │ │ ├── bases (base abstract common usage)
│ │ │ ├── constants (service constants)
│ │ │ ├── decorators (decorators)
│ │ │ ├── enums (common enums)
│ │ │ ├── exceptions (custom exception model)
│ │ │ ├── filters (exception filters for error handling)
│ │ │ ├── interceptors (logging and response formatting interceptors)
│ │ │ ├── interfaces (common interfaces)
│ │ │ ├── middlewares (service middlewares)
│ │ │ │ └── request_context (generate CID and extract header information)
│ │ │ ├── models (common model usage)
│ │ │ ├── modules (common module integrations)
│ │ │ │ ├── cache (integration for caching)
│ │ │ │ ├── google-chat (integration for Google Chat)
│ │ │ │ ├── google-pubsub (integration for Google Pub/Sub)
│ │ │ │ ├── health (healthcheck endpoint)
│ │ │ │ ├── http (HTTP client integration)
│ │ │ │ └── loggers (service logging)
│ │ │ ├── types (override global types)
│ │ │ ├── utils (common utility functions)
│ │ ├── package.json
│ │ └── tsconfig.json
│ ├── service-template (module)
│ │ ├── bin (bash scripts for build and publish)
│ │ ├── config (configuration definitions)
│ │ ├── prisma (Prisma schema)
│ │ ├── src (application logic)
│ │ │ ├── common
│ │ │ ├── modules (feature modules)
│ ├── auth-service (authorization service)
│ ├── consume-service (business logic consumption service)
│ ├── core-service (data storage service)
│ ├── delivery-api-gateway-service (receives requests from delivery partners)
│ ├── delivery-mock-service (mock delivery partner server)
│ ├── pos-api-gateway-service (receives requests from POS partners)
│ └── pos-mock-service (mock POS partner server)
└── package.json
```