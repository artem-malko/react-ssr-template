/**
 * Yes, these imports could be in a common.ts
 * But it is a small improvement of compilation speed,
 * cause `createStyles` is used in all .css.ts files
 * And these files have its own compilation pipeline.
 *
 * It would be better to compile as less code pisces as possible
 */

export { useStyles, createStyles } from 'framework/infrastructure/css/hook';
