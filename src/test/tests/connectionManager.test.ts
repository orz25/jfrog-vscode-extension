import { assert } from 'chai';

import { ConnectionManager } from '../../main/connect/connectionManager';
import { IClientConfig, IProxyConfig } from 'xray-client-js';
import * as vscode from 'vscode';
import { createGoCenterConfig } from './utils/utils.test';
import { LogManager } from '../../main/log/logManager';

describe('Connection Manager Tests', () => {
    let connectionManager: ConnectionManager = new ConnectionManager(new LogManager());

    before(async () => {});

    it('User agent header', () => {
        let clientConfig: IClientConfig = createGoCenterConfig();
        let userAgent: string | undefined = clientConfig.headers!['User-Agent'];
        assert.isDefined(userAgent);
        assert.match(userAgent, new RegExp(/^jfrog-vscode-extension\/\d.\d.\d$/));
    });

    it('Proxy authorization header', async () => {
        let clientConfig: IClientConfig = {
            headers: {},
            proxy: {} as IProxyConfig
        } as IClientConfig;

        await vscode.workspace.getConfiguration().update('http.proxyAuthorization', 'testProxyAuthorization');
        connectionManager.addProxyAuthHeader(clientConfig);
        let proxyAuthorization: string | undefined = clientConfig.headers!['Proxy-Authorization'];
        assert.isDefined(proxyAuthorization);
        assert.deepEqual(proxyAuthorization, 'testProxyAuthorization');
    });
});