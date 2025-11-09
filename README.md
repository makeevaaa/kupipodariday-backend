Kupipodariday backend scaffold (fixed)

- Contains DTOs with validation, controllers using DeepPartial to satisfy TypeScript types.
- @nestjs/config pinned to ^2.3.0 for NestJS 9 compatibility.
- Dockerfile uses multi-stage build and --legacy-peer-deps to avoid npm peer dep issues.
