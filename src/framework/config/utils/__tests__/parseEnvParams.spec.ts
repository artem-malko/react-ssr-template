import { expect } from 'chai';
import { parseEnvParams } from '../parseEnvParams';

describe('config / utils', () => {
  describe('parseEnvParams', () => {
    it(`Replace number value in initial config
        if there is a correct replacement in env params`, () => {
      expect(parseEnvParams({ port: 3000 }, { SERVER_PORT: '5000' }, 'server')).to.deep.eq({
        port: 5000,
      });
    });

    it(`Do not replace number value in initial config
        if there is an incorrect replacement in env params`, () => {
      expect(parseEnvParams({ port: 3000 }, { SERVER_PORT: 'ase' }, 'server')).to.deep.eq({
        port: 3000,
      });
    });

    it(`Do not replace number value in initial config
        if there is no any replacement in env params
        (regExp is for client, env params for server)`, () => {
      expect(parseEnvParams({ port: 3000 }, { SERVER_PORT: '5000' }, 'client')).to.deep.eq({
        port: 3000,
      });
    });

    it(`Do not replace any value in initial config
        if there is no any replacement in env params`, () => {
      expect(parseEnvParams({ port: 3000 }, { CLIENT_LABEL: 'label' }, 'client')).to.deep.eq({
        port: 3000,
      });
    });

    it(`Replace string value in initial config
        if there is a correct replacement in env params
        (regExp is for client, env params for client)`, () => {
      expect(parseEnvParams({ url: 'domain.com' }, { CLIENT_URL: 'c.d.com' }, 'client')).to.deep.eq({
        url: 'c.d.com',
      });
    });

    it(`Replace boolean value (true) in initial config
        if there is a correct replacement in env params`, () => {
      expect(parseEnvParams({ sendLogs: false }, { CLIENT_SEND_LOGS: 'true' }, 'client')).to.deep.eq({
        sendLogs: true,
      });
    });

    it(`Replace boolean value (false) in initial config
        if there is a correct replacement in env params`, () => {
      expect(parseEnvParams({ sendLogs: true }, { CLIENT_SEND_LOGS: 'false' }, 'client')).to.deep.eq({
        sendLogs: false,
      });
    });

    it(`Replace values from initial config only
        if there are incorrect and correct replacements in env params
        (regExp is for client, env params for client)`, () => {
      expect(
        parseEnvParams({ port: 3000 }, { SERVER_PORT: '5000', PATH: 'normal' }, 'server'),
      ).to.deep.eq({
        port: 5000,
      });
    });
  });
});
