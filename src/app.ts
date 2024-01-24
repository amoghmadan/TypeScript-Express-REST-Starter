import yargs, { ArgumentsCamelCase, Argv, Options } from 'yargs';

import { bootstrap, changePassword, createSuperUser } from '@/cli';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs
  .strict()
  .scriptName('app')
  .usage('$0 <cmd> [args]')
  .command(
    'bootstrap [port] [host]',
    'Bootstrap application',
    (setup: Argv<{ [key: string]: Options }>): void => {
      setup
        .positional('port', {
          default: 8000,
          description: 'Port',
          type: 'number',
        })
        .positional('host', {
          default: '::',
          description: 'Host',
          type: 'string',
        });
    },
    async (
      args: ArgumentsCamelCase<{ port: number; host: string }>,
    ): Promise<void> => {
      await bootstrap(Number(args.port), String(args.host));
    },
  )
  .command(
    'changepassword [email]',
    'Chnage password',
    (setup: Argv<{ [key: string]: Options }>): void => {
      setup.positional('email', {
        description: 'Email',
        type: 'string',
      });
    },
    async (args: ArgumentsCamelCase<{ email: string }>): Promise<void> => {
      await changePassword(String(args.email));
    },
  )
  .command(
    'createsuperuser',
    'Create super user',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_: Argv<{}>): void => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_: ArgumentsCamelCase<{}>): Promise<void> => {
      await createSuperUser();
    },
  )
  .help().argv;
