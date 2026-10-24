# 预约与飞书通知接入

## 已实现

- `/api/leads` 验证并持久保存六个表单字段、同意版本、来源及可选评估资料。
- 联系方式和评估资料使用 AES-256-GCM 加密后保存至 D1；随机 nonce，预约编号作为认证附加数据。
- `request_hash` / `submitter_hash` 为服务端 HMAC，不保存原始 IP。10 分钟最多 5 条新记录；同一天相同内容幂等返回已保存记录。
- 实际成功保存才返回 `ok: true`。飞书失败不会丢弃线索，也不会把通知标为成功。
- 飞书自定义机器人按官方 webhook / HMAC 签名规则推送六项内容；只在飞书返回成功状态后标记 `sent`。
- 未配置飞书时状态为 `unconfigured`；失败为 `pending`，有重试次数、通用失败码和退避时间。`/admin` 可批量重试最多 10 条或逐条重试。
- `/admin` 管理员密钥验证后可查看、导出 CSV、查看评估、删除记录。密钥只留浏览器页面内存。
- 90 天后的记录不会再被报告读取，且在新预约提交/管理页读取时清理。没有配置无人访问时运行的定时清理任务；不可对外声称精确到时自动清除。
- 评估报告使用随机 256 位访问令牌；数据库只存令牌摘要，令牌本体随资料加密。读取时只返回评估数据，不返回联系方式。

## 服务端环境变量

|变量|用途|
|---|---|
|`LEAD_ENCRYPTION_KEY`|必需。32 字节随机密钥的 Base64；更换前需迁移旧数据，否则旧资料不可解密。|
|`LEAD_HASH_SECRET`|建议独立的随机密钥；缺省使用加密密钥作为 HMAC 输入。|
|`ADMIN_TOKEN`|管理员 Bearer 密钥，至少 24 字符，建议 32 字节随机生成。|
|`FEISHU_WEBHOOK_URL`|飞书群自定义机器人 webhook，仅接受 `https://open.feishu.cn/open-apis/bot/v2/hook/...` 或 Lark 对应域名。|
|`FEISHU_WEBHOOK_SECRET`|若机器人启用签名校验，填其签名密钥。|

这些值只保存在 Sites 服务端环境（本地调试使用忽略的 `.dev.vars`），不可进入源码、HTML、浏览器脚本或普通日志。

当前功能是自定义机器人群通知。私聊用户、飞书多维表格同步不由 webhook 完成；如需这些功能需另配应用权限和接收人信息。

从本站删除预约不会删除已发送到飞书的群消息；飞书中的留存和访问权限由目标群管理。用户提交时的隐私说明需覆盖将联系方式用于咨询跟进，并说明接入的飞书通知用途。

## 接口

`POST /api/leads`

```json
{
  "name":"姓名", "company":"企业", "phone":"联系电话", "industry":"所属行业",
  "problem":"希望解决的问题", "preferredTime":"方便沟通的时间", "consent":true,
  "source":"homepage", "website":"", "assessment":{}
}
```

`assessment` 可省略，上限 32KB；整个请求上限 64KB。返回 `{ok,id,notificationStatus,reportToken?}`。

`GET /api/leads/config` 返回是否能收件、是否配置通知；不返回密钥。

管理员接口均要求 `Authorization: Bearer <ADMIN_TOKEN>`：

- `GET /api/admin/leads`：最新 100 条。
- `DELETE /api/admin/leads`：JSON `{id}`。
- `POST /api/admin/retry`：JSON `{id}` 重试单条，`{}` 重试最早 10 条未成功通知。

对飞书推送采用有超时的至少一次尝试；如果飞书已接收但网络超时，管理员重试可能产生重复通知，以预约编号识别即可。

## 上线核对

1. 绑定 D1 `DB` 并部署 Drizzle 迁移。
2. 配置加密密钥、HMAC 密钥、管理员密钥。
3. 在飞书目标群创建自定义机器人，配置 webhook 和可选签名密钥；目标群成员应限于需要处理咨询的人员。
4. 提交一条明确标为测试的预约，在 `/admin` 检查持久保存及飞书 `sent` 状态。
5. 确认飞书实际收到，随后删除测试记录。

官方签名规则参考：https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot
