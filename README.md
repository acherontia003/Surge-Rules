# Surge Rules

## Surge Mac 6.8+ 模块用法

两个模块均由 Surge 客户端独立加载和注入，不需要服务端订阅或 Mixer 提供任何桥接配置。请根据当前 Surge 配置中的策略组精确名称选择模块；策略组名称区分大小写。

### A：主配置策略组名为 `Proxy`

安装并按需启用：

```text
https://raw.githubusercontent.com/acherontia003/Surge-Rules/main/A_inject-rules-proxy.sgmodule
```

### B：主配置策略组名为 `PROXY`

安装并按需启用：

```text
https://raw.githubusercontent.com/acherontia003/Surge-Rules/main/B_inject-rules-PROXY.sgmodule
```

如果 Surge 提示模块使用了未知策略，说明所选模块的 `Proxy/PROXY` 大小写与当前配置不一致，或当前配置不存在该策略组。

外部规则表每 172800 秒（48 小时）更新一次：

- `inject-rules.list`：由 A/B 模块分别绑定到 `Proxy` 或 `PROXY`。
- `inject-direct-rules.list`：由 A/B 模块统一绑定到 `DIRECT`，用于维护需要直连的域名；当前包含 `feishu.com`。

UURemote 使用 Surge Mac 6.0+ 的 App Bundle 匹配模式：

```ini
PROCESS-NAME,/Applications/UURemote.app/,DIRECT
```

该写法同时覆盖 `UURemote`、`UURemoteService` 和 `UURemoteDaemon`。

## Muse 整个 App 走代理（Surge Mac 6.10.0）

A/B 模块分别包含以下规则，与各自主配置策略组的大小写一致：

```ini
# A：Proxy
PROCESS-NAME,/Applications/Muse.app/,Proxy
# B：PROXY
PROCESS-NAME,/Applications/Muse.app/,PROXY
```

路径末尾的 `/` 使用 App Bundle 前缀匹配，覆盖 Muse 包内所有可执行程序；请将 Muse 安装在 `/Applications/Muse.app`。
仅启用与主配置策略组匹配的一个模块，并将该组选择为代理节点。
对不遵循系统代理的连接，还需要开启 Surge 增强模式；进程规则本身不负责接管流量。更新模块后，新连接才会按新规则匹配。

规则格式参考：[Surge 官方 Process Rules](https://manual.nssurge.com/rules/process.html)。
